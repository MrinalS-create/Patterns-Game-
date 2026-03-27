/**
 * Entity.js - Base entity class for all game objects
 * Provides common properties and methods for game entities
 */

class Entity {
    constructor(x, y, width, height) {
        // Position
        this.x = x;
        this.y = y;
        
        // Dimensions
        this.width = width;
        this.height = height;
        
        // Physics
        this.velocityX = 0;
        this.velocityY = 0;
        this.accelerationX = 0;
        this.accelerationY = 0;
        
        // State
        this.active = true;
        this.visible = true;
        this.solid = true; // Can collide with other entities
        
        // Components
        this.components = new Map();
        
        // Type identifier
        this.type = 'entity';
        
        // Rendering
        this.color = '#0f62fe';
        this.sprite = null;
    }
    
    /**
     * Add a component to this entity
     */
    addComponent(name, component) {
        this.components.set(name, component);
        return this;
    }
    
    /**
     * Get a component by name
     */
    getComponent(name) {
        return this.components.get(name);
    }
    
    /**
     * Check if entity has a component
     */
    hasComponent(name) {
        return this.components.has(name);
    }
    
    /**
     * Update entity state (called every frame)
     */
    update(deltaTime) {
        if (!this.active) return;
        
        // Update velocity based on acceleration
        this.velocityX += this.accelerationX * deltaTime;
        this.velocityY += this.accelerationY * deltaTime;
        
        // Update position based on velocity
        this.x += this.velocityX * deltaTime;
        this.y += this.velocityY * deltaTime;
        
        // Update components
        for (const [name, component] of this.components) {
            if (component.update) {
                component.update(deltaTime);
            }
        }
    }
    
    /**
     * Render entity (called every frame)
     */
    render(ctx, camera) {
        if (!this.visible) return;
        
        // Calculate screen position relative to camera
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        
        // Don't render if off-screen
        if (screenX + this.width < 0 || screenX > camera.width ||
            screenY + this.height < 0 || screenY > camera.height) {
            return;
        }
        
        // Render sprite or colored rectangle
        if (this.sprite) {
            ctx.drawImage(this.sprite, screenX, screenY, this.width, this.height);
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(screenX, screenY, this.width, this.height);
        }
        
        // Render components
        for (const [name, component] of this.components) {
            if (component.render) {
                component.render(ctx, camera);
            }
        }
    }
    
    /**
     * Get bounding box for collision detection
     */
    getBounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height,
            centerX: this.x + this.width / 2,
            centerY: this.y + this.height / 2
        };
    }
    
    /**
     * Check if this entity overlaps with another
     */
    overlaps(other) {
        const a = this.getBounds();
        const b = other.getBounds();
        
        return !(a.right < b.left || 
                 a.left > b.right || 
                 a.bottom < b.top || 
                 a.top > b.bottom);
    }
    
    /**
     * Set position
     */
    setPosition(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    
    /**
     * Set velocity
     */
    setVelocity(vx, vy) {
        this.velocityX = vx;
        this.velocityY = vy;
        return this;
    }
    
    /**
     * Destroy entity
     */
    destroy() {
        this.active = false;
        this.visible = false;
        
        // Clean up components
        for (const [name, component] of this.components) {
            if (component.destroy) {
                component.destroy();
            }
        }
        this.components.clear();
    }
}

// Made with Bob
