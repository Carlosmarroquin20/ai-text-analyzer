/* ========================================
   AI Text Analyzer - AI Engine
   Advanced NLP Processing Module
   ======================================== */

class AIEngine {
    constructor() {
        // Sentiment analysis word dictionaries
        this.positiveWords = [
            'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'perfect', 'love', 'loved', 'best',
            'beautiful', 'awesome', 'outstanding', 'brilliant', 'superb', 'incredible', 'fabulous', 'terrific',
            'delightful', 'impressive', 'exceptional', 'marvelous', 'phenomenal', 'magnificent', 'splendid',
            'happy', 'joy', 'pleased', 'satisfied', 'enjoy', 'enjoyed', 'like', 'liked', 'recommend', 'positive',
            'success', 'successful', 'advantage', 'beneficial', 'improve', 'improved', 'better', 'superior'
        ];

        this.negativeWords = [
            'bad', 'terrible', 'horrible', 'awful', 'poor', 'worst', 'hate', 'hated', 'disappointing', 'disappointed',
            'useless', 'waste', 'boring', 'sucks', 'pathetic', 'disgusting', 'annoying', 'frustrating', 'frustrated',
            'angry', 'sad', 'unhappy', 'dislike', 'disliked', 'negative', 'problem', 'issue', 'fail', 'failed',
            'failure', 'wrong', 'error', 'mistake', 'difficult', 'hard', 'complicated', 'confusing', 'expensive',
            'slow', 'unreliable', 'broken', 'defective', 'damaged'
        ];

        // Common stop words to exclude from keyword extraction
        this.stopWords = [
            'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at',
            'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'could',
            'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has',
            'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if',
            'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me', 'might', 'more', 'most', 'must', 'my', 'myself',
            'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves',
            'out', 'over', 'own', 's', 'same', 'she', 'should', 'so', 'some', 'such', 't', 'than', 'that', 'the',
            'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through',
            'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which',
            'while', 'who', 'whom', 'why', 'will', 'with', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves'
        ];
    }

    /**
     * Main analysis function that runs all requested analyses
     * @param {string} text - Input text to analyze
     * @param {Object} options - Analysis options
     * @returns {Object} - Analysis results
     */
    analyze(text, options) {
        if (!text || text.trim().length === 0) {
            throw new Error('Please provide text to analyze');
        }

        const results = {};

        // Run sentiment analysis
        if (options.sentiment) {
            results.sentiment = this.analyzeSentiment(text);
        }

        // Extract keywords
        if (options.keywords) {
            results.keywords = this.extractKeywords(text);
        }

        // Generate summary
        if (options.summary) {
            results.summary = this.generateSummary(text);
        }

        // Calculate readability
        if (options.readability) {
            results.readability = this.calculateReadability(text);
        }

        return results;
    }

    /**
     * Analyze sentiment of text
     * @param {string} text - Input text
     * @returns {Object} - Sentiment analysis results
     */
    analyzeSentiment(text) {
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        
        let positiveCount = 0;
        let negativeCount = 0;

        // Count positive and negative words
        words.forEach(word => {
            if (this.positiveWords.includes(word)) {
                positiveCount++;
            }
            if (this.negativeWords.includes(word)) {
                negativeCount++;
            }
        });

        // Calculate sentiment score (-1 to 1)
        const totalSentimentWords = positiveCount + negativeCount;
        let score = 0;
        
        if (totalSentimentWords > 0) {
            score = (positiveCount - negativeCount) / totalSentimentWords;
        }

        // Determine sentiment label and emoji
        let label, emoji, color;
        
        if (score > 0.2) {
            label = 'Positive';
            emoji = '😊';
            color = '#10b981';
        } else if (score < -0.2) {
            label = 'Negative';
            emoji = '😞';
            color = '#ef4444';
        } else {
            label = 'Neutral';
            emoji = '😐';
            color = '#f59e0b';
        }

        // Calculate confidence (0-100)
        const confidence = Math.min(100, totalSentimentWords * 5);

        return {
            score: score.toFixed(2),
            label: label,
            emoji: emoji,
            color: color,
            positiveWords: positiveCount,
            negativeWords: negativeCount,
            confidence: Math.round(confidence)
        };
    }

