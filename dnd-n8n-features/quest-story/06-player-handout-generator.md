# Feature: Player Handout Generator

**Category**: Quest & Story
**Priority**: Medium
**Complexity**: Medium
**Status**: Not Started

## Overview

Extract player-visible information from DM notes (removing secret content marked with special tags) and generate clean handout documents. Creates spoiler-free summaries, quest briefs, NPC descriptions, and location info that can be safely shared with players.

## User Story

Als Spielleiter möchte ich automatisch spielersichere Handouts aus meinen Notizen generieren, die alle geheimen DM-Informationen entfernen, damit ich schnell professionell aussehende Dokumente für meine Spieler erstellen kann.

## Requirements

### Must-Haves

1. **Secret Content Detection**
   - Support multiple secret markers:
     - `[DM: secret text]` - Inline secrets
     - `<!-- DM: secret note -->` - HTML-style comments
     - `%%hidden text%%` - Obsidian-style hidden text
     - Dedicated `## DM Notes` sections
   - Remove all marked secret content before export
   - Preserve formatting of non-secret content

2. **Handout Types**
   - **Session Recap**: Spoiler-free summary of previous session
   - **Quest Brief**: Quest objectives without revealing solutions
   - **NPC Description**: Appearance and public info only
   - **Location Guide**: What players can see/know
   - **Item Card**: Item properties without hidden bonuses
   - **Rules Reference**: Custom rules or mechanics explained

3. **Export Formats**
   - **PDF**: Printable handouts with D&D styling
   - **Markdown**: Clean markdown for digital sharing
   - **HTML**: Styled web version
   - **Image**: PNG/JPG for sharing in Discord/Roll20

4. **Styling & Branding**
   - Fantasy theme matching campaign aesthetic
   - Parchment background texture
   - Campaign logo/branding
   - Professional typography
   - Print-friendly (no dark backgrounds when printing)

5. **Distribution**
   - Save to dedicated `player-handouts/` folder
   - Email to players automatically
   - Post to Discord channel
   - Upload to campaign wiki

### Should-Haves

1. **Smart Content Filtering**
   - Remove future plot hooks not yet revealed
   - Hide NPC motivations and secrets
   - Filter out meta-gaming information
   - Keep only information players have discovered

2. **Template System**
   - Pre-designed templates for each handout type
   - Consistent branding across all handouts
   - Customizable headers/footers
   - Variable fields (session number, date, etc.)

3. **Interactive Elements**
   - QR codes linking to wiki pages
   - Clickable table of contents
   - Fillable form fields (for character sheets)
   - Embedded audio (NPC voice clips)

4. **Version Control**
   - Track handout versions
   - "Updated" badges when handouts change
   - Change log for significant updates
   - Archive old versions

5. **Player Feedback**
   - Mark handouts as "Read" or "Unread"
   - Allow players to request clarifications
   - Track which players have received handouts

### Nice-to-Haves

1. **AI Content Rewriting**
   - Automatically rephrase DM notes into player-friendly language
   - Convert detailed NPC motivations into observable behavior
   - Transform secret plot points into mysterious hints

2. **Spoiler Levels**
   - Level 1: Safe for all players
   - Level 2: For specific characters only
   - Level 3: Partial spoilers (use after certain events)
   - Generate different versions based on level

3. **Accessibility Features**
   - High contrast mode for visually impaired
   - Screen reader friendly text
   - Dyslexia-friendly fonts option
   - Text-to-speech compatible

4. **Localization**
   - Generate both German and English versions
   - Support for other languages

## Story Integration Points

### Current Handout Needs

**Session Recaps** (Weekly):
- Summary of previous session in Milo's voice
- Remove any DM notes about future plans
- Include only what players experienced
- Highlight important information they might have missed

**Quest Briefs** (As Needed):
- Clear quest objectives
- Known rewards
- Relevant NPCs and locations
- Hide solutions, puzzles answers, or secret twists

**NPC Cards** (When NPCs are introduced):
Example: **Mad Maggie**
- **Player Version**: Appearance, speech patterns, public reputation, services offered
- **Hidden**: True motivations, secret alliances, hidden agendas, plot connections

**Location Guides** (When visiting new places):
Example: **Fort Knucklebone**
- **Player Version**: What they see, smell, hear. Public areas. Available services.
- **Hidden**: Secret rooms, hidden treasures, enemy plans, traps not yet discovered

