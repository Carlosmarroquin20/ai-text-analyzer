# 🧠 AI Text Analyzer

A professional, full-stack web application for advanced Natural Language Processing (NLP) text analysis powered by **real AI models** with Python backend.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)

## ✨ Features

### Frontend Features
- **🎭 Sentiment Analysis**: Detect emotional tone with TextBlob AI
- **🔑 Keyword Extraction**: Extract important terms using spaCy NLP
- **📄 Text Summarization**: AI-powered extractive summarization
- **📚 Readability Score**: Calculate Flesch Reading Ease scores
- **🏷️ Named Entity Recognition (NER)**: Identify people, places, organizations
- **📊 Interactive Dashboard**: Visual analytics with Chart.js graphs
- **💾 Export to PDF/JSON**: Professional report generation
- **📜 Analysis History**: Save and revisit past analyses
- **🌓 Dark/Light Theme**: Beautiful theme switcher
- **📱 Responsive Design**: Works on all devices

### Backend Features (NEW! 🚀)
- **🐍 Python FastAPI**: High-performance REST API
- **🤖 Real AI Models**: spaCy + TextBlob for accurate NLP
- **💾 SQLite Database**: Persistent storage of analyses
- **📊 Statistics API**: Usage analytics and insights
- **🔄 Auto-fallback**: Uses local engine if backend unavailable
- **📚 Interactive API Docs**: Swagger/ReDoc documentation

## 🚀 Getting Started

You can run this project in **two modes**:

### Mode 1: Frontend Only (Quick Start)
- Just open `index.html` in a browser
- Uses local JavaScript AI engine
- No installation required

### Mode 2: Full Stack (Recommended)
- Frontend + Python backend with real AI models
- More accurate analysis with spaCy and TextBlob
- Database storage and advanced features

### Prerequisites

#### Frontend Only:
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Visual Studio Code (recommended) or any text editor

#### Full Stack:
- Everything from Frontend Only
- **Python 3.8+** installed
- **pip** package manager

### Installation

1. **Download or Clone the Project**
   ```bash
   # If using git
   git clone <repository-url>
   
   # Or simply download and extract the ZIP file
   ```

2. **Open in Visual Studio Code**
   ```bash
   cd ai-text-analyzer
   code .
   ```

3. **Project Structure**
   ```
   ai-text-analyzer/
   ├── index.html           # Main HTML file
   ├── dashboard.html       # Analytics dashboard
   ├── css/
   │   └── styles.css       # All styling and animations
   ├── js/
   │   ├── ai-engine.js     # Local AI/NLP engine
   │   ├── api-client.js    # Backend API connector
   │   ├── app.js           # Main application logic
   │   └── dashboard.js     # Dashboard charts
   ├── backend/             # Python FastAPI backend
   │   ├── main.py          # FastAPI server
   │   ├── requirements.txt # Python dependencies
   │   ├── start.bat        # Quick start script (Windows)
   │   └── README.md        # Backend documentation
   └── README.md            # Main documentation
   ```

### Running the Application

#### 🎯 Quick Start (Frontend Only)

**Option 1: Using Live Server (Recommended)**
1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"
4. Open at `http://localhost:5500`

**Option 2: Direct File Opening**
1. Double-click `index.html`
2. Works immediately with local AI engine

---

#### 🚀 Full Stack (Frontend + Backend)

**Step 1: Start the Backend**

Windows:
```bash
cd backend
start.bat
```

macOS/Linux:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
python main.py
```

Backend will start at: **http://localhost:8000**
API Docs at: **http://localhost:8000/docs**

**Step 2: Start the Frontend**

1. Open `index.html` with Live Server (VS Code)
2. Or use Python server: `python -m http.server 5500`
3. Open at `http://localhost:5500`

**Step 3: Verify Connection**

- You should see: "🚀 Backend AI connected!" notification
- If not, check that backend is running on port 8000

> **Note**: Frontend automatically falls back to local engine if backend is unavailable

## 📖 How to Use

1. **Enter Your Text**
   - Type or paste text into the input area
   - The character and word count updates automatically

2. **Select Analysis Options**
   - Choose which analyses you want to perform:
     - ✅ Sentiment Analysis
     - ✅ Keyword Extraction
     - ✅ Text Summarization
     - ✅ Readability Score

3. **Analyze**
   - Click the "Analyze Text" button
   - Or press `Ctrl + Enter` for quick analysis
   - Wait for the AI to process your text

4. **View Results**
   - Results appear in beautiful, interactive cards
   - Each card shows detailed metrics and visualizations
   - Scroll through different analysis types

5. **Export Results** (Optional)
   - Click the "Export" button to download results
   - Results are saved as a JSON file with timestamp

## 🎯 Analysis Types Explained

