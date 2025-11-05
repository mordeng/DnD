# D&D Campaign n8n Automation - Quest & Story Features

**Comprehensive Implementation Plan for Story-Focused Campaign Automation**

---

## 📖 Overview

This directory contains detailed feature specifications for automating D&D campaign management using n8n workflows. The focus is on **Quest & Story features** that help track narrative progression, manage NPCs, generate content, and enhance the storytelling experience for both DM and players.

### Current Campaign Context

- **Campaign Name**: Milo Quicksparks Abenteuerlogbuch
- **Language**: German (Deutsch)
- **Current Status**: Day 145, Avernus Arc, Fort Knucklebone
- **Party Size**: 6 characters (Kalmaris, Lamil, Longjohn, Lufnik, Milo, Serox)
- **Sessions Completed**: 145+ in-game days across 3 major arcs
- **Documentation**: Extensive markdown files with character sheets, session notes, NPCs, and world-building

---

## 🎯 Feature Categories

### Quest & Story Features (Priority Focus)

These features directly support campaign narrative management, quest tracking, and story development:

| Feature | Priority | Complexity | Status | File |
|---------|----------|------------|--------|------|
| **Automatic Timeline Generation** | High | Medium | Not Started | [01-automatic-timeline-generation.md](quest-story/01-automatic-timeline-generation.md) |
| **Quest Progress Dashboard** | High | Medium | Not Started | [02-quest-progress-dashboard.md](quest-story/02-quest-progress-dashboard.md) |
| **NPC Relationship Mapper** | Medium | High | Not Started | [03-npc-relationship-mapper.md](quest-story/03-npc-relationship-mapper.md) |
| **Session Summary Generator** | High | Medium | Not Started | [04-session-summary-generator.md](quest-story/04-session-summary-generator.md) |
| **Auto-Generate HTML Campaign Wiki** | High | Medium-High | Not Started | [05-auto-wiki-generator.md](quest-story/05-auto-wiki-generator.md) |
| **Player Handout Generator** | Medium | Medium | Not Started | [06-player-handout-generator.md](quest-story/06-player-handout-generator.md) |

---

## 🚀 Quick Start Guide

### Prerequisites

1. **n8n Installation**
   - Self-hosted n8n instance OR n8n Cloud account
   - Access to campaign file directory
   - Node.js 16+ for custom functions

2. **API Keys (Optional but Recommended)**
   - Anthropic Claude API (for AI summarization)
   - OR OpenAI GPT API (alternative for AI features)
   - Discord webhook URL (for notifications)
   - Email service credentials (SendGrid, SMTP)

3. **Campaign Structure**
   - Markdown files organized by arc (01, 02, 03 directories)
   - Character files in `characters/` directory
   - Campaign.md master document
   - Git repository (recommended for version control)

### Implementation Order (Recommended)

**Phase 1: Foundation (Weeks 1-2)**
1. Session Summary Generator - Start documenting immediately
2. Quest Progress Dashboard - Track current storylines
3. Player Handout Generator - Safe information sharing

**Phase 2: Enhanced Tracking (Weeks 3-4)**
4. Automatic Timeline Generation - Visualize campaign history
5. Auto-Wiki Generator - Create reference website

**Phase 3: Advanced Features (Week 5+)**
6. NPC Relationship Mapper - Complex social networks

---

## 📋 Feature Details

### 1. Automatic Timeline Generation

**Purpose**: Create a chronological visualization of all campaign events from session notes.

