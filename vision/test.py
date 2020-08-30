import cv2
import sys
import logging as log
import datetime as dt
from time import sleep


cascPath = "haarcascade_frontalface_default.xml"
eyeCascade = cv2.CascadeClassifier('haarcascade_eye_tree_eyeglasses.xml')
faceCascade = cv2.CascadeClassifier(cascPath)
log.basicConfig(filename='webcam.log',level=log.INFO)
video_capture = cv2.VideoCapture(0)
anterior = 0

qrCodeDetector = cv2.QRCodeDetector()


while True:
    if not video_capture.isOpened():
        print('Unable to load camera.')
        sleep(5)
        pass

    ret, frame = video_capture.read()
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = faceCascade.detectMultiScale(gray,scaleFactor=1.1,minNeighbors=5,minSize=(30, 30))
    

    decodedText, points, _ = qrCodeDetector.detectAndDecode(frame)
    
    if points is not None:
        nrOfPoints = len(points)
    
        for i in range(nrOfPoints):
            nextPointIndex = (i+1) % nrOfPoints
            cv2.line(frame, tuple(points[i][0]), tuple(points[nextPointIndex][0]), (255,0,0), 5)
    
        print(decodedText)  

    for (x, y, w, h) in faces:
        radioCirculo = int(w / 20)
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
        cv2.ellipse(frame,   (x, y), (radioCirculo, radioCirculo), 0,0,360,(0,255,0),-1)
        cv2.ellipse(frame,   (x+w, y+h), (radioCirculo, radioCirculo), 0,0,360,(0,255,0),-1)
        cv2.ellipse(frame,   (x, y+h), (radioCirculo, radioCirculo), 0,0,360,(0,255,0),-1)
        cv2.ellipse(frame,   (x+w, y), (radioCirculo, radioCirculo), 0,0,360,(0,255,0),-1)
        
        # Frente
        cv2.ellipse(frame,   (int(x+w/2), y+2*radioCirculo), (int(radioCirculo*1.3), int(radioCirculo*1.3)), 0,0,360,(0,0,255),2)

    if anterior != len(faces):
        anterior = len(faces)
        log.info("faces: "+str(len(faces))+" at "+str(dt.datetime.now()))

    cv2.imshow('Video', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

    cv2.imshow('Video', frame)

video_capture.release()
cv2.destroyAllWindows()