/**
 * NotificationSystem.js - Shows notifications for game events
 */

class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.maxNotifications = 3;
        this.notificationDuration = 3000; // 3 seconds
    }
    
    /**
     * Show a notification
     */
    show(message, type = 'info', duration = this.notificationDuration) {
        const notification = {
            id: Date.now() + Math.random(),
            message: message,
            type: type, // info, success, warning, error
            startTime: Date.now(),
            duration: duration,
            alpha: 1
        };
        
        this.notifications.push(notification);
        
        // Remove oldest if too many
        if (this.notifications.length > this.maxNotifications) {
            this.notifications.shift();
        }
    }
    
    /**
     * Update notifications (fade out)
     */
    update(deltaTime) {
        const now = Date.now();
        
        // Update alpha for fading
        for (const notification of this.notifications) {
            const elapsed = now - notification.startTime;
            const remaining = notification.duration - elapsed;
            
            if (remaining < 500) {
                // Fade out in last 500ms
                notification.alpha = remaining / 500;
            }
        }
        
        // Remove expired notifications
        this.notifications = this.notifications.filter(n => {
            return (now - n.startTime) < n.duration;
        });
    }
    
    /**
     * Render notifications - DISABLED (notifications hidden per user request)
     */
    render(ctx, camera) {
        // Notifications disabled - no visual feedback shown
        return;
    }
    
    /**
     * Get background color for notification type
     */
    getBackgroundColor(type) {
        switch (type) {
            case 'success': return 'rgba(36, 161, 72, 0.95)';
            case 'warning': return 'rgba(241, 194, 27, 0.95)';
            case 'error': return 'rgba(218, 30, 40, 0.95)';
            default: return 'rgba(15, 98, 254, 0.95)';
        }
    }
    
    /**
     * Get border color for notification type
     */
    getBorderColor(type) {
        switch (type) {
            case 'success': return '#198038';
            case 'warning': return '#8e6a00';
            case 'error': return '#750e13';
            default: return '#001d6c';
        }
    }
    
    /**
     * Get icon for notification type
     */
    getIcon(type) {
        switch (type) {
            case 'success': return '✓';
            case 'warning': return '⚠';
            case 'error': return '✗';
            default: return 'ℹ';
        }
    }
    
    /**
     * Clear all notifications
     */
    clear() {
        this.notifications = [];
    }
    
    /**
     * Show tool collected notification
     */
    showToolCollected(toolName) {
        this.show(`Collected: ${toolName}! Press E to use`, 'success', 4000);
    }
    
    /**
     * Show evidence collected notification
     */
    showEvidenceCollected(count, total) {
        this.show(`Evidence: ${count}/${total}`, 'info', 2000);
    }
    
    /**
     * Show enemy defeated notification
     */
    showEnemyDefeated(score) {
        this.show(`Enemy Defeated! +${score} points`, 'success', 2000);
    }
    
    /**
     * Show damage taken notification
     */
    showDamageTaken(damage) {
        this.show(`Took ${damage} damage!`, 'warning', 2000);
    }
    
    /**
     * Show tool activated notification
     */
    showToolActivated(toolName) {
        this.show(`${toolName} activated!`, 'info', 2000);
    }
    
    /**
     * Show level objective
     */
    showObjective(text) {
        this.show(text, 'info', 5000);
    }
    
    /**
     * Show success message
     */
    showSuccess(message, duration = 3000) {
        this.show(message, 'success', duration);
    }
    
    /**
     * Show info message
     */
    showInfo(message, duration = 3000) {
        this.show(message, 'info', duration);
    }
    
    /**
     * Show warning message
     */
    showWarning(message, duration = 3000) {
        this.show(message, 'warning', duration);
    }
    
    /**
     * Show error message
     */
    showError(message, duration = 3000) {
        this.show(message, 'error', duration);
    }
}

// Made with Bob
