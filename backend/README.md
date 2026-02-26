# AI Text Analyzer - Backend API

Backend con **Python + FastAPI** para análisis de texto con IA real usando **spaCy**, **TextBlob** y **transformers**.

## 🚀 Características

- ✅ **Análisis de Sentimiento** con TextBlob
- ✅ **Extracción de Keywords** con spaCy
- ✅ **Resumen Automático** extractivo
- ✅ **Análisis de Legibilidad** (Flesch Reading Ease)
- ✅ **Reconocimiento de Entidades** (NER) con spaCy
- ✅ **Base de Datos SQLite** para historial
- ✅ **API REST** con FastAPI
- ✅ **CORS** habilitado para frontend

## 📋 Requisitos

- Python 3.8 o superior
- pip (gestor de paquetes de Python)

## 🔧 Instalación

### 1. Navegar a la carpeta backend

```bash
cd backend
```

### 2. Crear entorno virtual (recomendado)

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 4. Descargar modelo de spaCy

```bash
python -m spacy download en_core_web_sm
```

## ▶️ Ejecutar el servidor

```bash
python main.py
```

O usando uvicorn directamente:

```bash
uvicorn main:app --reload
```

El servidor estará disponible en: **http://localhost:8000**

## 📚 Documentación de la API

Una vez el servidor esté corriendo, puedes acceder a:

- **Documentación interactiva (Swagger)**: http://localhost:8000/docs
- **Documentación alternativa (ReDoc)**: http://localhost:8000/redoc

## 🔌 Endpoints

### `GET /`
Información general de la API

### `GET /health`
Verificar estado del servidor y modelos cargados

### `POST /analyze`
Analizar texto

**Request Body:**
```json
{
  "text": "Your text here",
  "options": {
    "sentiment": true,
    "keywords": true,
    "summary": true,
    "readability": true,
    "entities": true
  }
}
```

**Response:**
```json
{
  "sentiment": {
    "label": "Positive",
    "score": 0.85,
    "confidence": 92,
    "positiveWords": 12,
    "negativeWords": 2,
    "emoji": "😊",
    "color": "#10b981"
  },
  "keywords": [
    {"word": "amazing", "frequency": 3},
    {"word": "excellent", "frequency": 2}
  ],
  "summary": "Generated summary...",
  "readability": {
    "fleschScore": 67,
    "level": "Standard",
    "grade": "8th-9th grade",
    "sentenceCount": 5,
    "wordCount": 45,
    "avgWordsPerSentence": 9.0,
    "avgSyllablesPerWord": 1.5
  },
  "entities": [
    {"text": "New York", "label": "GPE", "start": 10, "end": 18}
  ]
}
```

### `GET /stats`
Obtener estadísticas de uso

### `GET /history?limit=10`
Obtener historial de análisis recientes

## 🗄️ Base de Datos

El backend usa **SQLite** para almacenar:
- Historial de análisis
- Texto original
- Resultados
- Timestamps

El archivo de base de datos se crea automáticamente: `text_analysis.db`

## 🔒 Seguridad

- **CORS** configurado (modifica en `main.py` para producción)
- **Validación** de entrada con Pydantic
- **Límite de longitud** de texto

## 🚀 Deploy en Producción

### Opción 1: Render (Gratis)

1. Crea una cuenta en [Render.com](https://render.com)
2. Conecta tu repositorio
3. Crea un nuevo Web Service
4. Configura:
   - **Build Command**: `pip install -r requirements.txt && python -m spacy download en_core_web_sm`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Opción 2: Railway (Gratis)

1. Crea una cuenta en [Railway.app](https://railway.app)
2. Nuevo proyecto desde GitHub
3. Railway detectará automáticamente Python
4. Agrega variable de entorno si necesario

### Opción 3: Heroku

1. Crea `Procfile`:
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

2. Deploy:
```bash
heroku create your-app-name
git push heroku main
```

## 🛠️ Desarrollo

### Ejecutar en modo desarrollo

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Ejecutar tests

```bash
pytest  # (crear tests/)
```

## 📦 Dependencias Principales

- **FastAPI** - Framework web moderno y rápido
- **spaCy** - NLP industrial-strength
- **TextBlob** - Procesamiento de texto simple
- **SQLAlchemy** - ORM para base de datos
- **uvicorn** - Servidor ASGI

## 🤝 Conectar con Frontend

El frontend automáticamente detecta si el backend está disponible.

1. Asegúrate de que el backend esté corriendo en `http://localhost:8000`
2. Abre el frontend (index.html)
3. Verás una notificación: "🚀 Backend AI connected!"

Si el backend no está disponible, usará el motor local de JavaScript.

## 📝 Notas

- El primer análisis puede tardar más (carga de modelos)
- spaCy requiere ~100MB de espacio para el modelo
- Para análisis en español, descarga: `python -m spacy download es_core_news_sm`

## 🐛 Troubleshooting

**Error: "No module named 'spacy'"**
```bash
pip install spacy
python -m spacy download en_core_web_sm
```

**Error: "Port 8000 already in use"**
```bash
# Cambia el puerto
uvicorn main:app --port 8001
```

**CORS Error en frontend**
- Verifica que CORS esté habilitado en `main.py`
- Revisa la consola del navegador

## 📧 Soporte

Si tienes problemas, revisa:
1. La documentación de FastAPI: https://fastapi.tiangolo.com
2. Documentación de spaCy: https://spacy.io
3. Los logs del servidor

---

**Desarrollado con ❤️ usando Python, FastAPI, spaCy y TextBlob**
