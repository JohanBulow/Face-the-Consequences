# Some simple json functions to store and fetch data from the encoding.json file.
#
# By: Johan Bülow

import json
import numpy as np

def store_encoding(name, encoding):
    # Load existing data from JSON file
    existing_data = {}
    try:
        with open('encoding.json', 'r') as file:
            file_content = file.read()  # Read the file content
            if file_content:
                existing_data = json.loads(file_content)  # Load the JSON data
    except FileNotFoundError:
        pass

    # Append new data to existing data
    existing_data[name] = encoding.tolist()  # Convert numpy array to list

    # Write updated data back to JSON file
    with open('encoding.json', 'w') as file:
        json.dump(existing_data, file)



def load_encoding():
    try:
        with open('encoding.json', 'r') as file:
            data = json.load(file)

            known_face_names = list(data.keys())
            known_face_encodings = [np.array(encoding) for encoding in data.values()]
            
            
            return known_face_names, known_face_encodings
    except FileNotFoundError:
        return [], []