    /**
     * Extract important keywords from text
     * @param {string} text - Input text
     * @returns {Array} - Array of keywords with frequency
     */
    extractKeywords(text) {
        // Tokenize and clean text
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        
        // Count word frequency (excluding stop words)
        const wordFreq = {};
        
        words.forEach(word => {
            if (word.length > 3 && !this.stopWords.includes(word)) {
                wordFreq[word] = (wordFreq[word] || 0) + 1;
            }
        });

        // Sort by frequency and get top keywords
        const sortedWords = Object.entries(wordFreq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([word, freq]) => ({
                word: word,
                frequency: freq,
                importance: Math.min(100, freq * 10)
            }));

        return sortedWords;
    }

    /**
     * Generate text summary using extractive method
     * @param {string} text - Input text
     * @returns {string} - Summary text
     */
    generateSummary(text) {
        // Split text into sentences
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        
        if (sentences.length <= 2) {
            return text;
        }

        // Score sentences based on keyword frequency
        const keywords = this.extractKeywords(text);
        const keywordSet = new Set(keywords.map(k => k.word));

        const sentenceScores = sentences.map(sentence => {
            const words = sentence.toLowerCase().match(/\b\w+\b/g) || [];
            const score = words.filter(word => keywordSet.has(word)).length;
            return { sentence: sentence.trim(), score: score };
        });

        // Sort by score and take top sentences (up to 3)
        const topSentences = sentenceScores
            .sort((a, b) => b.score - a.score)
            .slice(0, Math.min(3, Math.ceil(sentences.length / 3)))
            .sort((a, b) => sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence))
            .map(s => s.sentence);

        return topSentences.join(' ');
    }

    /**
     * Calculate readability scores
     * @param {string} text - Input text
     * @returns {Object} - Readability metrics
     */
    calculateReadability(text) {
        // Count sentences, words, and syllables
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
        const words = text.match(/\b\w+\b/g) || [];
        const syllableCount = this.countSyllables(text);

        const sentenceCount = sentences.length || 1;
        const wordCount = words.length || 1;

        // Calculate average words per sentence
        const avgWordsPerSentence = wordCount / sentenceCount;

        // Calculate average syllables per word
        const avgSyllablesPerWord = syllableCount / wordCount;

        // Flesch Reading Ease Score (0-100, higher is easier)
        const fleschScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
        const normalizedFlesch = Math.max(0, Math.min(100, Math.round(fleschScore)));

        // Determine reading level
        let level, grade;
        if (normalizedFlesch >= 90) {
            level = 'Very Easy';
            grade = '5th grade';
        } else if (normalizedFlesch >= 80) {
            level = 'Easy';
            grade = '6th grade';
        } else if (normalizedFlesch >= 70) {
            level = 'Fairly Easy';
            grade = '7th grade';
        } else if (normalizedFlesch >= 60) {
            level = 'Standard';
            grade = '8-9th grade';
        } else if (normalizedFlesch >= 50) {
            level = 'Fairly Difficult';
            grade = '10-12th grade';
        } else if (normalizedFlesch >= 30) {
            level = 'Difficult';
            grade = 'College';
        } else {
            level = 'Very Difficult';
            grade = 'College Graduate';
        }

        return {
            fleschScore: normalizedFlesch,
            level: level,
            grade: grade,
            avgWordsPerSentence: avgWordsPerSentence.toFixed(1),
            avgSyllablesPerWord: avgSyllablesPerWord.toFixed(1),
            sentenceCount: sentenceCount,
            wordCount: wordCount
        };
    }

    /**
     * Count syllables in text (approximate)
     * @param {string} text - Input text
     * @returns {number} - Syllable count
     */
    countSyllables(text) {
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        let totalSyllables = 0;

        words.forEach(word => {
            // Basic syllable counting algorithm
            word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
            word = word.replace(/^y/, '');
            const syllables = word.match(/[aeiouy]{1,2}/g);
            totalSyllables += syllables ? syllables.length : 1;
        });

        return totalSyllables;
    }

    /**
     * Export results to JSON
     * @param {Object} results - Analysis results
     * @param {string} originalText - Original input text
     * @returns {string} - JSON string
     */
    exportResults(results, originalText) {
        const exportData = {
            timestamp: new Date().toISOString(),
            originalText: originalText,
            analysis: results,
            metadata: {
                analyzer: 'AI Text Analyzer v1.0',
                engine: 'Advanced NLP Engine'
            }
        };

        return JSON.stringify(exportData, null, 2);
    }
}

// Export the AI Engine class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIEngine;
}
