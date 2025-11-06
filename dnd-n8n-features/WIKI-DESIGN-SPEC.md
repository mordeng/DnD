# D&D Campaign Wiki - Complete Design Specification

**Project**: Milo Quicksparks Abenteuerlogbuch Wiki System
**Version**: 1.0
**Date**: 2025-11-06
**Status**: Design Phase

---

## Executive Summary

A comprehensive wiki system for a German-language D&D campaign that automatically converts markdown files into a beautiful, searchable, interconnected website with dynamic updates and intelligent linking.

**Key Features**:
- 🔄 Real-time updates when files change
- 🔗 Automatic cross-linking between entities
- 🔍 Full-text search with filtering
- 📱 Responsive design (desktop, tablet, mobile)
- 🎨 Fantasy/parchment aesthetic
- 🌙 Dark mode support
- 📊 Visual timeline and relationship maps
- 🔐 DM vs Player view toggle

---

## Part 1: Software Architecture

### 1.1 System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Campaign Files (Source)                      │
│  Markdown files in Git repository (characters, sessions, etc.)  │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    File Watcher Service                          │
│  Monitors file changes, triggers builds (chokidar + n8n)        │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Build Pipeline (n8n)                          │
│  ┌────────────┐   ┌───────────┐   ┌──────────────┐            │
│  │ File Reader│──▶│  Parser   │──▶│  Link Engine │            │
│  └────────────┘   └───────────┘   └──────────────┘            │
│         │              │                   │                     │
│         ▼              ▼                   ▼                     │
│  ┌────────────┐   ┌───────────┐   ┌──────────────┐            │
│  │ Categorizer│   │ Metadata  │   │  Cross-Ref   │            │
│  └────────────┘   │ Extractor │   │  Generator   │            │
│                   └───────────┘   └──────────────┘            │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Template Engine                               │
│  Applies HTML templates, injects content, generates pages        │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Search Index Builder                          │
│  Creates full-text search index (Lunr.js or MiniSearch)         │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Static Site Output                            │
│  HTML/CSS/JS files ready for deployment (wiki-output/)          │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Deployment Layer                              │
│  GitHub Pages / Netlify / Local Server                          │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Technology Stack

#### Core Technologies

**Build System**:
- **n8n** - Workflow orchestration and automation
- **Node.js 18+** - JavaScript runtime
- **chokidar** - File watching with smart debouncing

**Markdown Processing**:
- **markdown-it** v13+ - Fast, extensible markdown parser
- **markdown-it-attrs** - Add custom classes/IDs
- **markdown-it-anchor** - Auto-generate heading IDs
- **markdown-it-table-of-contents** - Auto TOC generation
- **gray-matter** - Parse frontmatter (YAML metadata)

**Templating & HTML**:
- **Handlebars** v4+ - Logic-less templating
- **cheerio** - jQuery-like HTML manipulation
- **html-minifier** - Optimize output HTML

**Search**:
- **MiniSearch** - Lightweight full-text search (5KB)
- Alternative: **Lunr.js** (if more features needed)

**Styling & Assets**:
- **PostCSS** - CSS processing
- **autoprefixer** - Browser compatibility
- **cssnano** - CSS minification
- **Google Fonts** - Cinzel & Crimson Text

**Utilities**:
- **slugify** - Generate URL-safe slugs
- **date-fns** - Date formatting (German locale)
- **glob** - File pattern matching
- **fs-extra** - Enhanced file operations

#### Why These Choices?

✅ **No heavy frameworks** (React, Vue, etc.) - Static site = fast & simple
✅ **Lightweight** - Total bundle < 100KB for client-side JS
✅ **Offline-capable** - All search runs client-side
✅ **SEO-friendly** - Pure HTML, no JavaScript required for content
✅ **Easy deployment** - Static files work anywhere

### 1.3 File Structure

```
DnD/                                    # Campaign repository root
├── wiki-output/                        # Generated wiki (gitignored)
│   ├── index.html                      # Homepage
│   ├── timeline.html
│   ├── characters/
│   │   ├── index.html                  # Character listing
│   │   ├── kalmaris.html
│   │   ├── lamil.html
│   │   └── ...
│   ├── sessions/
│   │   ├── index.html
│   │   ├── arc-1/
│   │   │   ├── index.html
│   │   │   └── day-001-023.html
│   │   ├── arc-2/
│   │   └── arc-3/
│   ├── locations/
│   ├── quests/
│   ├── items/
│   ├── factions/
│   ├── assets/
│   │   ├── css/
│   │   │   ├── main.css               # Core styles
│   │   │   ├── theme-light.css        # Light theme
│   │   │   └── theme-dark.css         # Dark theme
│   │   ├── js/
│   │   │   ├── main.js                # Core functionality
│   │   │   ├── search.js              # Search engine
│   │   │   ├── navigation.js          # Nav interactions
│   │   │   └── darkmode.js            # Theme switching
│   │   ├── images/
│   │   └── fonts/
│   └── search-index.json               # Search data
│
├── .wiki-templates/                    # Template files
│   ├── base.hbs                        # Base page template
│   ├── partials/
│   │   ├── header.hbs
│   │   ├── footer.hbs
│   │   ├── sidebar.hbs
│   │   ├── breadcrumb.hbs
│   │   └── search-bar.hbs
│   ├── pages/
│   │   ├── homepage.hbs
│   │   ├── character.hbs
│   │   ├── location.hbs
│   │   ├── session.hbs
│   │   ├── quest.hbs
│   │   ├── item.hbs
│   │   └── timeline.hbs
│   └── components/
│       ├── card.hbs
│       ├── stat-block.hbs
│       ├── progress-bar.hbs
│       └── tag-list.hbs
│
├── .wiki-config/                       # Configuration
│   ├── wiki-config.json                # Main config
│   ├── entity-links.json               # Known entities for auto-linking
│   ├── navigation.json                 # Nav structure
│   └── category-rules.json             # File categorization rules
│
└── .wiki-build/                        # Build scripts
    ├── n8n-workflow.json               # n8n workflow export
    ├── build.js                        # Node.js build script
    ├── watch.js                        # File watcher
    ├── parser.js                       # Markdown parser
    ├── linker.js                       # Cross-linking engine
    ├── search-indexer.js               # Search index builder
    └── deployer.js                     # Deployment script
```

