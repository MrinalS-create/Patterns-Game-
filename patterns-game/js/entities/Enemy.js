/**
 * Enemy.js - Base enemy class and specific enemy types
 */

class Enemy extends Entity {
    constructor(x, y, width, height, enemyType = 'confusion_fog') {
        super(x, y, width, height);
        
        this.type = 'enemy';
        this.enemyType = enemyType;
        
        // Enemy stats
        this.health = 30;
        this.maxHealth = 30;
        this.damage = 10;
        this.scoreValue = 50;
        
        // Movement
        this.patrolSpeed = 50;
        this.patrolDistance = 100;
        this.startX = x;
        this.direction = 1; // 1 = right, -1 = left
        
        // AI state
        this.aiState = 'patrol'; // patrol, chase, attack, stunned
        this.detectionRange = 200;
        this.attackRange = 50;
        this.attackCooldown = 0;
        this.attackCooldownMax = 2; // seconds
        
        // Visual
        this.setupVisuals();
    }
    
    /**
     * Setup enemy visuals based on type
     */
    setupVisuals() {
        switch (this.enemyType) {
            case 'confusion_fog':
                this.color = '#8a3ffc'; // Purple fog
                this.createConfusionFogSprite();
                break;
            case 'scope_creep':
                this.color = '#da1e28'; // Red
                this.createScopeCreepSprite();
                break;
            case 'assumption_beast':
                this.color = '#f1c21b'; // Yellow
                this.createAssumptionBeastSprite();
                break;
            default:
                this.color = '#525252';
        }
    }
    
    /**
     * Create Confusion Fog sprite
     */
    createConfusionFogSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        const ctx = canvas.getContext('2d');
        
        // Foggy cloud shape
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.7;
        
        // Draw multiple circles to create fog effect
        const circles = 5;
        for (let i = 0; i < circles; i++) {
            const x = (this.width / circles) * i + this.width / (circles * 2);
            const y = this.height / 2;
            const radius = this.width / (circles * 1.5);
            
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Question marks
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', this.width / 2, this.height / 2);
        
        this.sprite = canvas;
    }
    
    /**
     * Create Scope Creep sprite
     */
    createScopeCreepSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        const ctx = canvas.getContext('2d');
        
        // Body
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Border
        ctx.strokeStyle = '#750e13';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, this.width - 2, this.height - 2);
        
        // Symbol
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('++', this.width / 2, this.height / 2);
        
        this.sprite = canvas;
    }
    
    /**
     * Create Assumption Beast sprite
     */
    createAssumptionBeastSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        const ctx = canvas.getContext('2d');
        
        // Body
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Border
        ctx.strokeStyle = '#8e6a00';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, this.width - 2, this.height - 2);
        
        // Symbol
        ctx.fillStyle = '#161616';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('!?', this.width / 2, this.height / 2);
        
        this.sprite = canvas;
    }
    
    /**
     * Update enemy AI and behavior
     */
    update(deltaTime, player, physics, platforms) {
        if (!this.active) return;
        
        // Update attack cooldown
        if (this.attackCooldown > 0) {
            this.attackCooldown -= deltaTime;
        }
        
        // Calculate distance to player
        const distanceToPlayer = Math.sqrt(
            Math.pow(player.x - this.x, 2) + 
            Math.pow(player.y - this.y, 2)
        );
        
        // AI behavior based on state
        switch (this.aiState) {
            case 'patrol':
                this.patrol(deltaTime);
                
                // Check if player is in detection range
                if (distanceToPlayer < this.detectionRange) {
                    this.aiState = 'chase';
                }
                break;
                
            case 'chase':
                this.chase(player, deltaTime);
                
                // Check if in attack range
                if (distanceToPlayer < this.attackRange) {
                    this.aiState = 'attack';
                }
                
                // Return to patrol if player is too far
                if (distanceToPlayer > this.detectionRange * 1.5) {
                    this.aiState = 'patrol';
                }
                break;
                
            case 'attack':
                this.attack(player, deltaTime);
                
                // Return to chase if player moves away
                if (distanceToPlayer > this.attackRange * 1.5) {
                    this.aiState = 'chase';
                }
                break;
                
            case 'stunned':
                // Do nothing, will be handled by stun timer
                break;
        }
        
        // Apply physics
        physics.applyGravity(this, deltaTime);
        physics.applyFriction(this, physics.isOnGround(this, platforms));
        
        // Update position
        super.update(deltaTime);
    }
    
    /**
     * Patrol behavior
     */
    patrol(deltaTime) {
        // Move back and forth
        this.velocityX = this.direction * this.patrolSpeed;
        
        // Check if reached patrol distance
        if (Math.abs(this.x - this.startX) > this.patrolDistance) {
            this.direction *= -1;
        }
    }
    
    /**
     * Chase behavior
     */
    chase(player, deltaTime) {
        // Move towards player
        const directionToPlayer = player.x > this.x ? 1 : -1;
        this.velocityX = directionToPlayer * this.patrolSpeed * 1.5;
        this.direction = directionToPlayer;
    }
    
    /**
     * Attack behavior
     */
    attack(player, deltaTime) {
        // Stop moving
        this.velocityX = 0;
        
        // Attack if cooldown is ready
        if (this.attackCooldown <= 0) {
            // Check if still in range
            if (this.overlaps(player)) {
                player.takeDamage(this.damage);
                this.attackCooldown = this.attackCooldownMax;
            }
        }
    }
    
    /**
     * Take damage
     */
    takeDamage(amount) {
        this.health -= amount;
        
        if (this.health <= 0) {
            this.die();
        }
        
        return this.health > 0;
    }
    
    /**
     * Stun enemy
     */
    stun(duration) {
        this.aiState = 'stunned';
        this.velocityX = 0;
        
        setTimeout(() => {
            if (this.active) {
                this.aiState = 'patrol';
            }
        }, duration * 1000);
    }
    
    /**
     * Enemy death
     */
    die() {
        this.active = false;
        this.visible = false;
        // Game will handle score and cleanup
    }
    
    /**
     * Render enemy
     */
    render(ctx, camera) {
        if (!this.visible) return;
        
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        
        // Save context
        ctx.save();
        
        // Flip sprite based on direction
        if (this.direction < 0) {
            ctx.translate(screenX + this.width, screenY);
            ctx.scale(-1, 1);
            ctx.drawImage(this.sprite, 0, 0, this.width, this.height);
        } else {
            ctx.drawImage(this.sprite, screenX, screenY, this.width, this.height);
        }
        
        // Restore context
        ctx.restore();
        
        // Render health bar if damaged
        if (this.health < this.maxHealth) {
            const barWidth = this.width;
            const barHeight = 3;
            const barX = screenX;
            const barY = screenY - 8;
            
            // Background
            ctx.fillStyle = '#e0e0e0';
            ctx.fillRect(barX, barY, barWidth, barHeight);
            
            // Health
            ctx.fillStyle = '#da1e28';
            ctx.fillRect(barX, barY, barWidth * (this.health / this.maxHealth), barHeight);
        }
    }
}

// Made with Bob
