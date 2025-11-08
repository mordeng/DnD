#!/usr/bin/env node

/**
 * D&D Campaign Wiki - Automated Test Suite
 *
 * Tests build health, content completeness, link validation,
 * data integrity, and search functionality.
 *
 * Usage: node test-wiki.js
 */

const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const cheerio = require('cheerio');

// Test configuration
const CONFIG = {
  rootDir: path.join(__dirname, '..'),
  outputDir: path.join(__dirname, '..', 'wiki-output'),
  configFile: path.join(__dirname, '..', '.wiki-config', 'wiki-config.json'),
  colors: {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
  }
};

// Test results
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  warnings: 0,
  errors: [],
  warnings: [],
  grade: 0
};

// Utility functions
function log(message, color = 'reset') {
  console.log(`${CONFIG.colors[color]}${message}${CONFIG.colors.reset}`);
}

function test(name, fn) {
  results.total++;
  try {
    const result = fn();
    if (result === true || result === undefined) {
      results.passed++;
      log(`✓ ${name}`, 'green');
      return true;
    } else {
      results.failed++;
      results.errors.push({ test: name, error: result });
      log(`✗ ${name}`, 'red');
      log(`  ${result}`, 'red');
      return false;
    }
  } catch (error) {
    results.failed++;
    results.errors.push({ test: name, error: error.message });
    log(`✗ ${name}`, 'red');
    log(`  ${error.message}`, 'red');
    return false;
  }
}

function warn(message) {
  results.warnings.push(message);
  log(`⚠ ${message}`, 'yellow');
}

