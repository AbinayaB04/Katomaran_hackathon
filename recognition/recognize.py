import cv2
import os
import argparse
import sqlite3
import json
import numpy as np

# --- Parse image path from arguments
parser = argparse.ArgumentParser()
parser.add_argument('--image', required=True)
args = parser.parse_args()

print("Reading image from:", args.image)

# --- Load image
img = cv2.imread(args.image)
if img is None:
    print("Image not found")
    print("Unknown")
    exit()

# --- Convert to grayscale and detect face
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
cascade_path = os.path.join(os.path.dirname(__file__), "haarcascade_frontalface_default.xml")
face_cascade = cv2.CascadeClassifier(cascade_path)
faces = face_cascade.detectMultiScale(gray, 1.1, 4)

if len(faces) == 0:
    print("No face detected")
    print("Unknown")
    exit()

# --- Use only the first detected face
(x, y, w, h) = faces[0]
face = gray[y:y+h, x:x+w]
face = cv2.resize(face, (100, 100))
test_encoding = face.flatten()

# --- Load known encodings from database
db_path = os.path.join(os.path.dirname(__file__), "faces.db")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()
cursor.execute("SELECT name, encoding FROM faces")
records = cursor.fetchall()
conn.close()

# --- Prepare encodings
known_names, known_encodings = [], []
for name, enc in records:
    known_names.append(name)
    known_encodings.append(np.array(json.loads(enc)))

print("Loaded encodings:", len(known_encodings))

# --- Match encoding with known faces
best_score = float('inf')
best_match = "Unknown"
THRESHOLD = 3000  # Adjust based on your camera/lighting/accuracy needs

for name, known in zip(known_names, known_encodings):
    dist = np.linalg.norm(test_encoding - known)
    #print(f"Comparing with {name}: Distance = {dist}")
    if dist < best_score:
        best_score = dist
        best_match = name

# --- Final decision
if best_score < THRESHOLD:
    print("\nbest match with ",best_match)
else:
    print("\nUnknown-no match")
