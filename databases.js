var Sequelize = require('sequelize');
var constants = require('./constants.js')
/*if (process.env.ENVIRONMENT == "production") {
  var dbConfig = constants.production.dbConfig
} else {
  var dbConfig = constants.development.dbConfig
}*/

var dbConfig = constants.development.dbConfig;

var sequelize = new Sequelize(dbConfig.dbName, dbConfig.user, dbConfig.pass, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  pool: {
    max: 5,
    min: 0,
    maxIdleTime: 10000
  },
});
var Messagestatuslogs = sequelize.define('messagestatuslogs', {
  id: {type: Sequelize.UUID,defaultValue: Sequelize.UUIDV4,primaryKey: true},
  externalId: Sequelize.STRING,
  externalProvider: Sequelize.STRING,
  sender: Sequelize.STRING,
  type: Sequelize.ENUM('sms', 'gcm notification', 'email'),
  reciever: Sequelize.STRING,
  contents: Sequelize.TEXT,
  status: Sequelize.ENUM('Success', 'Failure', 'Unknown'),
  cause: Sequelize.TEXT,
  deliveredTimeStamp: Sequelize.STRING,
  originallySentAt: Sequelize.DATE
});
module.exports = {
  Messagestatuslogs: Messagestatuslogs
}