from FaceTracker import FaceTracker
import serial
import time 
tracker = FaceTracker()
tracker.startCapture()
arduino = serial.Serial('COM7', 9600)

'''
for text in tracker.getQRStream():
    print(text)
    
    if text == "test":
        break
'''
        
for res in tracker.getForeheadStream():
    
    sen = str(res).encode('utf-8')
    #comenta las siguientes dos lineas si vas a probar sin arduino
    arduino.write(sen)
    rawString = arduino.readline()
    
    #lec = ( rawString.decode("utf-8") )
    
    print(rawString)
    
    #print(res)
    
arduino.close()