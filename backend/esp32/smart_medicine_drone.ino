// Smart Medicine Delivery Drone (ESP32 + GPS + SIM800L + Servo + Indicators)
// Libraries needed:
// - TinyGSM
// - TinyGPSPlus
// - ArduinoHttpClient
// - ArduinoJson
// - ESP32Servo

#define TINY_GSM_MODEM_SIM800

#include <ArduinoHttpClient.h>
#include <ArduinoJson.h>
#include <ESP32Servo.h>
#include <TinyGPSPlus.h>
#include <TinyGsmClient.h>

// -------- Device identity --------
const char DEVICE_ID[] = "esp32-drone-001";
const char FW_VERSION[] = "1.0.0";

// -------- Backend config --------
const char APN[] = "your_apn";
const char GPRS_USER[] = "";
const char GPRS_PASS[] = "";

const char SERVER_HOST[] = "YOUR_SERVER_IP_OR_DOMAIN";
const int SERVER_PORT = 8080;
const char DEVICE_TOKEN[] = "replace-with-same-token-as-backend";

// -------- Pins --------
// SIM800L UART
const int SIM800_RX = 26;
const int SIM800_TX = 27;
// NEO-6M GPS UART
const int GPS_RX = 16;
const int GPS_TX = 17;

const int SERVO_PIN = 13;
const int LED_PIN = 2;
const int BUZZER_PIN = 4;
const int LIMIT_SWITCH_PIN = 25;
const int BUTTON_PIN = 33;

HardwareSerial simSerial(1);
HardwareSerial gpsSerial(2);

TinyGsm modem(simSerial);
TinyGsmClient gsmClient(modem);
HttpClient http(gsmClient, SERVER_HOST, SERVER_PORT);
TinyGPSPlus gps;
Servo dropServo;

unsigned long lastTelemetryMs = 0;
unsigned long lastCommandPollMs = 0;
const unsigned long TELEMETRY_INTERVAL_MS = 15000;
const unsigned long COMMAND_POLL_INTERVAL_MS = 5000;

bool ledOn = false;
bool buzzerOn = false;
bool servoLocked = true;

String buildTelemetryJson() {
  StaticJsonDocument<512> doc;
  doc["deviceId"] = DEVICE_ID;
  doc["batteryPercent"] = 75; // replace with real battery reading circuit/ADC
  doc["signalQuality"] = modem.getSignalQuality();
  doc["servoLocked"] = servoLocked;
  doc["limitSwitchPressed"] = digitalRead(LIMIT_SWITCH_PIN) == LOW;
  doc["buttonPressed"] = digitalRead(BUTTON_PIN) == LOW;
  doc["ledOn"] = ledOn;
  doc["buzzerOn"] = buzzerOn;

  if (gps.location.isValid()) {
    JsonObject gpsObj = doc.createNestedObject("gps");
    gpsObj["lat"] = gps.location.lat();
    gpsObj["lng"] = gps.location.lng();
    gpsObj["altitude"] = gps.altitude.meters();
    gpsObj["speedKmph"] = gps.speed.kmph();
    gpsObj["satellites"] = gps.satellites.value();
  }

  String json;
  serializeJson(doc, json);
  return json;
}

bool postJson(const String &path, const String &jsonBody) {
  http.beginRequest();
  http.post(path);
  http.sendHeader("Content-Type", "application/json");
  http.sendHeader("x-device-token", DEVICE_TOKEN);
  http.sendHeader("Content-Length", jsonBody.length());
  http.beginBody();
  http.print(jsonBody);
  http.endRequest();

  int status = http.responseStatusCode();
  String response = http.responseBody();
  Serial.printf("POST %s -> %d, %s\n", path.c_str(), status, response.c_str());
  return status >= 200 && status < 300;
}

bool registerDevice() {
  StaticJsonDocument<256> doc;
  doc["deviceId"] = DEVICE_ID;
  doc["firmwareVersion"] = FW_VERSION;
  JsonArray caps = doc.createNestedArray("capabilities");
  caps.add("gps");
  caps.add("gsm");
  caps.add("servo");
  caps.add("buzzer");
  caps.add("limit-switch");

  String json;
  serializeJson(doc, json);
  return postJson("/api/devices/register", json);
}