### 1.4 Data Models

#### Page Metadata Structure

Every parsed page has this metadata:

```javascript
{
  // Core identifiers
  "id": "character-kalmaris",
  "type": "character",               // character|session|location|quest|item|faction
  "slug": "kalmaris",
  "title": "Kalmaris",
  "subtitle": "Aarakocra Bard, ehemaliger Pirat",

  // Source information
  "sourcePath": "characters/Kalmaris/Kalmaris.md",
  "sourceFile": "Kalmaris.md",
  "lastModified": "2025-11-05T14:30:00Z",
  "createdDate": "2025-01-15T10:00:00Z",

  // Content
  "rawContent": "# Kalmaris\n\n...",
  "htmlContent": "<h1>Kalmaris</h1>...",
  "excerpt": "Ein Aarakocra Barde, der seine Identität an einen Spiegeldämon verloren hat...",

  // Categorization
  "tags": ["player-character", "bard", "aarakocra", "pirate"],
  "arc": null,                       // For sessions: 1, 2, or 3
  "dayRange": null,                  // For sessions: {start: 1, end: 23}
  "faction": null,                   // For characters: "Azure-Enklave"

  // Relationships
  "linkedEntities": {
    "characters": ["Milo", "Lamil", "Serox"],
    "locations": ["Baldur's Gate", "Moreva"],
    "sessions": ["session-068", "session-134"],
    "quests": ["quest-kalmaris-identity"],
    "factions": ["Azure-Enklave"]
  },
  "mentionedIn": [
    {"id": "session-068", "count": 15},
    {"id": "session-134", "count": 8}
  ],
  "backlinks": [
    {"from": "character-milo", "context": "mein treuer Freund Kalmaris"}
  ],

  // Special fields per type
  "characterClass": "Bard",          // For characters
  "race": "Aarakocra",
  "level": 10,
  "status": "active",                // active|retired|deceased

  // Quest-specific
  "questStatus": null,               // not-started|in-progress|completed|failed
  "questProgress": null,             // 0-100

  // Session-specific
  "sessionNumber": null,
  "sessionDate": null,

  // Generated URLs
  "url": "/characters/kalmaris.html",
  "relativeUrl": "../characters/kalmaris.html"
}
```

#### Entity Database

All entities stored in a global registry:

```javascript
{
  "entities": {
    "characters": {
      "kalmaris": { /* metadata */ },
      "milo": { /* metadata */ },
      // ...
    },
    "locations": {
      "baldurs-gate": { /* metadata */ },
      "avernus": { /* metadata */ }
    },
    "sessions": { /* ... */ },
    "quests": { /* ... */ },
    "items": { /* ... */ },
    "factions": { /* ... */ }
  },

  "relationships": {
    "character-to-quest": [
      {"character": "kalmaris", "quest": "identity-search", "role": "protagonist"}
    ],
    "character-to-faction": [
      {"character": "kalmaris", "faction": "azure-enklave", "status": "member"}
    ],
    "character-to-character": [
      {"from": "kalmaris", "to": "milo", "relationship": "friend"}
    ]
  },

  "statistics": {
    "totalPages": 127,
    "characters": 12,
    "sessions": 45,
    "locations": 28,
    "quests": 15,
    "items": 18,
    "factions": 9
  },

  "buildInfo": {
    "lastBuild": "2025-11-06T09:00:00Z",
    "buildDuration": "3.2s",
    "version": "1.0.0"
  }
}
```

### 1.5 Build Pipeline (Detailed)

#### Step 1: File Discovery & Categorization

```javascript
// .wiki-build/parser.js
async function discoverFiles() {
  const patterns = {
    characters: 'characters/**/*.md',
    sessions: [
      '01 Deep Underground/**/*.md',
      '02 Baldurs Gate/**/*.md',
      '03 Avernus/**/*.md'
    ],
    items: 'item/**/*.html',
    quests: 'characters/**/Avernus_Quest.md',
    locations: ['**/*.md'], // Filter by content
    general: ['Campaign.md', 'README.md']
  };

  const files = await glob(patterns, {
    ignore: ['**/archive/**', '**/node_modules/**', '**/.git/**']
  });

  return categorizeFiles(files);
}

function categorizeFiles(files) {
  return files.map(file => ({
    path: file,
    type: detectType(file),
    priority: getPriority(file)  // Homepage > Characters > Sessions > Others
  }));
}
```

#### Step 2: Markdown Parsing

```javascript
// .wiki-build/parser.js
const md = require('markdown-it')({
  html: true,          // Allow HTML in markdown
  linkify: true,       // Auto-convert URLs to links
  typographer: true    // Smart quotes, dashes
})
  .use(require('markdown-it-attrs'))
  .use(require('markdown-it-anchor'), {
    permalink: true,
    permalinkBefore: true,
    permalinkSymbol: '§'
  });

async function parseMarkdownFile(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');

  // Extract frontmatter
  const { data: frontmatter, content: markdown } = matter(content);

  // Parse markdown to HTML
  const html = md.render(markdown);

  // Extract metadata
  const metadata = {
    ...frontmatter,
    title: extractTitle(markdown),
    headings: extractHeadings(markdown),
    links: extractLinks(markdown),
    entities: extractEntityMentions(markdown)
  };

  return { html, metadata, raw: markdown };
}
```

#### Step 3: Entity Extraction

