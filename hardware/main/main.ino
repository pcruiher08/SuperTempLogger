#include "Thermometer.h"
#include <Servo.h>
#include <Regexp.h>
#include <string.h>
Thermometer therm;
Servo pan,tilt;
MatchState ms;
int thetaPan = 30;
int thetaTilt = 30;
String readString;
char buf[100];

void setup(){
    Serial.begin(9600);
    pan.attach(9);
    tilt.attach(10);
    therm.initialize(0x5D);
    therm.setupEmissivity(0.78);
}

int incomingByte = 0;
void loop(){
  while (Serial.available()){ 
      if(Serial.available()>0){ 
        
        char c = Serial.read();
        bool empieza = false;
        
        if(c == '('){
          readString = "";
          empieza = true;
        }
        
        if(empieza){
          readString = "("
        }else{
          readString += c;
        }
        
        if(c == ')'){
          break;
        } 
      } 
  }

  for(int i=0; i<readString.length(); i++){
    buf[i] = readString.charAt(i); 
  }
  
  ms.Target(buf);
  unsigned int count = ms.MatchCount("([0-9]*,[0-9]*)");
  
  if(count == 1){ 
    Serial.println(readString);
    readString = "";
    memset(buf, 0, sizeof buf);
  } 

  
  Serial.println(therm.getTemperature());  
  Serial.flush();
}
