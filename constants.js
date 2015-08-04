module.exports = {
  development: {
    rabbitMQ: {
      server: "amqp://localhost",
      queueName: "qyk-gcm-queue",
      prefetch: 1,
    },
    gcm: {
    serverKey: "AIzaSyDpGM_5AckCBM2r_mmpH1WEL8BU0HaXtzg",
    retries: 2,
    user_chunk : 1000,
  },
    dbConfig: {
      dbName: 'qykexternalmessagelogs',
      user: 'root',
      pass: 'root',
      host: 'localhost',
      dialect: 'mysql'
    }
  },
  production: {
    rabbitMQ: {
      server: "amqp://rmq.qykapp.com",
      queueName: "qyk-gcm-queue",
      prefetch: 1,
    },
    gcm: {
    serverKey: "AIzaSyDpGM_5AckCBM2r_mmpH1WEL8BU0HaXtzg",
    retries: 2,
    user_chunk : 1000,
  },
    dbConfig: {
      dbName: 'qykexternalmessagelogs',
      user: "qykadmin",
      pass: "qykbadmin",
      host:  'qyk-external-message-logs-db.ciedfil65z2c.ap-southeast-1.rds.amazonaws.com',
      port: 3306,
      dialect: 'mysql'
    }
  }
}