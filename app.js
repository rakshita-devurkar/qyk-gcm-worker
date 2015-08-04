
var context = require('rabbit.js').createContext('amqp://localhost');
var constants = require('./constants.js');
var gcm = require("node-gcm");
var dbModels = require('./databases.js');
var worker = context.socket('WORKER', {
  prefetch: 1,
  ack: true
});
worker.setEncoding('utf8');

function processGcm(messagestring) {
  var rabbitMqMessage = JSON.parse(messagestring);
  var message = new gcm.Message(rabbitMqMessage);   
  message.dryRun = false;
  var registration_ids = rabbitMqMessage.registration_ids;
  console.log("Message is:", message);
  var sender = new gcm.Sender(constants.development.gcm.serverKey);
  sender.send(message, registration_ids, function(err, res) {
    console.log("Entering send function");
    //var logmessage;
    if (err) {
      console.log("Error:", err);
      var logmessage = {
        externalId: 'No external id present',
        externalProvider: 'GCM',
        sender: "sendingfunction",
        type: 'gcm notification',
        reciever: JSON.stringify(registration_ids),
        contents: JSON.stringify(rabbitMqMessage.data),
        status: 'Failure',
        cause: JSON.stringify(err),
      }
    } else {
      console.log("Notification sent", res);
      logmessage = {
        externalId: res.results[0].message_id,
        externalProvider: 'GCM',
        sender: "sendingfunction",
        type: 'gcm notification',
        reciever: JSON.stringify(registration_ids),
        contents: JSON.stringify(rabbitMqMessage.data),
        status: 'Success',
        cause: 'Success',
      }
      
    }
    dbModels.Messagestatuslogs.create(logmessage).then(function() {
        console.log("Message logged into database.");
        worker.ack();
      }).catch(function(reason) {
        console.log("Error in logging", reason);
      });
    
  });
}

  worker.on('data', processGcm);
  worker.connect('qyk-gcm-queue');
