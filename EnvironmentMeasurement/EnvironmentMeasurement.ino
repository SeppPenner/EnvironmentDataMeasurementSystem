#include <ESP8266WiFi.h>
#include "EnvironmentPost.h"
#include <WiFiClientSecure.h>
#include "DHT.h"

#define DHTTYPE DHT22

const char* ssid     = "MyWifi"; 
const char* password = "MyPassword"; 
WiFiClientSecure net_ssl; 
EnvironmentPost poster (net_ssl);
const int LM35Pin = A0;
const int DhtPin = A2;
DHT dht(DhtPin, DHTTYPE);

void setup()
{
  Serial.begin(115200);
  Serial.println();

  WiFi.begin(ssid, password);

  Serial.print("Connecting");
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println();

  Serial.print("Connected, IP address: ");
  Serial.println(WiFi.localIP());

  poster.begin();
  dht.begin();
}

void loop()
{
  float temperature = measureTemperature();
  float humidity = dht.readHumidity();
  poster.postEnvironmentData(humidity, temperature);
}

float measureTemperature()
{
  int sensorValue = analogRead(LM35Pin);
  float temperature = sensorValue * 0.48828125;
  Serial.print(temperature);
  Serial.println(" Grad Celsius");
  return temperature;
}