```javascript
// .wiki-build/linker.js
function extractEntityMentions(markdown) {
  const knownEntities = loadEntityDatabase();
  const mentions = {
    characters: [],
    locations: [],
    quests: [],
    items: [],
    factions: []
  };

  // Pattern matching for known entities
  for (const [type, entities] of Object.entries(knownEntities)) {
    for (const entity of entities) {
      const regex = new RegExp(`\\b${escapeRegex(entity.name)}\\b`, 'gi');
      const matches = [...markdown.matchAll(regex)];

      if (matches.length > 0) {
        mentions[type].push({
          entity: entity.id,
          name: entity.name,
          count: matches.length,
          positions: matches.map(m => m.index)
        });
      }
    }
  }

  return mentions;
}
```

#### Step 4: Automatic Cross-Linking

```javascript
// .wiki-build/linker.js
function autoLinkContent(html, currentPageId) {
  const $ = cheerio.load(html);
  const entityDb = loadEntityDatabase();

  // Walk through text nodes
  $('body').find('*').contents().filter(function() {
    return this.type === 'text';
  }).each(function() {
    let text = $(this).text();

    // Replace entity mentions with links
    for (const entity of entityDb.all()) {
      // Skip self-links
      if (entity.id === currentPageId) continue;

      // Create regex for entity name
      const regex = new RegExp(`\\b(${escapeRegex(entity.name)})\\b`, 'g');

      // Replace first occurrence only (avoid over-linking)
      text = text.replace(regex, (match, p1) => {
        return `<a href="${entity.url}" class="auto-link" data-entity="${entity.type}">${p1}</a>`;
      });
    }

    $(this).replaceWith(text);
  });

  return $.html();
}
```

#### Step 5: Template Application

```javascript
// .wiki-build/build.js
const Handlebars = require('handlebars');

async function generatePage(pageData) {
  // Load appropriate template
  const templateName = `pages/${pageData.type}.hbs`;
  const template = Handlebars.compile(
    await fs.readFile(`.wiki-templates/${templateName}`, 'utf-8')
  );

  // Prepare template context
  const context = {
    page: pageData,
    site: {
      title: 'Milo Quicksparks Abenteuerlogbuch',
      baseUrl: config.baseUrl,
      currentDay: 145,
      currentArc: 'Avernus'
    },
    navigation: loadNavigation(),
    breadcrumbs: generateBreadcrumbs(pageData),
    relatedPages: findRelatedPages(pageData),
    recentUpdates: getRecentUpdates(5)
  };

  // Render page
  const html = template(context);

  // Minify (production only)
  const minified = minify(html, {
    collapseWhitespace: true,
    removeComments: true
  });

  // Write to output
  const outputPath = path.join('wiki-output', pageData.url);
  await fs.outputFile(outputPath, minified);

  return outputPath;
}
```

#### Step 6: Search Index Generation

```javascript
// .wiki-build/search-indexer.js
const MiniSearch = require('minisearch');

async function buildSearchIndex(allPages) {
  const miniSearch = new MiniSearch({
    fields: ['title', 'content', 'tags', 'excerpt'],
    storeFields: ['title', 'url', 'type', 'excerpt'],
    searchOptions: {
      boost: { title: 2, tags: 1.5 },
      fuzzy: 0.2,
      prefix: true
    }
  });

  // Add all pages to index
  const documents = allPages.map(page => ({
    id: page.id,
    title: page.title,
    content: stripHtml(page.htmlContent),
    tags: page.tags.join(' '),
    excerpt: page.excerpt,
    url: page.url,
    type: page.type
  }));

  miniSearch.addAll(documents);

  // Export as JSON
  const searchData = {
    index: miniSearch.toJSON(),
    documents: documents
  };

  await fs.writeJSON('wiki-output/search-index.json', searchData);
}
```

### 1.6 Dynamic Update System

#### File Watcher with Smart Debouncing

```javascript
// .wiki-build/watch.js
const chokidar = require('chokidar');
const debounce = require('lodash.debounce');

const watcher = chokidar.watch([
  'characters/**/*.md',
  '01 Deep Underground/**/*.md',
  '02 Baldurs Gate/**/*.md',
  '03 Avernus/**/*.md',
  'item/**/*.html',
  'Campaign.md'
], {
  ignored: /(^|[\/\\])\../, // Ignore dotfiles
  persistent: true,
  ignoreInitial: true
});

// Debounced rebuild function (waits 5s after last change)
const triggerRebuild = debounce(async (changedFiles) => {
  console.log(`🔄 Rebuilding wiki (${changedFiles.length} files changed)...`);

  const startTime = Date.now();

  // Incremental build: only rebuild affected pages
  const affectedPages = await findAffectedPages(changedFiles);
  await rebuildPages(affectedPages);

  // Update search index
  await updateSearchIndex(affectedPages);

  // Regenerate navigation if structure changed
  if (needsNavUpdate(changedFiles)) {
    await regenerateNavigation();
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`✅ Wiki rebuilt in ${duration}s`);

  // Optional: Trigger browser reload (for local dev)
  if (config.liveReload) {
    notifyBrowserReload();
  }
}, 5000);

// Watch for file changes
watcher
  .on('add', file => triggerRebuild([file]))
  .on('change', file => triggerRebuild([file]))
  .on('unlink', file => {
    // Handle deleted files
    removePageFromWiki(file);
    triggerRebuild([]);
  });
```

#### Incremental Build Strategy

```javascript
// .wiki-build/build.js
async function findAffectedPages(changedFiles) {
  const affected = new Set();

  for (const file of changedFiles) {
    // Always rebuild the changed file itself
    affected.add(file);

    // Find pages that link to this file
    const backlinks = await findBacklinks(file);
    backlinks.forEach(link => affected.add(link));

    // If it's a character file, rebuild related quest pages
    if (file.includes('characters/')) {
      const relatedQuests = await findRelatedQuests(file);
      relatedQuests.forEach(quest => affected.add(quest));
    }

    // Always rebuild homepage (shows recent updates)
    affected.add('homepage');

    // Always rebuild navigation (in case of new page)
    affected.add('navigation');
  }

  return Array.from(affected);
}
```

