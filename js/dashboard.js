/* ========================================
   AI Text Analyzer - Dashboard
   Analytics & Statistics Module
   ======================================== */

// Theme Management
let currentTheme = 'dark';

// Load data from localStorage
let analysisHistory = [];

/* ========================================
   Initialization
   ======================================== */

window.addEventListener('load', () => {
    loadThemeFromStorage();
    loadHistoryFromStorage();
    setupHistoryPanel();
    calculateStatistics();
    renderCharts();
});

/* ========================================
   Theme Management
   ======================================== */

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

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(currentTheme);

    try {
        localStorage.setItem('appTheme', currentTheme);
    } catch (error) {
        console.error('Error saving theme:', error);
    }

    // Re-render charts with new theme colors
    renderCharts();
}

// Theme toggle event listener
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

/* ========================================
   Data Loading
   ======================================== */

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

/* ========================================
   History Panel Setup
   ======================================== */

function setupHistoryPanel() {
    const historyBtn = document.getElementById('historyBtn');
    const historyPanel = document.getElementById('historyPanel');
    const closeHistoryBtn = document.getElementById('closeHistoryBtn');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');

    if (historyBtn) {
        historyBtn.addEventListener('click', () => {
            historyPanel.classList.toggle('active');
            updateHistoryDisplay();
        });
    }

    if (closeHistoryBtn) {
        closeHistoryBtn.addEventListener('click', () => {
            historyPanel.classList.remove('active');
        });
    }

    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
                analysisHistory = [];
                localStorage.setItem('textAnalysisHistory', JSON.stringify(analysisHistory));
                updateHistoryDisplay();
                calculateStatistics();
                renderCharts();
            }
        });
    }
}

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
   Statistics Calculation
   ======================================== */

function calculateStatistics() {
    const emptyDashboard = document.getElementById('emptyDashboard');
    const statsGrid = document.querySelector('.stats-grid');
    const chartsGrid = document.querySelector('.charts-grid');

    // Check if we have data
    if (analysisHistory.length === 0) {
        if (emptyDashboard) emptyDashboard.style.display = 'flex';
        if (statsGrid) statsGrid.style.display = 'none';
        if (chartsGrid) chartsGrid.style.display = 'none';
        return;
    }

    if (emptyDashboard) emptyDashboard.style.display = 'none';
    if (statsGrid) statsGrid.style.display = 'grid';
    if (chartsGrid) chartsGrid.style.display = 'grid';

    // Total Analyses
    const totalAnalyses = analysisHistory.length;
    document.getElementById('totalAnalyses').textContent = totalAnalyses;

    // Total Words
    const totalWords = analysisHistory.reduce((sum, item) => sum + item.wordCount, 0);
    document.getElementById('totalWords').textContent = totalWords.toLocaleString();

    // Average Sentiment
    const sentiments = analysisHistory
        .filter(item => item.results.sentiment)
        .map(item => item.results.sentiment.label);

    if (sentiments.length > 0) {
        const mostCommonSentiment = getMostCommon(sentiments);
        document.getElementById('avgSentiment').textContent = mostCommonSentiment;
    }

    // Average Readability
    const readabilityScores = analysisHistory
        .filter(item => item.results.readability)
        .map(item => item.results.readability.fleschScore);

    if (readabilityScores.length > 0) {
        const avgReadability = Math.round(
            readabilityScores.reduce((sum, score) => sum + score, 0) / readabilityScores.length
        );
        document.getElementById('avgReadability').textContent = avgReadability;
    }
}

function getMostCommon(arr) {
    const counts = {};
    arr.forEach(item => {
        counts[item] = (counts[item] || 0) + 1;
    });
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
}

/* ========================================
   Chart Rendering
   ======================================== */

let charts = {};

function renderCharts() {
    if (analysisHistory.length === 0) return;

    // Destroy existing charts
    Object.values(charts).forEach(chart => {
        if (chart) chart.destroy();
    });

    // Get theme colors
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#cbd5e1' : '#475569';
    const gridColor = isDark ? '#334155' : '#e2e8f0';

    // Render all charts
    renderSentimentChart(textColor, gridColor);
    renderTimelineChart(textColor, gridColor);
    renderKeywordsChart(textColor, gridColor);
    renderReadabilityChart(textColor, gridColor);
}