void setLed(bool value) {
  ledOn = value;
  digitalWrite(LED_PIN, ledOn ? HIGH : LOW);
}

void setBuzzer(bool value) {
  buzzerOn = value;
  digitalWrite(BUZZER_PIN, buzzerOn ? HIGH : LOW);
}

void executeDrop(int angle) {
  angle = constrain(angle, 30, 120);
  dropServo.write(angle);
  delay(1200);
  dropServo.write(0);
  servoLocked = true;
}

void ackCommand(const String &commandId, bool success, const char *errorMessage = "") {
  StaticJsonDocument<256> doc;
  doc["status"] = success ? "acked" : "failed";

  if (success) {
    JsonObject result = doc.createNestedObject("result");
    result["executedAt"] = millis();
  } else {
    doc["error"] = errorMessage;
  }

  String json;
  serializeJson(doc, json);
  postJson("/api/commands/" + commandId + "/ack", json);
}

void pollCommands() {
  String path = "/api/commands/device/" + String(DEVICE_ID) + "/next";

  http.beginRequest();
  http.get(path);
  http.sendHeader("x-device-token", DEVICE_TOKEN);
  http.endRequest();

  int status = http.responseStatusCode();
  String body = http.responseBody();
  if (status == 204) {
    return;
  }

  if (status < 200 || status >= 300) {
    Serial.printf("Command poll failed: %d\n", status);
    return;
  }

  StaticJsonDocument<768> doc;
  DeserializationError err = deserializeJson(doc, body);
  if (err) {
    Serial.println("Invalid command JSON");
    return;
  }

  JsonObject data = doc["data"];
  String commandId = data["id"].as<String>();
  String type = data["type"].as<String>();

  bool ok = true;
  if (type == "SERVO_DROP") {
    int angle = data["payload"]["angle"] | 90;
    executeDrop(angle);
  } else if (type == "LED_ON") {
    setLed(true);
  } else if (type == "LED_OFF") {
    setLed(false);
  } else if (type == "BUZZER_ALERT") {
    int durationMs = data["payload"]["durationMs"] | 500;
    setBuzzer(true);
    delay(durationMs);
    setBuzzer(false);
  } else if (type == "PING") {
    // no-op
  } else {
    ok = false;
  }

  if (ok) {
    ackCommand(commandId, true);
  } else {
    ackCommand(commandId, false, "Unknown command type");
  }
}

bool setupModem() {
  Serial.println("Initializing modem...");
  modem.restart();
  Serial.println("Connecting to network...");
  if (!modem.waitForNetwork(30000L)) {
    Serial.println("Network failed");
    return false;
  }

  Serial.println("Connecting to GPRS...");
  if (!modem.gprsConnect(APN, GPRS_USER, GPRS_PASS)) {
    Serial.println("GPRS failed");
    return false;
  }

  Serial.println("GPRS connected");
  return true;
}

void setup() {
  Serial.begin(115200);
  delay(200);

  pinMode(LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LIMIT_SWITCH_PIN, INPUT_PULLUP);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  setLed(false);
  setBuzzer(false);

  dropServo.attach(SERVO_PIN);
  dropServo.write(0);

  simSerial.begin(9600, SERIAL_8N1, SIM800_RX, SIM800_TX);
  gpsSerial.begin(9600, SERIAL_8N1, GPS_RX, GPS_TX);

  if (!setupModem()) {
    Serial.println("Modem setup failed. Reboot to retry.");
    return;
  }

  registerDevice();
}

void loop() {
  while (gpsSerial.available()) {
    gps.encode(gpsSerial.read());
  }

  if (!modem.isNetworkConnected()) {
    setupModem();
  }

  unsigned long now = millis();

  if (now - lastTelemetryMs >= TELEMETRY_INTERVAL_MS) {
    String telemetryJson = buildTelemetryJson();
    postJson("/api/telemetry", telemetryJson);
    lastTelemetryMs = now;
  }

  if (now - lastCommandPollMs >= COMMAND_POLL_INTERVAL_MS) {
    pollCommands();
    lastCommandPollMs = now;
  }
}
