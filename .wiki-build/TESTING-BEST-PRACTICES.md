# Testing Best Practices Comparison & Implementation

**Date**: 2025-11-07
**Research**: Modern web testing practices for static sites in 2025

---

## Executive Summary

After researching industry best practices for automated website testing in 2025, we've implemented a **multi-layered testing strategy** that combines:

1. ✅ **Custom content validation** (our Node.js scripts)
2. ✅ **Performance & Accessibility** (Lighthouse CI)
3. ✅ **Link validation** (Lychee)
4. ✅ **HTML validation** (HTML5 Validator)
5. ✅ **Accessibility testing** (Pa11y)
6. ✅ **Security scanning** (Trivy)
7. ✅ **CI/CD integration** (GitHub Actions)

This approach follows 2025 best practices and provides comprehensive quality assurance.

---

## Industry Best Practices (2025)

### 1. Testing Pyramid

Modern testing follows the **Testing Pyramid** approach:

```
        /\
       /  \      E2E Tests (10-20%)
      /----\     - User flows
     /      \    - Critical paths
    /--------\   - Cross-browser
   /          \
  /  Integration\ Integration Tests (20-30%)
 /    Tests     \- API calls
/                \- Data flow
|________________|

    Unit Tests    Unit Tests (50-70%)
    (Base)        - Functions
                  - Components
                  - Data validation
```

For a **static wiki site**, we adapt this to:

```
        /\
       /  \      Manual Visual Testing (10%)
      /----\     - Design review
     /      \    - UX testing
    /--------\
   /          \  End-to-End Functional (20%)
  /   E2E     \  - Lighthouse
 /   Tests     \ - Pa11y
/                \- Browser tests
|________________|

  Automated       Content Validation (70%)
  Validation      - Build tests
                  - Link checking
                  - HTML validation
                  - Data integrity
```

### 2. CI/CD Integration - GitHub Actions

**Best Practice**: ✅ **YES - Absolutely run tests in CI/CD!**

**Why?**
- ✅ Catch issues before deployment
- ✅ Prevent broken builds going live
- ✅ Automatic testing on every PR/commit
- ✅ Test reports in pull requests
- ✅ No manual testing burden
- ✅ Consistent test environment

**Our Implementation**:
- Separate testing workflow (`.github/workflows/test-wiki.yml`)
- Runs on pull requests AND pushes
- Parallel test execution
- Artifacts uploaded for review
- Test summary in PR comments

### 3. Modern Testing Tools

Based on 2025 research:

| Tool | Best For | Why Use It | Our Status |
|------|----------|------------|------------|
| **Playwright** | E2E testing | Multi-browser, fast, CI-friendly | ⏳ Future enhancement |
| **Lighthouse CI** | Performance + A11y | Industry standard, comprehensive | ✅ Implemented |
| **Lychee** | Link checking | Fast, accurate, GitHub Action | ✅ Implemented |
| **HTML5 Validator** | HTML validation | W3C standards compliance | ✅ Implemented |
| **Pa11y** | Accessibility | WCAG compliance testing | ✅ Implemented |
| **Trivy** | Security | Vulnerability scanning | ✅ Implemented |
| **Custom Scripts** | Content validation | Wiki-specific tests | ✅ Implemented |

---

## Our Testing Strategy

### Layer 1: Build & Content Tests (Custom)

**File**: `.wiki-build/test-wiki.js`

**What it does**:
- ✅ Verifies build completes
- ✅ Checks all markdown files converted
- ✅ Validates internal links
- ✅ Verifies character data accuracy
- ✅ Checks search index completeness
- ✅ Basic accessibility checks

**Why custom?**
- Campaign-specific validation (day numbers, arcs, characters)
- Data integrity checks (quest progress, timeline accuracy)
- Wiki structure validation
- No generic tool can do this

**Run locally**:
```bash
cd .wiki-build
npm test
```

### Layer 2: Performance & Accessibility (Lighthouse CI)

**What it tests**:
- ✅ Performance (load times, FCP, LCP, CLS)
- ✅ Accessibility (WCAG compliance, contrast, alt text)
- ✅ Best Practices (HTTPS, console errors, deprecated APIs)
- ✅ SEO (meta tags, crawlability, mobile-friendly)

**Thresholds** (defined in `lighthouserc.json`):
- Performance: ≥ 80
- Accessibility: ≥ 90
- Best Practices: ≥ 85
- SEO: ≥ 90

**Why?**
- Industry standard for web quality
- Catches performance regressions
- Ensures accessibility standards
- Provides actionable recommendations

### Layer 3: Link Validation (Lychee)

**What it tests**:
- ✅ All internal links work
- ✅ No broken image references
- ✅ Navigation links are valid
- ✅ Anchor links work

