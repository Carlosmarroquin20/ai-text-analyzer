/* ========================================
   AI Text Analyzer - API Client
   Backend Connection Module
   ======================================== */

// API Configuration
const API_BASE_URL = 'http://localhost:8000';
const USE_BACKEND = true; // Set to false to use local AI engine

/**
 * Check if backend is available
 */
async function checkBackendHealth() {
    if (!USE_BACKEND) return false;

    try {
        const response = await fetch(`${API_BASE_URL}/health`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log('✅ Backend connected:', data);
            return true;
        }
    } catch (error) {
        console.warn('⚠️ Backend not available, using local engine');
        return false;
    }

    return false;
}

/**
 * Analyze text using backend API
 * @param {string} text - Text to analyze
 * @param {Object} options - Analysis options
 * @returns {Promise<Object>} - Analysis results
 */
async function analyzeWithBackend(text, options) {
    try {
        const response = await fetch(`${API_BASE_URL}/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                options: options
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Backend analysis failed');
        }

        const results = await response.json();
        return results;

    } catch (error) {
        console.error('Backend API Error:', error);
        throw error;
    }
}

/**
 * Get statistics from backend
 * @returns {Promise<Object>} - Statistics data
 */
async function getBackendStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/stats`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error('Failed to fetch stats:', error);
    }

    return null;
}

/**
 * Get history from backend
 * @param {number} limit - Number of items to fetch
 * @returns {Promise<Object>} - History data
 */
async function getBackendHistory(limit = 10) {
    try {
        const response = await fetch(`${API_BASE_URL}/history?limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error('Failed to fetch history:', error);
    }

    return null;
}
