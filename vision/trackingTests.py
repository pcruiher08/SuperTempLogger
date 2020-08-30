from FaceTracker import FaceTracker
import serial
import time 
import requests
tracker = FaceTracker()
tracker.startCapture()
#comenta esta linea si vas a probar sin arduino
arduino = serial.Serial('COM7', 9600)

'''
for text in tracker.getQRStream():
    print(text)
    
    if text == "test":
        break
'''
url = 'https://0d0358325598.ngrok.io/api/record/create'

rawString = 10
        
for res in tracker.getForeheadStream():
    
    #comenta las siguientes lineas tambien si vas a probar sin arduino
    try: 
        sen = str(res).encode('utf-8')

        arduino.write(sen)
    
        rawString = arduino.readline()
        
        #lec = ( rawString.decode("utf-8") )
        
        print(rawString)
        pload = {'record':{'code':"5631b87a-4b77-48ba-99a4-8777baf96e45", 'group':"5f4af874a8ed837950ee0d16", 'temp':'222.1'}}

        r = requests.post(url, data = pload)
        print(r)
    except:
        print("except")
    
    #print(res)
    
arduino.close()