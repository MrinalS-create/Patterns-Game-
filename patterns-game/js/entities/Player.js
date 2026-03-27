/**
 * Player.js - Player character (Alex) with movement and physics
 */

class Player extends Entity {
    constructor(x, y) {
        super(x, y, 40, 60); // 40x60 pixel character
        
        this.type = 'player';
        this.color = '#0f62fe'; // IBM Blue
        
        // Player stats
        this.maxHealth = 100;
        this.health = 100;
        this.maxEnergy = 100;
        this.energy = 100;
        
        // Movement properties
        this.moveSpeed = 300; // pixels per second
        this.jumpForce = -450; // negative = upward
        this.maxJumps = 2; // Double jump
        this.jumpsRemaining = this.maxJumps;
        this.isGrounded = false;
        this.canJump = true;
        
        // State
        this.state = 'idle'; // idle, walking, jumping, falling
        this.facingRight = true;
        
        // Invincibility (after taking damage)
        this.invincible = false;
        this.invincibilityTimer = 0;
        this.invincibilityDuration = 1.5; // seconds
        
        // Animation (simple frame counter for now)
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.animationSpeed = 0.1; // seconds per frame
        
        // Create simple sprite
        this.updateSprite();
    }
    
    /**
     * Update player sprite based on state
     */
    updateSprite() {
        // Create a simple character sprite with "A" for Alex
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        const ctx = canvas.getContext('2d');
        
        // Body
        ctx.fillStyle = this.invincible && Math.floor(Date.now() / 100) % 2 === 0 
            ? '#ffffff' : this.color;
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Border
        ctx.strokeStyle = '#001d6c';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, this.width - 2, this.height - 2);
        
        // Face/Letter
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('A', this.width / 2, this.height / 2);
        
        this.sprite = canvas;
    }
    
    /**
     * Update player state
     */
    update(deltaTime, input, physics, platforms) {
        if (!this.active) return;
        
        // Update invincibility
        if (this.invincible) {
            this.invincibilityTimer += deltaTime;
            if (this.invincibilityTimer >= this.invincibilityDuration) {
                this.invincible = false;
                this.invincibilityTimer = 0;
            }
            // Update sprite for flashing effect
            if (Math.floor(this.invincibilityTimer * 10) % 2 === 0) {
                this.updateSprite();
            }
        }
        
        // Check if grounded
        this.isGrounded = physics.isOnGround(this, platforms);
        
        // Reset jumps when grounded
        if (this.isGrounded) {
            this.jumpsRemaining = this.maxJumps;
            this.canJump = true;
        }
        
        // Horizontal movement
        const horizontalInput = input.getHorizontalAxis();
        if (horizontalInput !== 0) {
            this.velocityX = horizontalInput * this.moveSpeed;
            this.facingRight = horizontalInput > 0;
            this.state = this.isGrounded ? 'walking' : this.state;
        } else {
            this.velocityX = 0;
            if (this.isGrounded) {
                this.state = 'idle';
            }
        }
        
        // Jumping
        if (input.isKeyPressed('jump') && this.jumpsRemaining > 0 && this.canJump) {
            this.velocityY = this.jumpForce;
            this.jumpsRemaining--;
            this.state = 'jumping';
            this.canJump = false;
        }
        
        // Allow jump again when key is released
        if (input.isKeyReleased('jump')) {
            this.canJump = true;
        }
        
        // Update state based on velocity
        if (!this.isGrounded) {
            if (this.velocityY < 0) {
                this.state = 'jumping';
            } else {
                this.state = 'falling';
            }
        }
        
        // Apply physics
        physics.applyGravity(this, deltaTime);
        physics.applyFriction(this, this.isGrounded);
        
        // Update position
        super.update(deltaTime);
        
        // Update animation
        this.animationTimer += deltaTime;
        if (this.animationTimer >= this.animationSpeed) {
            this.animationTimer = 0;
            this.animationFrame = (this.animationFrame + 1) % 4;
        }
        
        // Regenerate energy
        if (this.energy < this.maxEnergy) {
            this.energy = Math.min(this.maxEnergy, this.energy + 10 * deltaTime);
        }
    }
    
    /**
     * Render player
     */
    render(ctx, camera) {
        if (!this.visible) return;
        
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        
        // Save context
        ctx.save();
        
        // Flip sprite if facing left
        if (!this.facingRight) {
            ctx.translate(screenX + this.width, screenY);
            ctx.scale(-1, 1);
            ctx.drawImage(this.sprite, 0, 0, this.width, this.height);
        } else {
            ctx.drawImage(this.sprite, screenX, screenY, this.width, this.height);
        }
        
        // Restore context
        ctx.restore();
        
        // Render health bar above player
        if (this.health < this.maxHealth) {
            const barWidth = this.width;
            const barHeight = 4;
            const barX = screenX;
            const barY = screenY - 10;
            
            // Background
            ctx.fillStyle = '#e0e0e0';
            ctx.fillRect(barX, barY, barWidth, barHeight);
            
            // Health
            ctx.fillStyle = '#24a148';
            ctx.fillRect(barX, barY, barWidth * (this.health / this.maxHealth), barHeight);
        }
    }
    
    /**
     * Take damage
     */
    takeDamage(amount) {
        if (this.invincible) return false;
        
        this.health = Math.max(0, this.health - amount);
        this.invincible = true;
        this.invincibilityTimer = 0;
        this.updateSprite();
        
        if (this.health <= 0) {
            this.die();
        }
        
        return true;
    }
    
    /**
     * Heal player
     */
    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }
    
    /**
     * Use energy
     */
    useEnergy(amount) {
        if (this.energy >= amount) {
            this.energy -= amount;
            return true;
        }
        return false;
    }
    
    /**
     * Player death
     */
    die() {
        this.state = 'dead';
        this.velocityX = 0;
        this.velocityY = 0;
        // Game will handle respawn
    }
    
    /**
     * Reset player to starting state
     */
    reset(x, y) {
        this.x = x;
        this.y = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.health = this.maxHealth;
        this.energy = this.maxEnergy;
        this.state = 'idle';
        this.invincible = false;
        this.invincibilityTimer = 0;
        this.jumpsRemaining = this.maxJumps;
        this.active = true;
        this.visible = true;
        this.updateSprite();
    }
    
    /**
     * Get player state for saving
     */
    getState() {
        return {
            x: this.x,
            y: this.y,
            health: this.health,
            energy: this.energy,
            facingRight: this.facingRight
        };
    }
    
    /**
     * Restore player state from save
     */
    setState(state) {
        this.x = state.x;
        this.y = state.y;
        this.health = state.health;
        this.energy = state.energy;
        this.facingRight = state.facingRight;
        this.updateSprite();
    }
}

// Made with Bob
