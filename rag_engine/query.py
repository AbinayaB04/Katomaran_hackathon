# rag_engine/query.py
import os
import sqlite3
import sys
from dotenv import load_dotenv
from langchain.chains import RetrievalQA
from langchain.docstore.document import Document
from transformers import pipeline
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.llms import HuggingFacePipeline


load_dotenv()

# Step 1: Load face registration data from SQLite
def load_face_data():
    db_path = os.path.join(os.path.dirname(__file__), '../recognition/faces.db')
    if not os.path.exists(db_path):
        print("Database not found.")
        exit(1)

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT name, timestamp FROM faces")
    rows = cursor.fetchall()
    conn.close()

    docs = [Document(page_content=f"{name} was registered at {ts}") for name, ts in rows]
    return docs

# Step 2: Get the question
if len(sys.argv) < 2:
    print("No question received.")
    exit(1)

question = sys.argv[1]
if any(kw in question.lower() for kw in ["how many", "total", "number of"]) and "registered" in question.lower():
    docs = load_face_data()
    print(len(docs))
    exit(0)
try:
    docs = load_face_data()
    if not docs:
        print("No registrations found.")
        exit()

    # Step 3: Use HuggingFace Embeddings
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    vectorstore = FAISS.from_documents(docs, embeddings)
    retriever = vectorstore.as_retriever()

    # Step 4: Use HuggingFace LLM (Flan-T5)
    hf_pipeline = pipeline("text2text-generation", model="google/flan-t5-base", max_length=256)
    llm = HuggingFacePipeline(pipeline=hf_pipeline)

    qa = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever,
        return_source_documents=False
    )

    answer = qa.run(question)
    print(answer)

except Exception as e:
    print(f"RAG error: {str(e)}")
