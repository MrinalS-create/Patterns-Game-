/**
 * TutorialSystem.js - Provides contextual hints and tutorials
 */

class TutorialSystem {
    constructor() {
        // DISABLED: Tutorial hints are annoying
        this.enabled = false;
        this.hints = [];
        this.currentHint = null;
        this.hintElement = document.getElementById('tutorial-hint');
        this.hintText = this.hintElement?.querySelector('.hint-text');
        this.hintTimeout = null;
        
        // Hide hint element immediately
        if (this.hintElement) {
            this.hintElement.style.display = 'none';
        }
        
        // Tutorial state
        this.tutorialState = {
            hasMovedLeft: false,
            hasMovedRight: false,
            hasJumped: false,
            hasDoubleJumped: false,
            hasCollectedTool: false,
            hasDefeatedEnemy: false,
            hasCollectedEvidence: false,
            hasUsedTool: false,
            hasReachedGoal: false
        };
        
        // Load tutorial progress
        this.loadProgress();
        
        // Define tutorial sequence
        this.tutorialSequence = [
            {
                id: 'welcome',
                condition: () => true,
                delay: 1000,
                duration: 4000,
                text: 'Welcome! Use Arrow Keys or WASD to move, Space to jump',
                once: true
            },
            {
                id: 'movement',
                condition: () => !this.tutorialState.hasMovedRight,
                delay: 5000,
                duration: 3000,
                text: 'Try moving right with → or D',
                once: true
            },
            {
                id: 'jump',
                condition: () => this.tutorialState.hasMovedRight && !this.tutorialState.hasJumped,
                delay: 2000,
                duration: 3000,
                text: 'Press Space to jump!',
                once: true
            },
            {
                id: 'doubleJump',
                condition: () => this.tutorialState.hasJumped && !this.tutorialState.hasDoubleJumped,
                delay: 3000,
                duration: 3000,
                text: 'Press Space again in mid-air for a double jump!',
                once: true
            },
            {
                id: 'collectTool',
                condition: () => !this.tutorialState.hasCollectedTool,
                delay: 8000,
                duration: 4000,
                text: 'Collect the hexagon tool (EDT Lens) to gain new abilities!',
                once: true
            },
            {
                id: 'defeatEnemy',
                condition: () => !this.tutorialState.hasDefeatedEnemy,
                delay: 12000,
                duration: 4000,
                text: 'Jump on purple enemies from above to defeat them!',
                once: true
            },
            {
                id: 'useTool',
                condition: () => this.tutorialState.hasCollectedTool && !this.tutorialState.hasUsedTool,
                delay: 3000,
                duration: 4000,
                text: 'Press E to use your EDT Lens tool!',
                once: true
            },
            {
                id: 'reachGoal',
                condition: () => this.tutorialState.hasDefeatedEnemy && !this.tutorialState.hasReachedGoal,
                delay: 5000,
                duration: 4000,
                text: 'Find the green door to complete the level!',
                once: true
            }
        ];
        
        this.shownHints = new Set();
    }
    
    /**
     * Update tutorial system (DISABLED)
     */
    update(deltaTime, gameState) {
        if (!this.enabled) return;
        
        // Check for tutorial triggers
        this.checkTutorialTriggers(gameState);
        
        // Process hint queue
        if (this.hints.length > 0 && !this.currentHint) {
            this.showNextHint();
        }
    }
    
    /**
     * Check tutorial triggers based on game state
     */
    checkTutorialTriggers(gameState) {
        for (const tutorial of this.tutorialSequence) {
            // Skip if already shown and marked as once
            if (tutorial.once && this.shownHints.has(tutorial.id)) {
                continue;
            }
            
            // Check condition
            if (tutorial.condition()) {
                // Add to queue with delay
                if (!this.hints.find(h => h.id === tutorial.id)) {
                    setTimeout(() => {
                        if (!this.shownHints.has(tutorial.id)) {
                            this.queueHint(tutorial.id, tutorial.text, tutorial.duration);
                        }
                    }, tutorial.delay);
                }
            }
        }
    }
    
    /**
     * Queue a hint to be shown
     */
    queueHint(id, text, duration = 3000) {
        if (!this.shownHints.has(id)) {
            this.hints.push({ id, text, duration });
        }
    }
    
