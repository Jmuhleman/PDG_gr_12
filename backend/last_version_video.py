import os
import cv2
import easyocr
from inference_sdk import InferenceHTTPClient
import numpy as np

# Initialize the inference client for license plate recognition
CLIENT = InferenceHTTPClient(
    api_url="https://detect.roboflow.com",
    api_key="l0Km0auutPDginF6gOBw"
)

# Output directory for saving frames with bounding boxes
output_folder = './processed_frames'
os.makedirs(output_folder, exist_ok=True)

# Initialize EasyOCR reader
reader = easyocr.Reader(['en'])

# Define the path to your MP4 file
video_file_path = './sample.mp4'  # Replace with your MP4 file path
cap = cv2.VideoCapture(video_file_path)

# Define the model ID for license plate recognition
license_plate_model_id = "license-plate-recognition-rxg4e/3"

# Define frame skipping rate
frame_skip = 60

frame_nmr = 0

while True:
    # Skip frames to speed up processing
    for _ in range(frame_skip):
        ret, _ = cap.read()
        if not ret:
            print("End of video stream or error encountered. Exiting...")
            cap.release()
            cv2.destroyAllWindows()
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
        license_plate_crop = frame[max(y1-5, 0):y2+5, max(x1-5, 0):x2+5]
        license_plate_crop_gray = cv2.cvtColor(license_plate_crop, cv2.COLOR_BGR2GRAY)
        _, license_plate_crop_thresh = cv2.threshold(license_plate_crop_gray, 100, 255, cv2.THRESH_BINARY_INV)

        # Read text from the cropped region
        license_plate_text = reader.readtext(license_plate_crop_thresh, detail=0)

        if license_plate_text and score > 0.75:
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            label = f"{license_plate_text[0]} ({score:.2f})"
            cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 1.75, (0, 255, 0), 2)
            print(f"Frame {frame_nmr}: Detected license plate {license_plate_text[0]} with confidence {score:.2f}")

            # Save processed frame
            output_filename = os.path.join(output_folder, f'frame_{frame_nmr}.png')
            cv2.imwrite(output_filename, frame)

    frame_nmr += frame_skip

# Release resources
cap.release()
cv2.destroyAllWindows()

print("Processing of the video file is complete.")
