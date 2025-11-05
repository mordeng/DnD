# Feature: Automatic Timeline Generation

**Category**: Quest & Story
**Priority**: High
**Complexity**: Medium
**Status**: Not Started

## Overview

Automatically parse session notes and campaign files to extract dates, events, and key moments, then generate a visual timeline. This feature helps track the campaign's chronological progression and makes it easy to reference when events occurred.

## User Story

Als Spielleiter möchte ich eine automatisch generierte Zeitleiste aller Kampagnenereignisse, damit ich und meine Spieler einen klaren Überblick über die Story-Entwicklung haben und wichtige Ereignisse leicht nachschlagen können.

## Requirements

### Must-Haves

1. **Date Extraction**
   - Automatically detect date patterns in markdown files
   - Support for campaign-specific date format: "Tag X" (Day X)
   - Extract dates from session filenames (e.g., `001 Auf nach Candlekeep.md`)
   - Parse dates from Campaign.md master document

2. **Event Identification**
   - Extract key events from session headers and subheaders
   - Identify story milestones (e.g., boss battles, character deaths, major plot reveals)
   - Tag events by category: combat, roleplay, discovery, character moment, faction interaction

3. **Timeline Output**
   - Generate markdown timeline document
   - Create visual HTML timeline (using timeline.js or similar)
   - Support for filtering by character, location, or event type
   - Include links back to source session notes

4. **Integration with Existing Campaign**
   - Parse existing 138+ days of campaign history
   - Support three campaign arcs: Moreva, Baldur's Gate, Avernus
   - Maintain German language throughout

### Should-Haves

