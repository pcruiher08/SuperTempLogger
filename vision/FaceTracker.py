import cv2
from time import sleep
import sys
import logging as log
import datetime as dt

class FaceTracker: 

    def __init__(self):
        self.cascPath = "haarcascade_frontalface_default.xml"
        self.faceCascade = cv2.CascadeClassifier(self.cascPath)
        log.basicConfig(filename='webcam.log', level=log.INFO)
        self.font = cv2.FONT_HERSHEY_SIMPLEX

    def startCapture(self):
        self.tracking = True
        self.video_capture = cv2.VideoCapture(0)

    def stopCapture(self):
        self.tracking = False

    def getQRStream(self):
        qrCodeDetector = cv2.QRCodeDetector()

        while self.tracking:
            if not self.video_capture.isOpened():
                print('Unable to load camera.')
                sleep(5)
                pass


            ret, frame = self.video_capture.read()
            frameShape = frame.shape 

            # Write text on the image 
            print("show")
            cv2.putText(frame, 'SHOW YOUR QR CODE', (frameShape[0]//3, 50), self.font, 1,(0,0,0), 5)

            decodedText, points, _ = qrCodeDetector.detectAndDecode(frame)
            
            if points is not None:
                nrOfPoints = len(points)
            
                for i in range(nrOfPoints):
                    nextPointIndex = (i+1) % nrOfPoints
                    cv2.line(frame, tuple(points[i][0]), tuple(points[nextPointIndex][0]), (255,0,0), 5)
            
                print(decodedText)  

                yield decodedText

            cv2.imshow('Video', frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        

    def getForeheadStream(self):
        """
        This tracks the user's face, and returns the position of the forehead
        """

        anterior = 0
        while self.tracking:
            if not self.video_capture.isOpened():
                print('Unable to load camera.')
                sleep(5)
                pass

            ret, frame = self.video_capture.read()
            frame = cv2.flip(frame, 1)
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = self.faceCascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))


            for (x, y, w, h) in faces:
                radioCirculo = int(w / 20)
                cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
                cv2.ellipse(frame,   (x, y), (radioCirculo, radioCirculo), 0,0,360,(0,255,0),-1)
                cv2.ellipse(frame,   (x+w, y+h), (radioCirculo, radioCirculo), 0,0,360,(0,255,0),-1)
                cv2.ellipse(frame,   (x, y+h), (radioCirculo, radioCirculo), 0,0,360,(0,255,0),-1)
                cv2.ellipse(frame,   (x+w, y), (radioCirculo, radioCirculo), 0,0,360,(0,255,0),-1)
                
                # Frente
                cv2.ellipse(frame,   (int(x+w/2), y+2*radioCirculo), (int(radioCirculo*1.3), int(radioCirculo*1.3)), 0,0,360,(0,0,255),2)

                foreheadPosition = (int(x+w/2), y+2*radioCirculo)
                yield foreheadPosition


            if anterior != len(faces):
                anterior = len(faces)
                log.info("faces: "+str(len(faces))+" at "+str(dt.datetime.now()))

            cv2.putText(frame, 'PLEASE LOOK AT THE CAMERA', (frame.shape[0]//3 - 30, 50), self.font, 1,(0,0,0), 5)
            cv2.imshow('Video', frame)

        
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
