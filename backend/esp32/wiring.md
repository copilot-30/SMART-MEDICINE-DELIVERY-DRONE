# ESP32 Wiring Guide (for listed components)

> Power note: SIM800L and servos can cause brownouts. Use a stable power rail and common GND.

## Components

- ESP32 DevKit V1
- NEO-6M GPS
- SIM800L GSM/GPRS
- MG90S/SG90 servo
- LiPo 3.7V (1000-2000mAh)
- MT3608 boost converter
- LED + resistor
- Buzzer module
- Limit switch
- Push button

## Suggested pin map

- `SIM800L TX -> ESP32 GPIO26 (RX1)`
- `SIM800L RX -> ESP32 GPIO27 (TX1)`
- `GPS TX -> ESP32 GPIO16 (RX2)`
- `GPS RX -> ESP32 GPIO17 (TX2)`
- `Servo signal -> ESP32 GPIO13`
- `LED -> ESP32 GPIO2`
- `Buzzer IN -> ESP32 GPIO4`
- `Limit switch -> ESP32 GPIO25` (to GND, `INPUT_PULLUP`)
- `Push button -> ESP32 GPIO33` (to GND, `INPUT_PULLUP`)

## Power topology

1. `LiPo -> MT3608 input`.
2. Set MT3608 output to **4.0V** for SIM800L stability (do **not** over-volt SIM800L).
3. Use a separate regulated rail (5V/6V according to servo spec) for servo if possible.
4. **Common GND** between ESP32, SIM800L, GPS, servo, and sensors.
5. Add bulk capacitance near SIM800L (e.g., 470uF-1000uF low-ESR).

## Safety checks before powering

- Verify MT3608 output with multimeter.
- Confirm no GPIO is directly tied to higher voltage than 3.3V logic.
- Test modules one-by-one: ESP32 -> GPS -> SIM800L -> Servo.
