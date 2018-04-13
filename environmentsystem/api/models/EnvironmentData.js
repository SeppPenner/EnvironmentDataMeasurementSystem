/**
 * EnvironmentData
 *
 * @description :: The environment data in the environment system.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	connection: 'mysqlServer',
    tableName: 'EnvironmentData',
	attributes: {
		humidity: {
			type: 'float'
		},
		temperature: {
			type: 'float'
		},
		toJSON: function() {
			var obj = this.toObject();
			delete obj.updatedAt;
			return obj;
		}
	  }
};