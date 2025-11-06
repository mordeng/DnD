#!/usr/bin/env node

/**
 * D&D Campaign Wiki - Build Script
 * Converts markdown campaign files to static HTML wiki
 */

const fs = require('fs-extra');
const path = require('path');
const { glob } = require('glob');
const matter = require('gray-matter');
const Handlebars = require('handlebars');
const MarkdownIt = require('markdown-it');
const markdownItAttrs = require('markdown-it-attrs');
const markdownItAnchor = require('markdown-it-anchor');
const slugify = require('slugify');

// Initialize
const ROOT = path.resolve(__dirname, '..');
const CONFIG = require(path.join(ROOT, '.wiki-config/wiki-config.json'));
const ENTITY_LINKS = require(path.join(ROOT, '.wiki-config/entity-links.json'));

// Setup markdown parser
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})
  .use(markdownItAttrs)
  .use(markdownItAnchor, {
    slugify: s => slugify(s, { lower: true, strict: true })
  });

// Global state
const entityDatabase = {
  entities: {},
  relationships: [],
  pages: new Map()
};

// Statistics
const stats = {
  filesProcessed: 0,
  pagesGenerated: 0,
  errors: 0,
  startTime: Date.now()
};

/**
 * Main build function
 */
async function build() {
  console.log('🏰 Building D&D Campaign Wiki...\n');

  try {
    // 1. Clean output directory
    await cleanOutput();

    // 2. Discover and categorize files
    const files = await discoverFiles();
    console.log(`📁 Found ${files.length} source files\n`);

    // 3. Parse all markdown files
    const parsedPages = await parseAllFiles(files);
    console.log(`📝 Parsed ${parsedPages.length} pages\n`);

    // 4. Build entity database
    await buildEntityDatabase(parsedPages);
    console.log(`🔗 Built entity database\n`);

    // 5. Apply auto-linking
    await applyAutoLinking(parsedPages);
    console.log(`🔗 Applied auto-linking\n`);

    // 6. Generate HTML pages
    await generatePages(parsedPages);
    console.log(`📄 Generated ${stats.pagesGenerated} HTML pages\n`);

    // 7. Copy assets
    await copyAssets();
    console.log(`📦 Copied assets\n`);

    // 8. Generate search index
    await generateSearchIndex(parsedPages);
    console.log(`🔍 Generated search index\n`);

    // 9. Build complete
    const duration = ((Date.now() - stats.startTime) / 1000).toFixed(2);
    console.log(`✅ Build complete in ${duration}s`);
    console.log(`   Pages: ${stats.pagesGenerated}`);
    console.log(`   Errors: ${stats.errors}`);

  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

/**
 * Clean output directory
 */
async function cleanOutput() {
  const outputDir = path.join(ROOT, CONFIG.paths.output);
  await fs.emptyDir(outputDir);
  await fs.ensureDir(path.join(outputDir, 'assets'));
  console.log('🧹 Cleaned output directory');
}

/**
 * Discover and categorize files
 */
async function discoverFiles() {
  const files = [];

  for (const [category, config] of Object.entries(CONFIG.categories)) {
    for (const pattern of Array.isArray(config.patterns) ? config.patterns : [config.patterns]) {
      const matches = await glob(pattern, {
        cwd: ROOT,
        ignore: CONFIG.excludePatterns
      });

      // Filter out excludes
      const filtered = config.exclude
        ? matches.filter(f => !config.exclude.some(ex => f.includes(ex)))
        : matches;

      files.push(...filtered.map(file => ({
        path: file,
        category,
        config
      })));
    }
  }

  return files;
}

/**
 * Parse all markdown files
 */
async function parseAllFiles(files) {
  const pages = [];

  for (const file of files) {
    try {
      const page = await parseFile(file);
      if (page) {
        pages.push(page);
        entityDatabase.pages.set(page.id, page);
        stats.filesProcessed++;
      }
    } catch (error) {
      console.error(`❌ Error parsing ${file.path}:`, error.message);
      stats.errors++;
    }
  }

  return pages;
}

/**
 * Parse a single file
 */
async function parseFile(file) {
  const filePath = path.join(ROOT, file.path);
  const content = await fs.readFile(filePath, 'utf-8');

  // Parse frontmatter and markdown
  const { data: frontmatter, content: markdown } = matter(content);

  // Extract metadata
  const title = frontmatter.title || extractTitle(markdown) || path.basename(file.path, path.extname(file.path));
  const slug = slugify(title, { lower: true, strict: true });

  // Convert to HTML
  const htmlContent = md.render(markdown);

  // Extract headings for TOC
  const toc = extractHeadings(markdown);

  // Build page object
  const page = {
    id: `${file.category}-${slug}`,
    type: file.category,
    slug,
    title,
    sourcePath: file.path,
    sourceFile: path.basename(file.path),
    lastModified: (await fs.stat(filePath)).mtime.toISOString(),
    rawContent: markdown,
    htmlContent,
    excerpt: extractExcerpt(markdown),
    toc,
    tags: frontmatter.tags || [],
    frontmatter,
    url: generateUrl(file.category, slug),
    backlinks: [],
    linkedEntities: {
      characters: [],
      locations: [],
      sessions: [],
      quests: [],
      items: [],
      factions: []
    }
  };

  // Category-specific metadata
  if (file.category === 'characters') {
    Object.assign(page, {
      characterClass: frontmatter.class || null,
      race: frontmatter.race || null,
      level: frontmatter.level || null,
      status: frontmatter.status || 'active'
    });
  }

  if (file.category === 'sessions') {
    Object.assign(page, {
      arc: frontmatter.arc || detectArc(file.path),
      dayStart: frontmatter.dayStart || null,
      dayEnd: frontmatter.dayEnd || null,
      location: frontmatter.location || null
    });
  }

  return page;
}

/**
 * Extract title from markdown
 */
function extractTitle(markdown) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

/**
 * Extract excerpt from markdown
 */
function extractExcerpt(markdown, length = 200) {
  // Remove markdown syntax
  const plain = markdown
    .replace(/^#+\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .trim();

  return plain.length > length
    ? plain.substring(0, length) + '...'
    : plain;
}

/**
 * Extract headings for table of contents
 */
function extractHeadings(markdown) {
  const headings = [];
  const lines = markdown.split('\n');

  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = slugify(text, { lower: true, strict: true });

      headings.push({ level, text, id });
    }
  }

  return headings;
}

/**
 * Detect arc from file path
 */
function detectArc(filePath) {
  if (filePath.includes('01 Deep Underground')) return 1;
  if (filePath.includes('02 Baldurs Gate')) return 2;
  if (filePath.includes('03 Avernus')) return 3;
  return null;
}

/**
 * Generate URL for page
 */
function generateUrl(category, slug) {
  const outputPath = CONFIG.categories[category]?.outputPath || category;
  return `/${outputPath}/${slug}.html`;
}

/**
 * Build entity database
 */
async function buildEntityDatabase(pages) {
  // Initialize entity types
  entityDatabase.entities = {
    characters: {},
    locations: {},
    sessions: {},
    quests: {},
    items: {},
    factions: {}
  };

  // Add known entities from config
  for (const [type, entities] of Object.entries(ENTITY_LINKS)) {
    entityDatabase.entities[type] = { ...entities };
  }

  // Add pages as entities
  for (const page of pages) {
    if (entityDatabase.entities[page.type]) {
      entityDatabase.entities[page.type][page.slug] = {
        name: page.title,
        slug: page.slug,
        url: page.url,
        type: page.type,
        page
      };
    }
  }
}

/**
 * Apply auto-linking to content
 */
async function applyAutoLinking(pages) {
  if (!CONFIG.features.autoLink) return;

  for (const page of pages) {
    // Find entity mentions in content
    for (const [type, entities] of Object.entries(entityDatabase.entities)) {
      for (const [slug, entity] of Object.entries(entities)) {
        // Skip self-links
        if (page.slug === slug) continue;

        const name = entity.name;
        const aliases = entity.aliases || [];
        const patterns = [name, ...aliases];

        for (const pattern of patterns) {
          const regex = new RegExp(`\\b${escapeRegex(pattern)}\\b`, 'gi');
          const matches = page.rawContent.match(regex);

          if (matches && matches.length > 0) {
            // Add to linked entities
            if (!page.linkedEntities[type].includes(slug)) {
              page.linkedEntities[type].push(slug);
            }

            // Add backlink
            if (entity.page) {
              entity.page.backlinks.push({
                fromId: page.id,
                fromUrl: page.url,
                fromTitle: page.title,
                count: matches.length
              });
            }
          }
        }
      }
    }
  }
}

/**
 * Escape regex special characters
 */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Generate HTML pages
 */
async function generatePages(pages) {
  // Load templates
  const templates = await loadTemplates();

  // Register partials
  await registerPartials();

  // Generate homepage
  await generateHomepage(templates, pages);

  // Generate individual pages
  for (const page of pages) {
    await generatePage(templates, page);
  }
}

/**
 * Load Handlebars templates
 */
async function loadTemplates() {
  const templatesDir = path.join(ROOT, CONFIG.paths.templates, 'pages');
  const files = await fs.readdir(templatesDir);

  const templates = {};
  for (const file of files) {
    const name = path.basename(file, '.hbs');
    const content = await fs.readFile(path.join(templatesDir, file), 'utf-8');
    templates[name] = Handlebars.compile(content);
  }

  return templates;
}

/**
 * Register Handlebars partials
 */
async function registerPartials() {
  const partialsDir = path.join(ROOT, CONFIG.paths.templates, 'partials');
  const files = await fs.readdir(partialsDir);

  for (const file of files) {
    const name = path.basename(file, '.hbs');
    const content = await fs.readFile(path.join(partialsDir, file), 'utf-8');
    Handlebars.registerPartial(name, content);
  }

  // Register components
  const componentsDir = path.join(ROOT, CONFIG.paths.templates, 'components');
  if (await fs.pathExists(componentsDir)) {
    const componentFiles = await fs.readdir(componentsDir);
    for (const file of componentFiles) {
      const name = path.basename(file, '.hbs');
      const content = await fs.readFile(path.join(componentsDir, file), 'utf-8');
      Handlebars.registerPartial(name, content);
    }
  }

  // Register helpers
  Handlebars.registerHelper('eq', (a, b) => a === b);
  Handlebars.registerHelper('ne', (a, b) => a !== b);
  Handlebars.registerHelper('gt', (a, b) => a > b);
  Handlebars.registerHelper('lt', (a, b) => a < b);
}

/**
 * Generate homepage
 */
async function generateHomepage(templates, pages) {
  const baseTemplate = Handlebars.compile(
    await fs.readFile(path.join(ROOT, CONFIG.paths.templates, 'base.hbs'), 'utf-8')
  );

  // Get recent updates (last 5 modified pages)
  const recentUpdates = pages
    .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
    .slice(0, 5)
    .map(p => ({
      type: p.type,
      typeLabel: p.type.charAt(0).toUpperCase() + p.type.slice(1),
      date: p.lastModified,
      dateFormatted: new Date(p.lastModified).toLocaleDateString('de-DE'),
      title: p.title,
      url: p.url,
      excerpt: p.excerpt
    }));

  const content = templates.homepage({
    site: {
      ...CONFIG.wiki,
      characters: CONFIG.characters,
      statistics: {
        sessions: pages.filter(p => p.type === 'sessions').length,
        npcs: 42, // TODO: Calculate dynamically
        locations: pages.filter(p => p.type === 'locations').length
      }
    },
    recentUpdates
  });

  const html = baseTemplate({
    site: CONFIG.wiki,
    page: {
      id: 'homepage',
      title: CONFIG.wiki.title,
      excerpt: CONFIG.wiki.subtitle
    },
    content,
    breadcrumbs: []
  });

  const outputPath = path.join(ROOT, CONFIG.paths.output, 'index.html');
  await fs.writeFile(outputPath, html);
  stats.pagesGenerated++;

  console.log('  ✓ Homepage');
}

/**
 * Generate individual page
 */
async function generatePage(templates, page) {
  const baseTemplate = Handlebars.compile(
    await fs.readFile(path.join(ROOT, CONFIG.paths.templates, 'base.hbs'), 'utf-8')
  );

  // Select appropriate template
  const templateName = page.type;
  const template = templates[templateName] || templates.general;

  if (!template) {
    console.warn(`  ⚠ No template for type: ${page.type}`);
    return;
  }

  // Generate breadcrumbs
  const breadcrumbs = generateBreadcrumbs(page);

  // Render page content
  const content = template({
    page,
    site: CONFIG.wiki
  });

  // Wrap in base template
  const html = baseTemplate({
    site: CONFIG.wiki,
    page,
    content,
    breadcrumbs
  });

  // Write to file
  const outputPath = path.join(ROOT, CONFIG.paths.output, page.url);
  await fs.ensureDir(path.dirname(outputPath));
  await fs.writeFile(outputPath, html);
  stats.pagesGenerated++;
}

/**
 * Generate breadcrumbs for page
 */
function generateBreadcrumbs(page) {
  const crumbs = [];

  // Add category
  if (page.type !== 'general') {
    crumbs.push({
      label: page.type.charAt(0).toUpperCase() + page.type.slice(1),
      url: `/${page.type}/`
    });
  }

  // Add current page
  crumbs.push({
    label: page.title,
    url: page.url
  });

  return crumbs;
}

/**
 * Copy static assets
 */
async function copyAssets() {
  const assetsSource = path.join(ROOT, CONFIG.paths.output, 'assets');
  const assetsOutput = path.join(ROOT, CONFIG.paths.output, 'assets');

  // Ensure assets directory exists
  await fs.ensureDir(assetsOutput);

  // Copy CSS (already in place)
  // Copy images if they exist
  const imagesSource = path.join(ROOT, 'bilder');
  const imagesOutput = path.join(assetsOutput, 'images');

  if (await fs.pathExists(imagesSource)) {
    await fs.copy(imagesSource, imagesOutput);
  }
}

/**
 * Generate search index
 */
async function generateSearchIndex(pages) {
  const documents = pages.map(page => ({
    id: page.id,
    title: page.title,
    content: page.rawContent.substring(0, 1000), // Limit content size
    tags: page.tags.join(' '),
    excerpt: page.excerpt,
    url: page.url,
    type: page.type
  }));

  const searchData = {
    documents,
    indexedAt: new Date().toISOString(),
    version: '1.0.0'
  };

  const outputPath = path.join(ROOT, CONFIG.paths.output, 'search-index.json');
  await fs.writeJSON(outputPath, searchData);
}

// Run build
if (require.main === module) {
  build().catch(error => {
    console.error('Build failed:', error);
    process.exit(1);
  });
}

module.exports = { build };
