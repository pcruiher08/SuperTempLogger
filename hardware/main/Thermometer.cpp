#include "Arduino.h"
#include "Thermometer.h"
#include <Wire.h>

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

double Thermometer::readEmiss(){
    return mlx.readEmissivity();
}
