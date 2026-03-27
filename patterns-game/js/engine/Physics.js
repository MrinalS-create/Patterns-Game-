/**
 * Physics.js - Physics engine for gravity, collision detection, and resolution
 */

class Physics {
    constructor() {
        // Physics constants
        this.gravity = 980; // pixels per second squared (roughly Earth gravity)
        this.terminalVelocity = 600; // Maximum falling speed
        this.friction = 0.8; // Ground friction coefficient
        this.airResistance = 0.98; // Air resistance coefficient
    }
    
    /**
     * Apply gravity to an entity
     */
    applyGravity(entity, deltaTime) {
        if (!entity.active) return;
        
        // Apply gravity acceleration
        entity.velocityY += this.gravity * deltaTime;
        
        // Cap at terminal velocity
        if (entity.velocityY > this.terminalVelocity) {
            entity.velocityY = this.terminalVelocity;
        }
    }
    
    /**
     * Apply friction to an entity
     */
    applyFriction(entity, onGround) {
        if (!entity.active) return;
        
        if (onGround) {
            // Ground friction
            entity.velocityX *= this.friction;
        } else {
            // Air resistance
            entity.velocityX *= this.airResistance;
            entity.velocityY *= this.airResistance;
        }
        
        // Stop very small velocities to prevent jitter
        if (Math.abs(entity.velocityX) < 0.1) entity.velocityX = 0;
        if (Math.abs(entity.velocityY) < 0.1) entity.velocityY = 0;
    }
    
    /**
     * Check AABB (Axis-Aligned Bounding Box) collision between two entities
     */
    checkAABBCollision(entityA, entityB) {
        if (!entityA.solid || !entityB.solid) return false;
        if (!entityA.active || !entityB.active) return false;
        
        return entityA.overlaps(entityB);
    }
    
    /**
     * Resolve collision between two entities
     * Returns collision data with normal and penetration depth
     */
    resolveCollision(entityA, entityB) {
        const boundsA = entityA.getBounds();
        const boundsB = entityB.getBounds();
        
        // Calculate overlap on each axis
        const overlapX = Math.min(boundsA.right - boundsB.left, boundsB.right - boundsA.left);
        const overlapY = Math.min(boundsA.bottom - boundsB.top, boundsB.bottom - boundsA.top);
        
        // Determine collision normal (direction to push entityA)
        let normalX = 0;
        let normalY = 0;
        let penetration = 0;
        
        if (overlapX < overlapY) {
            // Horizontal collision
            penetration = overlapX;
            normalX = boundsA.centerX < boundsB.centerX ? -1 : 1;
        } else {
            // Vertical collision
            penetration = overlapY;
            normalY = boundsA.centerY < boundsB.centerY ? -1 : 1;
        }
        
        return {
            normal: { x: normalX, y: normalY },
            penetration: penetration,
            side: this.getCollisionSide(normalX, normalY)
        };
    }
    
    /**
     * Get collision side name
     */
    getCollisionSide(normalX, normalY) {
        if (normalY === -1) return 'bottom'; // Entity A is above B
        if (normalY === 1) return 'top';     // Entity A is below B
        if (normalX === -1) return 'right';  // Entity A is left of B
        if (normalX === 1) return 'left';    // Entity A is right of B
        return 'none';
    }
    
    /**
     * Separate two overlapping entities
     */
    separate(entityA, entityB, collision) {
        // Move entityA out of entityB
        entityA.x += collision.normal.x * collision.penetration;
        entityA.y += collision.normal.y * collision.penetration;
        
        // Stop velocity in collision direction
        if (collision.normal.x !== 0) {
            entityA.velocityX = 0;
        }
        if (collision.normal.y !== 0) {
            entityA.velocityY = 0;
        }
    }
    
    /**
     * Check if entity is on ground (colliding from top)
     */
    isOnGround(entity, platforms) {
        // Check slightly below entity
        const checkY = entity.y + entity.height + 2;
        
        for (const platform of platforms) {
            if (!platform.active || !platform.solid) continue;
            
            const bounds = platform.getBounds();
            
            // Check if entity is above platform and within horizontal bounds
            if (entity.x + entity.width > bounds.left &&
                entity.x < bounds.right &&
                checkY >= bounds.top &&
                entity.y + entity.height <= bounds.top + 5) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Get all collisions for an entity
     */
    getCollisions(entity, others) {
        const collisions = [];
        
        for (const other of others) {
            if (entity === other) continue;
            if (!this.checkAABBCollision(entity, other)) continue;
            
            const collision = this.resolveCollision(entity, other);
            collision.entity = other;
            collisions.push(collision);
        }
        
        return collisions;
    }
    
    /**
     * Raycast from point in direction
     * Returns first entity hit or null
     */
    raycast(startX, startY, dirX, dirY, maxDistance, entities) {
        const normalizedDirX = dirX / Math.sqrt(dirX * dirX + dirY * dirY);
        const normalizedDirY = dirY / Math.sqrt(dirX * dirX + dirY * dirY);
        
        let closestHit = null;
        let closestDistance = maxDistance;
        
        for (const entity of entities) {
            if (!entity.active || !entity.solid) continue;
            
            const bounds = entity.getBounds();
            
            // Simple ray-box intersection
            const tMin = (bounds.left - startX) / normalizedDirX;
            const tMax = (bounds.right - startX) / normalizedDirX;
            const tYMin = (bounds.top - startY) / normalizedDirY;
            const tYMax = (bounds.bottom - startY) / normalizedDirY;
            
            const tEnter = Math.max(Math.min(tMin, tMax), Math.min(tYMin, tYMax));
            const tExit = Math.min(Math.max(tMin, tMax), Math.max(tYMin, tYMax));
            
            if (tExit >= tEnter && tEnter >= 0 && tEnter < closestDistance) {
                closestDistance = tEnter;
                closestHit = {
                    entity: entity,
                    distance: tEnter,
                    point: {
                        x: startX + normalizedDirX * tEnter,
                        y: startY + normalizedDirY * tEnter
                    }
                };
            }
        }
        
        return closestHit;
    }
}

// Made with Bob