**Character-Specific Handouts**:
- Information only one character knows
- Private quest updates
- Personal NPC connections
- Secret discoveries

### Example: Converting DM Notes to Player Handout

**Original DM Notes (with secrets)**:
```markdown
# Fort Knucklebone

Fort Knucklebone ist ein gewaltiger Schrottplatz voller infernaler Kriegsmaschinen.
Mad Maggie herrscht hier über ein chaotisches Reich aus Metall und Feuer.

[DM: Mad Maggie ist eigentlich eine Spionin für Zariel, beobachtet alle
Besucher und berichtet deren Pläne.]

Die Festung ist gefährlich aber auch voller Möglichkeiten. Maggie bietet
Reparaturen und Upgrades für Kriegsmaschinen an.

<!-- DM: Versteckter Eingang zu Waffenkammer hinter dem Schmiedebereich.
Enthält seltene infernale Waffen. DC 18 Perception check. -->

**Bekannte NPCs:**
- Mad Maggie (Herrscherin, Mechanikerin)
- [DM: Hat Deal mit Bel, dem vorherigen Herrscher von Avernus]

## DM Notes
- Party sollte hier infernales Metall für Serox finden können
- Mögliche Hinweise auf Arians Aufenthaltsort
- Wenn Party Mad Maggie misstraut, könnte sie Fallen stellen
```

**Generated Player Handout**:
```markdown
# Fort Knucklebone
*Spieler-Handout - Tag 145*

Fort Knucklebone ist ein gewaltiger Schrottplatz voller infernaler Kriegsmaschinen.
Mad Maggie herrscht hier über ein chaotisches Reich aus Metall und Feuer.

Die Festung ist gefährlich aber auch voller Möglichkeiten. Maggie bietet
Reparaturen und Upgrades für Kriegsmaschinen an.

**Bekannte NPCs:**
- Mad Maggie (Herrscherin, Mechanikerin)

**Verfügbare Dienste:**
- Kriegsmaschinen-Reparaturen
- Upgrades und Modifikationen
- Schrotthandel

**Was ihr wisst:**
Ihr habt gehört, dass Mad Maggie eine exzentrische aber faire Händlerin ist.
Sie verlangt meist Quests oder Gefallen statt Gold als Bezahlung.
```

### Secret Marker Examples

**Inline Secrets**:
```markdown
Captain Zodge seems trustworthy. [DM: He's actually hiding information about
Zariel's true plan.]
```

**Section-Based Secrets**:
```markdown
## Public Information
This is what players know.

## DM Notes
This section gets completely removed from player handouts.
Hidden plot twists and future plans.

## Player Information Continues
More safe content here.
```

**Obsidian-Style Hidden Text**:
```markdown
The treasure chest contains gold and gems. %%And a cursed ring that will
possess the wearer in 3 days.%%
```

**HTML Comments**:
```markdown
Mad Maggie offers to help. <!-- DM: She's reporting to Zariel. -->
```

## Technical Implementation

### n8n Workflow Steps

1. **Trigger Node**
   - Manual trigger with file selection
   - OR scheduled (e.g., "Generate weekly session recap")
   - OR file watcher for specific handout requests

2. **File Reader Node**
   - Read source DM note file
   - Read handout template
   - Read branding assets

3. **Function Node: Secret Content Remover**
   ```javascript
   // Remove all secret markers and their content:

   // Inline secrets: [DM: ...] or [SECRET: ...]
   content = content.replace(/\[DM:.*?\]/gi, '');
   content = content.replace(/\[SECRET:.*?\]/gi, '');

   // HTML comments: <!-- DM: ... -->
   content = content.replace(/<!--\s*DM:.*?-->/gis, '');

   // Obsidian hidden: %%...%%
   content = content.replace(/%%.*?%%/gs, '');

   // Remove entire sections marked "DM Notes"
   content = content.replace(/^##\s*DM Notes.*?(?=^##|\Z)/gms, '');

   // Clean up extra whitespace
   content = content.replace(/\n{3,}/g, '\n\n');
   ```

4. **Function Node: Content Rewriter (Optional)**
   ```javascript
   // Use AI to make content more player-friendly
   // Convert: "Captain has hidden agenda"
   // To: "Captain seems evasive about certain topics"
   ```

5. **Template Node: Apply Handout Template**
   - Add header with campaign branding
   - Apply consistent formatting
   - Add footer with date and session number
   - Include "Questions? Ask the DM!" note

