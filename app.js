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
  try {
    var rabbitMqMessage = JSON.parse(messagestring);
  } catch (e) {
    console.log("JSON parse exception", e);
    worker.ack();
  }
  console.log("rmq message is", rabbitMqMessage);
  var message = new gcm.Message(rabbitMqMessage.message);
  message.dryRun = false;
  console.log("Message is:", message);
  var registrationsChunk = rabbitMqMessage.registrationsChunk;
  console.log("Reg id:", registrationsChunk);
  console.log("Type is:", typeof(registrationsChunk));
  var source = rabbitMqMessage.sender;
  console.log("Source is:", source);
  var retries = rabbitMqMessage.retries;
  console.log("Retries is:", retries);
  var sender = new gcm.Sender(constants.development.gcm.serverKey);
  sender.send(message, registrationsChunk, retries, function(err, res) {
    console.log("Entering send function");
    if (err) {
      console.log("Error:", err);
      var logmessage = {
        externalId: 'No external id present',
        externalProvider: 'GCM',
        sender: source,
        type: 'gcm notification',
        reciever: JSON.stringify(registrationsChunk),
        contents: JSON.stringify(rabbitMqMessage.message.data),
        status: 'Failure',
        cause: JSON.stringify(err),
      }
    } else {
      console.log("Notification sent", res);
      if (res.failure == 0) {
        logmessage = {
          externalId: res.results.message_id,
          externalProvider: 'GCM',
          sender: source,
          type: 'gcm notification',
          reciever: JSON.stringify(registrationsChunk),
          contents: JSON.stringify(rabbitMqMessage.message.data),
          status: 'Success',
          cause: 'Success',
        }
      } else {
        logmessage = {
          externalId: res.results.message_id,
          externalProvider: 'GCM',
          sender: source,
          type: 'gcm notification',
          reciever: JSON.stringify(registrationsChunk),
          contents: JSON.stringify(rabbitMqMessage.message.data),
          status: 'Failure',
          cause: JSON.stringify(res),
        }
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