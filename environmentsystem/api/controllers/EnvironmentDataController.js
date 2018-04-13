/**
 * EnvironmentDataController
 *
 * @description :: Server-side logic for managing environmental data
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var validator = require('validator');
 
module.exports = {
	createEnvironmentData: function(req, res) {
		try {
			var humidity = parseFloat(req.param("humidity"));
			if (humidity == null || humidity < 0 || humidity > 100){
				return res.badRequest();
			}
			sails.log("humidity" + humidity);
			var temperature = parseFloat(req.param("temperature"));
			if (temperature == null || temperature < -100 || temperature > 100){
				return res.badRequest();
			}
            sails.log("CreateEnvironmentData, req.params = " + JSON.stringify(req.params.all()));
            if (req.method == "POST") {
				var newEnvironmentData = {
					humidity: humidity,
					temperature: temperature
				};
				EnvironmentData.create(newEnvironmentData).exec(function(err, environmentData) {
					if (err) {
                        sails.log(err);
                        return res.serverError(err);
                    }
					sails.log(req.__('Environment data created') + JSON.stringify(environmentData));
					return res.created(environmentData);
				});
            } else {
                var wrongHttpMethod = req.__('Wrong HTTP method');
                return res.notFound(wrongHttpMethod);
            }
        } catch (ex) {
            return res.serverError(ex);
        }
	},
	readEnvironmentDataInDateRange: function(req, res) {
		try {
			var dateFrom = req.param("dateFrom");
			if (dateFrom == null || dateFrom == '' || !validator.isISO8601(dateFrom)){
				return res.badRequest();
			}
			var dateTo = req.param("dateTo");
			if (dateTo == null || dateTo == '' || !validator.isISO8601(dateTo)){
				return res.badRequest();
			}
            sails.log("ReadEnvironmentDataInDateRange, req.params = " + JSON.stringify(req.params.all()));
            if (req.method == "GET") {
				EnvironmentData.find({createdAt: { '>=': dateFrom, '<=': dateTo }}).exec(function afterwards(err, environmentData) {
                    if (err) {
                        sails.log(err);
                        return res.serverError(err);
                    }
                    if (!environmentData) {
                        return res.notFound(req.__('No environment data found'));
                    }
                    sails.log(req.__('Environment data found') + JSON.stringify(environmentData));
                    return res.ok(environmentData);
                });
            } else {
                var wrongHttpMethod = req.__('Wrong HTTP method');
                return res.notFound(wrongHttpMethod);
            }
        } catch (ex) {
            return res.serverError(ex);
        }
	},
	readAllEnvironmentData: function(req, res) {
		try {
            sails.log("ReadAllEnvironmentData, req.params = " + JSON.stringify(req.params.all()));
            if (req.method == "GET") {
				EnvironmentData.find({}).exec(function afterwards(err, environmentData) {
                    if (err) {
                        sails.log(err);
                        return res.serverError(err);
                    }
                    if (!environmentData) {
                        return res.notFound(req.__('No environment data found'));
                    }
                    sails.log(req.__('Environment data found') + JSON.stringify(environmentData));
                    return res.ok(environmentData);
                });
            } else {
                var wrongHttpMethod = req.__('Wrong HTTP method');
                return res.notFound(wrongHttpMethod);
            }
        } catch (ex) {
            return res.serverError(ex);
        }
	}
};