function renderSentimentChart(textColor, gridColor) {
    const ctx = document.getElementById('sentimentChart');
    if (!ctx) return;

    // Count sentiments
    const sentimentCounts = { Positive: 0, Negative: 0, Neutral: 0 };
    analysisHistory.forEach(item => {
        if (item.results.sentiment) {
            const label = item.results.sentiment.label;
            if (label in sentimentCounts) {
                sentimentCounts[label]++;
            }
        }
    });

    charts.sentiment = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Positive', 'Negative', 'Neutral'],
            datasets: [{
                data: [sentimentCounts.Positive, sentimentCounts.Negative, sentimentCounts.Neutral],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(245, 158, 11, 0.8)'
                ],
                borderColor: [
                    'rgba(16, 185, 129, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(245, 158, 11, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: textColor,
                        padding: 15,
                        font: { size: 12 }
                    }
                }
            }
        }
    });
}

function renderTimelineChart(textColor, gridColor) {
    const ctx = document.getElementById('timelineChart');
    if (!ctx) return;

    // Group by date
    const dateGroups = {};
    analysisHistory.forEach(item => {
        const date = new Date(item.timestamp).toLocaleDateString();
        dateGroups[date] = (dateGroups[date] || 0) + 1;
    });

    const dates = Object.keys(dateGroups).slice(-7); // Last 7 days
    const counts = dates.map(date => dateGroups[date]);

    charts.timeline = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Analyses',
                data: counts,
                borderColor: 'rgba(99, 102, 241, 1)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: { color: textColor }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: textColor },
                    grid: { color: gridColor }
                },
                x: {
                    ticks: { color: textColor },
                    grid: { color: gridColor }
                }
            }
        }
    });
}

function renderKeywordsChart(textColor, gridColor) {
    const ctx = document.getElementById('keywordsChart');
    if (!ctx) return;

    // Collect all keywords
    const keywordCounts = {};
    analysisHistory.forEach(item => {
        if (item.results.keywords) {
            item.results.keywords.forEach(kw => {
                keywordCounts[kw.word] = (keywordCounts[kw.word] || 0) + kw.frequency;
            });
        }
    });

    // Get top 10
    const sortedKeywords = Object.entries(keywordCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    const keywords = sortedKeywords.map(([word]) => word);
    const frequencies = sortedKeywords.map(([, freq]) => freq);

    charts.keywords = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: keywords,
            datasets: [{
                label: 'Frequency',
                data: frequencies,
                backgroundColor: 'rgba(139, 92, 246, 0.8)',
                borderColor: 'rgba(139, 92, 246, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: 'y',
            plugins: {
                legend: {
                    labels: { color: textColor }
                }
            },
            scales: {
                y: {
                    ticks: { color: textColor },
                    grid: { color: gridColor }
                },
                x: {
                    beginAtZero: true,
                    ticks: { color: textColor },
                    grid: { color: gridColor }
                }
            }
        }
    });
}

function renderReadabilityChart(textColor, gridColor) {
    const ctx = document.getElementById('readabilityChart');
    if (!ctx) return;

    // Get readability scores over time
    const scores = analysisHistory
        .filter(item => item.results.readability)
        .slice(-10)
        .map((item, index) => ({
            x: index + 1,
            y: item.results.readability.fleschScore
        }));

    charts.readability = new Chart(ctx, {
        type: 'line',
        data: {
            labels: scores.map(s => `#${s.x}`),
            datasets: [{
                label: 'Flesch Score',
                data: scores.map(s => s.y),
                borderColor: 'rgba(236, 72, 153, 1)',
                backgroundColor: 'rgba(236, 72, 153, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: { color: textColor }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { color: textColor },
                    grid: { color: gridColor }
                },
                x: {
                    ticks: { color: textColor },
                    grid: { color: gridColor }
                }
            }
        }
    });
}
