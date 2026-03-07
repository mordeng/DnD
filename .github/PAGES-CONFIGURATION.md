# GitHub Pages Configuration Fix

## Problem: Only seeing README instead of the wiki

This happens when GitHub Pages is configured to deploy from a **branch** (e.g., `main` or `gh-pages`) instead of **GitHub Actions**.

## Solution: Configure GitHub Pages to use GitHub Actions

### Step 1: Go to Repository Settings

1. Open your repository on GitHub
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar under "Code and automation")

### Step 2: Change Source to GitHub Actions

In the **Build and deployment** section:

**Current (Wrong) Setting:**
```
Source: Deploy from a branch
Branch: main / (root)
```
This deploys the README.md from your repository root.

**Correct Setting:**
```
Source: GitHub Actions
```

### Step 3: Save and Wait

1. The source dropdown should show "GitHub Actions"
2. GitHub will automatically detect your workflow
3. Wait for the next workflow run (or trigger manually)

## How to Verify

### Check Workflow Runs

1. Go to **Actions** tab
2. Look for "Build and Deploy Wiki" workflow
3. It should show:
   - ✅ Build job completed
   - ✅ Deploy job completed

### Check Build Logs

In the workflow run, check the "Verify build output" step:

```
=== Build Output Structure ===
-rwxr-xr-x index.html
-rwxr-xr-x timeline.html
drwxr-xr-x assets/
drwxr-xr-x characters/
drwxr-xr-x sessions/
...

=== CSS Files ===
-rw-r--r-- main.css (43KB)

=== JS Files ===
-rw-r--r-- darkmode.js
-rw-r--r-- main.js
-rw-r--r-- navigation.js
-rw-r--r-- search.js
```

If you see this, the build is working correctly!

### Check Deployment URL

After deployment completes, visit your GitHub Pages URL:
- Should see: Your D&D wiki homepage
- Should NOT see: Repository README

## Alternative: Manual Trigger

If automatic deployment isn't working:

1. Go to **Actions** tab
2. Click "Build and Deploy Wiki" workflow
3. Click "Run workflow" button (right side)
4. Select `main` branch
5. Click green "Run workflow" button

## Troubleshooting

### "No GitHub Actions option in dropdown"

Make sure the workflow file exists and is committed:
```bash
git add .github/workflows/deploy-wiki.yml
git commit -m "Add GitHub Pages workflow"
git push
```

Then refresh the Pages settings page.

### "Deployment succeeds but still shows README"

1. **Hard refresh browser**: Ctrl+Shift+R (Cmd+Shift+R on Mac)
2. **Clear cache**: Wait 5-10 minutes for GitHub's CDN
3. **Check deployment URL**: Click the URL in the deployment step

### "Actions workflow fails"

Check the error in the Actions tab:
- **Build fails**: Check the "Build wiki" step for errors
- **Deploy fails**: Permissions might be wrong

## Expected Workflow Flow

```
Push to main
    ↓
GitHub Actions trigger
    ↓
Build job:
  - Checkout code
  - Install dependencies
  - Run build script
  - Create wiki-output/
  - Upload artifact
    ↓
Deploy job:
  - Download artifact
  - Deploy to GitHub Pages
    ↓
Site live at: https://[username].github.io/[repo]/
```

## Permissions Check

Make sure your workflow has the correct permissions (already set in deploy-wiki.yml):

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

## What GitHub Pages Should Deploy

With correct configuration, GitHub Pages deploys the **wiki-output/** directory containing:

- ✅ index.html (homepage)
- ✅ /characters/ (character pages with D&D Beyond data)
- ✅ /sessions/ (session pages by arc)
- ✅ /locations/ (location pages)
- ✅ /factions/ (faction pages)
- ✅ /quests/ (quest pages)
- ✅ /items/ (item pages)
- ✅ timeline.html
- ✅ /assets/css/main.css
- ✅ /assets/js/*.js
- ✅ /assets/images/**/*
- ✅ search-index.json
- ✅ .nojekyll (tells GitHub not to use Jekyll)

**NOT** your repository root with README.md!

## Quick Fix Summary

1. **Go to Settings → Pages**
2. **Change Source from "Deploy from a branch" to "GitHub Actions"**
3. **Save**
4. **Trigger workflow** (push or manual trigger)
5. **Wait ~2 minutes** for deployment
6. **Visit your Pages URL**

Done! You should now see your beautiful D&D wiki! 🎉
