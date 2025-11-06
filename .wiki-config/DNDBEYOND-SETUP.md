# D&D Beyond Live Integration Setup

This guide explains how to set up real-time character data integration with D&D Beyond.

## Prerequisites

1. **D&D Beyond Accounts**: All players need D&D Beyond accounts
2. **Public Character Sheets**: Characters must be set to PUBLIC visibility
3. **Character IDs**: You need the numeric ID from each character's URL

## Finding Character IDs

1. Go to your character sheet on D&D Beyond
2. Look at the URL: `https://www.dndbeyond.com/characters/12345678`
3. The number at the end (`12345678`) is your Character ID

## Setup Steps

### 1. Create Configuration File

Copy the example configuration:

```bash
cp .wiki-config/dndbeyond-config.example.json .wiki-config/dndbeyond-config.json
```

### 2. Add Your Character IDs

Edit `.wiki-config/dndbeyond-config.json`:

```json
{
  "characters": {
    "kalmaris": 12345678,
    "lamil": 23456789,
    "longjohn": 34567890,
    "lufnik": 45678901,
    "milo": 56789012,
    "serox": 67890123
  }
}
```

Replace the numbers with your actual D&D Beyond character IDs.

### 3. Set Characters to Public

**IMPORTANT**: Each character sheet must be set to PUBLIC visibility in D&D Beyond:

1. Open your character sheet on D&D Beyond
2. Click the gear icon (⚙️) in the top right
3. Select "Character Settings"
4. Set "Character Privacy" to **Public**
5. Save changes

## Usage

### Manual Sync

Sync all characters manually:

```bash
node .wiki-build/dndbeyond-sync.js sync
```

This will:
- Fetch latest data from D&D Beyond for all configured characters
- Cache the data locally in `.wiki-config/character-cache/`
- Update character pages on next build

### Fetch Single Character

Test fetching a single character:

```bash
node .wiki-build/dndbeyond-sync.js fetch 12345678
```

### Automated Sync (Recommended)

Add to your build workflow:

```bash
# Sync characters before building
node .wiki-build/dndbeyond-sync.js sync && node .wiki-build/build.js
```

Or add to `package.json`:

```json
{
  "scripts": {
    "sync": "node .wiki-build/dndbeyond-sync.js sync",
    "build": "node .wiki-build/build.js",
    "build:sync": "npm run sync && npm run build"
  }
}
```

## What Data is Synced?

The integration fetches:

- ✅ Character name, level, race, class
- ✅ Ability scores (STR, DEX, CON, INT, WIS, CHA)
- ✅ HP (current, max, temp)
- ✅ AC, Initiative, Speed
- ✅ Proficiency bonus
- ✅ Spell slots (used/available)
- ✅ Death saves
- ✅ Conditions
- ✅ Background, alignment
- ✅ XP
- ✅ Character avatar URL

## Cached Data

Character data is cached in `.wiki-config/character-cache/` as JSON files.

The wiki build process reads from this cache, so you can:
- Build offline (using last synced data)
- Version control character progression (git commit the cache)
- Rebuild without hitting D&D Beyond API repeatedly

## Rate Limiting

The script includes a 1-second delay between character requests to respect D&D Beyond's servers.

For 6 characters, a full sync takes ~6 seconds.

## Troubleshooting

### "Character is private or doesn't exist"

**Solution**: Make sure the character is set to PUBLIC in D&D Beyond settings.

### "Failed to parse JSON"

**Solution**: The character ID might be wrong. Double-check the URL.

### "HTTP 403"

**Solution**: The character sheet is private. Set it to public.

### "Cannot read property"

**Solution**: The D&D Beyond API structure may have changed. Update the parser in `dndbeyond-sync.js`.

## API Notes

**Important**: This uses an unofficial D&D Beyond API endpoint:
- `https://character-service.dndbeyond.com/character/v5/character/{ID}`

D&D Beyond may change this endpoint without notice. If it breaks:
1. Check the D&D Beyond forums for updates
2. Look for community tools that still work
3. Update the API endpoint in `dndbeyond-sync.js`

## Privacy & Security

- Only PUBLIC character sheets can be accessed
- No authentication is required (or possible) for public sheets
- Character data is stored locally in your git repo
- No passwords or tokens are stored

## Git Ignore

You may want to add to `.gitignore`:

```
.wiki-config/dndbeyond-config.json
.wiki-config/character-cache/
```

Or commit them to track character progression over time!
