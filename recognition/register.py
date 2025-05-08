import cv2
import os
import argparse
import sqlite3
import json
from datetime import datetime

# --- Argument Parsing ---
parser = argparse.ArgumentParser()
parser.add_argument('--image', required=True)
parser.add_argument('--name', required=True)
args = parser.parse_args()

# --- Load Haar Cascade ---
cascade_path = os.path.join(os.path.dirname(__file__), "haarcascade_frontalface_default.xml")
face_cascade = cv2.CascadeClassifier(cascade_path)

# --- Read Image ---
img = cv2.imread(args.image)
if img is None:
    print("Error: Image not found or invalid path.")
    exit()

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
faces = face_cascade.detectMultiScale(gray, 1.1, 4)

if len(faces) == 0:
    print("No face detected")
    exit()

(x, y, w, h) = faces[0]
face = gray[y:y+h, x:x+w]
face = cv2.resize(face, (100, 100))

# --- Flatten as Encoding (simple method) ---
encoding = face.flatten().tolist()

# --- Connect to DB ---
db_path = os.path.join(os.path.dirname(__file__), "faces.db")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# --- Create Table if Not Exists ---
cursor.execute("""
CREATE TABLE IF NOT EXISTS faces (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    encoding TEXT NOT NULL
)
""")

# --- Insert Face Data ---
cursor.execute("""
INSERT INTO faces (name, timestamp, encoding) VALUES (?, ?, ?)
""", (args.name, datetime.now().isoformat(), json.dumps(encoding)))

conn.commit()
conn.close()

print(f"Face registered for {args.name}")