**Why?**
- Fast and accurate
- GitHub Action available
- Prevents broken navigation
- Better than our custom link checker

### Layer 4: HTML Validation

**What it tests**:
- ✅ Valid HTML5 syntax
- ✅ Proper element nesting
- ✅ Closed tags
- ✅ Valid attributes

**Why?**
- Ensures cross-browser compatibility
- Catches markup errors
- Best practices compliance
- Prevents rendering issues

### Layer 5: Accessibility Testing (Pa11y)

**What it tests**:
- ✅ WCAG 2.1 AA compliance
- ✅ Screen reader compatibility
- ✅ Keyboard navigation
- ✅ Color contrast
- ✅ Semantic HTML

**Why?**
- Dedicated accessibility tool
- More thorough than Lighthouse
- CLI-based (CI-friendly)
- Detailed reports

### Layer 6: Security Scanning (Trivy)

**What it tests**:
- ✅ Dependency vulnerabilities
- ✅ Known security issues
- ✅ License compliance
- ✅ Misconfigurations

**Why?**
- Free and open-source
- Fast scanning
- GitHub integration
- Prevents vulnerable dependencies

---

## Testing Workflow

### Local Development

```bash
# 1. Build the wiki
cd .wiki-build
npm run build

# 2. Run custom tests
npm test

# 3. Serve locally
npm run serve

# 4. Manual check
# Visit http://localhost:8080
# Test search, navigation, dark mode
```

### Pull Request / Push

**Automatic GitHub Actions workflow**:

1. **test-wiki.yml** runs:
   - Build & Content Tests
   - Lighthouse CI (3 runs)
   - Link Checker
   - HTML Validation
   - Accessibility Tests
   - Security Scan

2. **Results appear in**:
   - PR checks (✓ or ✗)
   - Actions tab (detailed logs)
   - PR summary (test report)
   - Artifacts (Lighthouse reports)

3. **If all tests pass**:
   - ✅ Merge allowed
   - ✅ deploy-wiki.yml runs
   - ✅ Site goes live

4. **If tests fail**:
   - ❌ Merge blocked
   - 🔍 Review logs
   - 🛠️ Fix issues
   - 🔄 Push again

### Post-Deployment

```bash
# Visit live site
https://mordeng.github.io/DnD/

# Quick smoke test
1. Homepage loads
2. Search works
3. 3 random pages load
4. Dark mode toggle works
```

---

## Comparison: Before vs. After

### Before (Initial Approach)

```
✅ Custom Node.js test script
❌ No CI/CD integration
❌ Manual testing only
❌ No performance testing
❌ No accessibility testing
❌ No link validation
❌ No HTML validation
❌ No security scanning
```

**Issues**:
- Easy to forget to test
- Inconsistent testing
- Manual effort required
- No performance metrics
- Accessibility not checked

### After (Best Practices Approach)

```
✅ Custom Node.js test script
✅ GitHub Actions CI/CD
✅ Automated on every PR
✅ Lighthouse performance testing
✅ Pa11y accessibility testing
✅ Lychee link validation
✅ HTML5 validation
✅ Trivy security scanning
✅ Parallel test execution
✅ Test reports in PRs
```

**Benefits**:
- ✅ Automatic testing (no manual work)
- ✅ Catches issues before deployment
- ✅ Performance metrics tracked
- ✅ Accessibility guaranteed
- ✅ Professional quality assurance
- ✅ Confidence in deployments

---

## Recommended Workflow

### For Every Code Change

```bash
# 1. Make changes to markdown files or templates
# 2. Commit to a branch
git checkout -b feature/update-session-notes
git add .
git commit -m "Add session 46 notes"

# 3. Push to GitHub
git push origin feature/update-session-notes

# 4. Open Pull Request
# GitHub automatically runs ALL tests

# 5. Review test results in PR
# - Check for failures
# - Review Lighthouse scores
# - Check accessibility report

# 6. If tests pass, merge PR
# - Wiki automatically deploys
# - Live site updated
```

### For Major Changes (Templates, Styles, Build System)

```bash
# 1. Test locally first
cd .wiki-build
npm run build
npm test
npm run serve

# 2. Manual testing checklist
# - Homepage
# - Character pages
# - Session pages
# - Search
# - Dark mode
# - Mobile view

# 3. Create PR
# - All automated tests run
# - Review detailed reports

# 4. After merge
# - Monitor deployment
# - Check live site
# - Run Lighthouse on live URL
```

---

## Performance Targets

