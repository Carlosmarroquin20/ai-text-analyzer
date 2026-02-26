"""
AI Text Analyzer - FastAPI Backend
Advanced NLP Processing with Real AI Models
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict
import spacy
from textblob import TextBlob
import re
from datetime import datetime
import sqlite3
import json

# Initialize FastAPI app
app = FastAPI(
    title="AI Text Analyzer API",
    description="Advanced NLP API for text analysis",
    version="1.0.0"
)

# CORS Configuration - Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load spaCy model (download with: python -m spacy download en_core_web_sm)
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Downloading spaCy model...")
    import os
    os.system("python -m spacy download en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

# Database setup
def init_db():
    """Initialize SQLite database"""
    conn = sqlite3.connect('text_analysis.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS analyses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            results TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# Pydantic Models
class AnalysisRequest(BaseModel):
    text: str
    options: Dict[str, bool] = {
        "sentiment": True,
        "keywords": True,
        "summary": True,
        "readability": True,
        "entities": True
    }

class SentimentResult(BaseModel):
    label: str
    score: float
    confidence: int
    positiveWords: int
    negativeWords: int
    emoji: str
    color: str

class KeywordResult(BaseModel):
    word: str
    frequency: int

class EntityResult(BaseModel):
    text: str
    label: str
    start: int
    end: int

class ReadabilityResult(BaseModel):
    fleschScore: int
    level: str
    grade: str
    sentenceCount: int
    wordCount: int
    avgWordsPerSentence: float
    avgSyllablesPerWord: float

class AnalysisResponse(BaseModel):
    sentiment: Optional[SentimentResult] = None
    keywords: Optional[List[KeywordResult]] = None
    summary: Optional[str] = None
    readability: Optional[ReadabilityResult] = None
    entities: Optional[List[EntityResult]] = None

# Helper Functions
def count_syllables(word: str) -> int:
    """Count syllables in a word"""
    word = word.lower()
    vowels = "aeiou"
    syllable_count = 0
    previous_was_vowel = False

    for char in word:
        is_vowel = char in vowels
        if is_vowel and not previous_was_vowel:
            syllable_count += 1
        previous_was_vowel = is_vowel

    if word.endswith('e'):
        syllable_count -= 1
    if syllable_count == 0:
        syllable_count = 1

    return syllable_count

def analyze_sentiment(text: str) -> SentimentResult:
    """Analyze sentiment using TextBlob"""
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity  # -1 to 1

    # Count positive and negative words
    positive_words = 0
    negative_words = 0

    for word in blob.words:
        word_blob = TextBlob(word)
        if word_blob.sentiment.polarity > 0.1:
            positive_words += 1
        elif word_blob.sentiment.polarity < -0.1:
            negative_words += 1

    # Determine label and emoji
    if polarity > 0.1:
        label = "Positive"
        emoji = "😊"
        color = "#10b981"
    elif polarity < -0.1:
        label = "Negative"
        emoji = "😞"
        color = "#ef4444"
    else:
        label = "Neutral"
        emoji = "😐"
        color = "#f59e0b"

    # Calculate confidence (0-100)
    confidence = min(int(abs(polarity) * 100), 100)

    return SentimentResult(
        label=label,
        score=abs(polarity),
        confidence=confidence,
        positiveWords=positive_words,
        negativeWords=negative_words,
        emoji=emoji,
        color=color
    )

def extract_keywords(text: str, top_n: int = 10) -> List[KeywordResult]:
    """Extract keywords using spaCy"""
    doc = nlp(text)

    # Count word frequencies (excluding stop words and punctuation)
    word_freq = {}
    for token in doc:
        if not token.is_stop and not token.is_punct and len(token.text) > 2:
            word_lower = token.lemma_.lower()
            word_freq[word_lower] = word_freq.get(word_lower, 0) + 1

    # Sort by frequency and get top N
    sorted_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)[:top_n]

    return [KeywordResult(word=word, frequency=freq) for word, freq in sorted_words]

def generate_summary(text: str) -> str:
    """Generate a simple extractive summary"""
    doc = nlp(text)
    sentences = list(doc.sents)

    if len(sentences) <= 2:
        return text

    # Score sentences by keyword density
    sentence_scores = {}
    word_freq = {}

    for token in doc:
        if not token.is_stop and not token.is_punct:
            word_freq[token.lemma_] = word_freq.get(token.lemma_, 0) + 1

    for sent in sentences:
        score = sum(word_freq.get(token.lemma_, 0) for token in sent if not token.is_stop)
        sentence_scores[sent.text] = score

    # Get top 2-3 sentences
    num_sentences = min(3, max(2, len(sentences) // 3))
    summary_sentences = sorted(sentence_scores.items(), key=lambda x: x[1], reverse=True)[:num_sentences]

    # Maintain original order
    summary_sentences = sorted(summary_sentences, key=lambda x: text.index(x[0]))
    summary = " ".join([sent[0] for sent in summary_sentences])

    return summary

def analyze_readability(text: str) -> ReadabilityResult:
    """Analyze text readability using Flesch Reading Ease"""
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if s.strip()]
    sentence_count = len(sentences)

    words = text.split()
    word_count = len(words)

    syllable_count = sum(count_syllables(word) for word in words)

    if sentence_count == 0 or word_count == 0:
        return ReadabilityResult(
            fleschScore=0,
            level="N/A",
            grade="N/A",
            sentenceCount=0,
            wordCount=0,
            avgWordsPerSentence=0.0,
            avgSyllablesPerWord=0.0
        )

    avg_words_per_sentence = round(word_count / sentence_count, 1)
    avg_syllables_per_word = round(syllable_count / word_count, 1)

    # Flesch Reading Ease formula
    flesch_score = 206.835 - (1.015 * avg_words_per_sentence) - (84.6 * avg_syllables_per_word)
    flesch_score = max(0, min(100, int(flesch_score)))

    # Determine level and grade
    if flesch_score >= 90:
        level = "Very Easy"
        grade = "5th grade"
    elif flesch_score >= 80:
        level = "Easy"
        grade = "6th grade"
    elif flesch_score >= 70:
        level = "Fairly Easy"
        grade = "7th grade"
    elif flesch_score >= 60:
        level = "Standard"
        grade = "8th-9th grade"
    elif flesch_score >= 50:
        level = "Fairly Difficult"
        grade = "10th-12th grade"
    elif flesch_score >= 30:
        level = "Difficult"
        grade = "College"
    else:
        level = "Very Difficult"
        grade = "College Graduate"

    return ReadabilityResult(
        fleschScore=flesch_score,
        level=level,
        grade=grade,
        sentenceCount=sentence_count,
        wordCount=word_count,
        avgWordsPerSentence=avg_words_per_sentence,
        avgSyllablesPerWord=avg_syllables_per_word
    )

def extract_entities(text: str) -> List[EntityResult]:
    """Extract named entities using spaCy"""
    doc = nlp(text)

    entities = []
    for ent in doc.ents:
        entities.append(EntityResult(
            text=ent.text,
            label=ent.label_,
            start=ent.start_char,
            end=ent.end_char
        ))

    return entities

def save_analysis(text: str, results: dict):
    """Save analysis to database"""
    conn = sqlite3.connect('text_analysis.db')
    cursor = conn.cursor()
    cursor.execute(
        'INSERT INTO analyses (text, results) VALUES (?, ?)',
        (text, json.dumps(results))
    )
    conn.commit()
    conn.close()

# API Endpoints
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI Text Analyzer API",
        "version": "1.0.0",
        "endpoints": {
            "/analyze": "POST - Analyze text",
            "/health": "GET - Health check",
            "/stats": "GET - Get statistics"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "models_loaded": {
            "spacy": nlp is not None,
            "textblob": True
        }
    }

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_text(request: AnalysisRequest):
    """
    Analyze text with NLP models

    - **text**: Text to analyze
    - **options**: Analysis options (sentiment, keywords, summary, readability, entities)
    """
    if not request.text or len(request.text.strip()) < 10:
        raise HTTPException(status_code=400, detail="Text must be at least 10 characters long")

    text = request.text.strip()
    results = {}

    try:
        # Sentiment Analysis
        if request.options.get("sentiment", True):
            results["sentiment"] = analyze_sentiment(text)

        # Keyword Extraction
        if request.options.get("keywords", True):
            results["keywords"] = extract_keywords(text)

        # Text Summary
        if request.options.get("summary", True):
            results["summary"] = generate_summary(text)

        # Readability Analysis
        if request.options.get("readability", True):
            results["readability"] = analyze_readability(text)

        # Named Entity Recognition
        if request.options.get("entities", True):
            results["entities"] = extract_entities(text)

        # Save to database
        response_obj = AnalysisResponse(**results)
        save_analysis(text, json.loads(response_obj.model_dump_json()))

        return AnalysisResponse(**results)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")

@app.get("/stats")
async def get_stats():
    """Get analysis statistics from database"""
    conn = sqlite3.connect('text_analysis.db')
    cursor = conn.cursor()

    cursor.execute('SELECT COUNT(*) FROM analyses')
    total_analyses = cursor.fetchone()[0]

    cursor.execute('SELECT COUNT(*) FROM analyses WHERE DATE(timestamp) = DATE("now")')
    today_analyses = cursor.fetchone()[0]

    conn.close()

    return {
        "total_analyses": total_analyses,
        "today_analyses": today_analyses,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/history")
async def get_history(limit: int = 10):
    """Get recent analysis history"""
    conn = sqlite3.connect('text_analysis.db')
    cursor = conn.cursor()

    cursor.execute(
        'SELECT id, text, results, timestamp FROM analyses ORDER BY timestamp DESC LIMIT ?',
        (limit,)
    )

    rows = cursor.fetchall()
    conn.close()

    history = []
    for row in rows:
        history.append({
            "id": row[0],
            "text_preview": row[1][:100] + "..." if len(row[1]) > 100 else row[1],
            "results": json.loads(row[2]),
            "timestamp": row[3]
        })

    return {"history": history, "count": len(history)}

if __name__ == "__main__":
    import uvicorn
    print("Starting AI Text Analyzer Backend...")
    print("API Documentation: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)
