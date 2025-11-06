#!/usr/bin/env node

/**
 * D&D Beyond Character Data Sync
 * Fetches live character data from D&D Beyond and updates local cache
 */

const fs = require('fs-extra');
const path = require('path');
const https = require('https');

// Configuration
const CACHE_DIR = path.join(__dirname, '..', '.wiki-config', 'character-cache');
const CONFIG_FILE = path.join(__dirname, '..', '.wiki-config', 'dndbeyond-config.json');

// D&D Beyond API endpoint
const DDB_API_BASE = 'https://character-service.dndbeyond.com/character/v5/character';

/**
 * Fetch character data from D&D Beyond
 */
async function fetchCharacterData(characterId) {
  return new Promise((resolve, reject) => {
    const url = `${DDB_API_BASE}/${characterId}`;

    console.log(`Fetching character ${characterId}...`);

    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (error) {
            reject(new Error(`Failed to parse JSON: ${error.message}`));
          }
        } else if (res.statusCode === 403) {
          reject(new Error(`Character ${characterId} is private or doesn't exist. Make sure the character is set to PUBLIC in D&D Beyond settings.`));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Parse character data into simplified format
 */
function parseCharacterData(raw) {
  const data = raw.data || raw;

  return {
    id: data.id,
    name: data.name,
    level: data.classes?.reduce((sum, cls) => sum + cls.level, 0) || 0,
    race: data.race?.fullName || data.race?.baseName || 'Unknown',
    classes: data.classes?.map(cls => ({
      name: cls.definition.name,
      level: cls.level,
      subclass: cls.subclassDefinition?.name || null
    })) || [],

    // Ability Scores
    stats: {
      strength: data.stats?.find(s => s.id === 1)?.value || 10,
      dexterity: data.stats?.find(s => s.id === 2)?.value || 10,
      constitution: data.stats?.find(s => s.id === 3)?.value || 10,
      intelligence: data.stats?.find(s => s.id === 4)?.value || 10,
      wisdom: data.stats?.find(s => s.id === 5)?.value || 10,
      charisma: data.stats?.find(s => s.id === 6)?.value || 10
    },

    // Combat Stats
    hp: data.baseHitPoints || 0,
    tempHp: data.temporaryHitPoints || 0,
    maxHp: data.baseHitPoints + (data.bonusHitPoints || 0),
    ac: data.armorClass || 10,
    initiative: data.initiative || 0,
    speed: data.race?.weightSpeeds?.normal?.walk || 30,

    // Proficiencies
    proficiencyBonus: data.proficiencyBonus || 2,
    inspiration: data.inspiration || false,

    // Death Saves
    deathSaves: {
      successes: data.deathSaves?.successCount || 0,
      failures: data.deathSaves?.failCount || 0
    },

    // Spell Slots (if spellcaster)
    spellSlots: data.spellSlots?.map(slot => ({
      level: slot.level,
      available: slot.available,
      used: slot.used
    })) || [],

    // Conditions
    conditions: data.conditions?.map(c => c.name) || [],

    // Background & Alignment
    background: data.background?.definition?.name || null,
    alignment: data.alignmentId ? getAlignmentName(data.alignmentId) : null,

    // XP
    xp: data.currentXp || 0,

    // Avatar
    avatarUrl: data.avatarUrl || data.decorations?.avatarUrl || null,

    // Last Updated
    lastUpdated: new Date().toISOString(),
    lastModified: data.dateModified || data.readonlyUrl
  };
}

/**
 * Get alignment name from ID
 */
function getAlignmentName(id) {
  const alignments = {
    1: 'Lawful Good',
    2: 'Neutral Good',
    3: 'Chaotic Good',
    4: 'Lawful Neutral',
    5: 'True Neutral',
    6: 'Chaotic Neutral',
    7: 'Lawful Evil',
    8: 'Neutral Evil',
    9: 'Chaotic Evil'
  };
  return alignments[id] || 'Unknown';
}

/**
 * Save character data to cache
 */
async function saveToCache(characterId, data) {
  await fs.ensureDir(CACHE_DIR);
  const cacheFile = path.join(CACHE_DIR, `${characterId}.json`);
  await fs.writeJSON(cacheFile, data, { spaces: 2 });
  console.log(`✓ Cached data for ${data.name} (${characterId})`);
}

/**
 * Sync all configured characters
 */
async function syncAllCharacters() {
  try {
    // Load configuration
    if (!await fs.pathExists(CONFIG_FILE)) {
      console.error(`Configuration file not found: ${CONFIG_FILE}`);
      console.log('\nCreate .wiki-config/dndbeyond-config.json with your character IDs:');
      console.log(JSON.stringify({
        characters: {
          "kalmaris": 12345678,
          "milo": 87654321
        }
      }, null, 2));
      process.exit(1);
    }

    const config = await fs.readJSON(CONFIG_FILE);
    const characters = config.characters || {};

    if (Object.keys(characters).length === 0) {
      console.error('No characters configured in dndbeyond-config.json');
      process.exit(1);
    }

    console.log(`\n🎲 Syncing ${Object.keys(characters).length} characters from D&D Beyond...\n`);

    const results = {
      success: [],
      failed: []
    };

    for (const [slug, characterId] of Object.entries(characters)) {
      try {
        const rawData = await fetchCharacterData(characterId);
        const parsedData = parseCharacterData(rawData);
        await saveToCache(characterId, parsedData);
        results.success.push({ slug, name: parsedData.name, characterId });

        // Rate limiting - wait 1 second between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`✗ Failed to sync ${slug} (${characterId}): ${error.message}`);
        results.failed.push({ slug, characterId, error: error.message });
      }
    }

    console.log(`\n📊 Sync Complete:`);
    console.log(`   Success: ${results.success.length}`);
    console.log(`   Failed: ${results.failed.length}`);

    if (results.failed.length > 0) {
      console.log('\n⚠️  Failed characters:');
      results.failed.forEach(f => {
        console.log(`   - ${f.slug}: ${f.error}`);
      });
    }

    return results;

  } catch (error) {
    console.error('Sync error:', error);
    process.exit(1);
  }
}

/**
 * Get cached character data
 */
async function getCachedCharacter(characterId) {
  const cacheFile = path.join(CACHE_DIR, `${characterId}.json`);
  if (await fs.pathExists(cacheFile)) {
    return await fs.readJSON(cacheFile);
  }
  return null;
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'sync') {
    syncAllCharacters().catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
  } else if (command === 'fetch' && args[1]) {
    const characterId = args[1];
    fetchCharacterData(characterId)
      .then(data => {
        console.log(JSON.stringify(parseCharacterData(data), null, 2));
      })
      .catch(error => {
        console.error('Error:', error.message);
        process.exit(1);
      });
  } else {
    console.log('D&D Beyond Character Sync\n');
    console.log('Usage:');
    console.log('  node dndbeyond-sync.js sync           - Sync all configured characters');
    console.log('  node dndbeyond-sync.js fetch <id>     - Fetch single character by ID');
    console.log('\nConfiguration file: .wiki-config/dndbeyond-config.json');
    process.exit(0);
  }
}

module.exports = { fetchCharacterData, parseCharacterData, syncAllCharacters, getCachedCharacter };
