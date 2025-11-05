# Feature: Quest Progress Dashboard

**Category**: Quest & Story
**Priority**: High
**Complexity**: Medium
**Status**: Not Started

## Overview

Track quest status changes across markdown files and generate a living dashboard showing active quests, completed objectives, and pending storylines. This provides both DM and players with a clear view of ongoing story threads.

## User Story

Als Spielleiter möchte ich ein automatisch aktualisiertes Quest-Dashboard, das alle aktiven, abgeschlossenen und gescheiterten Quests anzeigt, damit ich den Überblick über alle Story-Threads behalte und nichts vergesse.

## Requirements

### Must-Haves

1. **Quest Tracking**
   - Parse character quest files (e.g., `characters/*/Avernus_Quest.md`)
   - Track main story quests from campaign files
   - Support quest status: Active, Completed, Failed, On Hold
   - Track quest objectives and sub-tasks
   - Associate quests with characters

2. **Quest Metadata**
   - Quest name/title
   - Quest giver (NPC)
   - Location(s) associated with quest
   - Reward (items, gold, XP, story progress)
   - Current progress percentage
   - Last updated date

3. **Dashboard Generation**
   - Generate markdown dashboard document
   - Create HTML dashboard with visual progress bars
   - Group quests by: Character, Status, Location, Arc
   - Show recently updated quests prominently
   - Include quick links to quest details

4. **Personal Quest Integration**
   - Track each of the 6 characters' personal quests:
     - **Kalmaris**: Find new identity after losing pirate background
     - **Lamil**: Stop Morgath Dunkelschatten, restore natural balance
     - **Lufnik**: Find Arian Brightwater (friend lost in war)
     - **Longjohn**: Get revenge on scarred pirate captain, mourn Blacky
     - **Serox**: Complete legendary armor, find hellish crafting materials
     - **Milo**: Scientific curiosity, protect friends

### Should-Haves

1. **Progress Visualization**
   - Visual progress bars (0-100%)
   - Color coding by urgency/importance
   - Icons for quest types (combat, social, exploration, personal)

2. **Quest Dependencies**
   - Track which quests unlock others
   - Show quest chains visually
   - Highlight blocked quests waiting on prerequisites

3. **Historical View**
   - Archive of completed quests
   - Timeline of when quests were accepted/completed
   - Quest success rate statistics

4. **Notifications**
   - Alert when quest file is updated
   - Remind about long-dormant quests (30+ days without progress)
   - Notify when new quest is detected

### Nice-to-Haves

1. **AI Quest Summarization**
   - Auto-generate quest descriptions from session notes
   - Suggest next steps for active quests
   - Identify potential quest hooks from campaign notes

2. **Player vs DM Views**
   - Separate dashboard for players (no spoilers)
   - DM view includes secret objectives and plot twists

3. **Quest Analytics**
   - Average quest completion time
   - Most active quest givers
   - Quest types breakdown

## Story Integration Points

### Current Campaign Quests

**Main Story Quest: Save Elturel**
- **Status**: Active
- **Location**: Avernus
- **Objective**: Find way to return Elturel from Hell
- **Progress**: 30% (Currently at Fort Knucklebone)
- **Sub-objectives**:
  - ✅ Witness Elturel's disappearance (Day 135)
  - ✅ Enter Avernus through Candlekeep (Day 136)
  - ✅ Reach Elturel, explore High Hall (Day 140)
  - ⏳ Investigate Fort Knucklebone (Day 145 - In Progress)
  - ⬜ Find way to break infernal chains
  - ⬜ Defeat/negotiate with Zariel
  - ⬜ Return Elturel to Material Plane

**Character Personal Quests**

1. **Kalmaris - Identity Quest**
   - **Quest File**: `characters/Kalmaris/Avernus_Quest.md`
   - **Status**: Active
   - **Start**: Day 120 (Curse sealed, lost pirate identity)
   - **Objective**: Discover true self beyond pirate background
   - **Progress**: 20%
   - **Current Lead**: Mirror demon sealed but effects permanent

2. **Lamil - Morgath & Nature Balance**
   - **Quest File**: `characters/Lamil/Avernus_Quest.md`
   - **Status**: Active
   - **Objective**: Stop Morgath Dunkelschatten, restore balance
   - **Progress**: 15%
   - **Connection**: Suspects Morgath connected to infernal forces

3. **Lufnik - Find Arian Brightwater**
   - **Quest File**: `characters/Lufnik/Avernus_Quest.md`
   - **Status**: Active
   - **Objective**: Find missing friend, potentially in Elturel
   - **Progress**: 10%
   - **Hope**: Arian may have been in Elturel before it fell

4. **Longjohn - Revenge & Mourning**
   - **Quest File**: `characters/Longjohn/Avernus_Quest.md`
   - **Status**: Active (Dual objectives)
   - **Objective 1**: Avenge Blacky (died in fire elemental fight)
   - **Objective 2**: Find scarred pirate captain
   - **Progress**: 5%
   - **Lead**: Rumors of pirates making pacts with devils

