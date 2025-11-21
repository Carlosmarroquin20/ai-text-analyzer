/* ========================================
   AI Text Analyzer - Main Application
   UI Logic & Event Handlers
   ======================================== */

// Initialize AI Engine
const aiEngine = new AIEngine();

// DOM Elements
const inputText = document.getElementById('inputText');
const analyzeBtn = document.getElementById('analyzeBtn');
const clearBtn = document.getElementById('clearBtn');
const exportBtn = document.getElementById('exportBtn');
const charCount = document.getElementById('charCount');
const wordCount = document.getElementById('wordCount');
const resultsPanel = document.getElementById('resultsPanel');
const resultsContainer = document.getElementById('resultsContainer');
const loadingOverlay = document.getElementById('loadingOverlay');

// Analysis checkboxes
const sentimentCheck = document.getElementById('sentimentCheck');
const keywordsCheck = document.getElementById('keywordsCheck');
const summaryCheck = document.getElementById('summaryCheck');
const readabilityCheck = document.getElementById('readabilityCheck');

// Store current results for export
let currentResults = null;
let currentText = '';

// History Management
const MAX_HISTORY_ITEMS = 10;
let analysisHistory = [];

// Theme Management
let currentTheme = 'dark';

/* ========================================
   Event Listeners
   ======================================== */

// Update character and word count on input
inputText.addEventListener('input', updateCounts);

// Analyze button click
analyzeBtn.addEventListener('click', performAnalysis);

// Clear button click
clearBtn.addEventListener('click', clearAll);

// Export button click
exportBtn.addEventListener('click', exportResults);

// History button click
const historyBtn = document.getElementById('historyBtn');
const historyPanel = document.getElementById('historyPanel');
const closeHistoryBtn = document.getElementById('closeHistoryBtn');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

if (historyBtn) {
    historyBtn.addEventListener('click', toggleHistoryPanel);
}

if (closeHistoryBtn) {
    closeHistoryBtn.addEventListener('click', () => {
        historyPanel.classList.remove('active');
    });
}

if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', clearHistory);
}

// Theme toggle button click
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// Handle Enter key in textarea (Ctrl+Enter to analyze)
inputText.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        performAnalysis();
    }
});

// Option card click handlers
document.querySelectorAll('.option-card').forEach(card => {
    card.addEventListener('click', function() {
        const checkbox = this.querySelector('input[type="checkbox"]');
        checkbox.checked = !checkbox.checked;
        this.classList.toggle('active', checkbox.checked);
    });
});

// Smooth scroll for same-page navigation links only
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Only prevent default and smooth scroll for same-page anchors
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href;
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });

                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        }
        // For external links (dashboard.html, index.html), let them navigate normally
    });
});

/* ========================================
   Core Functions
   ======================================== */

/**
 * Update character and word count
 */
function updateCounts() {
    const text = inputText.value;
    const chars = text.length;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    
    charCount.textContent = chars.toLocaleString();
    wordCount.textContent = words.toLocaleString();
}

/**
 * Perform text analysis
 */