**Key Benefits**:
- Visual representation of campaign progression
- Easy reference for "when did X happen?"
- Tracks all three arcs (Moreva, Baldur's Gate, Avernus)
- Links back to source session files

**Output**: Timeline.md and Timeline.html with 145+ days of events

**See**: [01-automatic-timeline-generation.md](quest-story/01-automatic-timeline-generation.md)

---

### 2. Quest Progress Dashboard

**Purpose**: Track all active, completed, and failed quests in one central dashboard.

**Key Benefits**:
- Never forget a quest thread
- Track 6 personal character quests + main story
- Visual progress bars
- Automatic updates from session notes

**Output**: Quest-Dashboard.md and interactive HTML dashboard

**See**: [02-quest-progress-dashboard.md](quest-story/02-quest-progress-dashboard.md)

---

### 3. NPC Relationship Mapper

**Purpose**: Visualize relationships between NPCs, factions, and player characters.

**Key Benefits**:
- Understand complex social dynamics
- Identify story connections
- Track faction membership
- See enemy/ally networks

**Output**: NPC-Relationships.md with mermaid diagrams, interactive HTML graph

**See**: [03-npc-relationship-mapper.md](quest-story/03-npc-relationship-mapper.md)

---

### 4. Session Summary Generator

**Purpose**: Use AI to automatically generate session summaries in Milo's narrative voice.

**Key Benefits**:
- Saves 30+ minutes per session on documentation
- Consistent voice matching Campaign.md
- Extracts key events, NPCs, loot, decisions
- Multiple output formats (narrative, bullet points, player handouts)

**Output**: Session summaries in markdown, updates to Campaign.md

**See**: [04-session-summary-generator.md](quest-story/04-session-summary-generator.md)

---

### 5. Auto-Generate HTML Campaign Wiki

**Purpose**: Convert all markdown campaign files into a beautiful, searchable website.

**Key Benefits**:
- Professional reference for players and DM
- Auto-updates when files change
- Cross-linked pages (NPCs, locations, sessions)
- Mobile-friendly design
- Full-text search

**Output**: Complete static HTML website, deployable to GitHub Pages

**See**: [05-auto-wiki-generator.md](quest-story/05-auto-wiki-generator.md)

---

### 6. Player Handout Generator

**Purpose**: Extract player-safe information from DM notes, removing all secrets.

**Key Benefits**:
- Quickly create spoiler-free handouts
- Professional PDF outputs
- Automatic distribution via email/Discord
- Multiple handout types (recaps, NPC cards, quest briefs)

**Output**: PDF, markdown, and HTML handouts

**See**: [06-player-handout-generator.md](quest-story/06-player-handout-generator.md)

---

## 🔧 Technical Architecture

### n8n Workflow Components

Each feature follows a similar architectural pattern:

```
┌─────────────────┐
│  Trigger Node   │  ← File watcher, manual, or scheduled
└────────┬────────┘
         │
┌────────▼────────┐
│  File Reader    │  ← Read campaign markdown files
└────────┬────────┘
         │
┌────────▼────────┐
│  Parser/AI      │  ← Extract data, use AI if needed
└────────┬────────┘
         │
┌────────▼────────┐
│  Generator      │  ← Create output (markdown, HTML, PDF)
└────────┬────────┘
         │
┌────────▼────────┐
│  File Writer    │  ← Save to campaign directory
└────────┬────────┘
         │
┌────────▼────────┐
│  Distribution   │  ← Email, Discord, git commit (optional)
└─────────────────┘
```

### Common Dependencies

- **Markdown Processing**: `markdown-it`, `gray-matter`
- **AI Integration**: Anthropic Claude API, OpenAI GPT API
- **PDF Generation**: `puppeteer`, `wkhtmltopdf`
- **Visualization**: `mermaid.js`, `vis.js`, `D3.js`
- **Notifications**: Discord webhooks, SendGrid email
- **Version Control**: Git integration via bash commands

### File Structure Integration

```
Campaign Root/
├── Campaign.md                 # Master narrative document
├── Timeline.md                 # Generated timeline
├── Quest-Dashboard.md          # Generated quest tracker
├── NPC-Relationships.md        # Generated relationship map
│
├── 01 Deep Underground/        # Arc 1 sessions
├── 02 Baldurs Gate/           # Arc 2 sessions
├── 03 Avernus/                # Arc 3 sessions (current)
│
├── characters/                # Character sheets and quests
│   ├── Kalmaris/
│   │   ├── Kalmaris.md
│   │   └── Avernus_Quest.md
│   ├── [other characters...]
│
├── item/                      # Magical items (HTML files)
├── player-handouts/           # Generated handouts
├── wiki-output/               # Generated wiki site
│
└── dnd-n8n-features/         # This documentation
    ├── README.md              # This file
    └── quest-story/           # Feature specifications
```

---

## 📊 Implementation Metrics

### Success Criteria

**Time Savings**:
- Session documentation: 30+ minutes saved per session
- Handout creation: 15+ minutes saved per handout
- Quest tracking: No forgotten storylines
- NPC management: Instant reference lookup

**Quality Improvements**:
- Consistent voice in summaries (matches Milo's narrative)
- Professional-looking handouts and wiki
- No accidental spoilers to players
- Complete campaign documentation

**Player Engagement**:
- Players read recaps before sessions
- Regular wiki reference during play
- Better understanding of complex storylines
- Increased immersion through quality handouts

### Key Performance Indicators (KPIs)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Summary generation time | < 60 seconds | n8n workflow execution time |
| Summary accuracy | 90%+ | DM manual review rating |
| Wiki page count | 100+ | Generated HTML files |
| Quest tracking completeness | 100% | Zero forgotten quests |
| Player handout usage | 80%+ | Read receipts / player feedback |
| Spoiler prevention | 100% | Zero accidental reveals |

---

## 🎨 Design Principles

### Campaign-Specific Styling

All generated content follows consistent branding:

**Colors**:
- Parchment Light: `#f9f1e6`
- Parchment Dark: `#f0e6d2`
- Brown Primary: `#8b4513`
- Brown Secondary: `#a0522d`
- Gold Accent: `#d4af37`

**Typography**:
- Headings: `Cinzel` (serif, fantasy-style)
- Body: `Crimson Text` (serif, readable)

**Theme**:
- Fantasy/medieval aesthetic
- Parchment backgrounds
- Gold and brown accents
- Professional yet immersive

### Voice & Tone

**Milo's Narrative Voice** (for summaries and Campaign.md):
- First-person plural ("wir", "unsere")
- Enthusiastic and curious
- Affectionate descriptions of companions
- Scientific observations mixed with adventure
- Occasional self-deprecating humor
- Emphasis on friendship and loyalty

**Player Handouts**:
- Clear and professional
- Spoiler-free
- Informative without meta-gaming
- Immersive in-world perspective

**DM Tools** (dashboards, timelines):
- Functional and efficient
- Data-dense but organized
- Quick reference focused
- Visual when helpful

---

## 🔗 Feature Interconnections

These features work together as an integrated system:

```
Session Summary Generator
    ├─→ Feeds Timeline Generation (events extracted)
    ├─→ Updates Quest Dashboard (quest progress)
    ├─→ Updates NPC Mapper (NPC mentions)
    └─→ Creates Player Handouts (recap basis)

Quest Dashboard
    ├─→ Links to Timeline (quest milestones)
    ├─→ Links to NPCs (quest givers)
    └─→ Feeds Wiki (quest pages)

NPC Relationship Mapper
    ├─→ Links to Timeline (NPC first appearances)
    ├─→ Links to Quests (quest givers)
    └─→ Feeds Wiki (NPC network page)

Timeline
    ├─→ Referenced by all features
    └─→ Feeds Wiki (timeline page)

Wiki Generator
    ├─→ Aggregates all generated content
    ├─→ Links everything together
    └─→ Provides unified interface

Player Handout Generator
    ├─→ Uses Session Summaries
    ├─→ Uses Quest Data
    └─→ Uses NPC Information
```

---

## 📝 Configuration Templates

### Global Configuration (config.json)

```json
{
  "campaign": {
    "name": "Milo Quicksparks Abenteuerlogbuch",
    "language": "de",
    "currentArc": "Avernus",
    "currentDay": 145,
    "characters": [
      "Kalmaris", "Lamil", "Longjohn",
      "Lufnik", "Milo", "Serox"
    ]
  },
  "paths": {
    "campaignRoot": "/mnt/c/Users/morde/OneDrive/Dokumente/workspace/DnD/DnD",
    "sessionNotes": ["01 Deep Underground", "02 Baldurs Gate", "03 Avernus"],
    "characters": "characters",
    "outputDir": "generated"
  },
  "ai": {
    "provider": "anthropic",
    "model": "claude-3-5-sonnet-20241022",
    "apiKey": "${ANTHROPIC_API_KEY}"
  },
  "notifications": {
    "discord": {
      "enabled": true,
      "webhookUrl": "${DISCORD_WEBHOOK}"
    },
    "email": {
      "enabled": false,
      "recipients": []
    }
  },
  "git": {
    "autoCommit": true,
    "commitMessage": "Auto-update: {feature} - {timestamp}"
  }
}
```

### Feature-Specific Configs

Each feature has its own configuration file referenced in its documentation. See individual feature `.md` files for details.

---

## 🧪 Testing Strategy

### Unit Testing

Each feature workflow should be tested independently:

1. **Input Validation**: Test with various markdown formats
2. **Parser Accuracy**: Verify extraction of all key data
3. **Output Quality**: Check generated content meets standards
4. **Error Handling**: Ensure graceful failures with clear logs

### Integration Testing

Test features working together:

1. **Data Flow**: Session summary → Timeline/Quest/NPC updates
2. **Link Integrity**: All cross-references work correctly
3. **Version Control**: Git commits don't conflict
4. **Performance**: Multiple features running simultaneously

### User Acceptance Testing

DM and players validate:

1. **Accuracy**: AI summaries capture session correctly
2. **Usability**: Wiki and dashboards are intuitive
3. **No Spoilers**: Player handouts are truly spoiler-free
4. **Value**: Features save time and improve experience

---

## 🛠️ Troubleshooting

### Common Issues

**AI API Rate Limits**:
- Solution: Add rate limiting to n8n workflows
- Solution: Use caching for repeated requests
- Solution: Batch process multiple items

**German Character Encoding**:
- Ensure UTF-8 encoding in all file operations
- Test ä, ö, ü, ß in PDFs and HTML
- Verify email transmission preserves encoding

**File Watch Performance**:
- Use debouncing (wait 10s after last change)
- Ignore `.git` and `node_modules` directories
- Watch specific file extensions only (`.md`, `.html`)

**Git Merge Conflicts**:
- Auto-generated files should be in separate commits
- Add `[skip ci]` to auto-commit messages
- Consider separate branch for generated content

---

## 📚 Additional Resources

### n8n Documentation
- [n8n Docs](https://docs.n8n.io/)
- [AI Nodes](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain/)
- [File Operations](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.filesreadwrite/)

### Libraries & Tools
- [markdown-it](https://github.com/markdown-it/markdown-it) - Markdown parser
- [mermaid.js](https://mermaid.js.org/) - Diagram generation
- [timeline.js](https://timeline.knightlab.com/) - Timeline visualization
- [vis.js](https://visjs.org/) - Network graphs
- [puppeteer](https://pptr.dev/) - PDF generation

### Campaign Context
- See [CLAUDE.md](../CLAUDE.md) for repository overview
- See [Campaign.md](../Campaign.md) for full campaign history
- See [dnd-n8n-features.md](../dnd-n8n-features.md) for complete feature list (all 33 features)

---

## 🎯 Next Steps

### Immediate Actions

1. **Set up n8n**:
   - Install n8n locally or sign up for n8n Cloud
   - Configure API keys (Anthropic/OpenAI)
   - Test basic file reading from campaign directory

2. **Start with Session Summary Generator**:
   - Highest immediate value
   - Required for many other features
   - Tests AI integration early

3. **Create Manual Templates**:
   - Design session recap template
   - Design NPC card template
   - Design quest brief template

4. **Build MVP Workflows**:
   - Manual trigger workflows first
   - Test with single session/NPC
   - Validate output quality

### Long-term Roadmap

**Month 1**: Core features operational (Summary, Quest Dashboard, Handouts)
**Month 2**: Enhanced features added (Timeline, Wiki generation)
**Month 3**: Advanced features and polish (NPC Mapper, integrations)
**Ongoing**: Refinement based on actual usage and feedback

---

## 🤝 Contributing

This is a personal campaign project, but the feature specifications and n8n workflows could be useful for other DMs. Feel free to:

- Adapt features for your own campaigns
- Suggest improvements or additional features
- Share your n8n workflow implementations
- Report issues or unclear documentation

---

## 📄 License

Campaign content: Personal/Private
Feature documentation and n8n workflows: MIT License (if shared)

---

## ✨ Acknowledgments

- **Campaign**: Run by DM using Descent into Avernus and custom content
- **Players**: Kalmaris, Lamil, Longjohn, Lufnik, Milo, Serox
- **Tools**: n8n, Claude AI, D&D 5e

---

*Last Updated: 2025-11-05*
*Campaign Day: 145 - Avernus Arc - Fort Knucklebone*
*Documentation Version: 1.0*