5. **Serox - Legendary Armor**
   - **Quest File**: `characters/Serox/Avernus_Quest.md`
   - **Status**: Active
   - **Objective**: Complete perfect armor with hellish materials
   - **Progress**: 33% (1 of 3 pieces completed)
   - **Achievement**: Fire-resistant piece crafted in dwarf city
   - **Next**: Find soul-forged metal or infernal alloys

6. **Milo - Protect Friends & Science**
   - **Quest File**: `characters/Milo/Avernus_Quest.md`
   - **Status**: Active
   - **Objective**: Keep party safe, study unique phenomena
   - **Progress**: Ongoing

**Faction Quests (Baldur's Gate Arc - Mostly Completed)**

- ✅ Azure-Enklave: Assist with Elturel refugee crisis
- ✅ Mechaniker-Kollektiv: Find missing Milo
- ⚠️ RR-Gilde: Complicated (rescued Milo, but now enemies)
- ❌ Eiserner Zirkel: Unfriendly, member died at auction

### Quest File Structure

Each character's quest file should follow this format:

```markdown
# [Character] - Avernus Quest

## Personal Quest: [Quest Name]

**Status**: Active | Completed | Failed | On Hold
**Progress**: X%
**Last Updated**: Tag X

### Objective
[Main goal description]

### Background
[How this quest started]

### Current Leads
- Lead 1
- Lead 2

### Sub-Objectives
- [x] Completed objective
- [ ] Active objective
- [ ] Future objective

### Rewards
- [Potential rewards]

### Notes
[DM notes, player insights]
```

## Technical Implementation

### n8n Workflow Steps

1. **File Watcher Node**
   - Monitor `characters/*/Avernus_Quest.md`
   - Monitor campaign arc files for quest mentions
   - Trigger dashboard update on any change

2. **File Reader Nodes**
   - Read all character quest files
   - Read main quest tracking documents
   - Read session files for quest references

3. **Function Node: Quest Parser**
   ```javascript
   // Parse quest markdown files
   // Extract: title, status, progress, objectives, rewards
   // Calculate completion percentage from checkboxes
   // Identify quest relationships
   ```

4. **Function Node: Progress Calculator**
   ```javascript
   // Count completed vs total objectives
   // Calculate percentage: completed / total * 100
   // Determine quest age (days since last update)
   // Flag stale quests (30+ days)
   ```

5. **Function Node: Dashboard Generator**
   ```javascript
   // Group quests by character, status, location
   // Sort by priority: active > on hold > completed
   // Generate markdown and HTML output
   // Add progress bars and visual indicators
   ```

6. **Template Node**
   - Apply HTML template with CSS styling
   - Use fantasy/parchment theme matching item-creator.html
   - Generate responsive layout

7. **File Writer Nodes**
   - Save `Quest-Dashboard.md` in campaign root
   - Save `Quest-Dashboard.html` for viewing
   - Optional: Save per-character quest summaries

8. **Notification Node (Optional)**
   - Send Discord message when quest status changes
   - Alert about stale quests weekly

### Data Structure

```markdown
# Quest Dashboard
*Automatisch generiert - Tag 145*

## 📊 Übersicht
- **Aktive Quests**: 7
- **Abgeschlossen**: 12
- **Pausiert**: 2
- **Gescheitert**: 1

---

## 🔥 Hauptquest

### Elturel retten
**Status**: 🟢 Aktiv | **Progress**: ████████░░░░░░░░░░ 40%
**Ort**: Avernus | **Letzte Aktualisierung**: Tag 145

**Ziel**: Die Stadt Elturel aus der Hölle zurückholen

**Aktuelle Fortschritte**:
- ✅ Nach Elturel gereist (Tag 136)
- ✅ High Hall erkundet (Tag 140)
- ⏳ Fort Knucklebone untersuchen (Tag 145)
- ⬜ Zariel konfrontieren
- ⬜ Infernal-Ketten brechen

[Details →](03 Avernus/Quest-Elturel.md)

---

## 👤 Charakterquests

### Kalmaris - Identität finden
**Status**: 🟢 Aktiv | **Progress**: ████░░░░░░░░░░░░░░░░ 20%
**Seit**: Tag 120

Der Aarakocra sucht nach seiner wahren Identität, nachdem der versiegelte Spiegeldämon ihm seine Piratenvergangenheit geraubt hat.

[Details →](characters/Kalmaris/Avernus_Quest.md)

---

### Lamil - Morgath stoppen
**Status**: 🟢 Aktiv | **Progress**: ███░░░░░░░░░░░░░░░░░░ 15%

Wildfire-Druide verfolgt seinen Erzfeind, der möglicherweise mit den Teufeln verbündet ist.

[Details →](characters/Lamil/Avernus_Quest.md)

---

[...weitere Quests...]

---

## ✅ Kürzlich abgeschlossen

### Milo retten
**Abgeschlossen**: Tag 134 | **Dauer**: 66 Tage
**Belohnung**: Milo ist zurück, RR-Gilde ist nun Feind

---

## ⏸️ Pausierte Quests

### Arena-Champion-Titel verteidigen
**Pausiert seit**: Tag 134
**Grund**: Baldur's Gate verlassen
**Ort**: Baldur's Gate Arena

---

## 📈 Statistiken

- **Durchschnittliche Quest-Dauer**: 24 Tage
- **Erfolgsquote**: 92%
- **Aktivster Questgeber**: Captain Zodge
```

### HTML Dashboard Features

- Fantasy-themed CSS matching item-creator.html style
- Progress bars with percentage indicators
- Color-coded status badges (🟢 Active, ✅ Complete, ⏸️ On Hold, ❌ Failed)
- Collapsible quest sections
- Filter buttons (All, Active, Personal, Main Story)
- Search functionality
- Responsive design for mobile viewing

## Dependencies

- Read access to all character quest files
- Read access to campaign session files
- Write access for dashboard generation
- Optional: Discord webhook for notifications
- Optional: Git integration

## Testing Criteria

- [ ] All 6 character quests detected and parsed
- [ ] Main story quest tracked correctly
- [ ] Progress percentages calculate accurately
- [ ] Completed objectives marked with checkboxes
- [ ] Dashboard regenerates in under 10 seconds
- [ ] HTML dashboard displays correctly on mobile
- [ ] German language maintained throughout
- [ ] Links to source files work correctly

## Success Metrics

- Dashboard includes 10+ tracked quests
- Players check dashboard before each session
- DM uses dashboard for session planning
- Zero forgotten quest threads over 30 days
- Players report feeling more connected to personal quests

## Related Features

- **Automatic Timeline Generation** - Quest milestones appear on timeline
- **Session Summary Generator** - Quest updates extracted from summaries
- **Player Handout Generator** - Generate player-safe quest list
- **NPC Relationship Mapper** - Link quests to quest-giver NPCs

## Implementation Notes

### Phase 1: Manual Quest Tracking (MVP)
1. Create quest markdown files for each character
2. Build basic parser for quest status and objectives
3. Generate simple markdown dashboard

### Phase 2: Automated Dashboard
1. Auto-update dashboard when quest files change
2. Add progress calculation
3. Implement HTML output with styling

### Phase 3: Enhanced Features
1. Add quest dependencies and chains
2. Implement notifications for stale quests
3. Create player vs DM views

### Phase 4: AI Integration
1. Auto-detect new quests from session notes
2. Suggest quest progressions
3. Generate quest summaries

## Campaign-Specific Configuration

```json
{
  "questFilePaths": [
    "characters/*/Avernus_Quest.md",
    "03 Avernus/Quest-*.md"
  ],
  "characters": [
    {"name": "Kalmaris", "icon": "🦅", "color": "#4A90E2"},
    {"name": "Lamil", "icon": "🌿", "color": "#7ED321"},
    {"name": "Longjohn", "icon": "⚓", "color": "#8B572A"},
    {"name": "Lufnik", "icon": "🌙", "color": "#C5C5C5"},
    {"name": "Milo", "icon": "⚗️", "color": "#F5A623"},
    {"name": "Serox", "icon": "🔨", "color": "#D0021B"}
  ],
  "statusIcons": {
    "Active": "🟢",
    "Completed": "✅",
    "Failed": "❌",
    "On Hold": "⏸️"
  },
  "staleQuestThreshold": 30,
  "updateFrequency": "on_file_change"
}
```

## Example Quest File Template

```markdown
# Kalmaris - Avernus Quest

## Personal Quest: Identität jenseits des Piraten

**Status**: Active
**Progress**: 20%
**Last Updated**: Tag 145

### Objective
Kalmaris muss seine wahre Identität finden, nachdem der versiegelte Spiegeldämon ihm seine Piratenvergangenheit geraubt hat. Er sucht nach einem neuen Zweck und Selbstverständnis.

### Background
In Baldur's Gate (Tag 100) wurde Kalmaris durch eine Schicksalkarte verflucht. Dr. Thallus in Widowhall konnte den Spiegeldämon versiegeln (Tag 120), aber der Prozess löschte Kalmaris' Piratenidentität vollständig. Er erinnert sich an die Fakten, aber die emotionale Verbindung ist weg.

### Current Leads
- Die Reise durch Avernus als ultimativer Test
- Möglicherweise gibt es in der Hölle Antworten über innere Wahrheit
- Der versiegelte Dämon könnte noch Informationen haben

### Sub-Objectives
- [x] Fluch durch Dr. Thallus untersuchen lassen
- [x] Dämon versiegeln (Kosten: Piratenidentität)
- [ ] Ersten Moment echter Selbsterkenntnis erleben
- [ ] Neue Identität definieren (nicht Pirat, aber was?)
- [ ] Frieden mit Verlust der Vergangenheit schließen

### Rewards
- Neue character background/identity
- Mögliche neue class features oder multiclass
- Emotionale character development
- Tiefere Verbindung zu Poseidon oder neuer Gottheit

### DM Notes
- This is a slow-burn character arc
- Avernus experiences should challenge and reshape Kalmaris
- Consider moments where old pirate instincts fail
- Potential encounter with mirror demon again as boss?
```
