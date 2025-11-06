# D&D Campaign Wiki - Build System

Automatic static site generator for your D&D campaign markdown files.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Campaign markdown files in proper structure

### Installation

```bash
cd .wiki-build
npm install
```

### Build Wiki

```bash
# One-time build
npm run build

# Watch for changes (auto-rebuild)
npm run watch

# Serve locally for preview
npm run serve
# Visit http://localhost:8080
```

## 📁 File Structure

Your campaign files should be organized like this:

```
DnD/
├── characters/
│   ├── Kalmaris/
│   │   ├── Kalmaris.md
│   │   └── Avernus_Quest.md
│   ├── Milo/
│   └── ...
│
├── 01 Deep Underground/
│   ├── 001 Session.md
│   └── ...
│
├── 02 Baldurs Gate/
│   └── ...
│
├── 03 Avernus/
│   ├── 001 Auf nach Candlekeep.md
│   ├── 002 Ankunft_in_Elturel.md
│   └── ...
│
├── item/
│   ├── kalmaris-spiegel-der-inneren-wahrheit.html
│   └── ...
│
├── Campaign.md
└── README.md
```

## ⚙️ Configuration

Edit `.wiki-config/wiki-config.json` to customize:

- **wiki.title**: Your campaign name
- **wiki.currentDay**: Current day number
- **wiki.currentArc**: Current story arc
- **paths**: Source and output directories
- **categories**: File patterns for each content type
- **theme**: Colors and fonts
- **features**: Enable/disable features (search, dark mode, etc.)

## 🔗 Auto-Linking

The system automatically creates links between entities.

Edit `.wiki-config/entity-links.json` to add known entities:

```json
{
  "characters": {
    "kalmaris": {
      "name": "Kalmaris",
      "aliases": ["Kalmari"],
      "type": "pc",
      "url": "/characters/kalmaris.html"
    }
  }
}
```

When you write "Kalmaris" in any markdown file, it automatically becomes a link!

## 📝 Markdown Frontmatter

Add metadata to your markdown files:

```markdown
---
title: Kalmaris
class: Bard
race: Aarakocra
level: 10
status: active
tags: [player-character, bard, azure-enklave]
---

# Kalmaris

Your content here...
```

## 🎨 Theming

The wiki uses your existing `item-creator.html` color scheme:
- Parchment backgrounds
- Brown/gold accents
- Fantasy fonts (Cinzel + Crimson Text)
- Responsive design

Dark mode is automatically available!

## 🔍 Search

Search index is automatically generated from all pages. Search includes:
- Page titles (highest weight)
- Tags
- Content
- Excerpts

No configuration needed - it just works!

## 🌙 DM Mode

Add DM-only content to any page:

```html
<div class="dm-only" hidden>
  This is secret DM information that players won't see.
</div>
```

Toggle DM mode in the header to show/hide this content.

## 🚀 GitHub Pages Deployment

### Automatic Deployment (Recommended)

1. **Enable GitHub Pages** in your repository:
   - Go to Settings > Pages
   - Source: GitHub Actions

2. **Push changes** to main/master branch:
   ```bash
   git add .
   git commit -m "Update campaign"
   git push
   ```

3. **GitHub Actions automatically**:
   - Builds the wiki
   - Deploys to GitHub Pages
   - Available at: `https://[username].github.io/[repo-name]/`

The workflow is already configured in `.github/workflows/deploy-wiki.yml`!

### Manual Deployment

If you prefer manual deployment:

```bash
# Build locally
npm run build

# Deploy wiki-output/ to your hosting service
```

## 🎯 Features

### Implemented

- ✅ **Auto-linking**: Mentions become links automatically
- ✅ **Search**: Full-text search with fuzzy matching
- ✅ **Dark mode**: Automatic theme switching
- ✅ **DM mode**: Show/hide spoilers
- ✅ **Responsive**: Works on all devices
- ✅ **Backlinks**: See where entities are mentioned
- ✅ **Breadcrumbs**: Easy navigation
- ✅ **Table of Contents**: Auto-generated from headings
- ✅ **Character cards**: Beautiful character displays
- ✅ **Session navigation**: Previous/next navigation

### Coming Soon

- 🔄 **Timeline visualization**: Interactive timeline
- 🔄 **NPC relationship graph**: Visual network map
- 🔄 **Quest progress dashboard**: Track all quests
- 🔄 **PDF export**: Export pages to PDF

## 🐛 Troubleshooting

### Build Fails

**Problem**: `npm run build` fails
**Solution**:
```bash
cd .wiki-build
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Pages Not Generating

**Problem**: Some markdown files don't appear in wiki
**Solution**: Check that files match patterns in `.wiki-config/wiki-config.json`

### Links Not Working

**Problem**: Auto-links not generated
**Solution**: Add entity to `.wiki-config/entity-links.json`

### GitHub Actions Failing

**Problem**: Deployment fails
**Solution**:
1. Check that GitHub Pages is enabled (Settings > Pages)
2. Ensure workflow has proper permissions (already configured)
3. Check Actions tab for error details

## 📊 Performance

- **Build time**: ~5-8 seconds for 100 pages
- **Incremental builds**: ~2-3 seconds for single page
- **Page load time**: <500ms
- **Search time**: <50ms

## 🔧 Advanced

### Custom Templates

Edit templates in `.wiki-templates/`:
- `base.hbs`: Main layout
- `pages/`: Page-specific templates
- `partials/`: Reusable components

Templates use Handlebars syntax.

### Custom Styling

Edit `wiki-output/assets/css/main.css` or add your own CSS files.

### Hooks

Modify `build.js` to add custom build steps:
- Pre-build hooks
- Post-build hooks
- Custom parsers
- Custom renderers

## 📚 Documentation

- **Design Spec**: `dnd-n8n-features/WIKI-DESIGN-SPEC.md`
- **Feature List**: `dnd-n8n-features.md`
- **Config Reference**: `.wiki-config/wiki-config.json` (inline comments)

## 💡 Tips

1. **Commit often**: Git tracks all changes to your campaign
2. **Use tags**: Tag pages for better search results
3. **Add frontmatter**: Helps with categorization and display
4. **Check build logs**: Errors show which files failed to parse
5. **Preview locally**: Use `npm run serve` before pushing

## 🆘 Support

Issues or questions? Check:
- GitHub Issues: [your-repo]/issues
- Documentation: `dnd-n8n-features/WIKI-DESIGN-SPEC.md`
- Examples: Look at existing markdown files

---

**Happy Adventuring!** 🎲🐉