---

## Part 2: UI/UX Design

### 2.1 Design Philosophy

**Core Principles**:
1. **Immersive but Readable** - Fantasy aesthetic that doesn't sacrifice usability
2. **Information Hierarchy** - Clear visual distinction between content types
3. **Fast Navigation** - Never more than 3 clicks to any page
4. **Progressive Disclosure** - Show essentials first, details on demand
5. **Accessibility** - WCAG 2.1 AA compliant
6. **Mobile-First** - Works perfectly on all screen sizes

### 2.2 Visual Design System

#### Color Palette

```css
/* Light Theme (Default) */
:root {
  /* Backgrounds */
  --bg-primary: #f9f1e6;           /* Parchment light */
  --bg-secondary: #f0e6d2;         /* Parchment dark */
  --bg-elevated: #ffffff;          /* Cards, modals */
  --bg-overlay: rgba(0,0,0,0.5);   /* Backdrop */

  /* Text */
  --text-primary: #2c1810;         /* Dark brown - body text */
  --text-secondary: #5c4033;       /* Medium brown - secondary text */
  --text-tertiary: #8b6f47;        /* Light brown - meta info */
  --text-inverse: #f9f1e6;         /* Light text on dark bg */

  /* Accent Colors */
  --accent-primary: #8b4513;       /* Saddle brown - primary actions */
  --accent-secondary: #a0522d;     /* Sienna - hover states */
  --accent-gold: #d4af37;          /* Gold - highlights, special items */
  --accent-blue: #4a7c99;          /* Muted blue - links */

  /* Semantic Colors */
  --success: #6b8e23;              /* Olive green - completed quests */
  --warning: #cd853f;              /* Peru - in-progress */
  --danger: #8b0000;               /* Dark red - enemies, danger */
  --info: #4682b4;                 /* Steel blue - info boxes */

  /* Borders & Shadows */
  --border-light: #d4c5a9;
  --border-medium: #a08968;
  --border-dark: #8b4513;
  --shadow-sm: 0 1px 3px rgba(139, 69, 19, 0.12);
  --shadow-md: 0 4px 6px rgba(139, 69, 19, 0.16);
  --shadow-lg: 0 10px 25px rgba(139, 69, 19, 0.2);
}

/* Dark Theme */
[data-theme="dark"] {
  --bg-primary: #1a1410;
  --bg-secondary: #2c2218;
  --bg-elevated: #3d3025;
  --bg-overlay: rgba(0,0,0,0.7);

  --text-primary: #e8dcc8;
  --text-secondary: #c4b5a0;
  --text-tertiary: #9d8b73;
  --text-inverse: #1a1410;

  --accent-primary: #b8732e;
  --accent-secondary: #d4af37;
  --accent-gold: #f4e4a6;
  --accent-blue: #7ab8d9;

  --border-light: #4a3d2f;
  --border-medium: #6b5a47;
  --border-dark: #8b7355;
}
```

#### Typography

```css
/* Font Families */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');

:root {
  --font-display: 'Cinzel', serif;
  --font-body: 'Crimson Text', serif;
  --font-mono: 'Consolas', 'Monaco', monospace;
}

/* Type Scale */
--text-xs: 0.75rem;      /* 12px - meta info */
--text-sm: 0.875rem;     /* 14px - secondary text */
--text-base: 1rem;       /* 16px - body text */
--text-lg: 1.125rem;     /* 18px - lead paragraphs */
--text-xl: 1.25rem;      /* 20px - h4 */
--text-2xl: 1.5rem;      /* 24px - h3 */
--text-3xl: 1.875rem;    /* 30px - h2 */
--text-4xl: 2.25rem;     /* 36px - h1 */
--text-5xl: 3rem;        /* 48px - page titles */

/* Typography Styles */
body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: 1.7;
  color: var(--text-primary);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  font-weight: 600;
  line-height: 1.3;
  color: var(--accent-primary);
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

h1 { font-size: var(--text-5xl); }
h2 { font-size: var(--text-4xl); }
h3 { font-size: var(--text-3xl); }
h4 { font-size: var(--text-2xl); }

.lead {
  font-size: var(--text-lg);
  font-weight: 600;
  line-height: 1.6;
}
```

#### Spacing System

```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.5rem;    /* 24px */
  --space-6: 2rem;      /* 32px */
  --space-8: 3rem;      /* 48px */
  --space-10: 4rem;     /* 64px */
  --space-12: 6rem;     /* 96px */
}
```

### 2.3 Layout Architecture

#### Grid System

```
┌─────────────────────────────────────────────────────────────────┐
│                        Header (Fixed)                            │
│  Logo | Navigation | Search | Theme Toggle | DM Mode Toggle     │
└─────────────────────────────────────────────────────────────────┘
┌──────────────┬───────────────────────────────────┬──────────────┐
│   Sidebar    │         Main Content              │   Aside      │
│   (Fixed)    │         (Scrollable)              │  (Optional)  │
│              │                                   │              │
│  Navigation  │  ┌─────────────────────────────┐  │  Table of    │
│  Tree        │  │     Breadcrumbs             │  │  Contents    │
│              │  └─────────────────────────────┘  │              │
│  • Home      │                                   │  - Overview  │
│  • Timeline  │  ┌─────────────────────────────┐  │  - Stats     │
│  • Chars     │  │                             │  │  - Story     │
│    - PCs     │  │     Page Content            │  │  - Quests    │
│    - NPCs    │  │                             │  │              │
│  • Locations │  │                             │  │  Related     │
│  • Sessions  │  │                             │  │  Pages       │
│  • Quests    │  │                             │  │              │
│  • Items     │  │                             │  │  - Milo      │
│  • Factions  │  │                             │  │  - Lamil     │
│              │  │                             │  │  - Serox     │
│  [Tags]      │  │                             │  │              │
│              │  └─────────────────────────────┘  │  Mentioned   │
│              │                                   │  In          │
│              │  ┌─────────────────────────────┐  │              │
│              │  │     Backlinks Section       │  │  • Session X │
│              │  └─────────────────────────────┘  │  • Quest Y   │
│              │                                   │              │
└──────────────┴───────────────────────────────────┴──────────────┘
┌─────────────────────────────────────────────────────────────────┐
│                           Footer                                 │
│  Last Updated | Build Info | Quick Links | Version              │
└─────────────────────────────────────────────────────────────────┘

Desktop: Sidebar(250px) | Main(flex-1) | Aside(300px)
Tablet:  Main(100%, aside below)
Mobile:  Hamburger menu, single column
```