### Sentiment Analysis
- Detects the emotional tone of your text
- Provides a score from -1 (negative) to +1 (positive)
- Shows count of positive and negative words
- Displays confidence level

### Keyword Extraction
- Identifies the most important words in your text
- Shows frequency of each keyword
- Filters out common stop words
- Displays top 10 most relevant terms

### Text Summarization
- Creates a concise summary of your text
- Uses extractive summarization technique
- Selects the most important sentences
- Maintains the original meaning

### Readability Score
- Calculates Flesch Reading Ease score (0-100)
- Determines appropriate grade level
- Shows average words per sentence
- Displays average syllables per word

## 🎨 Customization

### Changing Colors

Edit the CSS variables in `css/styles.css`:

```css
:root {
    --primary-color: #6366f1;      /* Main brand color */
    --secondary-color: #ec4899;    /* Secondary accent */
    --accent-color: #8b5cf6;       /* Accent color */
    --dark-bg: #0f172a;            /* Background color */
    /* ... more variables */
}
```

### Adding New Analysis Features

1. Add the algorithm to `js/ai-engine.js`
2. Update the UI in `js/app.js`
3. Create a new result card function
4. Add the option checkbox in `index.html`

## 🛠️ Technical Details

### Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **Vanilla JavaScript**: No frameworks or dependencies
- **Font Awesome**: Icon library (CDN)

### Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Performance

- Lightweight: < 50KB total size
- Fast analysis: < 2 seconds for most texts
- No external API calls required
- 100% client-side processing

## 📝 Code Examples

### Using the AI Engine Programmatically

```javascript
// Initialize the engine
const aiEngine = new AIEngine();

// Analyze text
const results = aiEngine.analyze("Your text here", {
    sentiment: true,
    keywords: true,
    summary: true,
    readability: true
});

console.log(results);
```

### Customizing Sentiment Dictionaries

Edit `ai-engine.js`:

```javascript
this.positiveWords = [
    'amazing', 'excellent', 'great',
    // Add your custom positive words
];

this.negativeWords = [
    'terrible', 'awful', 'bad',
    // Add your custom negative words
];
```

## 🔒 Privacy & Security

- ✅ All processing happens locally in your browser
- ✅ No data is sent to external servers
- ✅ No tracking or analytics
- ✅ Your text remains completely private
- ✅ No cookies or local storage used

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - feel free to use it for personal or commercial projects.

## 🎓 Learning Resources

### Understanding NLP Concepts

- **Sentiment Analysis**: Determines if text is positive, negative, or neutral
- **Tokenization**: Breaking text into words/sentences
- **Stop Words**: Common words filtered out (the, and, is, etc.)
- **TF-IDF**: Term frequency used for keyword extraction
- **Flesch Score**: Readability formula based on sentence/word length

### Recommended Reading

- Natural Language Processing with Python
- Speech and Language Processing (Jurafsky & Martin)
- Practical Natural Language Processing

## 🐛 Troubleshooting

### Common Issues

**Problem**: Text analysis not working
- **Solution**: Make sure JavaScript is enabled in your browser

**Problem**: Styles not loading
- **Solution**: Check that `css/styles.css` path is correct

**Problem**: Font Awesome icons not showing
- **Solution**: Check your internet connection (icons load from CDN)

**Problem**: Export not working
- **Solution**: Check browser permissions for file downloads

## 💡 Tips & Tricks

1. **Better Sentiment Analysis**: Use longer texts for more accurate results
2. **Keyword Optimization**: Include diverse vocabulary for better extraction
3. **Summary Quality**: Works best with well-structured paragraphs
4. **Readability**: Test different writing styles to improve clarity
5. **Keyboard Shortcut**: Use `Ctrl + Enter` to analyze quickly

## 📊 Example Use Cases

- **Content Writing**: Analyze blog posts for sentiment and readability
- **Customer Feedback**: Process reviews and identify key themes
- **Academic Writing**: Check readability for target audience
- **Social Media**: Analyze post sentiment before publishing
- **Marketing Copy**: Ensure positive tone and appropriate reading level
- **Email Communication**: Check professional tone and clarity


## 📞 Support

If you encounter any issues or have questions:

1. Check this README first
2. Review the code comments
3. Open an issue on GitHub
4. Contact the developer

## 🌟 Acknowledgments

- Inspired by modern NLP tools and research
- Built with passion for clean code and user experience
- Thanks to the open-source community

---

**Made with ❤️ and AI** | [Report Bug] | [Request Feature]

**Version**: 1.0.0 | **Last Updated**: 2024

---

## 👨‍💻 Author

**Created by Emanuel Marroquín**

🌐 Visit my portfolio: [emadev.netlify.app](https://emadev.netlify.app/)

---