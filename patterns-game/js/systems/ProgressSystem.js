/**
 * ProgressSystem.js - Tracks player progress, mastery, and saves
 */

class ProgressSystem {
    constructor() {
        this.saveKey = 'patternsJourney_save';
        
        // Framework mastery (0-100 for each)
        this.mastery = {
            EDT: 0,           // End of Thinking
            PDLC: 0,          // Product Development Lifecycle
            Team: 0,          // Team Dynamics
            Communication: 0, // Storytelling & Presentation
            Execution: 0,     // Consumability & Metrics
            Impact: 0         // Hills & Business Value
        };
        
        // Level completion
        this.levelsCompleted = new Set();
        this.currentLevel = 'world1-1';
        
        // Statistics
        this.stats = {
            totalScore: 0,
            evidenceCollected: 0,
            toolsCollected: 0,
            enemiesDefeated: 0,
            totalPlayTime: 0,
            deaths: 0,
            levelsCompleted: 0
        };
        
        // Tools inventory
        this.tools = new Map();
        
        // Load saved progress
        this.load();
    }
    
    /**
     * Add mastery points to a framework
     */
    addMastery(framework, points) {
        if (this.mastery.hasOwnProperty(framework)) {
            this.mastery[framework] = Math.min(100, this.mastery[framework] + points);
            return true;
        }
        return false;
    }
    
    /**
     * Update framework mastery (alias for addMastery for consistency)
     */
    updateFrameworkMastery(framework, points) {
        return this.addMastery(framework, points);
    }
    
    /**
     * Get mastery level for a framework
     */
    getMastery(framework) {
        return this.mastery[framework] || 0;
    }
    
    /**
     * Get overall mastery percentage
     */
    getOverallMastery() {
        const frameworks = Object.keys(this.mastery);
        const total = frameworks.reduce((sum, key) => sum + this.mastery[key], 0);
        return Math.floor(total / frameworks.length);
    }
    
    /**
     * Mark level as completed
     */
    completeLevel(levelId, score, time, evidence) {
        this.levelsCompleted.add(levelId);
        this.stats.levelsCompleted = this.levelsCompleted.size;
        this.stats.totalScore += score;
        this.stats.evidenceCollected += evidence;
        
        // Award mastery based on level
        this.awardLevelMastery(levelId, score);
        
        this.save();
    }
    
    /**
     * Award mastery points based on level completion
     */
    awardLevelMastery(levelId, score) {
        // Map levels to frameworks
        const levelFrameworks = {
            'world1-1': 'EDT',
            'world1-2': 'EDT',
            'world1-3': 'PDLC',
            'world2-1': 'Team',
            'world2-2': 'Team',
            'world2-3': 'Communication',
            'world3-1': 'Communication',
            'world3-2': 'Execution',
            'world3-3': 'Execution',
            'world4-1': 'Impact',
            'world4-2': 'Impact'
        };
        
        const framework = levelFrameworks[levelId];
        if (framework) {
            // Award 10-20 points based on score
            const masteryPoints = Math.floor(10 + (score / 1000) * 10);
            this.addMastery(framework, masteryPoints);
        }
    }
    
    /**
     * Check if level is unlocked
     */
    isLevelUnlocked(levelId) {
        // First level is always unlocked
        if (levelId === 'world1-1') return true;
        
        // Check if previous level is completed
        const levelOrder = [
            'world1-1', 'world1-2', 'world1-3',
            'world2-1', 'world2-2', 'world2-3',
            'world3-1', 'world3-2', 'world3-3',
            'world4-1', 'world4-2'
        ];
        
        const index = levelOrder.indexOf(levelId);
        if (index <= 0) return true;
        
        const previousLevel = levelOrder[index - 1];
        return this.levelsCompleted.has(previousLevel);
    }
    
    /**
     * Add a tool to inventory
     */
    addTool(toolName, toolData) {
        this.tools.set(toolName, {
            ...toolData,
            acquired: true,
            cooldown: 0
        });
        this.stats.toolsCollected++;
        this.save();
    }
    
    /**
     * Check if player has a tool
     */
    hasTool(toolName) {
        return this.tools.has(toolName);
    }
    
    /**
     * Get tool data
     */
    getTool(toolName) {
        return this.tools.get(toolName);
    }
    
    /**
     * Get all tools as array
     */
    getAllTools() {
        return Array.from(this.tools.entries()).map(([name, data]) => ({
            name,
            ...data
        }));
    }
    
    /**
     * Update statistics
     */
    updateStats(stat, value) {
        if (this.stats.hasOwnProperty(stat)) {
            this.stats[stat] += value;
        }
    }
    
    /**
     * Get statistics
     */
    getStats() {
        return { ...this.stats };
    }
    
    /**
     * Save progress to localStorage
     */
    save() {
        const saveData = {
            mastery: this.mastery,
            levelsCompleted: Array.from(this.levelsCompleted),
            currentLevel: this.currentLevel,
            stats: this.stats,
            tools: Array.from(this.tools.entries()),
            timestamp: Date.now()
        };
        
        try {
            localStorage.setItem(this.saveKey, JSON.stringify(saveData));
            return true;
        } catch (error) {
            console.error('Failed to save progress:', error);
            return false;
        }
    }
    
    /**
     * Load progress from localStorage
     */
    load() {
        try {
            const saveData = localStorage.getItem(this.saveKey);
            if (!saveData) return false;
            
            const data = JSON.parse(saveData);
            
            // Restore mastery
            if (data.mastery) {
                this.mastery = { ...this.mastery, ...data.mastery };
            }
            
            // Restore completed levels
            if (data.levelsCompleted) {
                this.levelsCompleted = new Set(data.levelsCompleted);
            }
            
            // Restore current level
            if (data.currentLevel) {
                this.currentLevel = data.currentLevel;
            }
            
            // Restore stats
            if (data.stats) {
                this.stats = { ...this.stats, ...data.stats };
            }
            
            // Restore tools
            if (data.tools) {
                this.tools = new Map(data.tools);
            }
            
            return true;
        } catch (error) {
            console.error('Failed to load progress:', error);
            return false;
        }
    }
    
    /**
     * Reset all progress
     */
    reset() {
        // Reset mastery
        for (const key in this.mastery) {
            this.mastery[key] = 0;
        }
        
        // Reset levels
        this.levelsCompleted.clear();
        this.currentLevel = 'world1-1';
        
        // Reset stats
        this.stats = {
            totalScore: 0,
            evidenceCollected: 0,
            toolsCollected: 0,
            enemiesDefeated: 0,
            totalPlayTime: 0,
            deaths: 0,
            levelsCompleted: 0
        };
        
        // Reset tools
        this.tools.clear();
        
        // Clear save
        try {
            localStorage.removeItem(this.saveKey);
        } catch (error) {
            console.error('Failed to clear save:', error);
        }
    }
    
    /**
     * Export progress as JSON
     */
    export() {
        return {
            mastery: this.mastery,
            levelsCompleted: Array.from(this.levelsCompleted),
            stats: this.stats,
            tools: Array.from(this.tools.entries())
        };
    }
    
    /**
     * Import progress from JSON
     */
    import(data) {
        try {
            if (data.mastery) this.mastery = { ...this.mastery, ...data.mastery };
            if (data.levelsCompleted) this.levelsCompleted = new Set(data.levelsCompleted);
            if (data.stats) this.stats = { ...this.stats, ...data.stats };
            if (data.tools) this.tools = new Map(data.tools);
            this.save();
            return true;
        } catch (error) {
            console.error('Failed to import progress:', error);
            return false;
        }
    }
}

// Made with Bob