6. **Function Node: Format Converter**
   - Convert markdown to desired format
   - For PDF: markdown → HTML → PDF (using puppeteer)
   - For Image: HTML → screenshot
   - For HTML: apply CSS styling

7. **File Writer Node**
   - Save to `player-handouts/` directory
   - Organize by type and date
   - Generate filename: `YYYY-MM-DD-handout-type-name.pdf`

8. **Distribution Nodes**
   - **Email**: Send to player mailing list
   - **Discord**: Post to #handouts channel
   - **Wiki**: Upload to campaign wiki
   - **Cloud**: Sync to Google Drive/Dropbox

### Handout Templates

**Session Recap Template**:
```markdown
---
type: session_recap
session: {SESSION_NUMBER}
date: {DATE}
in_game_day: {DAY_NUMBER}
---

# Session {SESSION_NUMBER} Zusammenfassung
## {SESSION_TITLE}

*{DATE} - Tag {DAY_NUMBER} der Reise*

---

{CONTENT}

---

**Nächste Session**: {NEXT_SESSION_DATE}

*Fragen? Kontaktiere den DM!*

---
🎲 Milos Abenteuerlogbuch
```

**NPC Card Template**:
```markdown
---
type: npc_card
npc_name: {NPC_NAME}
---

# {NPC_NAME}

![NPC Portrait]({IMAGE_URL})

**Erscheinung**: {APPEARANCE}

**Persönlichkeit**: {PERSONALITY}

**Was ihr wisst**:
{PUBLIC_INFORMATION}

**Beziehung zur Gruppe**: {RELATIONSHIP}

---

**Erste Begegnung**: Tag {FIRST_MET}
**Letzte Interaktion**: Tag {LAST_SEEN}

---
🎲 Milos Abenteuerlogbuch
```

**Quest Brief Template**:
```markdown
---
type: quest_brief
quest_name: {QUEST_NAME}
---

# Quest: {QUEST_NAME}

**Quest-Geber**: {QUEST_GIVER}
**Ort**: {LOCATION}
**Empfohlenes Level**: {LEVEL}

## Ziel
{OBJECTIVE}

## Was ihr wisst
{KNOWN_INFORMATION}

## Belohnung
{KNOWN_REWARDS}

## Hinweise
{CLUES}

---

**Fortschritt**: {PROGRESS_PERCENTAGE}%

[ ] Objective 1
[ ] Objective 2
[x] Completed Objective

---
🎲 Milos Abenteuerlogbuch
```

### PDF Styling (CSS for HTML to PDF)

```css
@page {
  size: A4;
  margin: 2cm;
}

.handout {
  font-family: 'Crimson Text', serif;
  background: url('parchment-texture.jpg');
  background-size: cover;
  padding: 40px;
  border: 3px solid #8b4513;
}

.handout-header {
  text-align: center;
  border-bottom: 2px solid #d4af37;
  margin-bottom: 30px;
}

.handout-title {
  font-family: 'Cinzel', serif;
  font-size: 32pt;
  color: #8b4513;
  margin: 0;
}

.handout-subtitle {
  font-size: 14pt;
  color: #a0522d;
  font-style: italic;
}

.handout-content {
  font-size: 12pt;
  line-height: 1.8;
  color: #2c1810;
}

.handout-footer {
  margin-top: 40px;
  text-align: center;
  border-top: 2px solid #d4af37;
  padding-top: 20px;
  font-size: 10pt;
  color: #8b4513;
}

@media print {
  body {
    background: white;
  }
  .handout {
    border: none;
  }
}
```

## Dependencies

- Read access to DM notes
- Write access to player-handouts directory
- PDF generation: `puppeteer` or `wkhtmltopdf`
- Image generation: `puppeteer` screenshots
- Optional: Email service (SendGrid, SMTP)
- Optional: Discord webhook
- Optional: Cloud storage API (Google Drive, Dropbox)

## Testing Criteria

- [ ] Removes all secret markers correctly
- [ ] Preserves non-secret formatting
- [ ] Generates readable PDF handouts
- [ ] Email distribution works reliably
- [ ] Discord posting successful
- [ ] German characters render correctly in PDF
- [ ] Images embed properly
- [ ] Links remain functional
- [ ] Template variables populate correctly

## Success Metrics

