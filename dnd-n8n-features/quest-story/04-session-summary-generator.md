# Feature: Session Summary Generator

**Category**: Quest & Story
**Priority**: High
**Complexity**: Medium
**Status**: Not Started

## Overview

Automatically generate summaries from raw session notes using AI. Extract key events, NPC interactions, loot acquired, decisions made, and combat encounters. Creates both DM-facing detailed summaries and player-facing recaps.

## User Story

Als Spielleiter möchte ich nach jeder Session automatisch eine Zusammenfassung generieren lassen, die die wichtigsten Ereignisse, NPC-Begegnungen, Beute und Entscheidungen hervorhebt, damit ich Zeit spare und eine konsistente Dokumentation habe.

## Requirements

### Must-Haves

1. **AI-Powered Summarization**
   - Use Claude/GPT API to analyze raw session notes
   - Generate concise summaries (200-500 words)
   - Extract key information in structured format
   - Maintain German language throughout
   - Preserve Milo's narrative voice for Campaign.md updates

2. **Key Information Extraction**
   - **Events**: Major plot developments, discoveries, battles
   - **NPCs**: New NPCs met, existing NPC interactions, important dialogues
   - **Locations**: Places visited, described, discovered
   - **Loot**: Items acquired, gold earned, equipment found
   - **Decisions**: Major player choices and consequences
   - **Combat**: Enemies fought, casualties, tactical highlights
   - **Character Moments**: Personal growth, character development

3. **Multiple Summary Formats**
   - **Bullet-Point Summary**: Quick reference (50-100 words)
   - **Narrative Summary**: Story-style recap (200-300 words)
   - **Detailed Summary**: Full breakdown (400-500 words)
   - **Player Handout**: Spoiler-free version for players
   - **Campaign.md Update**: In Milo's voice for master document

4. **Metadata Extraction**
   - Session date
   - Session number
   - In-game date (Tag X)
   - Players present
   - Session duration
   - Experience gained
   - Gold/treasure acquired

5. **Integration with Campaign Structure**
   - Auto-detect which arc (01, 02, 03)
   - Match session to day range (Day 1-67, 68-134, 135+)
   - Link to related quest updates
   - Tag NPCs and locations for cross-referencing

### Should-Haves

1. **Automatic Distribution**
   - Email summary to players after session
   - Post to Discord channel
   - Save in organized session notes folder
   - Update Campaign.md with narrative version

2. **Quote Extraction**
   - Identify memorable player quotes
   - Extract important NPC dialogue
   - Highlight funny/dramatic moments

3. **Character Spotlight**
   - Identify which character(s) had major moments
   - Track character-specific achievements
   - Note character development or changes

4. **Quest Tracking Integration**
   - Auto-update related quest files
   - Mark quest objectives as completed
   - Add new quest leads discovered

5. **Visual Elements**
   - Generate session "stat card" (combat stats, gold earned, etc.)
   - Create word cloud of session themes
   - Include relevant images if referenced

### Nice-to-Haves

1. **AI Scene Analysis**
   - Identify scene types (combat, roleplay, exploration, puzzle)
   - Calculate scene duration percentages
   - Suggest pacing improvements

2. **Continuity Checking**
   - Compare with previous sessions for contradictions
   - Flag inconsistencies in NPC behavior or lore
   - Suggest connections to earlier plot threads

3. **Foreshadowing Detection**
   - Identify potential future plot hooks
   - Suggest seeds planted for later payoff
   - Track Chekhov's guns (introduced elements not yet resolved)

4. **Multiple Language Support**
   - Generate English version for international sharing
   - Translate key terms while maintaining German names

## Story Integration Points

### Milo's Narrative Voice

The Campaign.md is written from Milo Quickspark's perspective with specific characteristics:

- **First-person plural** ("wir", "unsere", "meine Freunde")
- **Enthusiastic and curious** tone
- **Scientific observations** mixed with adventure
- **Affectionate descriptions** of party members
- **Occasional self-deprecating humor**
- **Detailed emotional reactions** to events
- **Emphasis on friendship and loyalty**

Example tone:
> "Oh, was für ein Abenteuer! Nach unserem Schiffbruch auf Moreva dachten wir zunächst, es wäre nur schlechtes Glück gewesen. Aber nein! Die Menschen hier verloren buchstäblich den Verstand - nicht nur wegen meiner experimentellen Kochkünste, wie ich anfangs befürchtete."

