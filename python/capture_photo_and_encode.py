# This program captures a photo, saves is locally and on the raspberry pi.
# Is also trains on the image, by creating an encoding, making it possible to recognize that person.
# 
# By: Johan Bülow

import tkinter as tk
from tkinter import filedialog
import cv2
import os
import requests
from PIL import Image, ImageTk
import face_recognition
import numpy as np
import json_functions

def capture_photo():
    global frame
    # Prompt the user to select a save location and enter a name for the image
    current_dir = os.getcwd()  # Get the current working directory
    initial_dir = os.path.join(current_dir, "images")  # Set the initial directory to "images" folder
    save_path = filedialog.asksaveasfilename(defaultextension=".jpg", filetypes=[("JPEG Image", "*.jpg")], initialdir=initial_dir)
    if save_path:
        cv2.imwrite(save_path, frame)
        print("Photo captured and saved successfully as", os.path.basename(save_path))
        
        # Upload the image to the server
        upload_image(save_path)

        # Create data points for faster FR
        recognize_image(os.path.basename(save_path))    


def recognize_image(photo_name):
    photo_path = f"images/{photo_name}"
    photo_name = os.path.splitext(photo_name)[0]
    print("Recognizing image:", photo_path)
    new_user_image = face_recognition.load_image_file(photo_path)
    face_locations = face_recognition.face_locations(new_user_image)
    
    if len(face_locations) > 0:
        new_user_face_encoding = face_recognition.face_encodings(new_user_image)[0]
        json_functions.store_encoding(photo_name, new_user_face_encoding)
        print("Face recognized and encoding stored.")
    else:
        print("No face detected in the image.")


def upload_image(image_path):
    url = "http://81.233.248.131:3000/public/faces" 
    files = {"image": open(image_path, "rb")}
    response = requests.post(url, files=files)
    if response.status_code == 200:
        print("Image uploaded successfully.")
    else:
        print(response.status_code)
        print("Failed to upload the image.")


def update_frame():
    global frame, video_label
    ret, frame = camera.read()
    small_frame = cv2.resize(frame, (0, 0), fx=1, fy=1)
    image = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)
    image = Image.fromarray(image)
    photo = ImageTk.PhotoImage(image)
    video_label.configure(image=photo)
    video_label.image = photo
    video_label.after(10, update_frame)


# Create the main window
window = tk.Tk()

# Create a label for video display
video_label = tk.Label(window, width=800, height=600)
video_label.pack()

# Create the button
button = tk.Button(window, text="Capture Photo", command=capture_photo)
button.pack()

# Set up camera capture
camera = cv2.VideoCapture(0)  # 0 corresponds to the default camera

# Start updating the frame
update_frame()

# Run the GUI main loop
window.mainloop()

# Release the camera capture
camera.release()
