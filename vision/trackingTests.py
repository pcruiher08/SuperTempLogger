from FaceTracker import FaceTracker
import serial
import time 
import requests
import json
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
endp = 'https://templogger-v2.herokuapp.com/api/record/create'
headers = {'Content-type': 'application/json'}

#rawString = 10

        
for res in tracker.getForeheadStream():
    
    #comenta las siguientes lineas tambien si vas a probar sin arduino
    try: 
        sen = str(res).encode('utf-8')

        arduino.write(sen)
    
        rawString = arduino.readline()
        
        #lec = ( rawString.decode("utf-8") )
        
        print(rawString)

        pload = {'record':{'code':"5631b87a-4b77-48ba-99a4-8777baf96e45", 'group':"5f4af874a8ed837950ee0d16", 'temp':rawString.decode('utf-8','strict')}}

        r = requests.post(endp, data = json.dumps(pload), headers = headers)

        print(r)

    except:
        print("except")
    
    #print(res)
    
arduino.close()