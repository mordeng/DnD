# GitHub Pages Deployment Fix

## Problem

The GitHub Actions workflow was not generating assets (CSS, JS, images) in the deployed site.

## Root Cause

The workflow was running the build script from the wrong directory:

```yaml
# ❌ WRONG - Changes directory before running build
- name: Build wiki
  run: |
    cd .wiki-build
    node build.js
```

This broke all the relative paths in the build script because:
- Build script defines `ROOT = path.resolve(__dirname, '..')`
- When run from `.wiki-build`, the paths pointed to the wrong location
- Assets in `.wiki-templates/assets/` weren't being copied

## Solution

Run the build script from the repository root:

```yaml
# ✅ CORRECT - Runs from root directory
- name: Build wiki
  run: node .wiki-build/build.js
```

## Changes Made

### `.github/workflows/deploy-wiki.yml`

**Before:**
```yaml
- name: Install dependencies
  run: |
    cd .wiki-build
    npm install

- name: Build wiki
  run: |
    cd .wiki-build
    node build.js
```

**After:**
```yaml
- name: Install dependencies
  run: npm install
  working-directory: .wiki-build

- name: Build wiki
  run: node .wiki-build/build.js

- name: Verify build output
  run: |
    echo "=== Build Output Structure ==="
    ls -la wiki-output/
    echo ""
    echo "=== Assets Directory ==="
    ls -la wiki-output/assets/
    # ... verification steps
```

## Verification Steps Added

The workflow now includes a verification step that shows:
- ✅ Wiki output directory structure
- ✅ Assets directory contents
- ✅ CSS files (main.css ~43KB)
- ✅ JS files (4 files: darkmode, main, navigation, search)
- ✅ Images directory with character and NPC images

## What Gets Deployed Now

After this fix, GitHub Pages will include:

### CSS (wiki-output/assets/css/)
- `main.css` - Full styling including character stats, locations, factions

### JavaScript (wiki-output/assets/js/)
- `main.js` - Core functionality
- `navigation.js` - Menu navigation
- `darkmode.js` - Theme toggle
- `search.js` - Search functionality

### Images (wiki-output/assets/images/)
- Character portraits (kalmaris.jpg, lamil.jpg, etc.)
- NPC images from `bilder/` directory
- Character placeholder SVG
- All images from character subdirectories

### Pages
- Homepage (index.html)
- All character pages with live D&D Beyond data
- Session pages organized by arc
- Quest pages
- Item pages
- Location pages by arc
- Faction pages
- Timeline page
- Search index (search-index.json)

## Testing Locally

To verify the fix works locally:

```bash
# Run build from repository root (not from .wiki-build)
node .wiki-build/build.js

# Check assets were created
ls -la wiki-output/assets/css/
ls -la wiki-output/assets/js/
ls -la wiki-output/assets/images/

# Serve locally
cd .wiki-build
npm run serve
# Visit http://localhost:8080
```

## Deployment Workflow

Now when you push to main:

1. ✅ Checkout repository
2. ✅ Setup Node.js
3. ✅ Install dependencies (in .wiki-build)
4. ✅ **Build wiki (from root directory)** ← Fixed!
5. ✅ Verify build output
6. ✅ Create .nojekyll file
7. ✅ Upload to GitHub Pages
8. ✅ Deploy

## Expected Build Output

When the workflow runs, you should see:

```
🏰 Building D&D Campaign Wiki...

📊 Loaded 0 D&D Beyond character caches  # (until you add character data)
🧹 Cleaned output directory
📁 Found 68 source files

📝 Parsed 68 pages

🔗 Built entity database

🔗 Applied auto-linking

  ✓ Homepage
📄 Generated 69 HTML pages

  ✓ Characters Index
  ✓ Sessions Index
  ✓ Quests Index
  ✓ Items Index
  ✓ Locations Index
  ✓ Factions Index
  ✓ Timeline
📑 Generated index pages

📦 Copied assets

🔍 Generated search index

✅ Build complete in 3.5s
   Pages: 76
   Errors: 0
```

## Next Deployment

Push this change to trigger a new deployment:

```bash
git add .github/workflows/deploy-wiki.yml
git commit -m "Fix GitHub Pages deployment - assets not generating"
git push
```

The site should now deploy with all assets correctly!

## Troubleshooting

If assets still don't show up after deployment:

1. **Check Actions log** - Look for the "Verify build output" step
2. **Hard refresh browser** - Press Ctrl+Shift+R (or Cmd+Shift+R on Mac)
3. **Clear GitHub Pages cache** - Wait 5-10 minutes for CDN to update
4. **Check .nojekyll file** - Should exist in wiki-output root

## Related Files

- Build script: `.wiki-build/build.js`
- Assets source: `.wiki-templates/assets/`
- Output directory: `wiki-output/` (gitignored)
- Workflow: `.github/workflows/deploy-wiki.yml`