Based on Lighthouse CI configuration:

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| **Performance** | ≥ 80 | TBD | 🔄 |
| **Accessibility** | ≥ 90 | TBD | 🔄 |
| **Best Practices** | ≥ 85 | TBD | 🔄 |
| **SEO** | ≥ 90 | TBD | 🔄 |
| **First Contentful Paint** | < 2s | TBD | 🔄 |
| **Largest Contentful Paint** | < 3s | TBD | 🔄 |
| **Cumulative Layout Shift** | < 0.1 | TBD | 🔄 |
| **Total Blocking Time** | < 300ms | TBD | 🔄 |

*Run tests to populate current values*

---

## Future Enhancements

### 1. Playwright E2E Tests

**Why?**
- Test actual user flows
- Multi-browser testing
- Mobile device emulation
- Screenshot comparison

**What to test**:
- Search functionality
- Navigation paths
- Dark mode toggle
- DM mode toggle
- Mobile menu

**Implementation**:
```bash
npm install -D @playwright/test
# Create tests in .wiki-build/e2e/
```

### 2. Visual Regression Testing

**Tools**: Percy, Chromatic, or Playwright screenshots

**What to test**:
- Homepage layout
- Character cards
- Timeline rendering
- Quest progress bars
- Mobile views

### 3. Performance Budgets

**Track over time**:
- Bundle sizes
- Image sizes
- Load times
- CSS/JS file sizes

**Alert on regressions**

---

## Common Issues & Solutions

### Issue: Lighthouse fails on CI but passes locally

**Solution**:
- CI runs in headless mode (different performance)
- Adjust thresholds slightly lower for CI
- Use `numberOfRuns: 3` and median score

### Issue: Link checker fails on valid links

**Solution**:
- Check for case sensitivity (GitHub Pages is case-sensitive)
- Verify relative vs absolute paths
- Exclude external links if needed

### Issue: HTML validation errors

**Solution**:
- Run validator locally first
- Check generated HTML in wiki-output
- Fix template issues in .wiki-templates

### Issue: Accessibility failures

**Solution**:
- Run Pa11y locally: `pa11y http://localhost:8080`
- Fix alt text, heading hierarchy, contrast
- Use axe DevTools browser extension

---

## Resources

### Documentation
- **Testing Strategy**: `TESTING-STRATEGY.md`
- **Pre-Deployment Checklist**: `PRE-DEPLOYMENT-CHECKLIST.md`
- **This Document**: `TESTING-BEST-PRACTICES.md`

### Tools
- **Playwright**: https://playwright.dev
- **Lighthouse CI**: https://github.com/GoogleChrome/lighthouse-ci
- **Lychee**: https://github.com/lycheeverse/lychee
- **Pa11y**: https://pa11y.org
- **Trivy**: https://github.com/aquasecurity/trivy

### GitHub Actions
- **Test Workflow**: `.github/workflows/test-wiki.yml`
- **Deploy Workflow**: `.github/workflows/deploy-wiki.yml`
- **Lighthouse Config**: `.github/lighthouse/lighthouserc.json`

---

## Summary

### ✅ What We Implemented

1. **Multi-layered testing** (content, performance, accessibility, security)
2. **CI/CD integration** via GitHub Actions
3. **Automated testing** on every PR/commit
4. **Industry-standard tools** (Lighthouse, Pa11y, Lychee)
5. **Custom wiki validation** (content accuracy, data integrity)
6. **Comprehensive reporting** (PR summaries, artifacts)
7. **Performance benchmarks** (Lighthouse thresholds)
8. **Accessibility compliance** (WCAG 2.1 AA)

### 🎯 Best Practice Alignment

| Practice | Status | Implementation |
|----------|--------|----------------|
| CI/CD Integration | ✅ | GitHub Actions workflows |
| Automated Testing | ✅ | test-wiki.yml |
| Performance Testing | ✅ | Lighthouse CI |
| Accessibility Testing | ✅ | Lighthouse + Pa11y |
| Link Validation | ✅ | Lychee |
| HTML Validation | ✅ | HTML5 Validator |
| Security Scanning | ✅ | Trivy |
| Content Validation | ✅ | Custom scripts |
| Visual Testing | ⏳ | Future: Playwright |
| Manual Checklist | ✅ | PRE-DEPLOYMENT-CHECKLIST.md |

### 🚀 Next Steps

1. **Run first automated test**:
   ```bash
   git add .
   git commit -m "Add comprehensive testing"
   git push
   ```

2. **Review test results** in GitHub Actions

3. **Adjust thresholds** based on current performance

4. **Document baseline scores** for future comparison

5. **Consider Playwright** for E2E tests (optional)

---

**Conclusion**: Our testing strategy now follows **2025 industry best practices**, combining automated CI/CD testing with comprehensive quality checks. This ensures every deployment maintains high standards for performance, accessibility, and content accuracy. 🎯✅
