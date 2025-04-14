const mysql = require('mysql2');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;


const pool = mysql.createPool({
  host: process.env.SQL_HOSTNAME,
  user: process.env.SQL_USERNAME,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DBNAME,
  charset: 'utf8mb4'
});


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Movie Reviewer API running on port ${port}`);
});

// Root route
app.get('/', (req, res) => {
  res.json({ info: 'Backend for Movie Reviewer by Diante.HM!' });
});


app.get('/users/list', (req, res) => {
  pool.query('SELECT id, fname, lname, email, account_status FROM users ORDER BY id', (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to fetch users' });
    }
    res.json({ status: 'success', data: results });
  });
});

app.post('/users/create', (req, res) => {
  const { fname, lname, email } = req.body;
  pool.query(
    'INSERT INTO users (fname, lname, email, registration_date, account_status) VALUES (?, ?, ?, NOW(), ?)',
    [fname, lname, email, 'Pending Verification'],
    (err) => {
      if (err) {
        console.error('Error creating user:', err);
        return res.status(500).json({ status: 'error', message: 'Failed to create user' });
      }
      res.json({ status: 'success', message: 'New user created' });
    }
  );
});


app.get('/movies/list', (req, res) => {
  pool.query('SELECT * FROM movies ORDER BY release_date DESC', (err, results) => {
    if (err) {
      console.error('Error fetching movies:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to fetch movies' });
    }
    res.json({ status: 'success', data: results });
  });
});

app.get('/movies/view/:id', (req, res) => {
  const movieId = req.params.id;

  pool.query('SELECT * FROM movies WHERE id = ?', [movieId], (err, results) => {
    if (err) {
      console.error('Error fetching movie by ID:', err);
      return res.status(500).json({ status: 'error', message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ status: 'not_found', message: 'Movie not found' });
    }

    res.json({ status: 'success', data: results[0] });
  });
});


app.get('/shows/list', (req, res) => {
  pool.query('SELECT * FROM shows ORDER BY release_date DESC', (err, results) => {
    if (err) {
      console.error('Error fetching shows:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to fetch shows' });
    }
    res.json({ status: 'success', data: results });
  });
});


app.get('/movies/ratings', (req, res) => {
  const query = `
    SELECT mr.id, u.fname, u.lname, m.title, mr.review, mr.rating
    FROM movie_ratings mr
    JOIN users u ON u.id = mr.user_id
    JOIN movies m ON m.id = mr.movie_id
    ORDER BY mr.id DESC
  `;

  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching movie ratings:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to fetch movie ratings' });
    }
    res.json({ status: 'success', data: results });
  });
});

app.post('/movies/ratings/add', (req, res) => {
  const { user_id, movie_id, review, rating } = req.body;
  pool.query(
    'INSERT INTO movie_ratings (user_id, movie_id, review, rating) VALUES (?, ?, ?, ?)',
    [user_id, movie_id, review, rating],
    (err) => {
      if (err) {
        console.error('Error adding movie rating:', err);
        return res.status(500).json({ status: 'error', message: 'Failed to add movie rating' });
      }
      res.json({ status: 'success', message: 'Movie rating added' });
    }
  );
});


app.get('/shows/ratings', (req, res) => {
  const query = `
    SELECT sr.id, u.fname, u.lname, s.tvshow, sr.review, sr.rating
    FROM show_ratings sr
    JOIN users u ON u.id = sr.user_id
    JOIN shows s ON s.id = sr.show_id
    ORDER BY sr.id DESC
  `;

  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching show ratings:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to fetch show ratings' });
    }
    res.json({ status: 'success', data: results });
  });
});

app.post('/shows/ratings/add', (req, res) => {
  const { user_id, show_id, review, rating } = req.body;
  pool.query(
    'INSERT INTO show_ratings (user_id, show_id, review, rating) VALUES (?, ?, ?, ?)',
    [user_id, show_id, review, rating],
    (err) => {
      if (err) {
        console.error('Error adding show rating:', err);
        return res.status(500).json({ status: 'error', message: 'Failed to add show rating' });
      }
      res.json({ status: 'success', message: 'Show rating added' });
    }
  );
});