    /**
     * Show next hint in queue
     */
    showNextHint() {
        if (this.hints.length === 0) return;
        
        const hint = this.hints.shift();
        this.currentHint = hint;
        this.shownHints.add(hint.id);
        
        // Display hint
        if (this.hintText) {
            this.hintText.textContent = hint.text;
        }
        if (this.hintElement) {
            this.hintElement.classList.remove('hidden');
        }
        
        // Auto-hide after duration
        this.hintTimeout = setTimeout(() => {
            this.hideHint();
        }, hint.duration);
    }
    
    /**
     * Hide current hint
     */
    hideHint() {
        if (this.hintElement) {
            this.hintElement.classList.add('hidden');
        }
        this.currentHint = null;
        
        if (this.hintTimeout) {
            clearTimeout(this.hintTimeout);
            this.hintTimeout = null;
        }
    }
    
    /**
     * Trigger tutorial event
     */
    triggerEvent(eventName) {
        switch (eventName) {
            case 'movedLeft':
                this.tutorialState.hasMovedLeft = true;
                break;
            case 'movedRight':
                this.tutorialState.hasMovedRight = true;
                break;
            case 'jumped':
                this.tutorialState.hasJumped = true;
                break;
            case 'doubleJumped':
                this.tutorialState.hasDoubleJumped = true;
                break;
            case 'collectedTool':
                this.tutorialState.hasCollectedTool = true;
                this.queueHint('toolCollected', 'Great! You collected the EDT Lens. Press E to use it!', 3000);
                break;
            case 'defeatedEnemy':
                this.tutorialState.hasDefeatedEnemy = true;
                this.queueHint('enemyDefeated', 'Nice! Keep jumping on enemies to defeat them!', 2500);
                break;
            case 'collectedEvidence':
                this.tutorialState.hasCollectedEvidence = true;
                break;
            case 'usedTool':
                this.tutorialState.hasUsedTool = true;
                this.queueHint('toolUsed', 'Tools consume energy but provide powerful abilities!', 3000);
                break;
            case 'reachedGoal':
                this.tutorialState.hasReachedGoal = true;
                break;
            case 'tookDamage':
                if (!this.shownHints.has('tookDamage')) {
                    this.queueHint('tookDamage', 'Watch out! Avoid touching enemies from the side!', 2500);
                }
                break;
        }
        
        this.saveProgress();
    }
    
    /**
     * Show immediate hint (bypasses queue)
     */
    showImmediateHint(text, duration = 3000) {
        // Clear current hint
        this.hideHint();
        
        // Show new hint
        if (this.hintText) {
            this.hintText.textContent = text;
        }
        if (this.hintElement) {
            this.hintElement.classList.remove('hidden');
        }
        
        // Auto-hide
        this.hintTimeout = setTimeout(() => {
            this.hideHint();
        }, duration);
    }
    
    /**
     * Reset tutorial progress
     */
    reset() {
        this.tutorialState = {
            hasMovedLeft: false,
            hasMovedRight: false,
            hasJumped: false,
            hasDoubleJumped: false,
            hasCollectedTool: false,
            hasDefeatedEnemy: false,
            hasCollectedEvidence: false,
            hasUsedTool: false,
            hasReachedGoal: false
        };
        this.shownHints.clear();
        this.hints = [];
        this.hideHint();
        this.saveProgress();
    }
    
    /**
     * Save tutorial progress
     */
    saveProgress() {
        try {
            localStorage.setItem('patternsJourney_tutorial', JSON.stringify({
                state: this.tutorialState,
                shownHints: Array.from(this.shownHints)
            }));
        } catch (error) {
            console.warn('Failed to save tutorial progress:', error);
        }
    }
    
    /**
     * Load tutorial progress
     */
    loadProgress() {
        try {
            const saved = localStorage.getItem('patternsJourney_tutorial');
            if (saved) {
                const data = JSON.parse(saved);
                if (data.state) {
                    this.tutorialState = { ...this.tutorialState, ...data.state };
                }
                if (data.shownHints) {
                    this.shownHints = new Set(data.shownHints);
                }
            }
        } catch (error) {
            console.warn('Failed to load tutorial progress:', error);
        }
    }
    
    /**
     * Skip all tutorials
     */
    skipTutorials() {
        // Mark all as shown
        for (const tutorial of this.tutorialSequence) {
            this.shownHints.add(tutorial.id);
        }
        this.hideHint();
        this.hints = [];
        this.saveProgress();
    }
}

// Made with Bob