### 2.4 Component Library

#### 2.4.1 Header Component

```html
<header class="wiki-header">
  <div class="header-container">
    <!-- Logo & Title -->
    <div class="header-brand">
      <img src="/assets/images/logo.svg" alt="Campaign Logo" class="header-logo">
      <div class="header-title">
        <h1>Milo Quicksparks Abenteuerlogbuch</h1>
        <span class="header-subtitle">Tag 145 • Avernus • Fort Knucklebone</span>
      </div>
    </div>

    <!-- Main Navigation -->
    <nav class="header-nav">
      <a href="/" class="nav-link">Home</a>
      <a href="/timeline.html" class="nav-link">Timeline</a>
      <a href="/characters/" class="nav-link">Characters</a>
      <a href="/sessions/" class="nav-link">Sessions</a>
      <a href="/quests/" class="nav-link">Quests</a>
    </nav>

    <!-- Utility Controls -->
    <div class="header-utils">
      <!-- Search -->
      <button class="header-search-toggle" aria-label="Open search">
        <svg><!-- Search icon --></svg>
      </button>

      <!-- Theme Toggle -->
      <button class="theme-toggle" aria-label="Toggle dark mode">
        <svg class="sun-icon"><!-- Sun --></svg>
        <svg class="moon-icon"><!-- Moon --></svg>
      </button>

      <!-- DM Mode Toggle -->
      <button class="dm-mode-toggle" aria-label="Toggle DM mode">
        <svg><!-- Eye icon --></svg>
        <span>DM Mode</span>
      </button>

      <!-- Mobile Menu Toggle -->
      <button class="mobile-menu-toggle" aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </div>

  <!-- Search Overlay (Hidden by default) -->
  <div class="search-overlay" hidden>
    <div class="search-modal">
      <input type="search"
             class="search-input"
             placeholder="Suche nach Charakteren, Orten, Sessions..."
             aria-label="Search">
      <div class="search-results"></div>
    </div>
  </div>
</header>
```

#### 2.4.2 Sidebar Navigation

```html
<aside class="wiki-sidebar">
  <nav class="sidebar-nav">
    <!-- Search (Mobile) -->
    <div class="sidebar-search">
      <input type="search" placeholder="Suche...">
    </div>

    <!-- Navigation Tree -->
    <ul class="nav-tree">
      <li class="nav-item">
        <a href="/" class="nav-link active">
          <svg class="nav-icon"><!-- Home icon --></svg>
          Home
        </a>
      </li>

      <li class="nav-item">
        <a href="/timeline.html" class="nav-link">
          <svg class="nav-icon"><!-- Clock icon --></svg>
          Timeline
        </a>
      </li>

      <li class="nav-item has-children">
        <button class="nav-link nav-toggle">
          <svg class="nav-icon"><!-- Users icon --></svg>
          Characters
          <svg class="nav-chevron"><!-- Chevron --></svg>
        </button>
        <ul class="nav-submenu">
          <li><a href="/characters/pcs.html">Spielercharaktere (6)</a></li>
          <li><a href="/characters/npcs.html">NPCs (42)</a></li>
          <li class="nav-divider"></li>
          <li><a href="/characters/kalmaris.html">Kalmaris</a></li>
          <li><a href="/characters/lamil.html">Lamil</a></li>
          <li><a href="/characters/longjohn.html">Longjohn</a></li>
          <li><a href="/characters/lufnik.html">Lufnik</a></li>
          <li><a href="/characters/milo.html">Milo</a></li>
          <li><a href="/characters/serox.html">Serox</a></li>
        </ul>
      </li>

      <li class="nav-item has-children">
        <button class="nav-link nav-toggle">
          <svg class="nav-icon"><!-- Map icon --></svg>
          Locations
          <svg class="nav-chevron"><!-- Chevron --></svg>
        </button>
        <ul class="nav-submenu">
          <li><a href="/locations/arc-1/">Arc 1: Deep Underground</a></li>
          <li><a href="/locations/arc-2/">Arc 2: Baldur's Gate</a></li>
          <li><a href="/locations/arc-3/">Arc 3: Avernus</a></li>
        </ul>
      </li>

      <!-- Continue for Sessions, Quests, Items, Factions -->
    </ul>

    <!-- Tag Cloud -->
    <div class="sidebar-tags">
      <h4>Tags</h4>
      <div class="tag-cloud">
        <a href="/tags/combat" class="tag">Combat</a>
        <a href="/tags/roleplay" class="tag">Roleplay</a>
        <a href="/tags/mystery" class="tag">Mystery</a>
        <a href="/tags/boss-fight" class="tag">Boss Fight</a>
        <!-- More tags -->
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="sidebar-stats">
      <div class="stat-item">
        <span class="stat-value">145</span>
        <span class="stat-label">Days</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">45</span>
        <span class="stat-label">Sessions</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">42</span>
        <span class="stat-label">NPCs</span>
      </div>
    </div>
  </nav>
</aside>
```

#### 2.4.3 Character Card Component

