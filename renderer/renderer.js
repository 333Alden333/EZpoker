const { ipcRenderer } = require('electron');

// State management
let gameState = {
    position: 'BTN',
    stackSize: 100,
    holeCards: ['A♠', 'K♥'],
    board: [],
    street: 'PREFLOP',
    opponents: [
        {
            position: 'UTG',
            stats: { vpip: 15, pfr: 12, foldToCbet: 65 },
            gtoDeviation: 2
        }
    ],
    isLocked: false
};

// GTO lookup tables (simplified for demo)
const gtoRanges = {
    'BTN': {
        'PREFLOP': {
            'AsKh': { action: 'RAISE 3x', frequencies: { raise: 68, call: 22, fold: 10 } },
            'AsKs': { action: 'RAISE 3x', frequencies: { raise: 75, call: 20, fold: 5 } },
            'default': { action: 'FOLD', frequencies: { raise: 0, call: 15, fold: 85 } }
        }
    },
    'UTG': {
        'PREFLOP': {
            'AsKh': { action: 'RAISE 3x', frequencies: { raise: 65, call: 25, fold: 10 } },
            'default': { action: 'FOLD', frequencies: { raise: 0, call: 10, fold: 90 } }
        }
    }
};

// Initialize UI
function initializeUI() {
    updateGameStateDisplay();
    updateGTORecommendation();
    setupEventListeners();
}

// Event listeners
function setupEventListeners() {
    // Window controls
    document.getElementById('minimize-btn').addEventListener('click', () => {
        ipcRenderer.invoke('minimize-window');
    });

    document.getElementById('close-btn').addEventListener('click', () => {
        ipcRenderer.invoke('close-window');
    });

    document.getElementById('lock-btn').addEventListener('click', toggleLock);

    // Manual input
    document.getElementById('update-gto').addEventListener('click', updateFromManualInput);
    
    // Card input formatting
    document.getElementById('manual-cards').addEventListener('input', formatCardInput);
    
    // Real-time updates
    document.getElementById('manual-position').addEventListener('change', updateFromManualInput);
    document.getElementById('manual-stack').addEventListener('input', updateFromManualInput);
}

// Toggle lock/unlock (click-through)
function toggleLock() {
    gameState.isLocked = !gameState.isLocked;
    const lockBtn = document.getElementById('lock-btn');
    
    if (gameState.isLocked) {
        lockBtn.textContent = '🔒';
        lockBtn.title = 'Unlock (Enable Interaction)';
        ipcRenderer.invoke('toggle-click-through', true);
    } else {
        lockBtn.textContent = '🔓';
        lockBtn.title = 'Lock (Click Through)';
        ipcRenderer.invoke('toggle-click-through', false);
    }
}

// Format card input (e.g., "askh" -> "AsKh")
function formatCardInput(event) {
    let value = event.target.value.toUpperCase().replace(/[^AKQJT23456789SHDCshdc]/g, '');
    
    if (value.length >= 2) {
        // Format as XsYh pattern
        const suits = { 'S': '♠', 'H': '♥', 'D': '♦', 'C': '♣' };
        let formatted = '';
        
        for (let i = 0; i < value.length; i += 2) {
            if (i + 1 < value.length) {
                const rank = value[i];
                const suit = suits[value[i + 1]] || value[i + 1];
                formatted += rank + suit;
            }
        }
        event.target.value = formatted.slice(0, 6); // Limit to 2 cards
    }
}

// Update from manual input
function updateFromManualInput() {
    const cardsInput = document.getElementById('manual-cards').value;
    const position = document.getElementById('manual-position').value;
    const stack = parseInt(document.getElementById('manual-stack').value) || 100;

    // Parse cards
    if (cardsInput.length >= 4) {
        const card1 = cardsInput.slice(0, 2);
        const card2 = cardsInput.slice(2, 4);
        gameState.holeCards = [card1, card2];
    }

    gameState.position = position;
    gameState.stackSize = stack;

    updateGameStateDisplay();
    updateGTORecommendation();
}

// Update game state display
function updateGameStateDisplay() {
    document.getElementById('position').textContent = gameState.position;
    document.getElementById('stack-size').textContent = `${gameState.stackSize}BB`;
    document.getElementById('card1').textContent = gameState.holeCards[0] || '?';
    document.getElementById('card2').textContent = gameState.holeCards[1] || '?';
    document.getElementById('street-label').textContent = gameState.street;

    // Update board cards
    const boardContainer = document.getElementById('board-cards');
    boardContainer.innerHTML = '';
    
    gameState.board.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.textContent = card;
        boardContainer.appendChild(cardElement);
    });
}

// Update GTO recommendation
function updateGTORecommendation() {
    const positionRanges = gtoRanges[gameState.position];
    if (!positionRanges) return;

    const streetRanges = positionRanges[gameState.street];
    if (!streetRanges) return;

    // Create hand key (simplified)
    const handKey = gameState.holeCards.join('').replace(/[♠♥♦♣]/g, match => {
        const suitMap = { '♠': 's', '♥': 'h', '♦': 'd', '♣': 'c' };
        return suitMap[match] || match;
    });

    const recommendation = streetRanges[handKey] || streetRanges['default'];
    
    // Update primary action
    document.getElementById('primary-action').textContent = recommendation.action;

    // Update frequency breakdown
    const freqContainer = document.getElementById('frequency-breakdown');
    freqContainer.innerHTML = '';

    Object.entries(recommendation.frequencies).forEach(([action, freq]) => {
        if (freq > 0) {
            const freqItem = document.createElement('div');
            freqItem.className = 'freq-item';
            freqItem.innerHTML = `
                <span class="action">${capitalizeFirst(action)}:</span>
                <span class="percentage">${freq}%</span>
            `;
            freqContainer.appendChild(freqItem);
        }
    });
}

// Utility functions
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Simulate opponent tracking (placeholder for future OCR integration)
function updateOpponentStats() {
    // This would be populated by actual game detection
    const opponentContainer = document.getElementById('opponent-1');
    // Update opponent stats display
}

// Auto-detection simulation (placeholder)
function simulateAutoDetection() {
    // This would integrate with screen capture and OCR
    // For now, just update status
    document.getElementById('detection-status').textContent = 'Auto Detection: Disabled';
    document.getElementById('solver-status').textContent = 'TexasSolver: Ready';
}

// Keyboard shortcuts
document.addEventListener('keydown', (event) => {
    if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
            case 'l':
                event.preventDefault();
                toggleLock();
                break;
            case 'm':
                event.preventDefault();
                ipcRenderer.invoke('minimize-window');
                break;
        }
    }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeUI);

// Expose functions for testing
window.gameAPI = {
    updateHoleCards: (card1, card2) => {
        gameState.holeCards = [card1, card2];
        updateGameStateDisplay();
        updateGTORecommendation();
    },
    updateBoard: (cards) => {
        gameState.board = cards;
        gameState.street = cards.length === 0 ? 'PREFLOP' : 
                          cards.length === 3 ? 'FLOP' :
                          cards.length === 4 ? 'TURN' : 'RIVER';
        updateGameStateDisplay();
        updateGTORecommendation();
    },
    updatePosition: (position) => {
        gameState.position = position;
        updateGameStateDisplay();
        updateGTORecommendation();
    }
};