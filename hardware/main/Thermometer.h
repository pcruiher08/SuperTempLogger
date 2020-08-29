
#ifndef Thermometer_h
#define Thermometer_h


#include <Adafruit_MLX90614.h>

class Thermometer {
  public:
    Thermometer(); //Default Constructor
    void initialize(byte addr);
   float getTemperature();
   float getAmbientTemperature();
   void setupEmissivity(double emms);
   double readEmiss();

  private:
    Adafruit_MLX90614 mlx = Adafruit_MLX90614();
  

};

#endif
