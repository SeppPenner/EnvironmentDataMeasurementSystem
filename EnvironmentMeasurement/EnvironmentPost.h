#ifndef EnvironmentPost_h
#define EnvironmentPost_h

#include <Arduino.h>
#include <ArduinoJson.h>
#include <Client.h>

#define HOST "192.168.2.206"
#define SSL_PORT 10011

#ifndef JSON_BUFF_SIZE
#ifdef ESP8266
#define JSON_BUFF_SIZE 1000
#else
#define JSON_BUFF_SIZE 10000
#endif
#endif

class EnvironmentPost
{
	public:
		EnvironmentPost(Client &client);
		void begin();
		String postEnvironmentData(float humidity, float temperature);

	private:
		String readPayload();
		Client *client;
};
#endif
