#include "Thermometer.h"

Thermometer therm;

void setup(){
    Serial.begin(9600);
    
    therm.initialize(0x5B);
    therm.setupEmissivity(0.78);
}


void loop(){
    Serial.println(therm.getTemperature());
    //Serial.println(therm.readEmiss());
    
}
