# Debugging Guide for Patterns Game

## Current Issue: Game Hangs on Hexagon Collection

### Problem Description
When the player collects the first hexagon (framework tool), the game stops responding. The modal should appear but doesn't, leaving the game in a paused state.

### Root Cause Analysis

The issue occurs in the tool collection flow:

1. **Player collects hexagon** → `handleCollisions()` in Game.js
2. **Game pauses** → `this.state = 'paused'`
3. **Modal should show** → `interactiveLearningSystem.showFramework()`
4. **If modal fails** → Game stays paused forever (HANG)

### Added Safety Mechanisms

#### 1. Comprehensive Error Handling
- **InteractiveLearningSystem.js**: Try-catch blocks with detailed logging
- **Game.js**: Try-catch blocks with automatic game resume on error
- **Safety timeout**: 30-second timeout forces game resume if modal doesn't respond

#### 2. Detailed Console Logging
All critical operations now log with prefixes:
- `[Game]` - Game.js operations
- `[InteractiveLearningSystem]` - Modal system operations

### How to Debug

#### Step 1: Open Browser Console
1. Open the game in browser
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Clear console (trash icon)

#### Step 2: Collect First Hexagon
Watch for these log messages in order:

```
[Game] Collecting tool: Marginal Thinking, slot: 0
[Game] Tool ID: marginal_thinking
[Game] Tool added: true
[Game] Game paused, showing framework modal for: marginal_thinking
[InteractiveLearningSystem] showFramework called with: marginal_thinking
[InteractiveLearningSystem] Creating modal for first time (if first time)
[InteractiveLearningSystem] Framework found: 🎯 Marginal Thinking
[InteractiveLearningSystem] Modal overlay shown
[InteractiveLearningSystem] First step rendered
```

#### Step 3: Identify Where It Fails

**If you see:**
- ❌ `Framework not found: marginal_thinking`
  - **Problem**: Framework ID mismatch
  - **Solution**: Check framework IDs in InteractiveLearningSystem.js line 66-450

- ❌ `Modal elements not created properly`
  - **Problem**: DOM creation failed
  - **Solution**: Check if modal HTML is being created correctly

- ❌ `Error in showFramework: [error message]`
  - **Problem**: JavaScript exception
  - **Solution**: Read the error message and stack trace

- ❌ `Modal timeout - forcing game resume`
  - **Problem**: Modal took >30 seconds (shouldn't happen)
  - **Solution**: Check for infinite loops or blocking operations

**If you see nothing after "Game paused":**
- **Problem**: `showFramework()` is not being called
- **Solution**: Check if `interactiveLearningSystem` is initialized

### Common Issues and Solutions

#### Issue 1: Framework ID Mismatch
**Symptom**: Console shows "Framework not found"

**Check**:
1. Tool name in Collectible.js (e.g., "Marginal Thinking")
2. Conversion in Game.js: `toolName.toLowerCase().replace(/ /g, '_')`
3. Framework key in InteractiveLearningSystem.js (must match exactly)

**Example**:
- Tool name: "Marginal Thinking"
- After conversion: "marginal_thinking"
- Framework key: Must be "marginal_thinking" (not "marginalThinking" or "marginal-thinking")

#### Issue 2: Modal Not Appearing
**Symptom**: Console shows success messages but no modal visible

**Check**:
1. CSS file loaded: `css/interactive-learning.css`
2. Modal overlay has class `hidden` removed
3. Z-index is high enough (should be 10000)
4. No CSS conflicts hiding the modal

**Test**: In console, run:
```javascript
document.getElementById('interactive-learning-overlay').classList.remove('hidden');
```

#### Issue 3: Modal Buttons Not Working
**Symptom**: Modal appears but clicking buttons does nothing

**Check**:
1. Event listeners attached in `createModal()`
2. Button IDs match: `prev-btn`, `next-btn`
3. No JavaScript errors when clicking

### Emergency Recovery

If game is stuck, open console and run:
```javascript
// Force resume game
game.state = 'playing';
```

### Testing Checklist

Before reporting "game hangs", verify:
- [ ] Browser console is open
- [ ] All console messages are captured
- [ ] Error messages (if any) are noted
- [ ] Network tab shows all files loaded (no 404s)
- [ ] No JavaScript errors before collecting hexagon
- [ ] Modal CSS file is loaded

### Expected Behavior

**Correct Flow**:
1. Player touches hexagon
2. Game pauses (player stops moving)
3. Modal appears with framework title
4. User reads content and clicks through 4 steps
5. User completes text validation
6. Modal closes
7. Game resumes (player can move again)
8. Mastery notification appears

**Total time**: 1-3 minutes per framework

### Performance Notes

- Modal creation happens on first use (lazy initialization)
- Subsequent modals reuse the same DOM elements
- No memory leaks - modal is hidden, not destroyed
- Game loop continues running (rendering only)

### File Locations

Key files for debugging:
- `patterns-game/js/engine/Game.js` - Lines 633-680 (tool collection)
- `patterns-game/js/systems/InteractiveLearningSystem.js` - Lines 453-520 (showFramework)
- `patterns-game/css/interactive-learning.css` - Modal styling
- `patterns-game/index.html` - Line 120 (script include)

### Contact

If issue persists after following this guide:
1. Copy ALL console output
2. Note which hexagon was collected
3. Note browser and version
4. Report with full details

---

**Last Updated**: 2026-03-27
**Version**: 1.0