# Implementation Plan: Quest & Story Features

**Quick Reference Guide for Getting Started**

---

## 📦 What Was Created

A comprehensive feature documentation system for automating your D&D campaign with n8n workflows, focused on Quest & Story management.

### Directory Structure

```
dnd-n8n-features/
├── README.md                          # Master overview and guide
├── IMPLEMENTATION-PLAN.md             # This file - quick start
│
├── quest-story/                       # Quest & Story features
│   ├── 01-automatic-timeline-generation.md
│   ├── 02-quest-progress-dashboard.md
│   ├── 03-npc-relationship-mapper.md
│   ├── 04-session-summary-generator.md
│   ├── 05-auto-wiki-generator.md
│   └── 06-player-handout-generator.md
│
├── content-generation/                # (Empty - for future features)
├── analytics/                         # (Empty - for future features)
└── file-management/                   # (Empty - for future features)
```

---

## 🎯 6 Core Features Documented

### 1. **Automatic Timeline Generation** (High Priority)
- **What**: Creates visual timeline of all 145+ days of campaign events
- **Input**: Session markdown files, Campaign.md
- **Output**: Timeline.md + Timeline.html (interactive)
- **Time Savings**: Instant reference vs manual searching
- **File**: [01-automatic-timeline-generation.md](quest-story/01-automatic-timeline-generation.md)

### 2. **Quest Progress Dashboard** (High Priority)
- **What**: Tracks all active quests with progress percentages
- **Input**: Character quest files, session notes
- **Output**: Quest-Dashboard.md + HTML dashboard with progress bars
- **Time Savings**: Never forget a quest thread again
- **File**: [02-quest-progress-dashboard.md](quest-story/02-quest-progress-dashboard.md)

### 3. **NPC Relationship Mapper** (Medium Priority)
- **What**: Visualizes complex NPC relationships and faction networks
- **Input**: All campaign files with NPC mentions
- **Output**: Mermaid diagrams + interactive network graph
- **Time Savings**: Instant understanding of social dynamics
- **File**: [03-npc-relationship-mapper.md](quest-story/03-npc-relationship-mapper.md)

### 4. **Session Summary Generator** (High Priority)
- **What**: AI-powered session summaries in Milo's voice
- **Input**: Raw session notes
- **Output**: Polished summaries for Campaign.md + player recaps
- **Time Savings**: 30+ minutes per session
- **File**: [04-session-summary-generator.md](quest-story/04-session-summary-generator.md)

### 5. **Auto-Generate HTML Campaign Wiki** (High Priority)
- **What**: Converts all markdown to searchable website
- **Input**: All campaign files
- **Output**: Complete static website with navigation + search
- **Time Savings**: Professional reference for players + DM
- **File**: [05-auto-wiki-generator.md](quest-story/05-auto-wiki-generator.md)

### 6. **Player Handout Generator** (Medium Priority)
- **What**: Creates spoiler-free handouts from DM notes
- **Input**: DM notes with secret markers
- **Output**: PDF/HTML handouts with secrets removed
- **Time Savings**: 15+ minutes per handout + zero spoilers
- **File**: [06-player-handout-generator.md](quest-story/06-player-handout-generator.md)

---

## 🚀 Getting Started (Step by Step)

### Week 1: Setup & First Feature

**Day 1-2: Environment Setup**
1. Install n8n (self-hosted or cloud)
   ```bash
   npx n8n
   # OR sign up at https://n8n.io/
   ```

2. Get API Keys
   - Anthropic Claude: https://console.anthropic.com/
   - OR OpenAI: https://platform.openai.com/

3. Test n8n file access
   - Create simple workflow reading Campaign.md
   - Verify file paths work correctly

**Day 3-5: Session Summary Generator**
- Start here because it provides immediate value
- Read: [04-session-summary-generator.md](quest-story/04-session-summary-generator.md)
- Build basic workflow:
  1. Manual trigger
  2. Read session file
  3. Send to Claude API with Milo voice prompt
  4. Save summary to file
- Test with one recent session (e.g., Fort Knucklebone)

**Day 6-7: Refine & Automate**
- Add email distribution to players
- Set up Discord webhook posting
- Create scheduled trigger (after weekly session)

### Week 2: Quest & Timeline Features

**Day 8-10: Quest Progress Dashboard**
- Read: [02-quest-progress-dashboard.md](quest-story/02-quest-progress-dashboard.md)
- Manually create quest files for each character
- Build parser workflow to read quest files
- Generate initial dashboard

**Day 11-14: Timeline Generation**
- Read: [01-automatic-timeline-generation.md](quest-story/01-automatic-timeline-generation.md)
- Extract dates from Campaign.md
- Parse session files for events
- Generate timeline markdown
- (HTML visualization is Phase 2)

### Week 3: Player Tools

**Day 15-17: Player Handout Generator**
- Read: [06-player-handout-generator.md](quest-story/06-player-handout-generator.md)
- Mark secrets in existing notes with [DM: ] tags
- Build secret removal workflow
- Generate PDF handouts with fantasy styling
- Test with session recap + NPC card

**Day 18-21: Wiki Generator Setup**
- Read: [05-auto-wiki-generator.md](quest-story/05-auto-wiki-generator.md)
- Start with basic markdown → HTML conversion
- Create simple page template
- Generate homepage + a few test pages
- Full wiki is a longer project (continue in Month 2)

### Week 4: Polish & Integration

