/**
 * Learning System
 * Manages educational content, pop-ups, and learning moments
 */
class LearningSystem {
    constructor() {
        this.currentModal = null;
        this.isModalActive = false;
        this.modalQueue = [];
        
        // Tool learning content
        this.toolLearning = {
            'edt_lens': {
                name: 'EDT Lens',
                icon: '🔍',
                title: 'Enterprise Design Thinking',
                concept: 'Observe → Reflect → Make',
                description: 'EDT helps you see clearly through complexity. Use the loop of observing users, reflecting on insights, and making solutions to navigate unclear requirements.',
                application: 'Press E to activate and clear the fog of confusion',
                framework: 'EDT',
                masteryGain: 20
            },
            'outcome_compass': {
                name: 'Outcome Compass',
                icon: '🧭',
                title: 'Marginal Thinking',
                concept: 'Outcome Before Output',
                description: 'Start with the BIGGER OUTCOME you want to achieve, then think about the output (what to build). This prevents building features without purpose.',
                application: 'Shows the true path by focusing on outcomes, not just features',
                framework: 'PDLC',
                masteryGain: 20
            },
            'pdlc_framework': {
                name: 'PDLC Framework',
                icon: '🔄',
                title: 'Product Development Lifecycle',
                concept: 'Discovery → Delivery → Launch & Scale',
                description: 'PDLC helps IBM build winning products. Discovery: Are we building the right thing? Delivery: Are we building it right? Launch & Scale: Are customers getting value?',
                application: 'Guides you through the complete product journey from idea to scale',
                framework: 'PDLC',
                masteryGain: 20
            },
            'trust_bridge': {
                name: 'Trust Bridge',
                icon: '🌉',
                title: 'Psychological Safety',
                concept: 'Trust Enables Performance',
                description: 'Psychological safety is the biggest indicator of team performance. When team members feel safe to speak up, ask for help, and admit mistakes, teams thrive.',
                application: 'Creates stable foundations and bridges gaps between team members',
                framework: 'Team Dynamics',
                masteryGain: 20
            },
            'hills_statement': {
                name: 'Hills Statement',
                icon: '⛰️',
                title: 'Hills Writing',
                concept: 'Who-What-Wow',
                description: 'Hills are statements of intent written as meaningful user outcomes. They align cross-functional teams (PM, Design, Engineering) on what success looks like.',
                application: 'Connects different paths and aligns teams on shared goals',
                framework: 'Hills',
                masteryGain: 20
            },
            'storytelling_scroll': {
                name: 'Storytelling Scroll',
                icon: '📜',
                title: 'Executive Communication',
                concept: 'Get to the Point',
                description: 'Executives have limited time. Lead with the outcome, explain WHY it matters, and be clear about your ask. Storytelling connects people emotionally.',
                application: 'Creates express paths to reach executives quickly',
                framework: 'Communication',
                masteryGain: 20
            },
            'instrumentation_toolkit': {
                name: 'Instrumentation Toolkit',
                icon: '📊',
                title: 'Consumability Metrics',
                concept: 'Measure to Improve',
                description: 'You can\'t improve what you don\'t measure. Track Time to Value, Completion Rates, CSAT, and Outcomes to make data-driven decisions.',
                application: 'Reveals metrics and shows the path to improvement',
                framework: 'Consumability',
                masteryGain: 20
            }
        };
        
        // Enemy learning content
        this.enemyLearning = {
            'confusion_fog': {
                name: 'Confusion Fog',
                challenge: 'Unclear Requirements',
                solution: 'Use EDT to observe, reflect, and make sense of complexity',
                lesson: 'When requirements are unclear, use frameworks to bring clarity'
            },
            'feature_creep': {
                name: 'Feature Creep',
                challenge: 'Building Without Purpose',
                solution: 'Focus on outcomes first, then decide what to build',
                lesson: 'Features without outcomes waste time and resources'
            },
            'deadline_dragon': {
                name: 'Deadline Dragon',
                challenge: 'Time Pressure Without Priorities',
                solution: 'Use Hills to align on what matters most',
                lesson: 'Clear priorities help teams move fast in the right direction'
            }
        };
    }
    
    /**
     * Show learning modal when tool is collected
     */
    showToolLearning(toolId, onClose) {
        const learning = this.toolLearning[toolId];
        if (!learning) return;
        
        this.isModalActive = true;
        
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'learning-modal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease-out;
        `;
        
        // Create modal content
        const modal = document.createElement('div');
        modal.className = 'learning-modal';
        modal.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 32px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: slideUp 0.3s ease-out;
            text-align: center;
        `;
        
        modal.innerHTML = `
            <div style="font-size: 64px; margin-bottom: 16px;">${learning.icon}</div>
            <h2 style="color: #0f62fe; margin: 0 0 8px 0; font-size: 28px;">${learning.name} Acquired!</h2>
            <h3 style="color: #161616; margin: 0 0 16px 0; font-size: 20px;">${learning.title}</h3>
            <div style="background: #f4f4f4; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                <div style="color: #0f62fe; font-weight: bold; margin-bottom: 8px;">${learning.concept}</div>
                <div style="color: #525252; line-height: 1.6; text-align: left;">${learning.description}</div>
            </div>
            <div style="background: #e8f4ff; padding: 12px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #0f62fe;">
                <div style="color: #161616; font-weight: bold; margin-bottom: 4px;">How to Use:</div>
                <div style="color: #525252; text-align: left;">${learning.application}</div>
            </div>
            <div style="color: #24a148; font-weight: bold; margin-bottom: 16px;">
                +${learning.masteryGain} ${learning.framework} Mastery
            </div>
            <button id="closeModal" style="
                background: #0f62fe;
                color: white;
                border: none;
                padding: 12px 32px;
                border-radius: 6px;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                transition: background 0.2s;
            ">Got it! Let's use it!</button>
        `;
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        // Add animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translateY(30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            #closeModal:hover {
                background: #0353e9 !important;
            }
        `;
        document.head.appendChild(style);
        
        // Close button handler
        const closeBtn = modal.querySelector('#closeModal');
        closeBtn.addEventListener('click', () => {
            overlay.style.animation = 'fadeIn 0.2s ease-out reverse';
            setTimeout(() => {
                document.body.removeChild(overlay);
                document.head.removeChild(style);
                this.isModalActive = false;
                if (onClose) onClose();
            }, 200);
        });
        
        this.currentModal = overlay;
    }
    
    /**
     * Show quick tip when using a tool effectively
     */
    showQuickTip(message, type = 'success') {
        const tip = document.createElement('div');
        tip.className = 'quick-tip';
        tip.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#24a148' : '#0f62fe'};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: bold;
            z-index: 9999;
            animation: tipSlide 0.3s ease-out;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        `;
        tip.textContent = message;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes tipSlide {
                from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(tip);
        
        setTimeout(() => {
            tip.style.animation = 'tipSlide 0.3s ease-out reverse';
            setTimeout(() => {
                document.body.removeChild(tip);
                document.head.removeChild(style);
            }, 300);
        }, 2500);
    }
    
    /**
     * Show enemy defeat learning
     */
    showEnemyDefeatLearning(enemyType) {
        const learning = this.enemyLearning[enemyType];
        if (!learning) return;
        
        this.showQuickTip(`✓ Overcame ${learning.challenge}!`, 'success');
    }
    
    /**
     * Get tool learning data
     */
    getToolLearning(toolId) {
        return this.toolLearning[toolId];
    }
    
    /**
     * Check if modal is active
     */
    isShowingModal() {
        return this.isModalActive;
    }
}

// Made with Bob
