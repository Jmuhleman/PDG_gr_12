import os
import cv2
import easyocr
from inference_sdk import InferenceHTTPClient
import numpy as np
import re
import string

# Initialize the inference client for license plate recognition
CLIENT = InferenceHTTPClient(
    api_url="https://detect.roboflow.com",
    api_key="l0Km0auutPDginF6gOBw"
)

# Output directory for saving frames with bounding boxes
output_folder = './processed_frames'
os.makedirs(output_folder, exist_ok=True)
reader = easyocr.Reader(['en'])
video_file_path = './video.mp4'
cap = cv2.VideoCapture(video_file_path)


def verifier_plaque(plaque_reconnue):
    # Liste des combinaisons de deux lettres autorisées
    combinaisons_autorisees = ['VD', 'ZH', 'GE', 'FR', 'TI', 'BE', 'LU', 'AG', 'SG', 'GR', 'NE', 'VS', 'SO', 'BL', 'BS', 'GL', 'SH', 'AR', 'AI', 'OW', 'NW', 'ZG', 'JU', 'TG', 'UR']

    # Nettoyer le texte en enlevant les espaces et la ponctuation
    plaque_nettoyee = re.sub(r'[^A-Za-z0-9]', '', plaque_reconnue)
    
    # Vérification du format attendu
    # Le pattern regex suivant vérifie :
    # - deux lettres
    # - suivi d'un nombre entre 1 et 5 chiffres
    pattern = re.compile(r'^([A-Za-z]{2})(\d{1,6})$')
    match = pattern.match(plaque_nettoyee)

    if match:
        code_lettres = match.group(1).upper()
        if code_lettres in combinaisons_autorisees:
            return f"{code_lettres}{match.group(2)}"
        else:
            return None
    else:
        return None

def preprocess_text(text):
 
    text = text.upper()
    translator = str.maketrans('', '', string.punctuation)
    text = text.translate(translator)

    if text and text[-1].isalpha():
        text = text[:-1]

    if len(text[2:]) > 7:
        text = text[:-1]

    if text[:3].isalpha():
        text = text[1:]
    return text
        




#license_plate_model_id = "license-plate-recognition-rxg4e/3"
license_plate_model_id = "model-plate/1"
frame_skip = 20
frame_nmr = 0

while True:
    # Skip frames to speed up processing
    for _ in range(frame_skip):
        ret, _ = cap.read()
        if not ret:
            print("End of video stream or error encountered. Exiting...")
            cap.release()
            print("Processing of the video file is complete.")
            exit()

    ret, frame = cap.read()
    if not ret:
        print("End of video stream or error encountered. Exiting...")
        break

    # Perform license plate recognition directly on the frame
    license_plate_response = CLIENT.infer(frame, model_id=license_plate_model_id)
    license_plates = license_plate_response.get("predictions", [])

    for license_plate in license_plates:
        x1 = int(license_plate['x'] - license_plate['width'] / 2)
        y1 = int(license_plate['y'] - license_plate['height'] / 2)
        x2 = int(license_plate['x'] + license_plate['width'] / 2)
        y2 = int(license_plate['y'] + license_plate['height'] / 2)
        score = license_plate['confidence']

        # Crop and preprocess license plate region
        license_plate_crop = frame[max(y1, 0):y2, max(x1, 0):x2]
        license_plate_crop_gray = cv2.cvtColor(license_plate_crop, cv2.COLOR_BGR2GRAY)
        _, license_plate_crop_thresh = cv2.threshold(license_plate_crop_gray, 90, 255, cv2.THRESH_BINARY_INV)

        license_plate_text = reader.readtext(license_plate_crop_thresh, detail=0)

        #implementer enregistrement avec nom de plaque et timestamp in / out
        if license_plate_text:
            license_plate_text[0] = preprocess_text(license_plate_text[0])
            license_plate_text[0] = verifier_plaque(license_plate_text[0])

            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            label = f"{license_plate_text[0]} ({score:.2f})"
            cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 1.75, (0, 255, 0), 2)
            print(f"Frame {frame_nmr}: Detected license plate {license_plate_text[0]} with confidence {score:.2f}")

            # Save processed frame
            output_filename = os.path.join(output_folder, f'{license_plate_text[0]}.png')
            cv2.imwrite(output_filename, frame)

    frame_nmr += frame_skip

# Release resources
cap.release()

print("Processing of the video file is complete.")
