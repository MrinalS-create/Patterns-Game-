/**
 * ToolSystem.js - Manages framework tools and their abilities
 */

class ToolSystem {
    constructor() {
        // Tool slots (1-9)
        this.slots = new Array(9).fill(null);
        this.activeSlot = -1;
        
        // Tool definitions
        this.toolDefinitions = {
            'edt_lens': {
                name: 'EDT Lens',
                description: 'Reveals hidden paths and weak points in enemies',
                framework: 'EDT',
                cooldown: 5,
                energyCost: 20,
                duration: 10,
                icon: '🔍'
            },
            'pdlc_compass': {
                name: 'PDLC Compass',
                description: 'Shows the optimal path forward',
                framework: 'PDLC',
                cooldown: 8,
                energyCost: 25,
                duration: 15,
                icon: '🧭'
            },
            'trust_shield': {
                name: 'Trust Shield',
                description: 'Temporary invincibility and damage reflection',
                framework: 'Team',
                cooldown: 15,
                energyCost: 30,
                duration: 5,
                icon: '🛡️'
            },
            'story_scroll': {
                name: 'Story Scroll',
                description: 'Charm enemies to fight for you temporarily',
                framework: 'Communication',
                cooldown: 12,
                energyCost: 35,
                duration: 8,
                icon: '📜'
            },
            'metrics_meter': {
                name: 'Metrics Meter',
                description: 'Reveals collectibles and enemy health',
                framework: 'Execution',
                cooldown: 6,
                energyCost: 15,
                duration: 12,
                icon: '📊'
            },
            'hills_hammer': {
                name: 'Hills Hammer',
                description: 'Powerful ground slam that stuns enemies',
                framework: 'Impact',
                cooldown: 10,
                energyCost: 40,
                duration: 0,
                icon: '🔨'
            }
        };
        
        // Active tool effects
        this.activeEffects = new Map();
        
        // Cooldowns
        this.cooldowns = new Map();
    }
    
    /**
     * Add a tool to a slot
     */
    addTool(toolId, slotIndex) {
        if (slotIndex < 0 || slotIndex >= this.slots.length) return false;
        if (!this.toolDefinitions[toolId]) return false;
        
        this.slots[slotIndex] = {
            id: toolId,
            ...this.toolDefinitions[toolId]
        };
        
        return true;
    }
    
    /**
     * Remove tool from slot
     */
    removeTool(slotIndex) {
        if (slotIndex < 0 || slotIndex >= this.slots.length) return false;
        this.slots[slotIndex] = null;
        return true;
    }
    
    /**
     * Get tool in slot
     */
    getTool(slotIndex) {
        if (slotIndex < 0 || slotIndex >= this.slots.length) return null;
        return this.slots[slotIndex];
    }
    
    /**
     * Activate tool in slot
     */
    activateTool(slotIndex, player) {
        const tool = this.getTool(slotIndex);
        if (!tool) return false;
        
        // Check cooldown
        const cooldownRemaining = this.getCooldown(tool.id);
        if (cooldownRemaining > 0) return false;
        
        // Check energy
        if (!player.useEnergy(tool.energyCost)) return false;
        
        // Activate tool effect
        this.applyToolEffect(tool, player);
        
        // Set cooldown
        this.cooldowns.set(tool.id, tool.cooldown);
        
        // Set active slot
        this.activeSlot = slotIndex;
        
        return true;
    }
    
    /**
     * Apply tool effect
     */
    applyToolEffect(tool, player) {
        const effect = {
            toolId: tool.id,
            startTime: Date.now(),
            duration: tool.duration,
            active: true
        };
        
        this.activeEffects.set(tool.id, effect);
        
        // Apply immediate effects based on tool type
        switch (tool.id) {
            case 'edt_lens':
                // Reveal hidden elements
                effect.revealHidden = true;
                break;
                
            case 'pdlc_compass':
                // Show optimal path
                effect.showPath = true;
                break;
                
            case 'trust_shield':
                // Grant invincibility
                player.invincible = true;
                effect.shieldActive = true;
                break;
                
            case 'story_scroll':
                // Charm effect
                effect.charmActive = true;
                break;
                
            case 'metrics_meter':
                // Reveal collectibles
                effect.revealCollectibles = true;
                break;
                
            case 'hills_hammer':
                // Instant ground slam
                this.performGroundSlam(player);
                // No duration, instant effect
                this.activeEffects.delete(tool.id);
                break;
        }
    }
    
    /**
     * Perform ground slam attack
     */
    performGroundSlam(player) {
        // Create shockwave effect
        return {
            type: 'groundSlam',
            x: player.x + player.width / 2,
            y: player.y + player.height,
            radius: 150,
            damage: 50,
            stun: 3
        };
    }
    
    /**
     * Update tool system
     */
    update(deltaTime, player) {
        // Update cooldowns
        for (const [toolId, cooldown] of this.cooldowns) {
            const newCooldown = cooldown - deltaTime;
            if (newCooldown <= 0) {
                this.cooldowns.delete(toolId);
            } else {
                this.cooldowns.set(toolId, newCooldown);
            }
        }
        
        // Update active effects
        const now = Date.now();
        for (const [toolId, effect] of this.activeEffects) {
            const elapsed = (now - effect.startTime) / 1000;
            
            if (elapsed >= effect.duration) {
                // Effect expired
                this.deactivateEffect(toolId, player);
                this.activeEffects.delete(toolId);
            }
        }
    }
    
    /**
     * Deactivate tool effect
     */
    deactivateEffect(toolId, player) {
        const effect = this.activeEffects.get(toolId);
        if (!effect) return;
        
        // Remove effect based on tool type
        switch (toolId) {
            case 'trust_shield':
                // Remove invincibility (unless from damage)
                if (effect.shieldActive) {
                    player.invincible = false;
                }
                break;
        }
    }
    
    /**
     * Get cooldown remaining for tool
     */
    getCooldown(toolId) {
        return this.cooldowns.get(toolId) || 0;
    }
    
    /**
     * Check if tool effect is active
     */
    isEffectActive(toolId) {
        return this.activeEffects.has(toolId);
    }
    
    /**
     * Get active effect
     */
    getEffect(toolId) {
        return this.activeEffects.get(toolId);
    }
    
    /**
     * Get all active effects
     */
    getAllActiveEffects() {
        return Array.from(this.activeEffects.values());
    }
    
    /**
     * Check if EDT Lens is revealing
     */
    isRevealing() {
        const effect = this.getEffect('edt_lens');
        return effect && effect.revealHidden;
    }
    
    /**
     * Check if PDLC Compass is showing path
     */
    isShowingPath() {
        const effect = this.getEffect('pdlc_compass');
        return effect && effect.showPath;
    }
    
    /**
     * Check if Metrics Meter is revealing collectibles
     */
    isRevealingCollectibles() {
        const effect = this.getEffect('metrics_meter');
        return effect && effect.revealCollectibles;
    }
    
    /**
     * Check if Story Scroll charm is active
     */
    isCharmActive() {
        const effect = this.getEffect('story_scroll');
        return effect && effect.charmActive;
    }
    
    /**
     * Get tool slots for UI
     */
    getSlotsForUI() {
        return this.slots.map((tool, index) => ({
            index: index + 1,
            tool: tool,
            cooldown: tool ? this.getCooldown(tool.id) : 0,
            active: this.activeSlot === index
        }));
    }
    
    /**
     * Reset all tools and effects
     */
    reset() {
        this.activeSlot = -1;
        this.activeEffects.clear();
        this.cooldowns.clear();
    }
}

// Made with Bob
