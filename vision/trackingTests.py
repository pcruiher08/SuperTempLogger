from FaceTracker import FaceTracker
import serial
import time 
import requests
import json
import re

pattern = '\d{2}\.\d{2}'
uuidPattern = '[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}'
tracker = FaceTracker()
tracker.startCapture()
#comenta esta linea si vas a probar sin arduino
arduino = serial.Serial('COM7', 9600)
uuidCode = ""

for text in tracker.getQRStream():    
    if re.match(uuidPattern,text):
        uuidCode = text
        break

endp = 'https://templogger-v2.herokuapp.com/api/record/create'
headers = {'Content-type': 'application/json'}

#rawString = 10

lectura = ""

temperatureIsReady = False
cuantasVan = 0
        
for res in tracker.getForeheadStream():
    
    #comenta las siguientes lineas tambien si vas a probar sin arduino
    try: 
        sen = str(res).encode('utf-8','strict')

        arduino.write(sen)
    
        rawString = arduino.readline()
        
        
        print(rawString)
        lectura = rawString.decode('utf-8','strict')

        if(re.match(pattern,lectura)):
            cuantasVan += 1
            print("cuantasVan",cuantasVan)
            if(cuantasVan >= 100):
                temperatureIsReady = True
                break
    except:
        print("except")
    
    #print(res)
    

if temperatureIsReady:
    pload = {'record':{'code':uuidCode, 'group':"5f4b4120ff6edc628064d9c3", 'temp':lectura}}
    try:
        r = requests.post(endp, data = json.dumps(pload), headers = headers)

        print(r)
        print("si se mando")
    except:
        print("no se manda")
arduino.close()