// Test Suite
async function runTests() {
  log('\n========================================', 'cyan');
  log('  D&D Campaign Wiki - Test Suite', 'cyan');
  log('========================================\n', 'cyan');

  // Test 1: Build Health
  log('\n📦 Build Health Tests', 'blue');
  log('─────────────────────────────', 'blue');

  test('Output directory exists', () => {
    return fs.existsSync(CONFIG.outputDir) || 'wiki-output directory not found';
  });

  test('Assets directory exists', () => {
    const assetsDir = path.join(CONFIG.outputDir, 'assets');
    return fs.existsSync(assetsDir) || 'assets directory not found';
  });

  test('CSS files exist', () => {
    const cssDir = path.join(CONFIG.outputDir, 'assets', 'css');
    if (!fs.existsSync(cssDir)) return 'CSS directory not found';
    const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
    return cssFiles.length > 0 || 'No CSS files found';
  });

  test('JavaScript files exist', () => {
    const jsDir = path.join(CONFIG.outputDir, 'assets', 'js');
    if (!fs.existsSync(jsDir)) return 'JS directory not found';
    const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
    return jsFiles.length > 0 || 'No JavaScript files found';
  });

  test('Homepage exists', () => {
    const homepage = path.join(CONFIG.outputDir, 'index.html');
    return fs.existsSync(homepage) || 'index.html not found';
  });

  // Test 2: Content Completeness
  log('\n📄 Content Completeness Tests', 'blue');
  log('─────────────────────────────', 'blue');

  const htmlFiles = glob.sync('**/*.html', { cwd: CONFIG.outputDir });
  log(`  Found ${htmlFiles.length} HTML pages`, 'cyan');

  test('At least 10 pages generated', () => {
    return htmlFiles.length >= 10 || `Only ${htmlFiles.length} pages found`;
  });

  test('Character pages exist', () => {
    const characterPages = htmlFiles.filter(f => f.startsWith('characters/'));
    if (characterPages.length === 0) return 'No character pages found';
    log(`  Found ${characterPages.length} character pages`, 'cyan');
    return true;
  });

  test('Session pages exist', () => {
    const sessionPages = htmlFiles.filter(f => f.startsWith('sessions/'));
    if (sessionPages.length === 0) return 'No session pages found';
    log(`  Found ${sessionPages.length} session pages`, 'cyan');
    return true;
  });

  // Test 3: Link Validation
  log('\n🔗 Link Validation Tests', 'blue');
  log('─────────────────────────────', 'blue');

  const brokenLinks = [];
  const validatedLinks = new Set();

  for (const htmlFile of htmlFiles.slice(0, 20)) { // Test first 20 pages
    const filePath = path.join(CONFIG.outputDir, htmlFile);
    const html = fs.readFileSync(filePath, 'utf-8');
    const $ = cheerio.load(html);

    $('a[href^="/"], a[href^="./"], a[href^="../"]').each((i, el) => {
      const href = $(el).attr('href');
      if (!href || validatedLinks.has(href)) return;

      validatedLinks.add(href);

      // Resolve relative URL
      let targetPath = href;
      if (href.startsWith('/')) {
        targetPath = href.substring(1); // Remove leading slash
      }

      // Remove anchor
      targetPath = targetPath.split('#')[0];

      // Handle directory URLs
      if (targetPath.endsWith('/')) {
        targetPath += 'index.html';
      }

      const fullPath = path.join(CONFIG.outputDir, targetPath);
      if (!fs.existsSync(fullPath)) {
        brokenLinks.push({ from: htmlFile, to: href });
      }
    });
  }

  test('No broken internal links', () => {
    if (brokenLinks.length === 0) return true;

    const errorMsg = `Found ${brokenLinks.length} broken links:\n` +
      brokenLinks.slice(0, 5).map(l => `  ${l.from} -> ${l.to}`).join('\n');

    if (brokenLinks.length > 5) {
      warn(`${brokenLinks.length} total broken links found`);
    }

    return errorMsg;
  });

  // Test 4: Data Integrity
  log('\n📊 Data Integrity Tests', 'blue');
  log('─────────────────────────────', 'blue');

  if (fs.existsSync(CONFIG.configFile)) {
    const config = JSON.parse(fs.readFileSync(CONFIG.configFile, 'utf-8'));

    test('Wiki config is valid', () => {
      if (!config.wiki) return 'Missing wiki section in config';
      if (!config.wiki.title) return 'Missing wiki title';
      if (!config.characters) return 'Missing characters section';
      return true;
    });

    test('Character data is present', () => {
      const chars = config.characters || [];
      if (chars.length === 0) return 'No characters defined in config';
      log(`  Found ${chars.length} characters in config`, 'cyan');
      return true;
    });

    // Validate character pages exist
    const expectedChars = config.characters || [];
    let missingChars = 0;

    expectedChars.forEach(char => {
      const charPage = path.join(CONFIG.outputDir, 'characters', `${char.slug}.html`);
      if (!fs.existsSync(charPage)) {
        warn(`Character page missing: ${char.name} (${char.slug}.html)`);
        missingChars++;
      }
    });

    test('All configured characters have pages', () => {
      return missingChars === 0 || `${missingChars} character pages missing`;
    });
  }

  // Test 5: Search Index
  log('\n🔍 Search Index Tests', 'blue');
  log('─────────────────────────────', 'blue');

  const searchIndexPath = path.join(CONFIG.outputDir, 'search-index.json');

  test('Search index exists', () => {
    return fs.existsSync(searchIndexPath) || 'search-index.json not found';
  });

  if (fs.existsSync(searchIndexPath)) {
    test('Search index is valid JSON', () => {
      try {
        const searchIndex = JSON.parse(fs.readFileSync(searchIndexPath, 'utf-8'));
        return true;
      } catch (e) {
        return 'Invalid JSON in search-index.json';
      }
    });

    test('Search index has documents', () => {
      const searchIndex = JSON.parse(fs.readFileSync(searchIndexPath, 'utf-8'));
      const docCount = searchIndex.documents?.length || 0;
      if (docCount === 0) return 'Search index has no documents';
      log(`  Indexed ${docCount} pages`, 'cyan');
      return true;
    });
  }

  // Test 6: Accessibility
  log('\n♿ Accessibility Tests', 'blue');
  log('─────────────────────────────', 'blue');

  let imagesWithoutAlt = 0;
  let headingIssues = 0;

  for (const htmlFile of htmlFiles.slice(0, 10)) { // Test first 10 pages
    const filePath = path.join(CONFIG.outputDir, htmlFile);
    const html = fs.readFileSync(filePath, 'utf-8');
    const $ = cheerio.load(html);

    // Check images have alt text
    $('img').each((i, el) => {
      if (!$(el).attr('alt')) {
        imagesWithoutAlt++;
      }
    });

    // Check heading hierarchy
    const headings = [];
    $('h1, h2, h3, h4, h5, h6').each((i, el) => {
      const level = parseInt(el.name.substring(1));
      headings.push(level);
    });

    // Check for skipped heading levels
    for (let i = 1; i < headings.length; i++) {
      if (headings[i] - headings[i-1] > 1) {
        headingIssues++;
        break;
      }
    }
  }

  test('Images have alt text', () => {
    if (imagesWithoutAlt === 0) return true;
    warn(`${imagesWithoutAlt} images missing alt text`);
    return true; // Warning only
  });

  test('Heading hierarchy is correct', () => {
    if (headingIssues === 0) return true;
    warn(`${headingIssues} pages with heading hierarchy issues`);
    return true; // Warning only
  });

  // Test 7: Content Validation
  log('\n✅ Content Validation Tests', 'blue');
  log('─────────────────────────────', 'blue');

  test('Homepage has hero section', () => {
    const homepage = path.join(CONFIG.outputDir, 'index.html');
    if (!fs.existsSync(homepage)) return 'Homepage not found';

    const html = fs.readFileSync(homepage, 'utf-8');
    const $ = cheerio.load(html);

    if ($('.hero').length === 0 && $('.hero-section').length === 0) {
      return 'Hero section not found on homepage';
    }
    return true;
  });

  test('Pages have proper metadata', () => {
    const testFile = htmlFiles[0];
    if (!testFile) return 'No HTML files to test';

    const filePath = path.join(CONFIG.outputDir, testFile);
    const html = fs.readFileSync(filePath, 'utf-8');
    const $ = cheerio.load(html);

    if (!$('meta[charset]').length) {
      return 'Missing charset meta tag';
    }
    if (!$('meta[name="viewport"]').length) {
      return 'Missing viewport meta tag';
    }
    if (!$('title').length) {
      return 'Missing title tag';
    }

    return true;
  });

  // Calculate grade
  results.grade = Math.round((results.passed / results.total) * 100);

  // Print summary
  log('\n========================================', 'cyan');
  log('  Test Summary', 'cyan');
  log('========================================\n', 'cyan');

  log(`Total Tests:    ${results.total}`, 'cyan');
  log(`Passed:         ${results.passed}`, 'green');
  log(`Failed:         ${results.failed}`, results.failed > 0 ? 'red' : 'cyan');
  log(`Warnings:       ${results.warnings.length}`, results.warnings.length > 0 ? 'yellow' : 'cyan');

  // Grade
  let gradeColor = 'green';
  if (results.grade < 70) gradeColor = 'red';
  else if (results.grade < 85) gradeColor = 'yellow';

  log(`\nBuild Grade:    ${results.grade}/100`, gradeColor);

  // Show errors
  if (results.errors.length > 0) {
    log('\n❌ Failed Tests:', 'red');
    results.errors.forEach(err => {
      log(`  • ${err.test}`, 'red');
      if (err.error) {
        log(`    ${err.error}`, 'red');
      }
    });
  }

  // Show warnings
  if (results.warnings.length > 0) {
    log('\n⚠️  Warnings:', 'yellow');
    results.warnings.forEach(warning => {
      log(`  • ${warning}`, 'yellow');
    });
  }

  log('\n========================================\n', 'cyan');

  // Exit code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(err => {
  log(`\n❌ Test suite failed: ${err.message}`, 'red');
  console.error(err);
  process.exit(1);
});
