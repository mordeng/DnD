# D&D Beyond Live Integration - Quick Start

Your wiki now has **real-time character data** from D&D Beyond! 🎲

## How It Works

1. **Sync Script** fetches live character data from D&D Beyond API
2. **Cache** stores the data locally as JSON files
3. **Build Process** merges cached data with your character markdown files
4. **Character Pages** display live HP, stats, spell slots, and more!

## Setup (5 Minutes)

### Step 1: Get Character IDs

For each character, find their D&D Beyond ID:
1. Open character sheet: `https://www.dndbeyond.com/characters/12345678`
2. The number at the end is the Character ID

### Step 2: Configure

Create `.wiki-config/dndbeyond-config.json`:

```json
{
  "characters": {
    "kalmaris": YOUR_CHARACTER_ID_HERE,
    "lamil": YOUR_CHARACTER_ID_HERE,
    "longjohn": YOUR_CHARACTER_ID_HERE,
    "lufnik": YOUR_CHARACTER_ID_HERE,
    "milo": YOUR_CHARACTER_ID_HERE,
    "serox": YOUR_CHARACTER_ID_HERE
  }
}
```

Replace `YOUR_CHARACTER_ID_HERE` with actual IDs.

### Step 3: Set Characters to Public

**CRITICAL**: Each character must be PUBLIC on D&D Beyond:
- Go to Character Settings (⚙️)
- Set "Character Privacy" to **Public**

### Step 4: First Sync

```bash
node .wiki-build/dndbeyond-sync.js sync
```

This will:
- Fetch all character data from D&D Beyond
- Create cache files in `.wiki-config/character-cache/`
- Take ~6 seconds for 6 characters

### Step 5: Build Wiki

```bash
node .wiki-build/build.js
```

Done! Your character pages now show live data! 🎉

## What You See

### Character Pages Show:
- ✅ **Live HP** (current/max + temp HP)
- ✅ **AC, Initiative, Speed, Proficiency Bonus**
- ✅ **Full Ability Scores** with modifiers
- ✅ **Spell Slots** (used/available) for casters
- ✅ **Active Conditions**
- ✅ **Death Saves** (DM-only mode)
- ✅ **XP Progress**
- ✅ **Character Avatar** from D&D Beyond
- ✅ **Class/Subclass** info
- ✅ **Background & Alignment**

### Visual Indicators:
- 🟢 **LIVE** badge on character portraits
- 📊 Beautiful stat blocks matching your parchment theme
- ⚠️ Conditions highlighted in orange
- 🎯 Spell slot dots showing used/available

## Daily Workflow

### Before Each Session:
```bash
node .wiki-build/dndbeyond-sync.js sync && node .wiki-build/build.js
```

This syncs all characters and rebuilds the wiki.

### After Combat:
Players update their characters on D&D Beyond (HP, spell slots, etc.), then you run:
```bash
node .wiki-build/dndbeyond-sync.js sync && node .wiki-build/build.js
```

The wiki instantly reflects current character states!

## Advanced Usage

### Add to package.json:
```json
{
  "scripts": {
    "sync": "node .wiki-build/dndbeyond-sync.js sync",
    "build": "node .wiki-build/build.js",
    "build:live": "npm run sync && npm run build"
  }
}
```

Then just run:
```bash
npm run build:live
```

### Auto-Sync Before Every Build:
Edit `.wiki-build/build.js` and uncomment the auto-sync feature (coming soon).

### Fetch Single Character:
```bash
node .wiki-build/dndbeyond-sync.js fetch 12345678
```

## Template Options

The system creates two character views:

### 1. Enhanced Template (with live data)
File: `.wiki-templates/pages/character-enhanced.hbs`
- Full D&D Beyond integration
- Live stats, HP, spell slots
- Best for active campaigns

### 2. Basic Template (markdown only)
File: `.wiki-templates/pages/character.hbs`
- Uses markdown frontmatter
- No live data required
- Best for archived campaigns

**Current**: Using enhanced template automatically when D&D Beyond data exists!

## Troubleshooting

### "Character is private"
→ Set character to PUBLIC in D&D Beyond settings

### "No data showing on page"
→ Run sync script first: `node .wiki-build/dndbeyond-sync.js sync`

### "Character not found"
→ Check Character ID in config file

### "Data looks wrong"
→ Update character on D&D Beyond, then re-sync

## Cache & Offline Mode

Character data is cached locally, so you can:
- ✅ Build wiki offline (uses last sync)
- ✅ Track character progression via git
- ✅ Rebuild quickly without API calls

## Rate Limiting

- 1 second delay between character requests
- 6 characters = ~6 seconds total
- Respects D&D Beyond servers

## Privacy

- Only PUBLIC sheets are accessible
- No passwords or tokens stored
- Data stays in your local git repo
- You control what gets committed

## Git Workflow

### Option A: Commit Character Cache (Recommended)
Track character progression over time:
```bash
git add .wiki-config/character-cache/
git commit -m "Update character stats"
```

### Option B: Ignore Cache
Always fetch fresh data:
```gitignore
.wiki-config/character-cache/
```

## Next Steps

1. ✅ Set up config file
2. ✅ Make characters public
3. ✅ Run first sync
4. ✅ Build wiki
5. ✅ View your amazing character pages!

## Support

- Full docs: `.wiki-config/DNDBEYOND-SETUP.md`
- Integration code: `.wiki-build/dndbeyond-sync.js`
- Template: `.wiki-templates/pages/character-enhanced.hbs`

**Enjoy your live D&D Beyond integration!** 🎲✨