### Session Summary Structure

Based on existing Campaign.md format:

```markdown
## [Arc Number] - [Arc Name]: [Subtitle]
*Tag X-Y*

[Opening narrative paragraph in Milo's voice]

**[Section Header]:**
[Story beats with mix of narrative and key details]

**[Another Section]:**
[More story beats]

*Anmerkung: [Milo's personal reflection or joke]*
```

### Information Categories by Campaign Phase

**Arc 1 (Deep Underground)**: Focus on discovery, world-building, establishing character dynamics
**Arc 2 (Baldur's Gate)**: Focus on politics, factions, intrigue, urban adventure
**Arc 3 (Avernus)**: Focus on survival, horror, personal quests, epic stakes

### Example Extractions

From a hypothetical session in Avernus:

**Raw Notes**:
```
Party reached Fort Knucklebone
Met Mad Maggie, runs the place
She offered to upgrade war machine in exchange for quest
Quest: retrieve something from crashed ship in bone fields
Party negotiated better terms
Serox interested in her smithing techniques
Lufnik asked about refugees, got info about possible Arian sighting
Combat with rust devils on the way back
Found rare infernal metal in wreckage
Returned to Mad Maggie, upgraded weapons on war machine
Kalmaris had moment of self-doubt during negotiation
```

**Generated Summary (Milo's Voice)**:
```markdown
## Fort Knucklebone: Der Schrottplatz der Hölle
*Tag 145*

Als wir Fort Knucklebone erreichten, erwartete uns ein Anblick, der selbst meinen wildesten Werkstatt-Träumen entsprach - wenn diese Träume von Alpträumen durchzogen wären! Die Festung war ein gigantischer Schrottplatz aus infernalen Kriegsmaschinen, Knochen und unmöglicher Mechanik.

**Mad Maggie, die Schrottkönigin:**
Die Herrin dieses chaotischen Reiches, Mad Maggie, empfing uns mit der Begeisterung eines Kindes in einem Süßigkeitenladen - wenn dieses Kind zufällig auch eine furchteinflößende Mechanikerin mit zweifelhaften Geschäftspraktiken wäre. Sie bot an, unsere Kriegsmaschine zu verbessern, im Austausch für einen kleinen Gefallen: etwas aus einem abgestürzten Schiff im Knochenfeld bergen.

Kalmaris versuchte bessere Konditionen auszuhandeln, obwohl ich bemerkte, dass er unsicher wirkte. Die Identitätskrise, seit der Spiegeldämon versiegelt wurde, macht ihm mehr zu schaffen, als er zugibt.

**Lufniks Hoffnung:**
Mein akrobatischer Freund fragte vorsichtig nach Flüchtlingen aus Elturel. Maggies Antwort ließ sein Gesicht aufleuchten - möglicherweise eine Sichtung von Arian Brightwater! Nach all den Tagen der Suche könnte sein verschollener Freund noch leben.

**Schatzsuche im Knochenfeld:**
Die Expedition zum Wrack war voller Gefahren. Rostdämonen griffen uns an - schreckliche Kreaturen, die Metall zu Staub zerfallen lassen! Serox war besonders besorgt um seine wertvolle Ausrüstung. Aber wir triumphierten und fanden nicht nur Maggies Ziel, sondern auch seltenes infernales Metall. Serox' Augen leuchteten - genau das Material, das er für seine legendäre Rüstung braucht!

**Der Lohn:**
Zurück bei Mad Maggie erhielten wir die versprochenen Upgrades. Unsere Kriegsmaschine ist nun noch furchteinflößender - was in Avernus absolut notwendig ist.

*Anmerkung: Ich habe so viele Fragen an Mad Maggie über ihre Mechanik! Aber sie schien mehr interessiert an unseren Seelenmünzen als an wissenschaftlichem Austausch. Wie enttäuschend.*
```

**Generated Bullet Points**:
```markdown
# Session 145: Fort Knucklebone

**Datum**: Tag 145
**Ort**: Fort Knucklebone, Avernus
**Spieler**: Alle anwesend

## Wichtige Ereignisse
- ✅ Fort Knucklebone erreicht
- 🤝 Mad Maggie getroffen (Schrottplatz-Herrscherin)
- 📝 Quest erhalten: Bergung aus Wrack im Knochenfeld
- ⚔️ Rostdämonen besiegt
- 🎁 Infernales Metall gefunden
- 🔧 Kriegsmaschinen-Upgrades erhalten

## NPCs
- **Mad Maggie** (Neu) - Schrottplatz-Betreiberin, Mechanikerin, Quest-Geberin

## Beute
- Infernales Metall (selten) - Serox
- Kriegsmaschinen-Upgrades (Waffenverbesserungen)

## Charaktermomente
- **Kalmaris**: Identitätskrise während Verhandlung sichtbar
- **Lufnik**: Mögliche Spur zu Arian Brightwater!
- **Serox**: Begeistert über infernale Schmiedematerialien

## Quests
- ✅ Mad Maggies Bergungsquest abgeschlossen
- 🔄 Lufniks Suche nach Arian: Neue Spur

## Nächste Schritte
- Arian-Spur verfolgen
- Weitere Erkundung von Fort Knucklebone
- Infernales Metall verarbeiten?
```

## Technical Implementation

### n8n Workflow Steps

1. **Trigger Node**
   - Manual trigger after session
   - OR File watcher for new session notes
   - OR Scheduled (e.g., "Every Sunday 22:00" after typical session)

2. **File Reader Node**
   - Read raw session notes file
   - Read previous session for context
   - Read Campaign.md for voice consistency

3. **AI Node: Main Summarization**
   ```javascript
   // Prompt engineering for Claude/GPT:
   const prompt = `
   Du bist Milo Quickspark, ein Gnom-Alchemist und Chronist der Abenteuergruppe.

   Analysiere die folgenden Session-Notizen und erstelle:
   1. Eine narrative Zusammenfassung in Milos Stimme (200-300 Wörter)
   2. Eine strukturierte Aufzählung der wichtigsten Ereignisse
   3. Liste aller erwähnten NPCs
   4. Liste aller gefundenen Gegenstände/Beute
   5. Charaktermomente und Entwicklungen

   Milos Stimme ist:
   - Enthusiastisch und neugierig
   - Affektionierte Beschreibungen der Gefährten
   - Wissenschaftliche Beobachtungen
   - Gelegentlich selbstironisch
   - Betont Freundschaft und Loyalität

   Session-Notizen:
   ${sessionNotes}

   Vorherige Session Zusammenfassung (für Kontext):
   ${previousSummary}
   `;
   ```

4. **Function Node: Metadata Extraction**
   ```javascript
   // Extract structured data from AI response:
   // - Session number and date
   // - Day number (Tag X)
   // - NPCs mentioned
   // - Items acquired
   // - Quests updated
   // - Character highlights
   ```

5. **Function Node: Quest Updates**
   ```javascript
   // Identify quest-related events
   // Generate quest file updates
   // Mark objectives completed/added
   ```

6. **Template Node: Multiple Formats**
   - Narrative summary (Campaign.md style)
   - Bullet points (structured overview)
   - Player handout (no spoilers)
   - Email/Discord format

7. **File Writer Nodes**
   - Save full summary to session folder
   - Update Campaign.md with narrative
   - Update related quest files
   - Save metadata JSON for analytics

8. **Notification Nodes**
   - Email summary to players
   - Post to Discord webhook
   - Optional: Tweet highlight or share image

### AI Prompt Templates

**Main Summarization Prompt**:
```
Rolle: Du bist Milo Quickspark, Gnom-Alchemist und Chronist.

Aufgabe: Fasse die folgende D&D Session zusammen.

Stil:
- Erzählperspektive: Ich (Milo) + Wir (Gruppe)
- Ton: Enthusiastisch, neugierig, warmherzig
- Details: Wissenschaftliche Beobachtungen + emotionale Reaktionen
- Humor: Gelegentlich selbstironisch

Struktur:
## [Titel der Session]
*Tag [X]*

[Eröffnungsparagraph]

**[Abschnitt 1 Titel]:**
[Narrative]

**[Abschnitt 2 Titel]:**
[Narrative]

*Anmerkung: [Milos persönliche Reflexion]*

Session-Notizen:
{SESSION_NOTES}

Kontext (vorherige Session):
{PREVIOUS_CONTEXT}
```

**Bullet Point Extraction Prompt**:
```
Extrahiere aus folgenden Session-Notizen:

1. Wichtigste Ereignisse (5-7 bullet points)
2. Neue NPCs (Name, Rolle, Bedeutung)
3. NPC-Interaktionen (Name, Art der Interaktion)
4. Gefundene Beute (Item, Wer bekam es)
5. Abgeschlossene Quests
6. Neue Quest-Hinweise
7. Charaktermomente (Wer, Was passierte)
8. Kampf-Statistiken (wenn zutreffend)

Format als strukturiertes Markdown.

Session-Notizen:
{SESSION_NOTES}
```

## Dependencies

- AI API (Claude Anthropic or OpenAI GPT)
- Read access to session notes and Campaign.md
- Write access to campaign files
- Optional: Email service (SendGrid, SMTP)
- Optional: Discord webhook
- Git integration for automatic commits

## Testing Criteria

- [ ] Generates summary from raw notes in under 60 seconds
- [ ] Summary captures all major events
- [ ] Maintains Milo's narrative voice consistently
- [ ] Extracts at least 90% of NPCs and items correctly
- [ ] German language maintained throughout
- [ ] Player handout contains no spoilers
- [ ] Quest files updated correctly
- [ ] Summary integrates smoothly into Campaign.md

## Success Metrics

- Saves DM 30+ minutes per session on documentation
- Players read and reference summaries regularly
- Summary accuracy rated 8/10 or higher by DM
- Zero critical information missed in summaries
- Campaign.md voice consistency maintained

## Related Features

- **Automatic Timeline Generation** - Summary events feed timeline
- **Quest Progress Dashboard** - Quest updates from summaries
- **NPC Relationship Mapper** - NPC mentions update relationship map
- **Player Handout Generator** - Uses summary for handouts

## Implementation Notes

### Phase 1: Manual Summary Generation (MVP)
1. Create prompt templates for AI
2. Manual trigger to generate summary
3. Save summary to file

### Phase 2: Automated Integration
1. Auto-detect new session files
2. Generate summary automatically
3. Update Campaign.md and quest files

### Phase 3: Distribution
1. Email summaries to players
2. Post to Discord
3. Generate visual session cards

### Phase 4: Advanced AI
1. Improve voice consistency with fine-tuning
2. Add continuity checking
3. Generate foreshadowing analysis

## Campaign-Specific Configuration

```json
{
  "narrator": {
    "name": "Milo Quickspark",
    "class": "Gnome Alchemist",
    "personality": [
      "enthusiastic",
      "curious",
      "loyal",
      "scientific",
      "self-deprecating"
    ],
    "perspective": "first-person-plural"
  },
  "summaryFormats": [
    "narrative_milo_voice",
    "bullet_points",
    "player_handout",
    "campaign_md_update"
  ],
  "aiProvider": "anthropic",
  "aiModel": "claude-3-5-sonnet-20241022",
  "language": "de",
  "sessionNotesPath": "03 Avernus/*.md",
  "campaignMasterFile": "Campaign.md",
  "autoUpdate": true,
  "notificationChannels": ["email", "discord"],
  "includeMetadata": true
}
```

## Example AI Response Structure

```json
{
  "narrative_summary": "[Milo-voice narrative text]",
  "bullet_points": {
    "events": ["Event 1", "Event 2"],
    "npcs": [
      {"name": "Mad Maggie", "role": "Quest Giver", "new": true}
    ],
    "loot": [
      {"item": "Infernal Metal", "recipient": "Serox", "rarity": "rare"}
    ],
    "character_moments": [
      {"character": "Kalmaris", "moment": "Identity crisis during negotiation"}
    ],
    "quests": [
      {"name": "Mad Maggie's Salvage", "status": "completed"},
      {"name": "Find Arian", "status": "updated", "progress": "new lead"}
    ]
  },
  "metadata": {
    "session_number": 145,
    "in_game_day": 145,
    "arc": "Avernus",
    "location": "Fort Knucklebone",
    "duration_hours": 4,
    "players_present": 6,
    "combat_encounters": 1,
    "npcs_met": 1,
    "items_found": 2
  }
}
```
