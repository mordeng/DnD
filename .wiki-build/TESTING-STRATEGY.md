# D&D Campaign Wiki - Testing Strategy

**Version**: 1.0
**Last Updated**: 2025-11-07
**Purpose**: Ensure wiki quality, correctness, and visual integrity before deployment

---

## Table of Contents

1. [Testing Philosophy](#testing-philosophy)
2. [Testing Levels](#testing-levels)
3. [Automated Tests](#automated-tests)
4. [Manual Tests](#manual-tests)
5. [Pre-Deployment Checklist](#pre-deployment-checklist)
6. [Testing Workflow](#testing-workflow)
7. [Issue Reporting](#issue-reporting)

---

## Testing Philosophy

**Goals**:
- ✅ Ensure all content is correctly converted from markdown to HTML
- ✅ Verify data accuracy (character stats, dates, locations)
- ✅ Confirm visual quality and responsive design
- ✅ Validate all links and navigation work
- ✅ Test search functionality
- ✅ Check cross-browser compatibility
- ✅ Ensure accessibility standards

**Testing Pyramid**:
```
        /\
       /  \        Manual Visual Testing (10%)
      /----\
     /      \      Integration Testing (30%)
    /--------\
   /          \    Automated Unit Testing (60%)
  /____________\
```

---

## Testing Levels

### Level 1: Build & Content Tests (Automated)
**Frequency**: Every build
**Runtime**: ~30 seconds
**Tools**: Node.js test scripts

Tests:
- ✓ Build completes without errors
- ✓ All markdown files are processed
- ✓ No missing template files
- ✓ Output directory structure is correct
- ✓ All expected pages are generated

### Level 2: Data Validation (Automated)
**Frequency**: Every build
**Runtime**: ~1 minute
**Tools**: Custom validation scripts

Tests:
- ✓ Character data matches source files
- ✓ Session dates are in correct order
- ✓ All internal links are valid
- ✓ No broken image references
- ✓ Search index is complete
- ✓ Frontmatter is correctly parsed

### Level 3: Functional Tests (Semi-Automated)
**Frequency**: Before deployment
**Runtime**: ~5 minutes
**Tools**: Playwright/Puppeteer + manual checks

Tests:
- ✓ Search returns correct results
- ✓ Navigation menu works
- ✓ Dark mode toggle functions
- ✓ DM mode toggle shows/hides content
- ✓ Breadcrumbs are accurate
- ✓ Mobile menu works

### Level 4: Visual & UI Tests (Manual)
**Frequency**: Major changes only
**Runtime**: ~15 minutes
**Tools**: Browser DevTools + checklist

Tests:
- ✓ Layout is correct on desktop/tablet/mobile
- ✓ Fonts load properly
- ✓ Colors match theme
- ✓ Images display correctly
- ✓ Print styles work
- ✓ Animations are smooth

### Level 5: Cross-Browser Tests (Manual)
**Frequency**: Before major releases
**Runtime**: ~10 minutes
**Browsers**: Chrome, Firefox, Safari, Edge

Tests:
- ✓ Pages render correctly
- ✓ JavaScript features work
- ✓ CSS is compatible
- ✓ Performance is acceptable

---

## Automated Tests

### Test Script: `test-wiki.js`

Located in `.wiki-build/test-wiki.js`

**Run with**:
```bash
cd .wiki-build
npm test
```

**What it tests**:
1. **Build Health**
   - Verifies build.js runs without errors
   - Checks output directory exists
   - Validates all asset files are copied

2. **Content Completeness**
   - Counts source markdown files
   - Counts generated HTML files
   - Ensures 1:1 mapping (or explains discrepancies)

3. **Link Validation**
   - Parses all generated HTML
   - Extracts internal links
   - Verifies target pages exist
   - Reports broken links

4. **Data Integrity**
   - Validates character stats against source
   - Checks session chronology
   - Verifies quest progress values
   - Confirms location names are consistent

5. **Search Index**
   - Validates search-index.json structure
   - Ensures all pages are indexed
   - Tests sample searches

6. **Accessibility**
   - Checks for alt text on images
   - Validates heading hierarchy
   - Ensures proper ARIA labels

**Expected Output**:
```
✓ Build completed successfully (3.2s)
✓ All 127 pages generated
✓ 0 broken links found
✓ Character data validated (6/6 characters)
✓ Search index complete (127/127 pages)
✓ Accessibility: 2 warnings (see report)

Build Grade: A (98/100)
```

### Test Script: `visual-test.js`

Located in `.wiki-build/visual-test.js`

**Run with**:
```bash
cd .wiki-build
npm run test:visual
```

**What it tests**:
1. **Screenshot Comparison**
   - Takes screenshots of key pages
   - Compares to baseline images
   - Reports visual differences

2. **Responsive Breakpoints**
   - Tests at 320px, 768px, 1024px, 1920px
   - Ensures layout adapts correctly
   - Checks for overflow/clipping

3. **Component Rendering**
   - Character cards
   - Timeline entries
   - Quest progress bars
   - Search results

---

## Manual Tests

### Pre-Deployment Checklist

Before pushing to production, manually verify:

#### 🏠 Homepage
- [ ] Hero section displays current day/arc/location
- [ ] Statistics are accurate
- [ ] Recent updates show latest 5 sessions
- [ ] Quick links grid works
- [ ] Party roster shows all 6 characters
- [ ] Footer information is correct

#### 👥 Character Pages
Pick 2 random characters and verify:
- [ ] Portrait image loads
- [ ] Stats are correct (class, race, level)
- [ ] Personal quest is listed
- [ ] "Mentioned in" section has backlinks
- [ ] Related pages are relevant
- [ ] Navigation to other characters works

#### 📖 Session Pages
Pick 3 random sessions (one per arc) and verify:
- [ ] Content is fully rendered
- [ ] Images display correctly
- [ ] Internal links work (to characters, locations, etc.)
- [ ] Previous/Next navigation works
- [ ] Arc breadcrumb is correct
- [ ] Date/day information is accurate

#### 🔍 Search Functionality
- [ ] Search opens with Cmd/Ctrl+K
- [ ] Typing shows instant results
- [ ] Results are grouped by type
- [ ] Clicking result navigates correctly
- [ ] Search highlights query terms
- [ ] No results state shows when appropriate

#### 🌙 Dark Mode
- [ ] Toggle button works
- [ ] Preference persists on page reload
- [ ] All text is readable
- [ ] Colors match theme
- [ ] Images/icons are visible
- [ ] No jarring color changes

#### 👁️ DM Mode
- [ ] Toggle button works
- [ ] DM-only content appears/disappears
- [ ] State persists during session
- [ ] No spoilers visible when off
- [ ] Visual indicator shows current mode

#### 📱 Mobile Responsiveness
Test on phone or at 375px width:
- [ ] Header adapts (hamburger menu)
- [ ] Navigation menu is accessible
- [ ] Content is readable (no horizontal scroll)
- [ ] Cards stack vertically
- [ ] Buttons are tappable (44px min)
- [ ] Search overlay works

#### 🔗 Navigation
- [ ] Main nav links work
- [ ] Breadcrumbs show correct path
- [ ] Sidebar navigation expands/collapses
- [ ] Footer links work
- [ ] All category index pages exist

### Sample Content Verification

#### Character Data Spot Check
For each PC, verify:
- **Kalmaris**: Aarakocra Bard, Level 10, Active
- **Lamil**: Wildfire Druid
- **Longjohn**: Revenge quest active
- **Lufnik**: Moon-based abilities
- **Milo**: Gnome Alchemist, narrator perspective
- **Serox**: Legendary armor quest

#### Timeline Accuracy
Verify these key dates:
- **Day 1**: Shipwreck on Moreva
- **Day 67**: End of Arc 1
- **Day 68**: Baldur's Gate arrival
- **Day 134**: End of Arc 2
- **Day 135+**: Avernus descent
- **Day 145**: Current location (Fort Knucklebone)

#### Quest Progress
Check that quests show correct status:
- [ ] Main quest: Save Elturel (in-progress)
- [ ] Kalmaris: Identity search (in-progress)
- [ ] Serox: Legendary armor (in-progress)
- [ ] Completed quests marked correctly

---

## Testing Workflow

### For Every Code Change

```bash
# 1. Build locally
cd .wiki-build
npm run build

# 2. Run automated tests
npm test

# 3. Serve locally for manual inspection
npm run serve
# Visit http://localhost:8080

# 4. Quick manual check (5 min)
# - Open homepage
# - Test search
# - Check 2-3 random pages
# - Toggle dark mode
# - Check mobile view

# 5. If tests pass, commit and push
git add .
git commit -m "Description of changes"
git push
```

### For Major Changes

```bash
# 1. Run full test suite
npm run test:full

# 2. Visual regression test
npm run test:visual

# 3. Extended manual testing (15 min)
# - Use pre-deployment checklist
# - Test all navigation paths
# - Verify data accuracy
# - Check multiple browsers

# 4. Generate test report
npm run test:report

# 5. Review report, fix issues, repeat
```

### After Deployment

```bash
# 1. Visit live site: https://mordeng.github.io/DnD/

# 2. Quick smoke test
# - Homepage loads
# - Search works
# - 3 random pages load
# - Dark mode toggle works

# 3. Check GitHub Actions logs
# - Build succeeded
# - Deployment succeeded
# - No warnings/errors

# 4. Performance check
# - Google PageSpeed Insights
# - Lighthouse audit
# - Check load times
```

---

## Issue Reporting

### When Tests Fail

**Create a testing report**:

```markdown
## Test Failure Report

**Date**: 2025-11-07
**Build**: #42
**Tester**: [Your Name]

### Failed Tests
1. **Link Validation**
   - Error: Broken link to `/characters/kaelin.html`
   - Source: `/sessions/arc-2/session-015.html`
   - Fix: Character file missing, need to create

2. **Visual Test**
   - Error: Character card overflow on mobile
   - Breakpoint: 375px
   - Fix: Adjust card width in CSS

### Action Items
- [ ] Create missing character page
- [ ] Fix mobile card layout
- [ ] Re-run tests
- [ ] Deploy fix

### Screenshots
[Attach screenshots if visual issues]
```

### Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Broken links | File renamed/moved | Update references or add redirect |
| Missing images | File path incorrect | Check image paths in config |
| Character data wrong | Frontmatter outdated | Update source markdown |
| Search not finding page | Not in index | Rebuild search index |
| Dark mode colors off | CSS variable missing | Add to theme config |
| Mobile menu broken | JavaScript error | Check console logs |

---

## Test Coverage Goals

**Current Coverage**:
- ✅ Build process: 100%
- ✅ Link validation: 100%
- ✅ Data integrity: 80%
- ⚠️ Visual testing: 40%
- ⚠️ Accessibility: 60%

**Target Coverage**:
- Build process: 100%
- Link validation: 100%
- Data integrity: 95%
- Visual testing: 80%
- Accessibility: 90%

---

## Performance Benchmarks

**Target Metrics**:
- Build time: < 10s for full build
- Page load time: < 1s
- Search response: < 100ms
- Lighthouse score: > 90
- Mobile usability: 100%

**How to Measure**:
```bash
# Build time
time npm run build

# Page load (using Lighthouse)
npm run test:performance

# Search speed (in test-wiki.js)
npm test -- --grep "search"
```

---

## Continuous Improvement

### Monthly Review
- Review test results from past month
- Identify flaky tests
- Update test coverage
- Add new test cases for new features

### Quarterly Updates
- Update baseline screenshots
- Review and update test data
- Audit accessibility
- Performance optimization

---

## Quick Reference

**Before Every Push**:
```bash
npm run build && npm test
```

**Before Major Release**:
```bash
npm run test:full && npm run test:visual
```

**After Deployment**:
```bash
# Visit: https://mordeng.github.io/DnD/
# Check: Homepage, Search, 3 Random Pages
```

**When in Doubt**:
```bash
# Run this and fix everything it reports
npm run test:all
```

---

## Resources

- **Build Scripts**: `.wiki-build/build.js`
- **Test Scripts**: `.wiki-build/test-*.js`
- **Config**: `.wiki-config/wiki-config.json`
- **CI/CD**: `.github/workflows/deploy-wiki.yml`
- **Issue Tracker**: GitHub Issues

---

**Remember**: Better to catch issues locally than after deployment! 🎲

Test often, deploy confidently. 🚀
