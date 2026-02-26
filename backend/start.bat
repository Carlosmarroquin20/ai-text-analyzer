@echo off
echo ========================================
echo  AI Text Analyzer - Backend Server
echo ========================================
echo.

REM Check if virtual environment exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
    echo.
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate
echo.

REM Install dependencies
echo Checking dependencies...
pip install -r requirements.txt --quiet
echo.

REM Download spaCy model if not exists
python -c "import spacy; spacy.load('en_core_web_sm')" 2>nul
if errorlevel 1 (
    echo Downloading spaCy model...
    python -m spacy download en_core_web_sm
    echo.
)

REM Start server
echo ========================================
echo  Starting server on http://localhost:8000
echo  API Docs: http://localhost:8000/docs
echo ========================================
echo.
python main.py

pause