**Day 22-25: NPC Relationship Mapper**
- Read: [03-npc-relationship-mapper.md](quest-story/03-npc-relationship-mapper.md)
- Create master NPC list
- Define key relationships manually first
- Build basic mermaid diagram generator
- Interactive graph is Phase 2

**Day 26-28: Integration & Testing**
- Connect features together (summaries → timeline, quests)
- Test all workflows with recent sessions
- Train players to use wiki and handouts
- Gather feedback

---

## 📝 Each Feature Document Contains

Every `.md` file in `quest-story/` includes:

✅ **Overview** - What the feature does
✅ **User Story** - Why you need it
✅ **Requirements** - Must-haves, should-haves, nice-to-haves
✅ **Story Integration Points** - How it fits your current campaign
✅ **Technical Implementation** - Detailed n8n workflow steps
✅ **Dependencies** - What you need to install
✅ **Testing Criteria** - How to verify it works
✅ **Success Metrics** - How to measure value
✅ **Configuration Examples** - Ready-to-use JSON configs
✅ **Campaign-Specific Details** - Tailored to your Avernus campaign

---

## 🎨 Consistent Design System

All features follow the same visual style:

**Colors**:
- Parchment backgrounds: `#f9f1e6`, `#f0e6d2`
- Brown accents: `#8b4513`, `#a0522d`
- Gold highlights: `#d4af37`

**Fonts**:
- Headings: Cinzel (fantasy serif)
- Body: Crimson Text (readable serif)

**Style**:
- Fantasy/medieval D&D aesthetic
- Professional but immersive
- Matches your existing `item-creator.html` style

---

## 💡 Pro Tips

### For DMs

1. **Start Small**: Don't try to build all 6 features at once
2. **Manual First**: Create templates manually before automating
3. **Iterate**: Get one feature working, then improve it
4. **Player Feedback**: Ask players which features they'd use most
5. **Secret Markers**: Retroactively add [DM: ] tags to existing notes

### For n8n Workflows

1. **Use Executions Tab**: Debug workflows by checking execution logs
2. **Test with Sample Data**: Start with one session/NPC before processing all
3. **Error Handling**: Add error notification nodes to catch failures
4. **Backup First**: Always backup before running file-modifying workflows
5. **Git Commits**: Let workflows auto-commit so you can rollback

### For AI Integration

1. **System Prompts**: Detailed prompts = better output (examples provided)
2. **Temperature**: 0.3-0.5 for consistency, 0.7-0.9 for creativity
3. **Context Window**: Include previous session for context continuity
4. **Cost Control**: Cache repeated prompts, batch similar requests
5. **Fallbacks**: Have manual process if API is down

---

## 📊 Success Metrics (Month 1)

Track these to measure value:

- [ ] Session summaries generated for last 4 sessions
- [ ] Quest dashboard shows all 7 active quests
- [ ] Timeline contains 145+ days of events
- [ ] 10+ player handouts created and distributed
- [ ] Wiki has at least 20 pages
- [ ] Time saved: 2+ hours per week

**Target**: By end of Month 1, workflows save you more time than they took to build.

---

## 🔗 Related Files

- **Campaign Context**: [../CLAUDE.md](../CLAUDE.md)
- **Campaign History**: [../Campaign.md](../Campaign.md)
- **Complete Feature List**: [../dnd-n8n-features.md](../dnd-n8n-features.md) (all 33 features)
- **Master Guide**: [README.md](README.md)

---

## 🆘 Need Help?

### Troubleshooting Resources

1. **n8n Community**: https://community.n8n.io/
2. **n8n Documentation**: https://docs.n8n.io/
3. **Claude API Docs**: https://docs.anthropic.com/
4. **Markdown Spec**: https://commonmark.org/

### Common Issues

**"n8n can't read my files"**
- Check file path is absolute
- Verify n8n has read permissions
- Test with simple workflow first

**"AI summaries don't match Milo's voice"**
- Add more examples to prompt
- Include excerpts from Campaign.md as reference
- Adjust temperature (try 0.5)

**"PDF generation fails"**
- Install puppeteer dependencies
- Check HTML renders correctly first
- Verify font files are accessible

**"Too slow to process all files"**
- Use file watcher instead of batch processing
- Only process changed files
- Add caching for AI responses

---

## 🎯 Your First Task

**Right Now**: Choose which feature to build first

**Recommendation**: Session Summary Generator
- Immediate value (saves time THIS WEEK)
- Tests AI integration
- Feeds other features (timeline, quests, wiki)
- Easiest to verify quality

**Alternative**: Quest Progress Dashboard
- Lower complexity (no AI needed)
- Clear immediate benefit (track storylines)
- Good for learning n8n workflows

---

## ✨ Vision: Month 3

Imagine this setup:

**Sunday evening after session**:
1. Save your raw session notes
2. n8n auto-generates polished summary in Milo's voice
3. Timeline updates with new events
4. Quest dashboard marks objectives completed
5. NPC relationship map adds new characters
6. Wiki regenerates with new session page
7. Player handout PDFs emailed to all players
8. Discord notification: "Session 146 recap posted!"

**All automatic. Zero manual work.**

That's the goal. Let's build it step by step.

---

## 📅 Next Actions

- [ ] Install n8n and get API keys
- [ ] Read Session Summary Generator doc
- [ ] Build first workflow (manual summary generation)
- [ ] Test with one session
- [ ] Share handout with players for feedback

**Start here**: [04-session-summary-generator.md](quest-story/04-session-summary-generator.md)

---

*Good luck, and may your campaign documentation be as epic as your adventures!*

🎲 **Happy Automating!** 🎲
