/**
 * main.js - Game entry point
 */

// Global game instance
let game = null;

/**
 * Initialize game when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 The Patterns Journey: Designer\'s Quest');
    console.log('Phase 1: Core Game Engine');
    console.log('Initializing...');
    
    // Get canvas element
    const canvas = document.getElementById('gameCanvas');
    
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    
    // Create game instance
    try {
        game = new Game(canvas);
        
        // Ensure canvas/window has focus for keyboard input
        canvas.setAttribute('tabindex', '0');
        canvas.focus();
        
        // Re-focus on click
        canvas.addEventListener('click', () => {
            canvas.focus();
        });
        
        // Also ensure window has focus
        window.focus();
        
        console.log('✅ Game initialized successfully!');
        console.log('');
        console.log('Controls:');
        console.log('  Arrow Keys / WASD - Move');
        console.log('  Space - Jump');
        console.log('  1-9 - Activate Tools (press individual numbers like 1, 2, 3...)');
        console.log('  Escape - Pause');
        console.log('  F - Toggle Debug Mode');
        console.log('');
        console.log('Objective:');
        console.log('  - Collect the EDT Lens tool');
        console.log('  - Defeat 3 Confusion Fogs');
        console.log('  - Collect evidence pieces');
        console.log('  - Reach the exit portal');
        console.log('');
        console.log('💡 If keys don\'t work, click on the game canvas first!');
    } catch (error) {
        console.error('Failed to initialize game:', error);
    }
});

/**
 * Handle window unload
 */
window.addEventListener('beforeunload', () => {
    if (game) {
        // Save progress before closing
        game.progressSystem.save();
    }
});

/**
 * Handle visibility change (pause when tab is hidden)
 */
document.addEventListener('visibilitychange', () => {
    if (game && game.state === 'playing') {
        if (document.hidden) {
            game.pause();
        }
    }
});

/**
 * Expose game to window for debugging
 */
if (typeof window !== 'undefined') {
    window.game = game;
    window.debugGame = () => {
        if (!game) {
            console.log('Game not initialized');
            return;
        }
        
        console.log('=== Game Debug Info ===');
        console.log('State:', game.state);
        console.log('Level:', game.currentLevel);
        console.log('Player:', {
            position: { x: game.player.x, y: game.player.y },
            velocity: { x: game.player.velocityX, y: game.player.velocityY },
            health: game.player.health,
            energy: game.player.energy,
            state: game.player.state
        });
        console.log('Entities:', {
            platforms: game.platforms.length,
            enemies: game.enemies.filter(e => e.active).length,
            collectibles: game.collectibles.filter(c => c.active).length
        });
        console.log('Progress:', {
            score: game.levelScore,
            evidence: game.evidenceCollected,
            time: Math.floor(game.levelTimer),
            mastery: game.progressSystem.getOverallMastery()
        });
        console.log('Tools:', game.toolSystem.getAllActiveEffects());
    };
    
    console.log('💡 Tip: Type debugGame() in console for debug info');
}

// Made with Bob