async function performAnalysis() {
    const text = inputText.value.trim();
    
    // Validate input
    if (!text) {
        showNotification('Please enter some text to analyze', 'error');
        return;
    }
    
    if (text.length < 10) {
        showNotification('Please enter at least 10 characters', 'warning');
        return;
    }
    
    // Get selected analysis options
    const options = {
        sentiment: sentimentCheck.checked,
        keywords: keywordsCheck.checked,
        summary: summaryCheck.checked,
        readability: readabilityCheck.checked
    };
    
    // Check if at least one option is selected
    if (!Object.values(options).some(v => v)) {
        showNotification('Please select at least one analysis option', 'warning');
        return;
    }
    
    // Show loading overlay
    showLoading(true);
    
    // Simulate processing delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
        // Perform analysis
        const results = aiEngine.analyze(text, options);
        currentResults = results;
        currentText = text;
        
        // Display results
        displayResults(results);
        
        // Show results panel
        resultsPanel.style.display = 'block';
        
        // Scroll to results
        setTimeout(() => {
            resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);

        // Add to history
        addToHistory(text, results);

        showNotification('Analysis completed successfully!', 'success');
        
    } catch (error) {
        console.error('Analysis error:', error);
        showNotification(error.message || 'An error occurred during analysis', 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Display analysis results
 * @param {Object} results - Analysis results
 */
function displayResults(results) {
    resultsContainer.innerHTML = '';
    
    // Sentiment Analysis
    if (results.sentiment) {
        const sentimentCard = createSentimentCard(results.sentiment);
        resultsContainer.appendChild(sentimentCard);
    }
    
    // Keywords Extraction
    if (results.keywords) {
        const keywordsCard = createKeywordsCard(results.keywords);
        resultsContainer.appendChild(keywordsCard);
    }
    
    // Text Summary
    if (results.summary) {
        const summaryCard = createSummaryCard(results.summary);
        resultsContainer.appendChild(summaryCard);
    }
    
    // Readability Score
    if (results.readability) {
        const readabilityCard = createReadabilityCard(results.readability);
        resultsContainer.appendChild(readabilityCard);
    }
}

/**
 * Create sentiment analysis card
 * @param {Object} sentiment - Sentiment data
 * @returns {HTMLElement} - Card element
 */
function createSentimentCard(sentiment) {
    const card = document.createElement('div');
    card.className = 'result-card';
    card.style.animation = 'slideUp 0.5s ease';
    
    card.innerHTML = `
        <div class="result-header">
            <i class="fas fa-smile"></i>
            <h3>Sentiment Analysis</h3>
        </div>
        <div class="result-content">
            <div class="sentiment-indicator">
                <div class="sentiment-emoji">${sentiment.emoji}</div>
                <div class="sentiment-details">
                    <div class="sentiment-label" style="color: ${sentiment.color}">${sentiment.label}</div>
                    <div class="sentiment-score">${(parseFloat(sentiment.score) * 100).toFixed(0)}%</div>
                </div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${sentiment.confidence}%; background: ${sentiment.color}"></div>
            </div>
            <div class="sentiment-stats" style="margin-top: 1rem; color: var(--text-secondary);">
                <p><i class="fas fa-plus-circle" style="color: #10b981"></i> Positive words: <strong>${sentiment.positiveWords}</strong></p>
                <p><i class="fas fa-minus-circle" style="color: #ef4444"></i> Negative words: <strong>${sentiment.negativeWords}</strong></p>
                <p><i class="fas fa-chart-line" style="color: #f59e0b"></i> Confidence: <strong>${sentiment.confidence}%</strong></p>
            </div>
        </div>
    `;
    
    return card;
}

/**
 * Create keywords card
 * @param {Array} keywords - Keywords array
 * @returns {HTMLElement} - Card element
 */
function createKeywordsCard(keywords) {
    const card = document.createElement('div');
    card.className = 'result-card';
    card.style.animation = 'slideUp 0.6s ease';
    
    const keywordTags = keywords.map(kw => 
        `<span class="keyword-tag" title="Frequency: ${kw.frequency}">
            ${kw.word} <small>(${kw.frequency})</small>
        </span>`
    ).join('');
    
    card.innerHTML = `
        <div class="result-header">
            <i class="fas fa-key"></i>
            <h3>Key Terms</h3>
        </div>
        <div class="result-content">
            <p style="margin-bottom: 1rem; color: var(--text-secondary);">
                Most important words and phrases identified in your text:
            </p>
            <div class="keywords-container">
                ${keywordTags || '<p>No significant keywords found.</p>'}
            </div>
        </div>
    `;
    
    return card;
}

/**
 * Create summary card
 * @param {string} summary - Summary text
 * @returns {HTMLElement} - Card element
 */
function createSummaryCard(summary) {
    const card = document.createElement('div');
    card.className = 'result-card';
    card.style.animation = 'slideUp 0.7s ease';
    
    card.innerHTML = `
        <div class="result-header">
            <i class="fas fa-file-alt"></i>
            <h3>AI Summary</h3>
        </div>
        <div class="result-content">
            <p style="margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">
                <i class="fas fa-info-circle"></i> Automatically generated summary:
            </p>
            <div class="summary-text">${summary}</div>
        </div>
    `;
    
    return card;
}

/**
 * Create readability card
 * @param {Object} readability - Readability data
 * @returns {HTMLElement} - Card element
 */
function createReadabilityCard(readability) {
    const card = document.createElement('div');
    card.className = 'result-card';
    card.style.animation = 'slideUp 0.8s ease';
    
    // Determine color based on score
    let scoreColor;
    if (readability.fleschScore >= 70) {
        scoreColor = '#10b981';
    } else if (readability.fleschScore >= 50) {
        scoreColor = '#f59e0b';
    } else {
        scoreColor = '#ef4444';
    }
    
    card.innerHTML = `
        <div class="result-header">
            <i class="fas fa-book-reader"></i>
            <h3>Readability Analysis</h3>
        </div>
        <div class="result-content">
            <div class="readability-meter">
                <div class="meter-item">
                    <div class="meter-value" style="color: ${scoreColor}">${readability.fleschScore}</div>
                    <div class="meter-label">Flesch Score</div>
                </div>
                <div class="meter-item">
                    <div class="meter-value" style="color: var(--primary-color)">${readability.level}</div>
                    <div class="meter-label">Reading Level</div>
                </div>
                <div class="meter-item">
                    <div class="meter-value" style="color: var(--accent-color)">${readability.grade}</div>
                    <div class="meter-label">Grade Level</div>
                </div>
            </div>
            <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color);">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; color: var(--text-secondary);">
                    <div>
                        <p><strong>Sentences:</strong> ${readability.sentenceCount}</p>
                        <p><strong>Words:</strong> ${readability.wordCount}</p>
                    </div>
                    <div>
                        <p><strong>Avg Words/Sentence:</strong> ${readability.avgWordsPerSentence}</p>
                        <p><strong>Avg Syllables/Word:</strong> ${readability.avgSyllablesPerWord}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

/**
 * Clear all inputs and results
 */
function clearAll() {
    inputText.value = '';
    updateCounts();
    resultsPanel.style.display = 'none';
    currentResults = null;
    currentText = '';
    showNotification('Cleared successfully', 'success');
}

/**
 * Export results to JSON file
 */
function exportResults() {
    if (!currentResults || !currentText) {
        showNotification('No analysis results to export', 'warning');
        return;
    }
    
    try {
        const jsonData = aiEngine.exportResults(currentResults, currentText);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `text-analysis-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('Results exported successfully!', 'success');
    } catch (error) {
        console.error('Export error:', error);
        showNotification('Failed to export results', 'error');
    }
}

/**
 * Show/hide loading overlay
 * @param {boolean} show - Show or hide
 */
function showLoading(show) {
    if (show) {
        loadingOverlay.classList.add('active');
    } else {
        loadingOverlay.classList.remove('active');
    }
}

/**
 * Show notification message
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, warning)
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10001;
        animation: slideIn 0.3s ease;
        box-shadow: var(--shadow-lg);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        max-width: 400px;
    `;
    
    // Set color based on type
    let bgColor, icon;
    switch(type) {
        case 'success':
            bgColor = '#10b981';
            icon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'error':
            bgColor = '#ef4444';
            icon = '<i class="fas fa-times-circle"></i>';
            break;
        case 'warning':
            bgColor = '#f59e0b';
            icon = '<i class="fas fa-exclamation-triangle"></i>';
            break;
        default:
            bgColor = '#6366f1';
            icon = '<i class="fas fa-info-circle"></i>';
    }
    
    notification.style.background = bgColor;
    notification.innerHTML = `${icon}<span>${message}</span>`;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

/* ========================================
   History Management Functions
   ======================================== */

/**
 * Load history from localStorage on page load
 */
function loadHistoryFromStorage() {
    try {
        const savedHistory = localStorage.getItem('textAnalysisHistory');
        if (savedHistory) {
            analysisHistory = JSON.parse(savedHistory);
        }
    } catch (error) {
        console.error('Error loading history:', error);
        analysisHistory = [];
    }
}

/**
 * Save history to localStorage
 */
function saveHistoryToStorage() {
    try {
        localStorage.setItem('textAnalysisHistory', JSON.stringify(analysisHistory));
    } catch (error) {
        console.error('Error saving history:', error);
        showNotification('Failed to save to history', 'error');
    }
}

/**
 * Add analysis to history
 * @param {string} text - Original text
 * @param {Object} results - Analysis results
 */
function addToHistory(text, results) {
    const historyItem = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        text: text,
        textPreview: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        results: results,
        wordCount: text.trim().split(/\s+/).length,
        charCount: text.length
    };

    // Add to beginning of array
    analysisHistory.unshift(historyItem);

    // Keep only last MAX_HISTORY_ITEMS
    if (analysisHistory.length > MAX_HISTORY_ITEMS) {
        analysisHistory = analysisHistory.slice(0, MAX_HISTORY_ITEMS);
    }

    saveHistoryToStorage();
    updateHistoryDisplay();
}

/**
 * Load analysis from history
 * @param {number} id - History item ID
 */
function loadFromHistory(id) {
    const historyItem = analysisHistory.find(item => item.id === id);

    if (!historyItem) {
        showNotification('History item not found', 'error');
        return;
    }

    // Load the text
    inputText.value = historyItem.text;
    updateCounts();

    // Load the results
    currentResults = historyItem.results;
    currentText = historyItem.text;
    displayResults(historyItem.results);

    // Show results panel
    resultsPanel.style.display = 'block';

    // Close history panel
    historyPanel.classList.remove('active');

    // Scroll to results
    setTimeout(() => {
        resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);

    showNotification('Analysis loaded from history', 'success');
}

/**
 * Delete item from history
 * @param {number} id - History item ID
 */
function deleteFromHistory(id) {
    analysisHistory = analysisHistory.filter(item => item.id !== id);
    saveHistoryToStorage();
    updateHistoryDisplay();
    showNotification('Item deleted from history', 'success');
}

/**
 * Clear all history
 */
function clearHistory() {
    if (analysisHistory.length === 0) {
        showNotification('History is already empty', 'warning');
        return;
    }

    if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
        analysisHistory = [];
        saveHistoryToStorage();
        updateHistoryDisplay();
        showNotification('History cleared', 'success');
    }
}

/**
 * Toggle history panel visibility
 */
function toggleHistoryPanel() {
    historyPanel.classList.toggle('active');
    updateHistoryDisplay();
}

/**
 * Update history display
 */
function updateHistoryDisplay() {
    const historyContainer = document.getElementById('historyContainer');

    if (!historyContainer) return;

    if (analysisHistory.length === 0) {
        historyContainer.innerHTML = `
            <div class="empty-history">
                <i class="fas fa-history" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                <p>No analysis history yet</p>
                <p style="font-size: 0.875rem; color: var(--text-secondary);">Your analyzed texts will appear here</p>
            </div>
        `;
        return;
    }

    historyContainer.innerHTML = analysisHistory.map(item => {
        const date = new Date(item.timestamp);
        const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

        return `
            <div class="history-item" data-id="${item.id}">
                <div class="history-item-header">
                    <div class="history-item-date">
                        <i class="fas fa-clock"></i>
                        ${dateStr}
                    </div>
                    <div class="history-item-actions">
                        <button class="history-load-btn" onclick="loadFromHistory(${item.id})" title="Load this analysis">
                            <i class="fas fa-upload"></i>
                        </button>
                        <button class="history-delete-btn" onclick="deleteFromHistory(${item.id})" title="Delete from history">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="history-item-preview">
                    ${item.textPreview}
                </div>
                <div class="history-item-stats">
                    <span><i class="fas fa-font"></i> ${item.charCount} chars</span>
                    <span><i class="fas fa-text-width"></i> ${item.wordCount} words</span>
                    ${item.results.sentiment ? `<span><i class="fas fa-smile"></i> ${item.results.sentiment.label}</span>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

/* ========================================
   Theme Management Functions
   ======================================== */

/**
 * Load theme from localStorage on page load
 */
function loadThemeFromStorage() {
    try {
        const savedTheme = localStorage.getItem('appTheme');
        if (savedTheme) {
            currentTheme = savedTheme;
            applyTheme(currentTheme);
        }
    } catch (error) {
        console.error('Error loading theme:', error);
    }
}

/**
 * Apply theme to document
 * @param {string} theme - Theme name ('dark' or 'light')
 */
function applyTheme(theme) {
    const themeToggleBtn = document.getElementById('themeToggle');
    const icon = themeToggleBtn?.querySelector('i');

    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggleBtn?.classList.add('active');
        if (icon) {
            icon.className = 'fas fa-moon';
        }
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggleBtn?.classList.remove('active');
        if (icon) {
            icon.className = 'fas fa-sun';
        }
    }
}

/**
 * Toggle between light and dark theme
 */
function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(currentTheme);

    // Save to localStorage
    try {
        localStorage.setItem('appTheme', currentTheme);
    } catch (error) {
        console.error('Error saving theme:', error);
    }

    // Show notification
    const themeLabel = currentTheme === 'dark' ? 'Dark' : 'Light';
    showNotification(`${themeLabel} theme activated`, 'success');
}

/* ========================================
   Sample Text Examples
   ======================================== */

// Add sample text on load (optional)
const sampleTexts = [
    "This product is absolutely amazing! I love everything about it. The quality is outstanding and it exceeded all my expectations. Highly recommend to everyone!",
    "I'm very disappointed with this service. The customer support was terrible and the product arrived damaged. Would not recommend to anyone.",
    "The presentation was informative and well-structured. The speaker covered all the key topics and engaged the audience effectively. Overall, it was a valuable learning experience."
];

// Uncomment to load a random sample on page load
// window.addEventListener('load', () => {
//     const randomSample = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
//     inputText.value = randomSample;
//     updateCounts();
// });

// Load history and theme from localStorage on page load
window.addEventListener('load', () => {
    loadHistoryFromStorage();
    loadThemeFromStorage();
});

/* ========================================
   Keyboard Shortcuts Info
   ======================================== */

console.log('%c🚀 AI Text Analyzer', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%cKeyboard Shortcuts:', 'font-size: 14px; font-weight: bold;');
console.log('Ctrl + Enter: Analyze text');
console.log('%cDeveloped with ❤️ using Advanced NLP', 'color: #10b981;');

/* ========================================
   Animation Styles (Dynamic)
   ======================================== */

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
