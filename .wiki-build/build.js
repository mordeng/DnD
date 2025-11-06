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

// D&D Beyond character cache
const ddbCache = new Map();

// Statistics
const stats = {
  filesProcessed: 0,
  pagesGenerated: 0,
  errors: 0,
  startTime: Date.now()
};

/**
 * Load D&D Beyond cached character data
 */
async function loadDnDBeyondCache() {
  const cacheDir = path.join(ROOT, '.wiki-config', 'character-cache');

  if (!await fs.pathExists(cacheDir)) {
    return;
  }

  const files = await fs.readdir(cacheDir);
  const jsonFiles = files.filter(f => f.endsWith('.json'));

  for (const file of jsonFiles) {
    try {
      const data = await fs.readJSON(path.join(cacheDir, file));
      // Store by character name slug
      const slug = slugify(data.name, { lower: true, strict: true });
      ddbCache.set(slug, data);
    } catch (error) {
      console.warn(`  ⚠ Failed to load D&D Beyond cache: ${file}`);
    }
  }

  if (ddbCache.size > 0) {
    console.log(`📊 Loaded ${ddbCache.size} D&D Beyond character caches`);
  }
}

/**
 * Main build function
 */
async function build() {
  console.log('🏰 Building D&D Campaign Wiki...\n');

  try {
    // 0. Load D&D Beyond cached data
    await loadDnDBeyondCache();

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

    // 7. Generate index pages
    await generateIndexPages(parsedPages);
    console.log(`📑 Generated index pages\n`);

    // 8. Copy assets
    await copyAssets();
    console.log(`📦 Copied assets\n`);

    // 9. Generate search index
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
    template: file.config.template || file.category,
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
      factions: [],
      npcs: []
    },
    sessionsCount: 0
  };

  // Category-specific metadata
  if (file.category === 'characters') {
    // Check for D&D Beyond cached data
    const ddbData = ddbCache.get(slug);

    if (ddbData) {
      // Merge D&D Beyond live data with frontmatter
      const classStr = ddbData.classes?.map(c => c.name).join('/') || frontmatter.class;

      Object.assign(page, {
        characterClass: frontmatter.class || classStr,
        race: frontmatter.race || ddbData.race,
        level: frontmatter.level || ddbData.level,
        status: frontmatter.status || 'active',

        // D&D Beyond live data
        ddbData: {
          hp: ddbData.hp,
          maxHp: ddbData.maxHp,
          tempHp: ddbData.tempHp,
          ac: ddbData.ac,
          initiative: ddbData.initiative,
          speed: ddbData.speed,
          proficiencyBonus: ddbData.proficiencyBonus,
          xp: ddbData.xp,
          alignment: ddbData.alignment,
          background: ddbData.background,
          avatarUrl: ddbData.avatarUrl,
          lastUpdated: ddbData.lastUpdated,

          // Ability scores
          stats: ddbData.stats,

          // Spell slots
          spellSlots: ddbData.spellSlots,

          // Death saves
          deathSaves: ddbData.deathSaves,

          // Conditions
          conditions: ddbData.conditions,

          // Classes with subclasses
          classes: ddbData.classes
        }
      });
    } else {
      // No D&D Beyond data, use frontmatter only
      Object.assign(page, {
        characterClass: frontmatter.class || null,
        race: frontmatter.race || null,
        level: frontmatter.level || null,
        status: frontmatter.status || 'active'
      });
    }
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
    factions: {},
    npcs: {}
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
  Handlebars.registerHelper('math', function(lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);

    return {
      "+": lvalue + rvalue,
      "-": lvalue - rvalue,
      "*": lvalue * rvalue,
      "/": lvalue / rvalue,
      "%": lvalue % rvalue,
      "floor": Math.floor(lvalue)
    }[operator];
  });
  Handlebars.registerHelper('repeat', function(n, options) {
    let result = '';
    for(let i = 0; i < n; i++) {
      result += options.fn({index: i});
    }
    return result;
  });
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
  const templateName = page.template;
  const template = templates[templateName] || templates.general;

  if (!template) {
    console.warn(`  ⚠ No template for page: ${page.title} (template: ${page.template})`);
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
 * Generate index pages for categories
 */
async function generateIndexPages(pages) {
  const baseTemplate = Handlebars.compile(
    await fs.readFile(path.join(ROOT, CONFIG.paths.templates, 'base.hbs'), 'utf-8')
  );

  // Load index templates
  const indexTemplates = {};
  const indexTemplateFiles = ['characters-index', 'sessions-index', 'quests-index', 'items-index', 'locations-index', 'factions-index', 'timeline'];

  for (const templateName of indexTemplateFiles) {
    const templatePath = path.join(ROOT, CONFIG.paths.templates, 'pages', `${templateName}.hbs`);
    if (await fs.pathExists(templatePath)) {
      const content = await fs.readFile(templatePath, 'utf-8');
      indexTemplates[templateName] = Handlebars.compile(content);
    }
  }

  // Generate Characters Index
  if (indexTemplates['characters-index']) {
    const characters = pages.filter(p => p.type === 'characters');
    await generateIndexPage(baseTemplate, indexTemplates['characters-index'], {
      page: {
        id: 'characters-index',
        title: 'Charaktere',
        url: '/characters/index.html',
        excerpt: 'Alle Charaktere der Kampagne'
      },
      characters,
      breadcrumbs: [{ label: 'Charaktere', url: '/characters/' }]
    }, '/characters/index.html');
    console.log('  ✓ Characters Index');
  }

  // Generate Sessions Index
  if (indexTemplates['sessions-index']) {
    const sessions = pages.filter(p => p.type === 'sessions').sort((a, b) => {
      return (a.dayStart || 0) - (b.dayStart || 0);
    });

    // Group sessions by arc
    const arcs = [
      { number: 1, name: 'Deep Underground', dayStart: 1, dayEnd: 67, sessions: [] },
      { number: 2, name: 'Baldur\'s Gate', dayStart: 68, dayEnd: 134, sessions: [] },
      { number: 3, name: 'Avernus', dayStart: 135, dayEnd: 999, sessions: [] }
    ];

    for (const session of sessions) {
      const arc = arcs.find(a => a.number === session.arc);
      if (arc) {
        arc.sessions.push(session);
      }
    }

    await generateIndexPage(baseTemplate, indexTemplates['sessions-index'], {
      page: {
        id: 'sessions-index',
        title: 'Sessions',
        url: '/sessions/index.html',
        excerpt: 'Chronik aller Spielsessions'
      },
      arcs: arcs.filter(a => a.sessions.length > 0),
      breadcrumbs: [{ label: 'Sessions', url: '/sessions/' }]
    }, '/sessions/index.html');
    console.log('  ✓ Sessions Index');
  }

  // Generate Quests Index
  if (indexTemplates['quests-index']) {
    const quests = pages.filter(p => p.type === 'quests');
    await generateIndexPage(baseTemplate, indexTemplates['quests-index'], {
      page: {
        id: 'quests-index',
        title: 'Quests',
        url: '/quests/index.html',
        excerpt: 'Alle Quests und Aufgaben'
      },
      quests,
      breadcrumbs: [{ label: 'Quests', url: '/quests/' }]
    }, '/quests/index.html');
    console.log('  ✓ Quests Index');
  }

  // Generate Items Index
  if (indexTemplates['items-index']) {
    const items = pages.filter(p => p.type === 'items');
    await generateIndexPage(baseTemplate, indexTemplates['items-index'], {
      page: {
        id: 'items-index',
        title: 'Items',
        url: '/items/index.html',
        excerpt: 'Magische Gegenstände und Ausrüstung'
      },
      items,
      breadcrumbs: [{ label: 'Items', url: '/items/' }]
    }, '/items/index.html');
    console.log('  ✓ Items Index');
  }

  // Generate Locations Index
  if (indexTemplates['locations-index']) {
    const locations = pages.filter(p => p.type === 'locations');

    // Calculate sessions count for each location
    for (const location of locations) {
      location.sessionsCount = pages.filter(p =>
        p.type === 'sessions' &&
        (p.location === location.title || p.linkedEntities.locations.includes(location.slug))
      ).length;
    }

    // Group locations by arc
    const arcs = [
      { number: 1, name: 'Deep Underground', locations: [] },
      { number: 2, name: 'Baldur\'s Gate', locations: [] },
      { number: 3, name: 'Avernus', locations: [] }
    ];

    for (const location of locations) {
      const arc = arcs.find(a => a.number === (location.frontmatter?.arc || location.arc));
      if (arc) {
        arc.locations.push(location);
      } else {
        // Default to first arc if no arc specified
        arcs[0].locations.push(location);
      }
    }

    await generateIndexPage(baseTemplate, indexTemplates['locations-index'], {
      page: {
        id: 'locations-index',
        title: 'Locations',
        url: '/locations/index.html',
        excerpt: 'Alle Orte der Kampagne'
      },
      arcs: arcs.filter(a => a.locations.length > 0),
      breadcrumbs: [{ label: 'Locations', url: '/locations/' }]
    }, '/locations/index.html');
    console.log('  ✓ Locations Index');
  }

  // Generate Factions Index
  if (indexTemplates['factions-index']) {
    const factions = pages.filter(p => p.type === 'factions');
    await generateIndexPage(baseTemplate, indexTemplates['factions-index'], {
      page: {
        id: 'factions-index',
        title: 'Factions',
        url: '/factions/index.html',
        excerpt: 'Fraktionen und Organisationen'
      },
      factions,
      breadcrumbs: [{ label: 'Factions', url: '/factions/' }]
    }, '/factions/index.html');
    console.log('  ✓ Factions Index');
  }

  // Generate Timeline
  if (indexTemplates['timeline']) {
    const sessions = pages.filter(p => p.type === 'sessions').sort((a, b) => {
      return (a.dayStart || 0) - (b.dayStart || 0);
    });

    // Group sessions by arc
    const arcs = [
      { number: 1, name: 'Deep Underground', dayStart: 1, dayEnd: 67, sessions: [] },
      { number: 2, name: 'Baldur\'s Gate', dayStart: 68, dayEnd: 134, sessions: [] },
      { number: 3, name: 'Avernus', dayStart: 135, dayEnd: 999, sessions: [] }
    ];

    for (const session of sessions) {
      const arc = arcs.find(a => a.number === session.arc);
      if (arc) {
        arc.sessions.push(session);
      }
    }

    const totalDays = CONFIG.wiki.currentDay || 145;
    const totalSessions = sessions.length;

    await generateIndexPage(baseTemplate, indexTemplates['timeline'], {
      page: {
        id: 'timeline',
        title: 'Timeline',
        url: '/timeline.html',
        excerpt: 'Chronologische Übersicht aller Ereignisse'
      },
      arcs: arcs.filter(a => a.sessions.length > 0),
      totalDays,
      totalSessions,
      breadcrumbs: [{ label: 'Timeline', url: '/timeline.html' }]
    }, '/timeline.html');
    console.log('  ✓ Timeline');
  }
}

/**
 * Generate a single index page
 */
async function generateIndexPage(baseTemplate, contentTemplate, data, outputPath) {
  const content = contentTemplate(data);
  const html = baseTemplate({
    site: CONFIG.wiki,
    page: data.page,
    content,
    breadcrumbs: data.breadcrumbs || []
  });

  const fullOutputPath = path.join(ROOT, CONFIG.paths.output, outputPath);
  await fs.ensureDir(path.dirname(fullOutputPath));
  await fs.writeFile(fullOutputPath, html);
  stats.pagesGenerated++;
}

/**
 * Copy static assets
 */
async function copyAssets() {
  const assetsOutput = path.join(ROOT, CONFIG.paths.output, 'assets');

  // Ensure assets directory exists
  await fs.ensureDir(assetsOutput);

  // Copy CSS from templates
  const cssSource = path.join(ROOT, CONFIG.paths.templates, 'assets', 'css');
  const cssOutput = path.join(assetsOutput, 'css');
  if (await fs.pathExists(cssSource)) {
    await fs.copy(cssSource, cssOutput);
  }

  // Copy JS from templates
  const jsSource = path.join(ROOT, CONFIG.paths.templates, 'assets', 'js');
  const jsOutput = path.join(assetsOutput, 'js');
  if (await fs.pathExists(jsSource)) {
    await fs.copy(jsSource, jsOutput);
  }

  // Copy images from bilder directory
  const imagesSource = path.join(ROOT, 'bilder');
  const imagesOutput = path.join(assetsOutput, 'images');
  if (await fs.pathExists(imagesSource)) {
    await fs.copy(imagesSource, imagesOutput);
  }

  // Copy character images from templates if they exist
  const charImagesSource = path.join(ROOT, CONFIG.paths.templates, 'assets', 'images', 'characters');
  const charImagesOutput = path.join(assetsOutput, 'images', 'characters');
  if (await fs.pathExists(charImagesSource)) {
    await fs.copy(charImagesSource, charImagesOutput);
  }

  // Create character images directory
  await fs.ensureDir(charImagesOutput);

  // Copy character images from character subdirectories
  const charactersDir = path.join(ROOT, 'characters');
  if (await fs.pathExists(charactersDir)) {
    const characterFolders = await fs.readdir(charactersDir);

    for (const folder of characterFolders) {
      const folderPath = path.join(charactersDir, folder);
      const stat = await fs.stat(folderPath);

      if (stat.isDirectory()) {
        // Look for image files in character folder
        const files = await fs.readdir(folderPath);
        const imageFiles = files.filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f));

        for (const imageFile of imageFiles) {
          const sourcePath = path.join(folderPath, imageFile);
          const characterSlug = folder.toLowerCase();
          const ext = path.extname(imageFile).toLowerCase();

          // Copy as charactername.ext (e.g., kalmaris.png, serox.jpg)
          if (imageFile.toLowerCase().startsWith(characterSlug)) {
            const destPath = path.join(charImagesOutput, imageFile.toLowerCase());
            await fs.copy(sourcePath, destPath);

            // Also copy as .jpg for template compatibility (if not already .jpg)
            if (ext !== '.jpg') {
              const jpgPath = path.join(charImagesOutput, `${characterSlug}.jpg`);
              await fs.copy(sourcePath, jpgPath);
            }
          }
        }
      }
    }
  }

  // Copy character placeholder image
  const placeholderSource = path.join(ROOT, CONFIG.paths.templates, 'assets', 'images', 'character-placeholder.svg');
  const placeholderDest = path.join(assetsOutput, 'images', 'character-placeholder.png');
  if (await fs.pathExists(placeholderSource)) {
    await fs.copy(placeholderSource, placeholderDest);
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
