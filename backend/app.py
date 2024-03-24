from flask import Flask, request, jsonify
import cv2
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load pre-trained model for object detection
net = cv2.dnn.readNetFromDarknet("yolov3.cfg", "yolov3.weights")
classes = []
with open("coco.names", "r") as f:
    classes = [line.strip() for line in f.readlines()]

def object_detection(image):
    # Convert the image to a blob
    blob = cv2.dnn.blobFromImage(image, 1/255.0, (416, 416), swapRB=True, crop=False)
    # Set the input to the network
    net.setInput(blob)
    # Get the output layer names
    layer_names = net.getLayerNames()
    output_layers = [layer_names[i - 1] for i in net.getUnconnectedOutLayers()]
    # Forward pass through the network
    outputs = net.forward(output_layers)

    detected_objects = []
    class_counts = {}

    for output in outputs:
        for detection in output:
            scores = detection[5:]
            class_id = np.argmax(scores)
            confidence = scores[class_id]
            if confidence > 0.5:
                # Object detected
                class_name = classes[class_id]
                if class_name not in class_counts:
                    class_counts[class_name] = 1
                else:
                    class_counts[class_name] += 1

                # Bounding box coordinates
                center_x = int(detection[0] * image.shape[1])
                center_y = int(detection[1] * image.shape[0])
                w = int(detection[2] * image.shape[1])
                h = int(detection[3] * image.shape[0])
                x = int(center_x - w / 2)
                y = int(center_y - h / 2)

                detected_objects.append({'class': class_name, 'confidence': float(confidence), 'bbox': [x, y, w, h]})

    return class_counts

@app.route('/detect_objects', methods=['POST'])
def detect_objects():
    if 'images' not in request.files:
        return jsonify({'error': 'No images uploaded'}), 400
    
    images = request.files.getlist('images')
    if len(images) == 0:
        return jsonify({'error': 'No images uploaded'}), 400

    results = []
    for image_file in images:
        try:
            nparr = np.fromstring(image_file.read(), np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            # Perform object detection on the image
            class_counts = object_detection(img)
            results.append({'image_name': image_file.filename, 'objects': class_counts})
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    return jsonify({'results': results}), 200

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
