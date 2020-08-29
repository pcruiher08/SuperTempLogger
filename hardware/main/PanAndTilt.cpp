#include "Arduino.h"
#include <math.h>

PanAndTilt::PanAndTilt(){}

void PanAndTilt::initialize(int pinPan, int pinTilt) {
    pan.attach(pinPan);
    tilt.attach(pinTilt);
}

void PanAndTilt::setCoordinates(int x, int y){
    pan.write(2 * atan(1.0 * x / y));
    tilt.wirte(2 * acos(1.0 x / y) + (2 * x * x + y * y) / sqrt(x + y) );
}