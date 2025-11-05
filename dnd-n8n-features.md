# D&D Campaign n8n Automation Features

A comprehensive feature list for automating D&D campaign management with n8n and markdown files.

## Content Generation & Conversion

### 1. Auto-Generate HTML Campaign Wiki
Convert markdown campaign files into a beautiful static HTML website automatically. Use n8n's Markdown node to transform notes, character sheets, and location descriptions into web pages that can be hosted for players.

- **Status**: Not Started
- **Priority**: High
- **Implementation Notes**: 
  - Use markdown-to-HTML converter in n8n
  - Watch for changes in campaign folder
  - Generate static site structure
  - Deploy to web server or GitHub Pages

### 2. PDF Session Report Generator
Automatically compile session notes into formatted PDF documents after each game session. Perfect for sharing recaps with players or creating a permanent archive.

- **Status**: Not Started
- **Priority**: High
- **Implementation Notes**:
  - Parse session markdown files
  - Convert to PDF format
  - Include session date, attendees, summary
  - Email to players automatically

### 3. Character Sheet HTML Export
Transform character progression markdown files into styled HTML pages with automatic stat calculations and visual progress bars.

- **Status**: Not Started
- **Priority**: Medium
- **Implementation Notes**:
  - Extract character stats from markdown
  - Calculate derived attributes
  - Create visual progress bars
  - Generate responsive HTML

## Timeline & Progress Tracking

### 4. Automatic Timeline Generation
Parse session notes for dates, events, and key moments to auto-generate a visual timeline. Extract temporal markers and organize them chronologically.

- **Status**: Not Started
- **Priority**: High
- **Implementation Notes**:
  - Regex extraction of date patterns
  - Parse event descriptions
  - Generate markdown and visual outputs
  - Consider timeline.js or similar library

### 5. Character Level-Up Tracker
Monitor character markdown files for XP changes and automatically log level progression, send notifications, and update progression history.

- **Status**: Not Started
- **Priority**: Medium
- **Implementation Notes**:
  - Compare file versions for XP changes
  - Send Discord/Slack notifications
  - Maintain level history document
  - Track date of level-ups

### 6. Quest Progress Dashboard
Track quest status changes across markdown files and generate a living dashboard showing active quests, completed objectives, and pending storylines.

- **Status**: Not Started
- **Priority**: Medium
- **Implementation Notes**:
  - Parse quest markdown files for status tags
  - Extract completion percentages
  - Generate dashboard view
  - Track quest history

## File Organization & Version Control

### 7. Git Auto-Commit Workflow
Set up automatic commits to a Git repository whenever campaign files are modified. Creates a complete version history of campaign development.

- **Status**: Not Started
- **Priority**: High
- **Implementation Notes**:
  - Watch local files for changes
  - Create meaningful commit messages
  - Push to remote repository
  - Include timestamp and file name in message

### 8. Folder Watch & Auto-Organize
Monitor campaign folder structure and automatically organize new files into appropriate subfolders based on naming patterns or content analysis.

- **Status**: Not Started
- **Priority**: Medium
- **Implementation Notes**:
  - Use local file trigger
  - Analyze filename patterns
  - Move files to correct folders (NPCs, Locations, Sessions, etc.)
  - Create subfolders if they don't exist

### 9. Backup Automation
Schedule regular backups of entire campaign folder to cloud storage with timestamped archives.

- **Status**: Not Started
- **Priority**: High
- **Implementation Notes**:
  - Daily or weekly schedule trigger
  - Backup to Google Drive, Dropbox, or Nextcloud
  - Create timestamped archives
  - Maintain retention policy

## Content Analysis & Enhancement

### 10. Session Summary Generator
Automatically generate summaries from raw session notes using AI. Extract key events, NPC interactions, loot acquired, and decisions made.

- **Status**: Not Started
- **Priority**: High
- **Implementation Notes**:
  - Use OpenAI or similar AI node
  - Trigger on session file creation/modification
  - Extract key moments, NPCs, combat, loot
  - Generate markdown summary

### 11. NPC Relationship Mapper
Parse markdown files to identify NPC mentions and automatically generate relationship diagrams showing connections between characters, factions, and locations.

- **Status**: Not Started
- **Priority**: Medium
- **Implementation Notes**:
  - Extract NPC names from files
  - Identify relationships and conflicts
  - Generate graph/diagram format
  - Export as visual markdown or HTML

### 12. Missing Link Detector
Scan campaign notes for references to NPCs, locations, or items that don't have dedicated markdown files, creating a to-do list of content needing development.

