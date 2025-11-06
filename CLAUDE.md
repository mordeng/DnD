# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a German-language D&D (Dungeons & Dragons) campaign repository documenting an ongoing adventure. The campaign follows a party of six characters through three major story arcs: Deep Underground (Moreva & Dwarf City), Baldur's Gate, and Avernus (the first layer of the Nine Hells).

## Language

- **Primary Language**: German (Deutsch)
- All campaign notes, character sheets, and narrative content are in German
- Maintain German language consistency when editing or creating new markdown files
- HTML item sheets use German for content but English for code/comments

## Repository Structure

### Campaign Chapters (Numbered Directories)
- `01 Deep Underground/` - First story arc (Days 1-67): Moreva shipwreck, mountain crossing, dwarf city, fire elemental encounter
- `02 Baldurs Gate/` - Second story arc (Days 68-134): City politics, factions, arena fights, RR Guild auction, Milo rescue
- `03 Avernus/` - Current story arc (Day 135+): Descent into the Nine Hells, includes subdirectories for crawl mechanics and specific locations

### Key Files
- `Campaign.md` - Master campaign log written in first-person from Milo's perspective
  - Organized by chapter with day ranges (e.g., "Tag 1-23")
  - Includes retrospective commentary in italics
  - Serves as the canonical narrative source
- `README.md` - Minimal project identifier

### Character Management
- `characters/` - Contains subdirectories for each party member:
  - Kalmaris (Aarakocra Bard, former pirate, lost identity to mirror demon)
  - Lamil (Druid, Wildfire Circle)
  - Longjohn (Character seeking revenge)
  - Lufnik (Character with moon-based second chance ability)
  - Milo (Gnome Alchemist/Researcher, campaign narrator)
  - Serox (Craftsman seeking legendary armor materials)
- Each character has a main `.md` file and may have `Avernus_Quest.md` for personal storylines

### Items & Game Mechanics
- `item/` directory contains:
  - `item-creator.html` - Template for creating styled magical item sheets
  - Individual character item HTML files (e.g., `serox-präzisionshammer.html`)
  - HTML files use inline CSS with fantasy/parchment theming
  - Items include rarity badges, abilities sections, and character quotes

### Supporting Content
- `audio/`, `bilder/` (images) - Media assets
- `archive/` - Deprecated or historical content
- `locations to play/` - Location references

## HTML Item Sheet Structure

The item creator template (`item/item-creator.html`) provides a consistent format:
- Uses Google Fonts: 'Cinzel' (headers) and 'Crimson Text' (body)
- Parchment-style design with brown/gold color scheme
- Standard sections: header with rarity badge, description, abilities, character quote
- Responsive design for mobile viewing
- All text content should be in German, CSS/code can remain in English

## Campaign Mechanics Documentation

Key mechanics files in `03 Avernus/`:
- `ratgeber.md` - Comprehensive Avernus travel guide (humorous tone, detailed hazards)
- `Seelenmünzen.md` - Soul coins mechanics
- `Crawl/` subdirectory contains:
  - `Travel Mechanics and Events.md` - Hex-crawl rules
  - `Demon Ichor.md` - Special resource mechanics
  - `Brimstone Bill's Mobile Outfitters.md` - Wandering merchant
- NPC documentation in `Avernus_NPCs_Deutsch.md`

## Working with This Repository

### Creating New Content
- Session notes should follow numbered format: `00X SessionName.md`
- Character updates go in respective character directories
- New items should use the item-creator.html as template
- Maintain narrative consistency with Campaign.md

### Style Guidelines
- Campaign narrative is written in first-person from Milo's perspective
- Maintains a balance between serious adventure and lighthearted commentary
- Dates are tracked as "Day X" of the journey
- NPC and location names should remain consistent across files

### Git Workflow
- This repository tracks campaign progress through git commits
- Untracked files in git status indicate recent session additions
- Modified files (like `03 Avernus/003 High Hall.md`) indicate ongoing sessions

## Common Tasks

### Viewing Campaign Progress
The Campaign.md file is the master reference for story continuity. Cross-reference with chapter-specific markdown files in numbered directories for detailed session notes.

### Creating Character Items
Use `item/item-creator.html` as the base template. Update:
1. Item name and type in header
2. Rarity badge text and color
3. Description text
4. Abilities section with game mechanics
5. Character quote at bottom
6. Update `<title>` and image src if needed

### Adding Session Notes
Session notes are numbered sequentially within chapter directories and include descriptive names:
- Format: `00X Title.md` (e.g., `001 Auf nach Candlekeep.md`, `003 High Hall.md`)
- Sessions may span multiple files if split across locations or events
- The Avernus chapter includes a `Crawl/` subdirectory for hex-crawl mechanics and special encounters

## Automation & Future Features

### n8n Integration
The repository includes a roadmap for automation features:
- `dnd-n8n-features.md` - Comprehensive list of planned automation workflows
- `dnd-n8n-features/` - Implementation planning and automation code

**Key Planned Features:**
- Auto-generate HTML campaign wiki from markdown
- PDF session report generation
- Automatic timeline generation from session notes
- Git auto-commit workflows
- AI-powered session summaries
- Player-facing handout generation

See `dnd-n8n-features.md` for the complete feature list and implementation priorities.