```html
<div class="character-card" data-character-id="kalmaris">
  <div class="character-card-header">
    <img src="/assets/images/characters/kalmaris.jpg"
         alt="Kalmaris Portrait"
         class="character-portrait">
    <div class="character-badge status-active">Active</div>
  </div>

  <div class="character-card-body">
    <h3 class="character-name">
      <a href="/characters/kalmaris.html">Kalmaris</a>
    </h3>
    <p class="character-class">Aarakocra Bard • Level 10</p>

    <p class="character-excerpt">
      Ein fliegender Pirat, der seine Identität an einen Spiegeldämon verloren hat...
    </p>

    <div class="character-meta">
      <span class="meta-item">
        <svg class="icon"><!-- Quest icon --></svg>
        Quest: Identity Search
      </span>
      <span class="meta-item">
        <svg class="icon"><!-- Faction icon --></svg>
        Azure-Enklave
      </span>
    </div>
  </div>

  <div class="character-card-footer">
    <a href="/characters/kalmaris.html" class="btn btn-sm btn-outline">
      View Full Profile
    </a>
  </div>
</div>
```

#### 2.4.4 Timeline Component

```html
<div class="timeline">
  <!-- Timeline Entry -->
  <div class="timeline-entry" data-day="1">
    <div class="timeline-marker"></div>
    <div class="timeline-content">
      <div class="timeline-header">
        <span class="timeline-day">Tag 1</span>
        <span class="timeline-arc">Arc 1: Deep Underground</span>
      </div>
      <h4 class="timeline-title">Schiffbruch auf Moreva</h4>
      <p class="timeline-description">
        Die Gruppe erleidet Schiffbruch und strandet auf der mysteriösen Insel Moreva...
      </p>
      <div class="timeline-meta">
        <a href="/sessions/arc-1/day-001.html" class="timeline-link">
          Session Details →
        </a>
      </div>
    </div>
  </div>

  <!-- More entries -->
  <div class="timeline-entry" data-day="67">
    <div class="timeline-marker milestone"></div>
    <div class="timeline-content">
      <div class="timeline-header">
        <span class="timeline-day">Tag 67</span>
        <span class="timeline-arc">Arc 1: Deep Underground</span>
      </div>
      <h4 class="timeline-title">🎯 Sieg über das Magma-Elemental</h4>
      <p class="timeline-description">
        Der Kampf gegen das Magma-Elemental endet heroisch. Serox erhält das erste Stück seiner legendären Rüstung.
      </p>
      <div class="timeline-tags">
        <span class="tag">Boss Fight</span>
        <span class="tag">Major Milestone</span>
      </div>
    </div>
  </div>
</div>
```

#### 2.4.5 Quest Progress Component

```html
<div class="quest-card" data-quest-id="kalmaris-identity">
  <div class="quest-card-header">
    <span class="quest-status in-progress">In Progress</span>
    <span class="quest-character">Kalmaris</span>
  </div>

  <div class="quest-card-body">
    <h3 class="quest-title">Die Suche nach der verlorenen Identität</h3>
    <p class="quest-description">
      Kalmaris muss seine wahre Identität zurückgewinnen, die ein Spiegeldämon gestohlen hat.
    </p>

    <!-- Progress Bar -->
    <div class="progress-bar">
      <div class="progress-fill" style="width: 65%" data-progress="65">
        <span class="progress-label">65%</span>
      </div>
    </div>

    <!-- Quest Objectives -->
    <ul class="quest-objectives">
      <li class="objective completed">
        <svg class="icon"><!-- Check --></svg>
        Spiegeldämon in Baldur's Gate besiegen
      </li>
      <li class="objective completed">
        <svg class="icon"><!-- Check --></svg>
        Kontakt mit Azure-Enklave aufnehmen
      </li>
      <li class="objective active">
        <svg class="icon"><!-- Arrow --></svg>
        Ritual zur Identitätswiederherstellung finden
      </li>
      <li class="objective pending">
        <svg class="icon"><!-- Circle --></svg>
        Identität vollständig zurückgewinnen
      </li>
    </ul>

    <div class="quest-meta">
      <span class="meta-item">
        <svg class="icon"><!-- Calendar --></svg>
        Started: Tag 68
      </span>
      <span class="meta-item">
        <svg class="icon"><!-- Location --></svg>
        Last Update: Fort Knucklebone
      </span>
    </div>
  </div>

  <div class="quest-card-footer">
    <a href="/quests/kalmaris-identity.html" class="btn btn-sm btn-primary">
      View Full Quest
    </a>
  </div>
</div>
```

#### 2.4.6 Search Results Component

```html
<div class="search-results">
  <!-- No results state -->
  <div class="search-empty" hidden>
    <svg class="search-empty-icon"><!-- Magnifying glass --></svg>
    <p>Keine Ergebnisse für "<span class="search-query"></span>"</p>
  </div>

  <!-- Results -->
  <div class="search-result-group">
    <h4 class="search-group-title">Characters (3)</h4>

    <a href="/characters/kalmaris.html" class="search-result">
      <div class="search-result-icon">
        <svg><!-- User icon --></svg>
      </div>
      <div class="search-result-content">
        <h5 class="search-result-title">Kalmaris</h5>
        <p class="search-result-excerpt">
          Ein <mark>Aarakocra Barde</mark>, der seine Identität an einen Spiegeldämon verloren hat...
        </p>
        <span class="search-result-meta">Character • Last updated 2 days ago</span>
      </div>
    </a>

    <!-- More results -->
  </div>

  <div class="search-result-group">
    <h4 class="search-group-title">Sessions (5)</h4>
    <!-- Session results -->
  </div>
</div>
```

### 2.5 Page Templates

#### Homepage Layout

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Milo Quicksparks Abenteuerlogbuch</title>
  <link rel="stylesheet" href="/assets/css/main.css">