- Saves DM 15+ minutes per handout creation
- Players read handouts before each session
- Zero accidental spoilers leaked
- Handout quality rated professional by players
- 100% of sessions have recap handouts

## Related Features

- **Session Summary Generator** - Summaries become handouts
- **Auto-Wiki Generator** - Handouts integrated into wiki
- **Quest Progress Dashboard** - Quest briefs from dashboard
- **NPC Relationship Mapper** - NPC cards from relationship data

## Implementation Notes

### Phase 1: Basic Secret Removal (MVP)
1. Implement secret marker detection
2. Remove marked content
3. Generate basic PDF handouts

### Phase 2: Template System
1. Create handout templates
2. Apply consistent styling
3. Support multiple formats

### Phase 3: Distribution
1. Email integration
2. Discord posting
3. Cloud storage sync

### Phase 4: AI Enhancement
1. AI-powered content rewriting
2. Spoiler level detection
3. Automatic player-friendly phrasing

## Campaign-Specific Configuration

```json
{
  "handoutOutputDir": "./player-handouts",
  "secretMarkers": [
    {"type": "inline", "pattern": "\\[DM:.*?\\]"},
    {"type": "inline", "pattern": "\\[SECRET:.*?\\]"},
    {"type": "comment", "pattern": "<!--\\s*DM:.*?-->"},
    {"type": "obsidian", "pattern": "%%.*?%%"},
    {"type": "section", "pattern": "^##\\s*DM Notes.*?(?=^##|\\Z)"}
  ],
  "templates": {
    "session_recap": "./templates/session-recap.md",
    "npc_card": "./templates/npc-card.md",
    "quest_brief": "./templates/quest-brief.md",
    "location_guide": "./templates/location-guide.md"
  },
  "branding": {
    "campaignTitle": "Milos Abenteuerlogbuch",
    "campaignLogo": "./assets/campaign-logo.png",
    "parchmentTexture": "./assets/parchment-bg.jpg"
  },
  "distribution": {
    "email": {
      "enabled": true,
      "recipients": ["player1@example.com", "player2@example.com"],
      "subject": "Neue Session Zusammenfassung: Tag {DAY_NUMBER}"
    },
    "discord": {
      "enabled": true,
      "webhookUrl": "https://discord.com/api/webhooks/...",
      "channel": "#handouts"
    },
    "cloudStorage": {
      "enabled": false,
      "provider": "google_drive",
      "folderId": "..."
    }
  },
  "formats": ["pdf", "markdown", "html"],
  "defaultFormat": "pdf",
  "language": "de"
}
```

## Example Workflow Trigger

**Manual Trigger**:
- DM clicks "Generate Session Recap Handout"
- Selects source file (latest session notes)
- Selects template (session_recap)
- Workflow processes and distributes

**Automated Trigger**:
- Every Sunday at 22:00 (after typical session)
- Auto-detect latest session file
- Generate recap using AI summary
- Email to all players automatically

## Example Generated Handout

```
╔══════════════════════════════════════════════════════╗
║                                                      ║
║         🎲 Milos Abenteuerlogbuch 🎲                ║
║                                                      ║
║            Session 145 Zusammenfassung               ║
║            Fort Knucklebone                          ║
║                                                      ║
╚══════════════════════════════════════════════════════╝

14. September 2024 - Tag 145 der Reise

─────────────────────────────────────────────────────

Die Gruppe erreichte Fort Knucklebone, einen gewaltigen
Schrottplatz regiert von der exzentrischen Mad Maggie.

Wichtige Ereignisse:

• Erstes Treffen mit Mad Maggie
• Quest erhalten: Bergung aus abgestürztem Schiff
• Kampf gegen Rostdämonen in den Knochenfeldern
• Seltenes infernales Metall gefunden
• Kriegsmaschinen-Upgrades erhalten

Neue NPCs:

Mad Maggie
  Herrscherin von Fort Knucklebone, Mechanikerin
  Exzentrisch aber faire Händlerin
  Bietet Upgrades für Seelenmünzen oder Quests

Charaktermomente:

• Kalmaris: Verhandlung mit Mad Maggie
• Lufnik: Mögliche Spur zu Arian Brightwater!
• Serox: Infernales Metall für Rüstungsbau gefunden

─────────────────────────────────────────────────────

Nächste Session: 21. September 2024

Fragen? Sprecht mit eurem DM!

─────────────────────────────────────────────────────
        Tag 145 | Avernus Arc | Fort Knucklebone
```
