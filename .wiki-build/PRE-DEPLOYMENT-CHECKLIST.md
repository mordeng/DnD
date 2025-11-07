# 📋 Pre-Deployment Checklist

**Before pushing to production**, complete this checklist to ensure quality.

**Date**: ___________
**Tester**: ___________
**Build Version**: ___________

---

## ⚙️ Automated Tests

- [ ] **Build completes without errors**
  ```bash
  cd .wiki-build && npm run build
  ```
  - Build time: _______ seconds
  - Errors: ☐ None ☐ See notes

- [ ] **All automated tests pass**
  ```bash
  npm test
  ```
  - Grade: _______ / 100
  - Failed tests: ☐ None ☐ See notes
  - Warnings: ☐ None ☐ See notes

---

## 🏠 Homepage (`/index.html`)

Visit: http://localhost:8080 (or deployed URL)

- [ ] Page loads without errors
- [ ] Hero section displays:
  - [ ] Campaign title correct
  - [ ] Current day: _______ (verify it's correct)
  - [ ] Current arc: _______ (verify it's correct)
  - [ ] Current location: _______ (verify it's correct)
- [ ] Statistics are accurate:
  - [ ] Days traveled: _______
  - [ ] Sessions count: _______
  - [ ] Story arcs: _______
  - [ ] Heroes count: 6
- [ ] Recent Updates section shows latest content
- [ ] Quick Links grid (6 cards):
  - [ ] Timeline
  - [ ] Characters
  - [ ] Locations
  - [ ] Quests
  - [ ] Sessions
  - [ ] Items
- [ ] Party roster shows all 6 characters
- [ ] All links are clickable and work

---

## 👥 Character Pages

**Test 2 random characters** (e.g., Kalmaris, Milo):

### Character 1: ___________

- [ ] Page loads at `/characters/[name].html`
- [ ] Portrait/image displays (if present)
- [ ] Name and title correct
- [ ] Stats displayed:
  - [ ] Class: _______
  - [ ] Race: _______
  - [ ] Level: _______
  - [ ] Status: Active/Retired/Deceased
- [ ] Content is readable and formatted
- [ ] Personal quest listed (if applicable)
- [ ] "Mentioned in" section has backlinks
- [ ] Related pages are shown
- [ ] Navigation works (sidebar/breadcrumbs)

### Character 2: ___________

- [ ] (Repeat same checks)

---

## 📖 Session Pages

**Test 3 sessions** (one from each arc):

### Arc 1 Session: ___________
- [ ] Page loads correctly
- [ ] Day/date information correct
- [ ] Arc shown in breadcrumbs
- [ ] Content fully rendered
- [ ] Images load (if present)
- [ ] Internal links work (test 2-3)
- [ ] Previous/Next navigation present

### Arc 2 Session: ___________
- [ ] (Repeat same checks)

### Arc 3 Session: ___________
- [ ] (Repeat same checks)

---

## 🔍 Search Functionality

- [ ] Search overlay opens with:
  - [ ] Click on search icon
  - [ ] Keyboard: Cmd/Ctrl + K
- [ ] Typing shows instant results
- [ ] Results are grouped by type:
  - [ ] Characters
  - [ ] Sessions
  - [ ] Locations
  - [ ] Quests
  - [ ] Items
- [ ] Search query is highlighted in results
- [ ] Clicking result navigates to page
- [ ] Search works with:
  - [ ] Character names (try: "Kalmaris")
  - [ ] Location names (try: "Avernus")
  - [ ] General terms (try: "quest")
- [ ] "No results" state shows for invalid queries
- [ ] Close with Escape key

---

## 🎨 Theme & Visual

### Light Mode (Default)
- [ ] Parchment background visible
- [ ] Brown/gold color scheme correct
- [ ] Text is readable (good contrast)
- [ ] Fonts load correctly:
  - [ ] Headers: Cinzel
  - [ ] Body: Crimson Text
- [ ] No visual glitches or overlaps

### Dark Mode
- [ ] Toggle button works (moon/sun icon)
- [ ] Dark theme applies:
  - [ ] Dark background
  - [ ] Light text
  - [ ] Adjusted accent colors
- [ ] All content is readable
- [ ] Images/icons remain visible
- [ ] Preference saved (reload page to verify)
- [ ] No flash of light theme on load

---

## 👁️ DM Mode

- [ ] Toggle button visible (eye icon + "DM")
- [ ] Click toggles mode on/off
- [ ] When ON:
  - [ ] DM-only content appears
  - [ ] Visual indicator shows mode is active
- [ ] When OFF:
  - [ ] DM-only content hidden
  - [ ] No spoilers visible
- [ ] State persists during browsing session
- [ ] (Optional) Test with a page that has DM content

---

## 📱 Mobile Responsiveness

**Test on mobile device OR resize browser to 375px width**

### Mobile Menu
- [ ] Hamburger icon appears (≡)
- [ ] Clicking opens navigation menu
- [ ] Menu is usable (all links accessible)
- [ ] Close button works

### Layout
- [ ] No horizontal scrolling
- [ ] Text is readable (not too small)
- [ ] Cards stack vertically
- [ ] Images scale appropriately
- [ ] Buttons are tappable (minimum 44x44px)

### Features
- [ ] Search overlay works on mobile
- [ ] Dark mode toggle works
- [ ] DM mode toggle works
- [ ] Navigation between pages works

---

## 🧭 Navigation

- [ ] Main header navigation works (all links)
- [ ] Breadcrumbs show correct path
- [ ] Sidebar navigation:
  - [ ] Tree structure visible
  - [ ] Expandable sections work
  - [ ] Links navigate correctly
- [ ] Footer links work
- [ ] Category index pages exist:
  - [ ] `/characters/`
  - [ ] `/sessions/`
  - [ ] `/locations/`
  - [ ] `/quests/`
  - [ ] `/items/`

---

## ✅ Content Accuracy Spot Checks

### Character Data
Verify these are correct:

- [ ] **Kalmaris**: Aarakocra Bard, Level 10
- [ ] **Lamil**: Druid (Wildfire Circle)
- [ ] **Longjohn**: (verify class/details)
- [ ] **Lufnik**: (verify class/details)
- [ ] **Milo**: Gnome Alchemist
- [ ] **Serox**: (verify class/details)

### Timeline Accuracy
Key events are correct:

- [ ] **Day 1**: Moreva shipwreck
- [ ] **Day 67**: End of Arc 1
- [ ] **Day 68**: Baldur's Gate arrival
- [ ] **Day 134**: End of Arc 2
- [ ] **Day 135+**: Avernus begins

### Current Status
- [ ] Current day matches reality: _______
- [ ] Current arc correct: _______
- [ ] Current location correct: _______

---

## 🌐 Cross-Browser Testing

**Test in at least 2 browsers:**

### Browser 1: ___________
- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] Search works
- [ ] Dark mode toggle works
- [ ] CSS renders correctly
- [ ] JavaScript features work

### Browser 2: ___________
- [ ] (Repeat same checks)

---

## 🚀 Performance

- [ ] Homepage loads in < 2 seconds
- [ ] Search responds in < 100ms
- [ ] Navigation is snappy (no lag)
- [ ] Images load progressively
- [ ] No console errors in DevTools

**Optional: Run Lighthouse audit**
- Performance: _______ / 100
- Accessibility: _______ / 100
- Best Practices: _______ / 100
- SEO: _______ / 100

---

## 📝 Notes & Issues

**Issues Found**:
1. ___________________________________________
2. ___________________________________________
3. ___________________________________________

**Things to Fix Before Deployment**:
- [ ] ___________________________________________
- [ ] ___________________________________________
- [ ] ___________________________________________

---

## ✅ Final Approval

- [ ] All critical tests passed
- [ ] No blocking issues found
- [ ] Performance is acceptable
- [ ] Ready for deployment

**Sign-off**: ___________
**Date**: ___________

---

## 🚀 Deployment

Once approved, deploy with:

```bash
git add .
git commit -m "Update wiki content"
git push origin main
```

**Post-Deployment Verification**:
- [ ] Visit: https://mordeng.github.io/DnD/
- [ ] Verify homepage loads
- [ ] Test search
- [ ] Check 3 random pages
- [ ] Confirm GitHub Actions succeeded

---

**Happy Testing!** 🎲