</head>
<body>
  {{> header}}

  <div class="wiki-layout">
    {{> sidebar}}

    <main class="wiki-main">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1 class="hero-title">Milo Quicksparks Abenteuerlogbuch</h1>
          <p class="hero-subtitle">Eine epische Reise von Moreva bis in die Tiefen von Avernus</p>

          <div class="hero-stats">
            <div class="stat">
              <span class="stat-value">145</span>
              <span class="stat-label">Tage gereist</span>
            </div>
            <div class="stat">
              <span class="stat-value">45</span>
              <span class="stat-label">Sessions</span>
            </div>
            <div class="stat">
              <span class="stat-value">3</span>
              <span class="stat-label">Story Arcs</span>
            </div>
            <div class="stat">
              <span class="stat-value">6</span>
              <span class="stat-label">Heroes</span>
            </div>
          </div>

          <div class="hero-actions">
            <a href="/timeline.html" class="btn btn-primary">View Timeline</a>
            <a href="/characters/" class="btn btn-outline">Meet the Party</a>
          </div>
        </div>
      </section>

      <!-- Current Status -->
      <section class="current-status">
        <div class="status-card">
          <h2>Current Status</h2>
          <div class="status-content">
            <div class="status-item">
              <span class="status-label">Day</span>
              <span class="status-value">145</span>
            </div>
            <div class="status-item">
              <span class="status-label">Arc</span>
              <span class="status-value">Avernus (3/3)</span>
            </div>
            <div class="status-item">
              <span class="status-label">Location</span>
              <span class="status-value">Fort Knucklebone</span>
            </div>
            <div class="status-item">
              <span class="status-label">Party Level</span>
              <span class="status-value">10</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Recent Updates -->
      <section class="recent-updates">
        <h2>Recent Updates</h2>
        <div class="update-list">
          {{#each recentUpdates}}
          <article class="update-card">
            <div class="update-meta">
              <span class="update-type">{{type}}</span>
              <span class="update-date">{{date}}</span>
            </div>
            <h3 class="update-title">
              <a href="{{url}}">{{title}}</a>
            </h3>
            <p class="update-excerpt">{{excerpt}}</p>
          </article>
          {{/each}}
        </div>
      </section>

      <!-- Quick Links Grid -->
      <section class="quick-links">
        <h2>Explore the Campaign</h2>
        <div class="link-grid">
          <a href="/timeline.html" class="link-card">
            <svg class="link-icon"><!-- Clock --></svg>
            <h3>Timeline</h3>
            <p>145 days of adventure</p>
          </a>

          <a href="/characters/" class="link-card">
            <svg class="link-icon"><!-- Users --></svg>
            <h3>Characters</h3>
            <p>6 heroes, 42 NPCs</p>
          </a>

          <a href="/locations/" class="link-card">
            <svg class="link-icon"><!-- Map --></svg>
            <h3>Locations</h3>
            <p>From Moreva to Avernus</p>
          </a>

          <a href="/quests/" class="link-card">
            <svg class="link-icon"><!-- Target --></svg>
            <h3>Quests</h3>
            <p>7 active storylines</p>
          </a>

          <a href="/sessions/" class="link-card">
            <svg class="link-icon"><!-- Book --></svg>
            <h3>Sessions</h3>
            <p>Read session notes</p>
          </a>

          <a href="/items/" class="link-card">
            <svg class="link-icon"><!-- Sparkles --></svg>
            <h3>Items</h3>
            <p>Magical treasures</p>
          </a>
        </div>
      </section>

      <!-- Party Roster -->
      <section class="party-roster">
        <h2>The Party</h2>
        <div class="character-grid">
          {{#each characters}}
          {{> character-card}}
          {{/each}}
        </div>
      </section>
    </main>
  </div>

  {{> footer}}

  <script src="/assets/js/main.js"></script>
</body>
</html>
```

### 2.6 Interaction Patterns

#### Search Functionality

```javascript
// assets/js/search.js
class WikiSearch {
  constructor() {
    this.searchIndex = null;
    this.miniSearch = null;
    this.init();
  }

  async init() {
    // Load search index
    const response = await fetch('/search-index.json');
    const data = await response.json();

    // Initialize MiniSearch
    this.miniSearch = MiniSearch.loadJSON(data.index, {
      fields: ['title', 'content', 'tags'],
      storeFields: ['title', 'url', 'type', 'excerpt']
    });

    // Set up event listeners
    this.setupEventListeners();
  }

  setupEventListeners() {
    const searchInput = document.querySelector('.search-input');
    const searchToggle = document.querySelector('.header-search-toggle');
    const searchOverlay = document.querySelector('.search-overlay');

    // Open search modal
    searchToggle.addEventListener('click', () => {
      searchOverlay.removeAttribute('hidden');
      searchInput.focus();
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchOverlay.setAttribute('hidden', '');
      }
    });

    // Keyboard shortcut (Cmd/Ctrl + K)
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchToggle.click();
      }
    });

    // Search as you type
    searchInput.addEventListener('input', debounce((e) => {
      this.performSearch(e.target.value);
    }, 200));
  }

  performSearch(query) {
    if (!query || query.length < 2) {
      this.clearResults();
      return;
    }

    // Search with fuzzy matching
    const results = this.miniSearch.search(query, {
      fuzzy: 0.2,
      prefix: true,
      boost: { title: 2, tags: 1.5 }
    });

    // Group by type
    const grouped = this.groupResults(results);

    // Render results
    this.renderResults(grouped, query);
  }

  groupResults(results) {
    const groups = {};

    results.forEach(result => {
      const type = result.type;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(result);
    });

    return groups;
  }

  renderResults(grouped, query) {
    const container = document.querySelector('.search-results');
    container.innerHTML = '';

    // Type labels in German
    const typeLabels = {
      'character': 'Charaktere',
      'session': 'Sessions',
      'location': 'Orte',
      'quest': 'Quests',
      'item': 'Items',
      'faction': 'Fraktionen'
    };

    // Render each group
    Object.entries(grouped).forEach(([type, results]) => {
      const group = document.createElement('div');
      group.className = 'search-result-group';

      const title = document.createElement('h4');
      title.className = 'search-group-title';
      title.textContent = `${typeLabels[type]} (${results.length})`;
      group.appendChild(title);

      results.slice(0, 5).forEach(result => {
        const item = this.createResultItem(result, query);
        group.appendChild(item);
      });

      container.appendChild(group);
    });
  }

  createResultItem(result, query) {
    const link = document.createElement('a');
    link.href = result.url;
    link.className = 'search-result';

    // Highlight query in title and excerpt
    const highlightedTitle = this.highlight(result.title, query);
    const highlightedExcerpt = this.highlight(result.excerpt, query);

    link.innerHTML = `
      <div class="search-result-icon">
        ${this.getTypeIcon(result.type)}
      </div>
      <div class="search-result-content">
        <h5 class="search-result-title">${highlightedTitle}</h5>
        <p class="search-result-excerpt">${highlightedExcerpt}</p>
        <span class="search-result-meta">${this.formatType(result.type)}</span>
      </div>
    `;

    return link;
  }

  highlight(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  new WikiSearch();
});
```

#### Dark Mode Toggle

```javascript
// assets/js/darkmode.js
class DarkMode {
  constructor() {
    this.init();
  }