- **Status**: Not Started
- **Priority**: Low
- **Implementation Notes**:
  - Extract mentioned entities
  - Check if files exist
  - Generate "missing content" report
  - Create file templates automatically

## Cross-Referencing & Linking

### 13. Auto-Wiki Link Generator
Automatically insert markdown links between related documents. When you mention "Baldur's Gate," the automation adds a link to the Baldur's Gate location file.

- **Status**: Not Started
- **Priority**: Medium
- **Implementation Notes**:
  - Maintain index of file titles
  - Find title mentions in content
  - Insert markdown links automatically
  - Avoid linking in existing links

### 14. Glossary Builder
Compile all unique terms, names, and locations from campaign into a master glossary with references to where they appear.

- **Status**: Not Started
- **Priority**: Low
- **Implementation Notes**:
  - Extract unique terms from all files
  - Track where terms appear
  - Generate glossary document
  - Update glossary regularly

### 15. Tag Management System
Automatically apply tags to markdown files based on content analysis (e.g., #combat, #roleplay, #loot, #plot-twist).

- **Status**: Not Started
- **Priority**: Medium
- **Implementation Notes**:
  - Analyze file content
  - Assign appropriate tags
  - Update file frontmatter with tags
  - Enable filtering by tags

## Player-Facing Tools

### 16. Player Handout Generator
Extract player-visible information from DM notes (removing secret content marked with special tags) and generate clean handout documents.

- **Status**: Not Started
- **Priority**: Medium
- **Implementation Notes**:
  - Use special markers for secret content (e.g., [SECRET] or %%hidden%%)
  - Strip secret sections before export
  - Generate player-safe markdown/PDF
  - Distribute to player folder

### 17. Email/Discord Session Recaps
Automatically send formatted session summaries to players via email or Discord webhooks after each game.

- **Status**: Not Started
- **Priority**: High
- **Implementation Notes**:
  - Trigger on session file creation
  - Generate summary (use AI node)
  - Format for email or Discord
  - Send to configured email list or Discord webhook

### 18. Character Spotlight Reports
Generate periodic "spotlight" documents highlighting individual character achievements, story developments, and progression.

- **Status**: Not Started
- **Priority**: Low
- **Implementation Notes**:
  - Parse character-related entries
  - Aggregate achievements per character
  - Generate formatted report
  - Schedule weekly or monthly

## Campaign Analytics

### 19. Campaign Statistics Dashboard
Track metrics like total sessions, NPCs introduced, locations visited, enemies defeated, and treasure acquired. Generate periodic reports.

- **Status**: Not Started
- **Priority**: Medium
- **Implementation Notes**:
  - Count sessions in folder
  - Count unique NPCs and locations
  - Aggregate combat statistics
  - Generate dashboard or report

### 20. Content Growth Tracker
Monitor how campaign documentation grows over time—track word counts, new files created, and content density metrics.

- **Status**: Not Started
- **Priority**: Low
- **Implementation Notes**:
  - Track word count per session
  - Count new files created
  - Calculate growth trends
  - Generate growth charts

### 21. Session Changelog Generator
Automatically create changelog-style documents showing what changed between sessions—new NPCs, location updates, quest developments, and story progression.

- **Status**: Not Started
- **Priority**: Medium
- **Implementation Notes**:
  - Compare session files
  - Extract changes
  - Organize by category (NPCs, Locations, Quests, etc.)
  - Generate changelog document

## Obsidian Integration Features

### 22. Dataview Query Automation
Process Dataview query results and generate summary documents like "All unresolved plot hooks" or "NPCs by faction."

- **Status**: Not Started
- **Priority**: Low
- **Implementation Notes**:
  - Read Obsidian vault structure
  - Execute Dataview-style queries
  - Generate aggregated documents
  - Update periodically

### 23. Graph View Export
Periodically export Obsidian graph view data and generate network visualizations showing how campaign elements connect.

- **Status**: Not Started
- **Priority**: Low
- **Implementation Notes**:
  - Parse Obsidian vault metadata
  - Extract link relationships
  - Generate graph visualization
  - Export as image or interactive HTML

### 24. Template Application Workflow
Automatically apply templates to new markdown files based on file location or naming convention. New NPC files get the NPC template structure.

- **Status**: Not Started
- **Priority**: Medium
- **Implementation Notes**:
  - Monitor folder for new files
  - Detect file type from folder or prefix
  - Apply appropriate template
  - Populate with basic structure

## Real-Time Collaboration

### 25. Multiplayer Edit Notifications
Set up notifications when specific files are modified, preventing conflicting edits if multiple people contribute to campaign notes.

- **Status**: Not Started
- **Priority**: Low
- **Implementation Notes**:
  - Watch files for changes
  - Send Discord or Slack notification
  - Include who changed what
  - Log change history

### 26. Change Summary for Co-DMs
Generate summaries of recent changes for co-DMs or players who contribute to worldbuilding.

- **Status**: Not Started
- **Priority**: Low
- **Implementation Notes**:
  - Track changes over time period
  - Extract what was added/modified
  - Generate summary report
  - Send to co-DMs

## Advanced Features

### 27. AI-Powered Content Suggestions
Use AI to suggest plot developments based on current campaign state, generate NPC dialogue options, or create random encounter descriptions fitting your campaign's tone.

- **Status**: Not Started
- **Priority**: Low
- **Implementation Notes**:
  - Analyze campaign state
  - Use OpenAI/Claude for suggestions
  - Generate dialogue options
  - Create encounter descriptions

### 28. Procedural Content Generation
Generate random NPCs, locations, or quest hooks in markdown format when triggered, complete with names, descriptions, and stat blocks.

- **Status**: Not Started
- **Priority**: Low
- **Implementation Notes**:
  - Use AI node or random generation libraries
  - Follow campaign tone/setting
  - Generate stat blocks for NPCs
  - Save as markdown files

### 29. Cross-Campaign Asset Reuse
Track reusable content (generic NPCs, encounter templates, location descriptions) and automatically suggest them when creating new content.

- **Status**: Not Started
- **Priority**: Low
- **Implementation Notes**:
  - Maintain template library
  - Tag reusable assets
  - Suggest matches when creating content
  - Enable quick copying and customization

### 30. Calendar Event Integration
If using a fantasy calendar system, automatically update campaign calendars based on session progression and in-game time passage.

- **Status**: Not Started
- **Priority**: Low
- **Implementation Notes**:
  - Parse in-game calendar dates
  - Track time passage per session
  - Update master calendar
  - Calculate holidays and important dates

## Maintenance & Quality Control

### 31. Dead Link Checker
Scan for broken internal links in markdown files and generate a repair list.

- **Status**: Not Started
- **Priority**: Low
- **Implementation Notes**:
  - Extract all markdown links
  - Check if referenced files exist
  - Generate report of dead links
  - Create repair suggestions

### 32. Consistency Validator
Check for inconsistencies in NPC names, location spellings, or stat blocks across campaign notes.

- **Status**: Not Started
- **Priority**: Medium
- **Implementation Notes**:
  - Extract names and locations
  - Check spelling consistency
  - Detect duplicate entries with different spellings
  - Generate consistency report

### 33. Content Freshness Monitor
Identify campaign elements that haven't been referenced or updated in a while, helping you remember forgotten plot threads or NPCs.

- **Status**: Not Started
- **Priority**: Low
- **Implementation Notes**:
  - Track last mention/update date
  - Identify old plot threads
  - Generate "forgotten elements" report
  - Suggest reintroduction opportunities

---

## Implementation Priority Matrix

### Phase 1 (High Priority - Start Here)
- Auto-Generate HTML Campaign Wiki
- PDF Session Report Generator
- Automatic Timeline Generation
- Git Auto-Commit Workflow
- Backup Automation
- Session Summary Generator
- Email/Discord Session Recaps

### Phase 2 (Medium Priority - After Phase 1)
- Character Sheet HTML Export
- Character Level-Up Tracker
- Quest Progress Dashboard
- Folder Watch & Auto-Organize
- NPC Relationship Mapper
- Auto-Wiki Link Generator
- Tag Management System
- Player Handout Generator
- Campaign Statistics Dashboard
- Session Changelog Generator
- Template Application Workflow
- Consistency Validator

### Phase 3 (Low Priority - Nice to Have)
- Missing Link Detector
- Glossary Builder
- Character Spotlight Reports
- Content Growth Tracker
- Dataview Query Automation
- Graph View Export
- Multiplayer Edit Notifications
- Change Summary for Co-DMs
- AI-Powered Content Suggestions
- Procedural Content Generation
- Cross-Campaign Asset Reuse
- Calendar Event Integration
- Dead Link Checker
- Content Freshness Monitor

---

## Notes

- All features should integrate with n8n workflows
- Markdown is the primary file format
- Consider Git version control integration
- Obsidian.md compatibility is a plus
- Player-facing outputs should be polished and clean
- Maintain campaign immersion in generated content
