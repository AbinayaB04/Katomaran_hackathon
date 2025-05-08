# Katomaran-Hackathon

## Face Recognition + RAG Q&A
### This project combines face registration data, a SQLite database, and a Retrieval-Augmented Generation (RAG) pipeline using Hugging Face models — all running locally without OpenAI.
## Tech Stack
### Programming Language: Python 3.10+
### Frameworks & Libraries:
#### React
#### Sqlite
#### Open-CV
#### LangChain (community + huggingface)
#### FAISS
#### Transformers
#### TF-Keras

## 🚀 Solution Approach
### Face Registration
#### Stores name, timestamp, and encoding into a SQLite database.

#### Encoding field is optional for this RAG application.

### RAG-Based Question Answering
#### Converts DB rows into text documents.

#### Uses Hugging Face’s MiniLM model for vector embeddings.

#### Flan-T5 as the LLM to generate natural-language answers based on retrieved data.

### Intelligent Query Parsing
#### Recognizes and handles:

#### "How many people are registered?" (returns count directly)

#### "When was [Name] registered?"

#### "List all registered people"



## Installation & Setup
### Prerequisites
#### Ensure you have Python 3.10+ installed and the required dependencies.

### Clone the Repository
```
git clone https://github.com/your-username/katomaran-face-rag.git
cd katomaran-face-rag

```
### Install dependencies
```
pip install -r requirements.txt
```
#### If you're using Keras 3, downgrade with:
```
pip uninstall keras
pip install tf-keras
```
### Database
```
-- Run in sqlite3 recognition/faces.db
CREATE TABLE faces (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  timestamp TEXT,
  encoding TEXT
);
```

### Run the Application
### React Frontend
```
cd client
npm install
npm run dev
```

### Backend
```
cd server
npm install
node index.js

```

## Demo video link
https://www.loom.com/share/fde1ef46df794141bfa43e047c0f5430?sid=05c3a08e-65c3-4d61-8abc-ebab6fdbff19
