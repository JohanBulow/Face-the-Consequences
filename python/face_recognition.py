# Uses face_recognition lib and cv2 to recognize a face that has been encoded via,
# capture_photo_and_encode.py. Each frame is downscaled to 25%, but video display is 
# at full resolution. Will also only detect faces in every other frame.
# If a face is recognized, a POST will be sent to the raspberry, emulating the attempt
# to be verified. Code is based on an existing example from face_recognition.py, but further
# improved and shaped to fit the project.
#
# By: Johan Bülow

import face_recognition
import cv2
import numpy as np
import json_functions
import requests

# Get a reference to webcam #0 (the default one)
video_capture = cv2.VideoCapture(0)

# Initialize some variables
known_face_encodings = []
known_face_names = []
face_locations = []
face_encodings = []
face_names = []
process_this_frame = True
threshhold = 0

# Load encodings.
known_face_names, known_face_encodings = json_functions.load_encoding()
recognized_people = {}


while True:
    # Grab a single frame of video
    ret, frame = video_capture.read()

    # Only process every other frame of video to save time
    if process_this_frame:
        # Resize frame of video to 1/4 size for faster face recognition processing
        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)

        # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
        rgb_small_frame = small_frame[:, :, ::-1]
        
        # Find all the faces and face encodings in the current frame of video
        face_locations = face_recognition.face_locations(rgb_small_frame)
        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

        face_names = []
        for face_encoding in face_encodings:
            # See if the face is a match for the known face(s)
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
            name = "Unknown"

            face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
            best_match_index = np.argmin(face_distances)
            if matches[best_match_index]:
                name = known_face_names[best_match_index]
                # Update the dictionary with the name and score
                recognized_people[name] = face_distances[best_match_index]
                
                if threshhold > 25:
                    try:
                        highest_score_person = max(recognized_people, key=recognized_people.get)
                        print("Highest Score Person:", highest_score_person)
                        url = "http://81.233.248.131:3000/recognize" 
                        payload = {'name': highest_score_person}
                        response = requests.post(url, json=payload)
                        print('Request sent to server.')
                        if response.status_code == 200:
                            print("Image uploaded successfully.")
                        else:
                            print(response.status_code)
                            print("Failed to upload the image.")
                    except requests.exceptions.RequestException as e:
                        print('Error sending request:', str(e))
                    threshhold = 0
                    recognized_people = {}
                else:
                    threshhold = threshhold + 1
                    
            face_names.append(name)

    process_this_frame = not process_this_frame


    # Display the results
    for (top, right, bottom, left), name in zip(face_locations, face_names):
        # Scale back up face locations since the frame we detected in was scaled to 1/4 size
        top *= 4
        right *= 4
        bottom *= 4
        left *= 4

        # Draw a box around the face
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)

        # Draw a label with a name below the face
        cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 0, 255), cv2.FILLED)
        font = cv2.FONT_HERSHEY_DUPLEX
        cv2.putText(frame, name, (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)

    # Display the resulting image
    cv2.imshow('Video', frame)

    # Hit 'q' on the keyboard to quit!
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release handle to the webcam
video_capture.release()
cv2.destroyAllWindows()