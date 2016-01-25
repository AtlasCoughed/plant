#include <aJSON.h>
#include <WiFi.h>
#include <Wire.h>
#include <SPI.h>
#include "SimpleTimer.h"
#include "M2XStreamClient.h"
#include "Adafruit_TMP006.h"

Adafruit_TMP006 tmp006(0x41); // start with a diferent i2c address!
char ssid[] = "MakerSquare";  //  your network SSID (name)
char pass[] = "alwaysbecommitting"; // your network password (use for WPA, or use as key for WEP)
//int keyIndex = 0; // your network key Index number (needed only for WEP)

int status = WL_IDLE_STATUS;
SimpleTimer timer;

char deviceId[] = "f990e644186d0c7ecde4eb454934ae2f"; // Device you want to push to
char streamWater[] = "water"; // Stream you want to push to
char streamLight[] = "light"; // Stream you want to push to
char streamTemp[] = "temp"; // Stream you want to push to
char m2xKey[] = "7f4b3ddf06944e06a87d0cc8aef754ad"; // Your M2X access key

WiFiClient client;

M2XStreamClient m2xClient(&client, m2xKey);
int waterSensor = 6;  // select the input pin 59 for the water level reader
int lightSensor = 2;  // select the input pin 57 for the light reader
int probe = 7;
int time = 1000;  // default to 1 second
float sensorWater = 0;  // variable to store the value coming from the sensor
float sensorLight = 0;  // variable to store the value coming from the sensor

void setup() {
  pinMode(probe, OUTPUT);
  Serial.begin(9600);

  //check temp sensor
  if (! tmp006.begin()) {
    Serial.println("No temp found");
  }
  // attempt to connect to Wifi network:
  Serial.print("Attempting to connect to Network named: ");
  // print the network name (SSID);
  Serial.println(ssid);
  // Connect to WPA/WPA2 network. Change this line if using open or WEP network:
  WiFi.begin(ssid, pass);
  while ( WiFi.status() != WL_CONNECTED) {
    // print dots while we wait to connect
    Serial.print(".");
    delay(300);
  }

  Serial.println("\nYou're connected to the network");
  Serial.println("Waiting for an ip address");

  while (WiFi.localIP() == INADDR_NONE) {
    // print dots while we wait for an ip addresss
    Serial.print(".");
    delay(300);
  }

  Serial.println("\nIP Address obtained");

  // you're connected now, so print out the status
  printWifiStatus();
  timer.setInterval((time * 60 * 30), GetWaterValue);
  timer.setInterval((time * 60 * 30), GetLightValue);
  timer.setInterval((time * 60 * 60), GetTempValue);
}

void loop() {
  timer.run();
}

void printWifiStatus() {
  // print the SSID of the network you're attached to:
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print your WiFi shield's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);
}

void GetWaterValue(){
  digitalWrite(probe, HIGH);
  //give time to read
  delay(200);
  sensorWater = analogRead(waterSensor);
  Serial.print("sensorWater: ");
  Serial.println(sensorWater);
  digitalWrite(probe, LOW);

  //post to m2x
  int response = m2xClient.updateStreamValue(deviceId, streamWater, sensorWater);
  Serial.print("M2x client response code: ");
  Serial.println(response);
  delay(100);
}

void GetLightValue(){
  sensorLight = analogRead(lightSensor);
  Serial.print("sensorLight: ");
  Serial.println(sensorLight);

  //post to m2x
  int response = m2xClient.updateStreamValue(deviceId, streamLight, sensorLight);
  Serial.print("M2x client response code: ");
  Serial.println(response);
  delay(100);
}

void GetTempValue(){
  float sensorTemp = tmp006.readDieTempC();
  Serial.print("Die Temperature: ");
  Serial.print(sensorTemp);
  Serial.println("*C");

  //post to m2x
  int response = m2xClient.updateStreamValue(deviceId, streamTemp, sensorTemp);
  Serial.print("M2x client response code: ");
  Serial.println(response);
  delay(100);
}

