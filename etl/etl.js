const amqp = require('amqplib/callback_api');
const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'jokes_db',  
  user: 'maila',
  password: 'maila123',
  database: 'jokesDB'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
});


const rabbitMQHost = 'amqp://rabbitmq';  //rabbitmq
amqp.connect(rabbitMQHost, (error0, connection) => {
  if (error0) {
    throw error0;
  }
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }

    const queue = 'jokesQueue'; 

    channel.assertQueue(queue, {
      durable: false
    });

    console.log(`Waiting for messages in ${queue}.`);

    channel.consume(queue, (msg) => {
        if (msg.content) {
          try {
            const joke = JSON.parse(msg.content.toString());
            const query = 'INSERT INTO jokes (setup, punchline, type) VALUES (?, ?, ?)';
            db.query(query, [joke.setup, joke.punchline, joke.type], (err, result) => {
              if (err) {
                console.error('Error inserting joke into database:', err);
              } else {
                console.log('Joke inserted into database with ID:', result.insertId);
              }
            });
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        }
      }, {
        noAck: true
      });
      
  });
});