1. **Visual Enhancements**
   - Add character icons for character-specific events
   - Color-code by arc (blue for Deep Underground, gold for Baldur's Gate, red for Avernus)
   - Include location markers on timeline

2. **Interactive Features**
   - Clickable events that expand to show full descriptions
   - Search functionality to find specific events
   - Export as PDF for players

3. **Smart Event Detection**
   - Use AI to identify "important" vs "minor" events
   - Automatically categorize events without manual tagging
   - Detect character level-ups and major item acquisitions

### Nice-to-Haves

1. **Parallel Timelines**
   - Show what each character was doing at the same time
   - Display faction movements in parallel to party actions

2. **Future Event Planning**
   - Add planned events to timeline
   - Set reminders for upcoming story beats

3. **Calendar Integration**
   - If fantasy calendar is created, map "Day X" to in-game dates

## Story Integration Points

### Current Campaign Structure

The timeline should integrate with:

1. **Campaign.md** - Master narrative document written from Milo's perspective
   - Contains high-level summaries of all three arcs
   - Uses "Tag X" (Day X) format for dates
   - Natural language date descriptions (e.g., "Tag 1-23", "Tag 68-134")

2. **Session Files** - Numbered session notes per arc
   - `01 Deep Underground/` - Sessions from Days 1-67
   - `02 Baldurs Gate/` - Sessions from Days 68-134
   - `03 Avernus/` - Sessions from Day 135+

3. **Character Files** - Personal quest tracking
   - Each character has `Avernus_Quest.md` for current arc
   - Character progression and personal story beats

### Key Events to Capture

Based on existing campaign:

**Arc 1: Deep Underground (Days 1-67)**
- Tag 1: Shipwreck on Moreva, Shadow Dragon discovery
- Tag 24: Mountain crossing begins
- Tag 35: Lufnik's lava accident (trauma moment)
- Tag 45: Magma Elemental battle
- Tag 60: Serox forges first armor piece
- Tag 67: Receive Milo's letter, journey to Baldur's Gate

**Arc 2: Baldur's Gate (Days 68-134)**
- Tag 68: Enter Baldur's Gate, faction introductions
- Tag 85: Arena battle
- Tag 95: RR Guild auction, Kalmaris buys Flüssiges Sonnenlicht
- Tag 100: Kalmaris cursed by mirror demon
- Tag 120: Mission to Widowhall, curse sealed (loses pirate identity)
- Tag 130: Milo rescue operation
- Tag 134: Flee Baldur's Gate, decide to go to Elturel

**Arc 3: Avernus (Day 135+)**
- Tag 135: Witness Elturel disappearing into Avernus
- Tag 136: Enter Avernus through Candlekeep
- Tag 140: Arrive in Elturel, explore High Hall
- Tag 145: Fort Knucklebone (current location)

## Technical Implementation

### n8n Workflow Steps

1. **File Watcher Node**
   - Monitor campaign files for changes
   - Trigger timeline regeneration on save

2. **File Reader Nodes**
   - Read Campaign.md
   - Read all session files from 01-03 directories
   - Read character quest files

3. **Function Node: Date Extraction**
   ```javascript
   // Extract patterns like:
   // "Tag 1-23"
   // "Tag 135"
   // "Day 68-134"
   // Extract from headers: "## 01 - Moreva: Wo alles begann"
   ```

4. **Function Node: Event Parsing**
   ```javascript
   // Extract events from:
   // - Headers (## and ###)
   // - Bold text (**important moments**)
   // - Lists with key actions
   // - Character names for character-specific events
   ```

5. **AI Node (Optional)**
   - Use Claude/GPT to summarize events
   - Categorize events automatically
   - Generate concise descriptions

6. **Template Node**
   - Generate markdown timeline
   - Generate HTML timeline with timeline.js

7. **File Writer Node**
   - Save `Timeline.md` in campaign root
   - Save `Timeline.html` for web viewing
   - Optional: Commit to git

### Data Structure

```markdown
# Kampagnen-Zeitleiste

## Tag 1-23: Moreva - Wo alles begann
- **Tag 1**: Schiffbruch auf Moreva, Schattendrache entdeckt
- **Tag 15**: Schattendrache besiegt, Menschen befreit
- **Tag 23**: RR-Gilde lädt Milo ein, Trennung der Gruppe

[Link zu Session: 00-Moreva.md]

## Tag 24-67: Tief unter der Erde
...
```

### External Libraries/Tools

- **timeline.js** - Open-source JavaScript timeline library
- **vis-timeline** - Alternative timeline visualization
- **mermaid.js** - For text-based timeline diagrams in markdown

## Dependencies

- Read access to all campaign markdown files
- Write access to generate timeline files
- Optional: AI API for smart event summarization (Claude, OpenAI)
- Optional: Git integration for version control

## Testing Criteria

- [ ] Successfully extracts all dates from Campaign.md
- [ ] Parses at least 90% of major events from session notes
- [ ] Timeline includes all three arcs
- [ ] Events link back to source files correctly
- [ ] Timeline is readable in both markdown and HTML formats
- [ ] German language maintained throughout
- [ ] Can regenerate timeline in under 30 seconds

## Success Metrics

- Timeline contains 50+ distinct events
- Players reference timeline at least once per session
- Reduces "when did that happen?" questions by 80%
- DM uses timeline for campaign prep

## Related Features

- **Quest Progress Dashboard** - Timeline feeds into quest tracking
- **Session Summary Generator** - AI summaries become timeline events
- **Campaign Statistics Dashboard** - Timeline data used for analytics
- **Auto-Wiki Link Generator** - Timeline events link to wiki pages

## Implementation Notes

### Phase 1: Basic Timeline (MVP)
1. Manual date/event extraction from Campaign.md
2. Generate simple markdown timeline
3. Test with existing campaign data

### Phase 2: Automated Extraction
1. Build regex patterns for date detection
2. Parse all session files automatically
3. Categorize events by type

### Phase 3: Visual Timeline
1. Implement timeline.js HTML output
2. Add styling matching campaign theme (parchment/fantasy)
3. Make timeline interactive

### Phase 4: AI Enhancement
1. Add AI summarization for events
2. Implement smart event importance scoring
3. Auto-generate event descriptions

## Campaign-Specific Configuration

```json
{
  "dateFormat": "Tag {number}",
  "datePattern": "Tag \\d+(-\\d+)?",
  "language": "de",
  "arcColors": {
    "moreva": "#4A90E2",
    "baldursGate": "#F5A623",
    "avernus": "#D0021B"
  },
  "characters": [
    "Kalmaris", "Lamil", "Longjohn",
    "Lufnik", "Milo", "Serox"
  ],
  "sessionFilePaths": [
    "01 Deep Underground/*.md",
    "02 Baldurs Gate/*.md",
    "03 Avernus/*.md"
  ]
}
```

## Example Output

See `dnd-n8n-features/examples/timeline-example.md` for full example output.
