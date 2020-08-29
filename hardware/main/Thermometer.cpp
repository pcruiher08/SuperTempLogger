#include "Arduino.h"
#include "Thermometer.h"
#include <Wire.h>

//Default Constructor
/*Thermometer::Thermometer{
  }*/

//Constructor with Pin/Address Parameter
Thermometer::Thermometer() {
}

void Thermometer::initialize(byte addr) {
  mlx = Adafruit_MLX90614(addr);
  mlx.begin();
}

float Thermometer::getTemperature() {
  return mlx.readObjectTempC()+6.3;
}

float Thermometer::getAmbientTemperature() {
  return mlx.readAmbientTempC();
}

void Thermometer::setupEmissivity(double emss){
    mlx.writeEmissivity(emss);
}

uint16_t Thermometer::readEmiss(){
    return mlx.readEmissivity();
}
