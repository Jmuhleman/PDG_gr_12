import os
import cv2
import easyocr
from inference_sdk import InferenceHTTPClient
import tempfile

# Initialize the inference client for license plate recognition
CLIENT = InferenceHTTPClient(
    api_url="https://detect.roboflow.com",
    api_key="l0Km0auutPDginF6gOBw"
)

# Hypothetical data_ingest folder path
data_ingest_folder = './plates_mania'
# Output directory for saving frames with bounding boxes
output_folder = './processed_frames'
os.makedirs(output_folder, exist_ok=True)

# Retrieve list of video files from the folder
video_files = [f for f in os.listdir(data_ingest_folder) if f.endswith('.jpg')]

# Process each video file
for video_file in video_files:
    video_path = os.path.join(data_ingest_folder, video_file)
    print(f"Processing video file: {video_path}")

    cap = cv2.VideoCapture(video_path)
    results = {}
    license_plate_model_id = "license-plate-recognition-rxg4e/3"
    
    frame_nmr = -1
    ret = True
    while ret:
        frame_nmr += 1
        ret, frame = cap.read()
        if ret:
            results[frame_nmr] = {}

            with tempfile.NamedTemporaryFile(delete=False, suffix='.jpeg') as temp_file:
                filename = temp_file.name
                cv2.imwrite(filename, frame)

            license_plate_response = CLIENT.infer(filename, model_id=license_plate_model_id)
            license_plates = license_plate_response.get("predictions", [])

            for license_plate in license_plates:
                x1 = int(license_plate['x'] - license_plate['width'] / 2)
                y1 = int(license_plate['y'] - license_plate['height'] / 2)
                x2 = int(license_plate['x'] + license_plate['width'] / 2)
                y2 = int(license_plate['y'] + license_plate['height'] / 2)
                score = license_plate['confidence']

                license_plate_crop = frame[y1-5:y2+5, x1-5:x2+5]
                license_plate_crop_gray = cv2.cvtColor(license_plate_crop, cv2.COLOR_BGR2GRAY)
                _, license_plate_crop_thresh = cv2.threshold(license_plate_crop_gray, 75, 255, cv2.THRESH_BINARY_INV)

                reader = easyocr.Reader(['en'])
                license_plate_text = reader.readtext(license_plate_crop_thresh, detail=0)

                if license_plate_text:
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    label = f"{license_plate_text[0]} ({score:.2f})"
                    cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 1.75, (0, 255, 0), 2)
                    print(f"Frame {frame_nmr}: Detected license plate {license_plate_text[0]} with confidence {score:.2f}")
                    results[frame_nmr][f'license_plate_{x1}_{y1}'] = {
                        'bbox': [x1, y1, x2, y2],
                        'text': license_plate_text[0],
                        'bbox_score': score
                    }
                    output_filename = os.path.join(output_folder, f'{os.path.splitext(video_file)[0]}_frame_{frame_nmr}.png')
                    cv2.imwrite(output_filename, frame)

    # Release resources after processing each video file
    cap.release()

print("Processing of all video files in the folder is complete.")
