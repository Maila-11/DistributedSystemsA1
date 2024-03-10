const amqp = require('amqplib/callback_api');

const rabbitMQHost = 'amqp://localhost'; 
const queue = 'jokesQueue'; 

amqp.connect(rabbitMQHost, (error0, connection) => {
  if (error0) {
    throw error0;
  }
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }

    const joke = {
      setup: "Why does the beetroot always win?",
      punchline: "Because its un-beet-able!",
      type: "food"
    };

    channel.assertQueue(queue, {
      durable: false
    });

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(joke)));
    console.log(" [x] Sent '%s'", JSON.stringify(joke));
  });

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
});
