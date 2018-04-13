# EnvironmentDataMeasurementSystem

EnvironmentDataMeasurementSystem is a project that shows how to connect a ESP8266 / NodeMCU to an API service to store environment data in a database using the [DHT22](https://funduino.de/anleitung-dht11-dht22) and [LM35](https://funduino.de/anleitung-temperatur-messen-lm35) sensors.

[![Build status](https://ci.appveyor.com/api/projects/status/keo3do1q4qrdyp37?svg=true)](https://ci.appveyor.com/project/SeppPenner/environmentdatameasurementsystem)
[![GitHub issues](https://img.shields.io/github/issues/SeppPenner/EnvironmentDataMeasurementSystem.svg)](https://github.com/SeppPenner/EnvironmentDataMeasurementSystem/issues)
[![GitHub forks](https://img.shields.io/github/forks/SeppPenner/EnvironmentDataMeasurementSystem.svg)](https://github.com/SeppPenner/EnvironmentDataMeasurementSystem/network)
[![GitHub stars](https://img.shields.io/github/stars/SeppPenner/EnvironmentDataMeasurementSystem.svg)](https://github.com/SeppPenner/EnvironmentDataMeasurementSystem/stargazers)
[![GitHub license](https://img.shields.io/badge/license-AGPL-blue.svg)](https://raw.githubusercontent.com/SeppPenner/EnvironmentDataMeasurementSystem/master/License.txt)

## What you need
* NodeMCU or ESP8266 compatible board
* [DHT22](https://funduino.de/anleitung-dht11-dht22) sensor
* [LM35](https://funduino.de/anleitung-temperatur-messen-lm35) sensor
* Breadboard
* Some jumper wires to connect
* Some kind of server (e.g. Raspberry Pi suites that, too)
* Some supported database fror Sails.JS: https://sailsjs.com/documentation/concepts/extending-sails/adapters/available-adapters

## Installation
1. Install [Node.JS](https://nodejs.org/en/download/) properly (administrator mode on Windows) on your server.
2. Check if the [environment variables](https://www.nextofwindows.com/windows-quick-tip-how-to-find-out-all-my-environment-variables) are set properly. (See image below for more information)

![Screenshot of the environment variables](https://github.com/SeppPenner/EnvironmentDataMeasurementSystem/blob/master/Environment_Variables.png "Screenshot of the environment variables")

3. Adjust the parameters as follows:
* In the environmentsystem subfolder adjust the following:
	* In the api\swagger\swagger.yaml file adjust the host variable to your server host (Let's assume 111.111.111.111):
	```yaml
	host: 111.111.111.111:10011
	```
	* In the assets\index.html file file adjust the host variable to your server host (Let's assume 111.111.111.111):
	```html
	url: "https://111.111.111.111:10011/swagger",
	```
	* In the config/ssl subfolder add your ssl files (I've put dummy ones in there):
	For generation of the files refer to https://github.com/SeppPenner/EnvironmentDataMeasurementSystem#generate-self-signed-ssl-files-openssl-needs-to-be-installed
	* In the config/session.js file update your session secret (Let's assume 41e2608f92f8701a99c41e2608f05885):
	```javascript
	secret: '41e2608f92f8701a99c41e2608f05885',
	```
	* In the config/policies.js file update your username/ password for basic authentication (Let's assume **EnvironmentSystem** as user and **Test** as password):
	```javascript
	var auth = require('http-auth');
	var basic = auth.basic({
			realm: "EnvironmentSystem"
		}, function(username, password, callback) {
			callback(username === "EnvironmentSystem" && password === "Test");
	});
	```
	From this username/ password get the Base64 encoding in the form **username:password**, so e.g. **EnvironmentSystem:Test** results in **RW52aXJvbm1lbnRTeXN0ZW06VGVzdA==** (Using e.g. https://www.base64encode.org/)
	* In the config/connections.js file update your database connection (You can use a local database, MySQL, MongoDB or PostgreSQL):
	```javascript
		localDiskDb: {
			adapter: 'sails-disk'
		},

		mysqlServer: {
			adapter: 'sails-mysql',
			host: '111.111.111.111',
			user: 'username',
			password: 'password',
			port: 3306,
			database: 'environmentsystem'
		},

		mongodbServer: {
			adapter: 'sails-mongo',
			host: '111.111.111.111',
			port: 27017,
			user: 'username',
			password: 'password',
			database: 'environmentsystem'
		},

		postgresqlServer: {
			adapter: 'sails-postgresql',
			host: '111.111.111.111',
			user: 'username',
			password: 'password',
			database: 'environmentsystem'
		}
	```
	You can specifiy more than one connection here. However, only one will be used. Set the used database in the config/models.js file:
	```javascript
	connection: 'mysqlServer',
	```
* In the EnvironmentMeasurement subfolder adjust the following:
	* In EnvironmentPost.h adjust the host variable to your server host (Let's assume 111.111.111.111): 
	```cpp
	#define HOST "111.111.111.111"
	```
	* In EnvironmentPost.cpp adjust the host variable to your server host (Let's assume 111.111.111.111):
	```cpp
	client->println("Host: 111.111.111.111");
	```
	* In EnvironmentPost.cpp adjust the authorization variable as set in the service (Base64 encoded, see the config/policies.js configuration above) to your server host (Let's assume RW52aXJvbm1lbnRTeXN0ZW06VGVzdA==):
	```cpp
	client->println("Authorization: Basic RW52aXJvbm1lbnRTeXN0ZW06VGVzdA==");
	```
	* Adjust the Wifi and password in the EnvironmentMeasurement.ino file:
	```cpp
	const char* ssid     = "MyWifi"; 
	const char* password = "MyPassword"; 
	```

4. Connect the LM35 tp pin A0 (or adjust the pin in the EnvironmentMeasurement.ino file) and the Dht22 to the pin A2 (or adjust the pin in the EnvironmentMeasurement.ino file).

	Pins set in the EnvironmentMeasurement.ino file:
	```cpp
	const int LM35Pin = A0;
	const int DhtPin = A2;
	```
	
5. Install a database system on your server (e.g. MySQL and add the database **environmentsystem**) --> See other manuals on how to do that, please.

5. Copy the environmentsystem folder to your server (e.g. with FileZilla in binary mode as a zip file --> unpack it).

6. Install sails and swagger and start your service:
```bash
cd /environmentsystem
npm install sails -g
npm install -g swagger
swagger project start
```

7. Your server should now be accessible at https://111.111.111.111:10011/ (Replace 111.111.111.111 with your host ip address) within your browser.

8. Compile the binaries onto the ESP8266/ NodeMCU using Arduino IDE.

9. The ESP8266/ NodeMCU posts data from the sensors to the database (Hopefully). Note that the ESP8266/ NodeMCU needs about 10 to 13 seconds to establish a SSL connection...

## Additional information:
The Dockerfile for the service didn't work on my Raspberry Pi. Cou can give it a try but don't be sad if it doesn't do what expected.

### Generate self signed ssl files (openssl needs to be installed)

```bash
export SERVER_NAME='localhost'
mkdir ssl

openssl req -nodes -x509 -newkey rsa:2048 \
  -subj "/CN=$SERVER_NAME" \
  -keyout ssl/default.key \
  -out ssl/default.crt
```
  
Change history
--------------
* **Version 1.0.0.0 (2018-04-13)** : Initial version.