# Feature: Auto-Generate HTML Campaign Wiki

**Category**: Quest & Story / Content Generation
**Priority**: High
**Complexity**: Medium-High
**Status**: Not Started

## Overview

Convert markdown campaign files into a beautiful static HTML website automatically. Transform notes, character sheets, location descriptions, and session logs into an interconnected wiki that players and DM can browse. The wiki updates automatically whenever campaign files change.

## User Story

Als Spielleiter möchte ich eine automatisch generierte HTML-Wiki-Website meiner Kampagne, die sich bei jeder Dateiänderung aktualisiert, damit meine Spieler und ich eine professionell aussehende, durchsuchbare Referenz haben.

## Requirements

### Must-Haves

1. **Markdown to HTML Conversion**
   - Convert all campaign markdown files to HTML
   - Preserve formatting (headers, lists, bold, italic, links)
   - Support tables, code blocks, quotes
   - Handle German special characters (ä, ö, ü, ß)
   - Support mermaid diagrams for relationship maps

2. **Site Structure**
   - **Homepage**: Campaign overview and recent updates
   - **Timeline**: Chronological event listing
   - **Characters**: PC and NPC pages
   - **Locations**: Places by arc (Moreva, Baldur's Gate, Avernus)
   - **Sessions**: All session notes organized by arc
   - **Quests**: Quest tracker and dashboard
   - **Items**: Magical items and equipment
   - **Factions**: Organizations and their members

3. **Navigation**
   - Main navigation menu
   - Sidebar with page tree
   - Breadcrumb navigation
   - Search functionality (full-text)
   - Internal link conversion (markdown → HTML)
   - "Last updated" timestamps

4. **Styling & Theme**
   - Fantasy/D&D aesthetic matching item-creator.html
   - Parchment/aged paper background
   - Readable typography (Crimson Text for body, Cinzel for headers)
   - Responsive design (mobile-friendly)
   - Dark mode option
   - Print-friendly styles

5. **Auto-Update**
   - Watch campaign files for changes
   - Regenerate affected pages
   - Update index and navigation
   - Fast incremental builds (only changed files)

6. **Cross-Referencing**
   - Automatic link detection between pages
   - "Mentioned in" sections (backlinks)
   - Related content suggestions
   - Tag-based connections

### Should-Haves

1. **Advanced Search**
   - Filter by category (NPCs, locations, sessions, etc.)
   - Search by date range (Tag X-Y)
   - Search by character
   - Search by faction

2. **Interactive Elements**
   - Collapsible sections
   - Tooltips for linked terms (hover to preview)
   - Image galleries
   - Embedded audio clips (if available)
   - Timeline visualization

3. **DM vs Player Views**
   - Toggle for DM-only content (spoilers, hidden info)
   - Player-safe version without DM notes
   - Password-protected DM sections

4. **Analytics**
   - Track most-viewed pages
   - Popular search terms
   - Dead links report
   - Orphaned pages (not linked from anywhere)

5. **Export Options**
   - Generate PDF of entire wiki
   - Export individual pages as PDF
   - EPUB format for e-readers
   - Offline version (single HTML file)

### Nice-to-Haves

1. **Version History**
   - Show git commit history for pages
   - "View previous version" links
   - Highlight recent changes

2. **Comments System**
   - Allow players to add comments to pages
   - DM can respond to questions
   - Moderation controls

3. **Custom Widgets**
   - Dice roller embedded in wiki
   - Character stat calculator
   - Spell lookup
   - Encounter builder

4. **Multi-Campaign Support**
   - Switch between different campaigns
   - Shared asset library
   - Compare campaigns

## Story Integration Points

### Wiki Structure for Current Campaign

```
Campaign Wiki - Milo Quicksparks Abenteuerlogbuch
│
├─ 🏠 Homepage (Campaign.md overview)
│
├─ ⏱️ Timeline
│   └─ Auto-generated from all sessions
│
├─ 👥 Characters
│   ├─ Player Characters
│   │   ├─ Kalmaris (Aarakocra Bard)
│   │   ├─ Lamil (Wildfire Druid)
│   │   ├─ Longjohn (Pirate/Avenger)
│   │   ├─ Lufnik (Moon-touched)
│   │   ├─ Milo Quickspark (Gnome Alchemist)
│   │   └─ Serox (Smith/Armor Seeker)
│   │
│   └─ NPCs
│       ├─ Allies
│       │   ├─ Captain Zodge
│       │   ├─ Kaelin Sturmreiter †
│       │   └─ ...
│       ├─ Enemies
│       │   ├─ Zariel (Archduchess of Avernus)
│       │   ├─ Elara "Die Eisige Klinge"
│       │   └─ ...
│       └─ Neutral
│
├─ 🗺️ Locations
│   ├─ Arc 1: Deep Underground
│   │   ├─ Moreva Island
│   │   ├─ Mountain Pass
│   │   └─ Dwarf City
│   ├─ Arc 2: Baldur's Gate
│   │   ├─ City Overview
│   │   ├─ Arena
│   │   ├─ RR Guild
│   │   └─ Widowhall
│   └─ Arc 3: Avernus
│       ├─ Avernus Overview (ratgeber.md)
│       ├─ Elturel
│       ├─ High Hall
│       ├─ Fort Knucklebone
│       └─ Crawl Locations
│
├─ 📖 Sessions
│   ├─ Arc 1: Days 1-67
│   ├─ Arc 2: Days 68-134
│   └─ Arc 3: Day 135+
│
├─ ✅ Quests
│   ├─ Main Quest: Save Elturel
│   └─ Character Quests
│       ├─ Kalmaris: Identity Search
│       ├─ Lamil: Stop Morgath
│       ├─ Lufnik: Find Arian
│       ├─ Longjohn: Revenge
│       ├─ Milo: Protect Friends
│       └─ Serox: Legendary Armor
│
├─ 🎁 Items & Equipment
│   ├─ Magical Items
│   ├─ Serox's Präzisionshammer
│   ├─ Kalmaris' Spiegel der Inneren Wahrheit
│   └─ ...
│
├─ 🏛️ Factions
│   ├─ Azure-Enklave
│   ├─ Eiserner Zirkel
│   ├─ RR-Gilde
│   ├─ Mechaniker-Kollektiv
│   ├─ Flaming Fists
│   └─ Infernal Forces
│
└─ 🔍 Search & Index
```

### Homepage Layout

**Hero Section**:
- Campaign title: "Milo Quicksparks Abenteuerlogbuch"
- Current status: "Tag 145 - Avernus Arc - Fort Knucklebone"
- Party level and status
- Latest session link

**Recent Updates**:
- Last 5 session summaries
- Recent quest completions
- New NPCs met
- Items acquired

**Quick Links**:
- Timeline
- Quest Dashboard
- Character Roster
- Current Location Info

**Statistics**:
- Total sessions: X
- Days traveled: 145
- NPCs met: 40+
- Locations visited: 25+
- Quests completed: 12

### Page Templates

**Character Page Template**:
```html
<div class="character-page">
  <header>
    <img src="character-portrait.png" alt="Character Name">
    <h1>[Character Name]</h1>
    <p class="character-class">[Class & Race]</p>
  </header>

  <section class="character-stats">
    <!-- Stats, abilities, traits -->
  </section>

  <section class="character-story">
    <h2>Backstory</h2>
    <!-- Backstory content -->
  </section>

  <section class="character-quests">
    <h2>Personal Quests</h2>
    <!-- Quest list -->
  </section>

  <section class="character-mentions">
    <h2>Mentioned In</h2>
    <!-- Links to sessions where character had major moments -->
  </section>
</div>
```

**Location Page Template**:
```html
<div class="location-page">
  <header>
    <h1>[Location Name]</h1>
    <p class="location-meta">Arc: [X] | First Visited: Tag [Y]</p>
  </header>

  <section class="location-description">
    <!-- Description from markdown -->
  </section>

  <section class="location-npcs">
    <h2>Notable NPCs</h2>
    <!-- NPCs found here -->
  </section>

  <section class="location-events">
    <h2>Events Here</h2>
    <!-- Timeline of events at this location -->
  </section>

  <section class="location-connections">
    <h2>Connected Locations</h2>
    <!-- Links to nearby places -->
  </section>
</div>
```

## Technical Implementation

### n8n Workflow Steps

1. **File Watcher Node**
   - Monitor all campaign markdown files
   - Detect file changes, additions, deletions
   - Debounce rapid changes (wait 10s after last change)

2. **Function Node: File Categorizer**
   ```javascript
   // Categorize files by type:
   // - Characters: /characters/*/.md
   // - Sessions: /01|02|03 */**.md
   // - Items: /item/*.html
   // - Locations: detect from content or path
   // - Quests: *Quest.md or Quest-*.md
   ```

3. **Markdown Parser Node**
   - Convert markdown to HTML
   - Parse frontmatter (if present)
   - Extract metadata (title, date, tags)
   - Handle German characters
   - Convert mermaid diagrams to SVG

4. **Function Node: Link Converter**
   ```javascript
   // Convert markdown links to HTML:
   // [Text](path/to/file.md) → <a href="path/to/file.html">Text</a>

   // Auto-link entity mentions:
   // "Kalmaris" → <a href="/characters/kalmaris.html">Kalmaris</a>
   ```

5. **Function Node: Navigation Generator**
   ```javascript
   // Build site navigation from file structure
   // Generate sidebar menu
   // Create breadcrumbs
   // Build search index
   ```

6. **Template Node: Apply HTML Templates**
   - Apply base template (header, footer, nav)
   - Apply page-specific template
   - Inject CSS and JavaScript
   - Add meta tags for SEO

7. **Function Node: Cross-Reference**
   ```javascript
   // Find all pages mentioning this entity
   // Generate "Mentioned in" sections
   // Create related content links
   ```

8. **File Writer Node**
   - Write HTML files to output directory
   - Copy assets (images, CSS, JS)
   - Generate index.html
   - Create search index JSON

9. **Deployment Node (Optional)**
   - Deploy to GitHub Pages
   - Upload to web server via FTP/SFTP
   - Sync to Netlify/Vercel
   - Clear CDN cache

### Technology Stack

**Markdown Processing**:
- `markdown-it` - Fast markdown parser
- `markdown-it-attrs` - Add classes/IDs to elements
- `markdown-it-anchor` - Auto-generate heading anchors
- `mermaid` - Diagram rendering

**Templating**:
- `handlebars` or `nunjucks` - HTML templating
- Custom templates for each page type

**Search**:
- `lunr.js` - Client-side full-text search
- Or `fuse.js` - Fuzzy search alternative

**Styling**:
- Custom CSS with D&D theme
- `normalize.css` for browser consistency
- Font imports from Google Fonts

**JavaScript**:
- Vanilla JS for interactions
- No heavy frameworks needed
- Progressive enhancement

### CSS Theme (Matching item-creator.html)

```css
:root {
  --parchment-light: #f9f1e6;
  --parchment-dark: #f0e6d2;
  --brown-primary: #8b4513;
  --brown-secondary: #a0522d;
  --gold-accent: #d4af37;
  --text-dark: #2c1810;
  --text-light: #f9f1e6;
}

body {
  font-family: 'Crimson Text', serif;
  background: linear-gradient(135deg, var(--parchment-light), var(--parchment-dark));
  color: var(--text-dark);
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Cinzel', serif;
  color: var(--brown-primary);
}

.wiki-header {
  background: linear-gradient(135deg, var(--brown-primary), var(--brown-secondary));
  color: var(--text-light);
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.wiki-nav {
  background: rgba(139, 69, 19, 0.1);
  border-right: 3px solid var(--brown-primary);
}

.wiki-content {
  background: var(--parchment-light);
  border: 2px solid var(--brown-primary);
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 5px 20px rgba(139, 69, 19, 0.2);
}

a {
  color: var(--brown-primary);
  text-decoration: none;
  border-bottom: 1px solid var(--gold-accent);
  transition: all 0.3s;
}

a:hover {
  color: var(--gold-accent);
}
```

## Dependencies

- n8n with markdown processing capabilities
- Read access to all campaign files
- Write access to wiki output directory
- Optional: Web server or GitHub Pages
- Optional: Domain name for wiki

## Testing Criteria

- [ ] Converts all markdown files to HTML successfully
- [ ] Preserves formatting and German characters
- [ ] All internal links work correctly
- [ ] Navigation is intuitive and complete
- [ ] Search finds relevant results
- [ ] Mobile-responsive design works
- [ ] Page load time under 2 seconds
- [ ] No broken links in generated wiki
- [ ] Updates within 30 seconds of file change

## Success Metrics

- Wiki contains 100+ pages
- Players visit wiki at least once per week
- Search used successfully 80%+ of queries
- Zero broken internal links
- DM uses wiki for quick reference during sessions
- Wiki accessible from any device

## Related Features

- **Automatic Timeline Generation** - Timeline page in wiki
- **Quest Progress Dashboard** - Quest section in wiki
- **NPC Relationship Mapper** - NPC network page in wiki
- **Session Summary Generator** - Session pages in wiki

## Implementation Notes

### Phase 1: Basic Wiki (MVP)
1. Convert markdown to HTML
2. Create simple page templates
3. Basic navigation structure
4. Deploy to local HTML files

### Phase 2: Enhanced Features
1. Add search functionality
2. Implement cross-referencing
3. Add fantasy styling
4. Auto-update on file change

### Phase 3: Advanced Features
1. DM vs Player views
2. Version history
3. Advanced search filters
4. Export to PDF

### Phase 4: Deployment & Hosting
1. Deploy to GitHub Pages
2. Custom domain setup
3. CDN for performance
4. Analytics integration

## Campaign-Specific Configuration

```json
{
  "wikiTitle": "Milo Quicksparks Abenteuerlogbuch",
  "wikiSubtitle": "Eine epische Reise von Moreva bis Avernus",
  "sourceDirectory": "/mnt/c/Users/morde/OneDrive/Dokumente/workspace/DnD/DnD",
  "outputDirectory": "./wiki-output",
  "baseUrl": "https://dnd-campaign.github.io",
  "theme": "fantasy-parchment",
  "language": "de",
  "fonts": {
    "body": "Crimson Text",
    "heading": "Cinzel"
  },
  "navigation": [
    {"label": "Home", "path": "/index.html"},
    {"label": "Timeline", "path": "/timeline.html"},
    {"label": "Characters", "path": "/characters/index.html"},
    {"label": "Locations", "path": "/locations/index.html"},
    {"label": "Sessions", "path": "/sessions/index.html"},
    {"label": "Quests", "path": "/quests/index.html"},
    {"label": "Items", "path": "/items/index.html"},
    {"label": "Factions", "path": "/factions/index.html"}
  ],
  "excludePatterns": [
    "*/archive/*",
    "*.git/*",
    "*node_modules/*"
  ],
  "autoLinkEntities": true,
  "generateSitemap": true,
  "enableSearch": true,
  "updateFrequency": "on_file_change",
  "deployTarget": "github_pages"
}
```

## Example Wiki Page Output

See `dnd-n8n-features/examples/wiki-page-example.html` for full HTML example.
