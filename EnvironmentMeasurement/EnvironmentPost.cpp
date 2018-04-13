#include "EnvironmentPost.h"

EnvironmentPost::EnvironmentPost(Client &client) {
	this->client = &client;
}

void EnvironmentPost::begin() {
	if(!client->connected()){
		client->connect(HOST, SSL_PORT);
	}
}

String EnvironmentPost::postEnvironmentData(float humidity, float temperature) {
  String temperatureString = String(temperature, 1);
  String humidityString = String(humidity, 1);
	String message = "{\"humidity\":" + humidityString + ", \"temperature\":" + temperatureString + "}";
	begin();
	client->println("POST /api/environment/create HTTP/1.1");
	client->println("Host: 111.111.111.111");
	client->println("User-Agent: Arduino/1.0");
	client->println("Content-Type: application/json");
	client->println("Authorization: Basic RW52aXJvbm1lbnRTeXN0ZW06VGVzdA==");
	client->println("Connection: close");
	client->print("Content-Length: ");
	client->println(message.length());
	client->println();
	client->println(message);
	return readPayload();
}

String EnvironmentPost::readPayload() {
	char c;
	String payload="";
		//Read the answer and save it in String payload
		while (client->connected()) {
			payload = client->readStringUntil('\n');
			if (payload == "\r") {
				break;
			}
		}
	payload = client->readStringUntil('\r');
	Serial.println(payload);
	return payload;
}
