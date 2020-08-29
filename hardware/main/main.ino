#include "Thermometer.h"
#include <Servo.h>
Thermometer therm;
Servo pan,tilt;

int thetaPan = 90;
int thetaTilt = 90;

void setup(){
    Serial.begin(9600);
    pan.attach(9);
    tilt.attach(10);
    
    therm.initialize(0x5D);
    therm.setupEmissivity(0.78);
}


void loop(){
    Serial.println(therm.getTemperature());
    //Serial.println(therm.readEmiss());
     pan.write(thetaPan);
     tilt.write(thetaTilt);
}
