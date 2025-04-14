const mysql = require('mysql2');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

// DB Connection
const pool = mysql.createPool({
  host: process.env.SQL_HOSTNAME,
  user: process.env.SQL_USERNAME,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DBNAME,
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Movie Reviewer API running on port ${port}`);
});

// Base route
app.get('/', (req, res) => {
  res.json({ info: 'Backend for Movie Reviewer, set up by Diante.HM!' });
});

// Users
app.get('/v1/users/list', (req, res) => {
  pool.query('SELECT id, fname, lname, email, account_status FROM users ORDER BY id', (err, results) => {
    res.json({ status: 'success', data: results });
  });
});

app.post('/v1/users/create', (req, res) => {
  const { fname, lname, email } = req.body;
  pool.query(
    'INSERT INTO users (fname, lname, email, registration_date, account_status) VALUES (?, ?, ?, NOW(), ?)',
    [fname, lname, email, 'Pending Verification'],
    (err, result) => {
      res.json({ status: 'success', message: 'New user created' });
    }
  );
});

// Movies
app.get('/v1/movies/list', (req, res) => {
  pool.query('SELECT * FROM movies ORDER BY release_date DESC', (err, results) => {
    res.json({ status: 'success', data: results });
  });
});

// Shows
app.get('/v1/shows/list', (req, res) => {
  pool.query('SELECT * FROM shows ORDER BY release_date DESC', (err, results) => {
    res.json({ status: 'success', data: results });
  });
});

// Movie Ratings
app.get('/v1/movies/ratings', (req, res) => {
  pool.query(
    `SELECT mr.id, u.fname, u.lname, m.title, mr.review, mr.rating
     FROM movie_ratings mr
     JOIN users u ON u.id = mr.user_id
     JOIN movies m ON m.id = mr.movie_id
     ORDER BY mr.id DESC`,
    (err, results) => {
      res.json({ status: 'success', data: results });
    }
  );
});

app.post('/v1/movies/ratings/add', (req, res) => {
  const { user_id, movie_id, review, rating } = req.body;
  pool.query(
    'INSERT INTO movie_ratings (user_id, movie_id, review, rating) VALUES (?, ?, ?, ?)',
    [user_id, movie_id, review, rating],
    (err, result) => {
      res.json({ status: 'success', message: 'Movie rating added' });
    }
  );
});

// Show Ratings
app.get('/v1/shows/ratings', (req, res) => {
  pool.query(
    `SELECT sr.id, u.fname, u.lname, s.tvshow, sr.review, sr.rating
     FROM show_ratings sr
     JOIN users u ON u.id = sr.user_id
     JOIN shows s ON s.id = sr.show_id
     ORDER BY sr.id DESC`,
    (err, results) => {
      res.json({ status: 'success', data: results });
    }
  );
});

app.post('/v1/shows/ratings/add', (req, res) => {
  const { user_id, show_id, review, rating } = req.body;
  pool.query(
    'INSERT INTO show_ratings (user_id, show_id, review, rating) VALUES (?, ?, ?, ?)',
    [user_id, show_id, review, rating],
    (err, result) => {
      res.json({ status: 'success', message: 'Show rating added' });
    }
  );
});