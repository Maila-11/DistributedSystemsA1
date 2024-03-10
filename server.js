const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

const dbConfig = {
  host: 'jokes_db', 
  user: 'maila',
  password: 'maila123', 
  database: 'jokesDB', 
  port: 3306 
};

const connection = mysql.createConnection(dbConfig);

connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL database.');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(express.static('public')); 
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/type', (req, res) => {
  const query = 'SELECT DISTINCT type FROM jokes';
  connection.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Error fetching joke types from database');
    } else {
      res.json(results.map(row => row.type));
    }
  });
});

app.get('/joke', (req, res) => {
  let jokeType = req.query.type || 'any'; 
  let count = parseInt(req.query.count) || 1; 

  let query = 'SELECT setup, punchline FROM jokes ';
  if (jokeType.toLowerCase() !== 'any') {
    query += 'WHERE type = ? ';
  }
  query += 'ORDER BY RAND() LIMIT ?';

  let queryParams = jokeType.toLowerCase() !== 'any' ? [jokeType, count] : [count];

  connection.query(query, queryParams, (err, results) => {
    if (err) {
      res.status(500).send('Error fetching joke from database');
    } else {
      res.json(results.length > 1 ? results : results[0]); 
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
