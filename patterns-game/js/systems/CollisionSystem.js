/**
 * CollisionSystem.js - Handles collision detection and resolution
 */

class CollisionSystem {
    constructor(physics) {
        this.physics = physics;
    }
    
    /**
     * Check and resolve collisions between player and platforms
     */
    handlePlayerPlatformCollisions(player, platforms) {
        for (const platform of platforms) {
            if (!platform.active || !platform.solid) continue;
            
            if (this.physics.checkAABBCollision(player, platform)) {
                const collision = this.physics.resolveCollision(player, platform);
                this.physics.separate(player, platform, collision);
            }
        }
    }
    
    /**
     * Check and resolve collisions between player and enemies
     */
    handlePlayerEnemyCollisions(player, enemies) {
        const hitEnemies = [];
        
        for (const enemy of enemies) {
            if (!enemy.active) continue;
            
            if (this.physics.checkAABBCollision(player, enemy)) {
                // Check if player is jumping on enemy (attacking from above)
                if (player.velocityY > 0 && player.y + player.height / 2 < enemy.y) {
                    // Player bounces on enemy
                    player.velocityY = -300;
                    enemy.takeDamage(50);
                    hitEnemies.push(enemy);
                } else {
                    // Enemy damages player
                    if (player.takeDamage(enemy.damage)) {
                        // Knockback
                        const knockbackDirection = player.x < enemy.x ? -1 : 1;
                        player.velocityX = knockbackDirection * 200;
                        player.velocityY = -200;
                    }
                }
            }
        }
        
        return hitEnemies;
    }
    
    /**
     * Check collisions between player and collectibles
     */
    handlePlayerCollectibleCollisions(player, collectibles) {
        const collected = [];
        
        for (const collectible of collectibles) {
            if (!collectible.active || collectible.collected) continue;
            
            // Use overlaps() directly since collectibles are not solid
            if (player.overlaps(collectible)) {
                console.log('Collecting:', collectible.toolName || collectible.collectibleType);
                const item = collectible.collect();
                collected.push(item);
                
                // Apply immediate effects
                switch (item.type) {
                    case 'health':
                        player.heal(30);
                        break;
                    case 'energy':
                        player.energy = Math.min(player.maxEnergy, player.energy + 50);
                        break;
                }
            }
        }
        
        return collected;
    }
    
    /**
     * Check collisions between enemies and platforms
     */
    handleEnemyPlatformCollisions(enemies, platforms) {
        for (const enemy of enemies) {
            if (!enemy.active) continue;
            
            for (const platform of platforms) {
                if (!platform.active || !platform.solid) continue;
                
                if (this.physics.checkAABBCollision(enemy, platform)) {
                    const collision = this.physics.resolveCollision(enemy, platform);
                    this.physics.separate(enemy, platform, collision);
                    
                    // Turn around if hit a wall
                    if (collision.side === 'left' || collision.side === 'right') {
                        enemy.direction *= -1;
                    }
                }
            }
        }
    }
    
    /**
     * Check if entity is at level boundary
     */
    checkBoundaries(entity, levelBounds) {
        let hitBoundary = false;
        
        // Left boundary
        if (entity.x < levelBounds.minX) {
            entity.x = levelBounds.minX;
            entity.velocityX = 0;
            hitBoundary = true;
        }
        
        // Right boundary
        if (entity.x + entity.width > levelBounds.maxX) {
            entity.x = levelBounds.maxX - entity.width;
            entity.velocityX = 0;
            hitBoundary = true;
        }
        
        // Top boundary
        if (entity.y < levelBounds.minY) {
            entity.y = levelBounds.minY;
            entity.velocityY = 0;
            hitBoundary = true;
        }
        
        // Bottom boundary (death plane)
        if (entity.y > levelBounds.maxY) {
            if (entity.type === 'player') {
                entity.takeDamage(entity.health); // Kill player
            } else {
                entity.die();
            }
            hitBoundary = true;
        }
        
        return hitBoundary;
    }
    
    /**
     * Check collision with goal/exit
     */
    checkGoalCollision(player, goal) {
        if (!goal || !goal.active) return false;
        // Use overlaps() directly since goal might not be solid
        return player.overlaps(goal);
    }
    
    /**
     * Get all entities within a radius
     */
    getEntitiesInRadius(centerX, centerY, radius, entities) {
        const inRadius = [];
        
        for (const entity of entities) {
            if (!entity.active) continue;
            
            const bounds = entity.getBounds();
            const distance = Math.sqrt(
                Math.pow(bounds.centerX - centerX, 2) + 
                Math.pow(bounds.centerY - centerY, 2)
            );
            
            if (distance <= radius) {
                inRadius.push({
                    entity: entity,
                    distance: distance
                });
            }
        }
        
        // Sort by distance
        inRadius.sort((a, b) => a.distance - b.distance);
        
        return inRadius;
    }
    
    /**
     * Check line of sight between two points
     */
    hasLineOfSight(x1, y1, x2, y2, obstacles) {
        const hit = this.physics.raycast(
            x1, y1,
            x2 - x1, y2 - y1,
            Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)),
            obstacles
        );
        
        return hit === null;
    }
}

// Made with Bob