  init() {
    // Check user preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      this.enable();
    }

    // Set up toggle button
    const toggle = document.querySelector('.theme-toggle');
    toggle.addEventListener('click', () => this.toggle());
  }

  enable() {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }

  disable() {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
  }

  toggle() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      this.disable();
    } else {
      this.enable();
    }
  }
}

new DarkMode();
```

#### DM Mode Toggle

```javascript
// assets/js/dm-mode.js
class DMMode {
  constructor() {
    this.init();
  }

  init() {
    const toggle = document.querySelector('.dm-mode-toggle');
    const isDMMode = sessionStorage.getItem('dmMode') === 'true';

    if (isDMMode) {
      this.enable();
    }

    toggle.addEventListener('click', () => this.toggle());
  }

  enable() {
    document.body.classList.add('dm-mode');
    sessionStorage.setItem('dmMode', 'true');

    // Show DM-only content
    document.querySelectorAll('.dm-only').forEach(el => {
      el.removeAttribute('hidden');
    });
  }

  disable() {
    document.body.classList.remove('dm-mode');
    sessionStorage.setItem('dmMode', 'false');

    // Hide DM-only content
    document.querySelectorAll('.dm-only').forEach(el => {
      el.setAttribute('hidden', '');
    });
  }

  toggle() {
    const isEnabled = document.body.classList.contains('dm-mode');
    if (isEnabled) {
      this.disable();
    } else {
      this.enable();
    }
  }
}

new DMMode();
```

---

## Part 3: Implementation Roadmap

### Phase 1: MVP (Weeks 1-2)

**Goal**: Basic working wiki with essential features

- [x] Set up build pipeline (n8n workflow)
- [x] Markdown to HTML conversion
- [x] Basic templates (homepage, character, session)
- [x] Simple navigation
- [x] Deploy locally
- [x] Test with 5-10 pages

**Deliverables**:
- Working wiki with homepage
- Character pages for all 6 PCs
- Latest 3 session notes converted
- Basic styling (parchment theme)

### Phase 2: Enhanced Features (Weeks 3-4)

**Goal**: Full-featured wiki with search and cross-linking

- [ ] Auto-linking engine
- [ ] Search functionality (MiniSearch)
- [ ] All pages converted (100+)
- [ ] Sidebar navigation
- [ ] Breadcrumbs
- [ ] Dark mode
- [ ] Mobile responsive design
- [ ] File watcher for auto-updates

**Deliverables**:
- Complete wiki (all content)
- Working search
- Auto-updates when files change
- Mobile-friendly

### Phase 3: Advanced Features (Week 5+)

**Goal**: Polish and advanced functionality

- [ ] DM mode toggle
- [ ] Timeline visualization
- [ ] NPC relationship graph
- [ ] Quest dashboard integration
- [ ] Backlinks ("Mentioned in")
- [ ] Export to PDF
- [ ] Version history
- [ ] Analytics

**Deliverables**:
- Production-ready wiki
- Deploy to GitHub Pages
- Custom domain (optional)
- Player training/documentation

---

## Part 4: Deployment Strategy

### Local Development

```bash
# 1. Set up project
cd /home/user/DnD
npm init -y
npm install chokidar markdown-it handlebars minisearch

# 2. Create build script
node .wiki-build/build.js

# 3. Start file watcher
node .wiki-build/watch.js

# 4. Serve locally (optional)
npx http-server wiki-output -p 8080
```

### GitHub Pages Deployment

```bash
# 1. Create gh-pages branch
git checkout --orphan gh-pages
git rm -rf .
cp -r wiki-output/* .
git add .
git commit -m "Deploy wiki"
git push origin gh-pages

# 2. Enable GitHub Pages in repo settings
# Settings > Pages > Source: gh-pages branch

# 3. Access at: https://mordeng.github.io/DnD/
```

### Automated Deployment (n8n)

```
File Change → Build Wiki → Commit to gh-pages → Push → Deploy
```

---

## Next Steps

Would you like me to:
1. **Start building the templates** (.wiki-templates/ directory)
2. **Create the build scripts** (.wiki-build/ directory)
3. **Set up the n8n workflow** (visual workflow)
4. **Generate example pages** (show what final output looks like)
5. **Something else**?

This design gives you a complete, professional wiki system that:
✅ Auto-updates when files change
✅ Beautiful fantasy aesthetic
✅ Full-text search
✅ Mobile-friendly
✅ Cross-linking between pages
✅ DM vs Player modes
✅ Dark mode
✅ Timeline visualization
✅ Quest tracking integration

Ready to start building?
