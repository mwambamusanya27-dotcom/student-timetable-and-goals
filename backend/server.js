require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Ensure goals table exists
db.run(`CREATE TABLE IF NOT EXISTS goals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`);

// ========== TIMETABLE API ==========

// GET - List all timetables
// API LINK: https://student-timetable-and-goals.onrender.com/api/timetable
app.get('/api/timetable', (req, res) => {
  db.all("SELECT * FROM timetable ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET - Get one timetable by ID
// API LINK: https://student-timetable-and-goals.onrender.com/api/timetable/1
app.get('/api/timetable/:id', (req, res) => {
  db.get("SELECT * FROM timetable WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Timetable not found" });
    res.json(row);
  });
});

// POST - Create new timetable
// API LINK: https://student-timetable-and-goals.onrender.com/api/timetable
app.post('/api/timetable', (req, res) => {
  const { course_code, course_name, day_of_week, start_time, end_time, venue, goal, status } = req.body;
  if (!course_code) return res.status(400).json({ error: "course_code is required" });

  db.run(
    `INSERT INTO timetable (course_code, course_name, day_of_week, start_time, end_time, venue, goal, status) VALUES (?,?,?,?,?,?,?,?)`,
    [course_code, course_name, day_of_week, start_time, end_time, venue, goal, status],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get("SELECT * FROM timetable WHERE id = ?", [this.lastID], (err, row) => {
        res.status(201).json(row);
      });
    }
  );
});

// PUT - Update timetable
// API LINK: https://student-timetable-and-goals.onrender.com/api/timetable/1
app.put('/api/timetable/:id', (req, res) => {
  const { course_code, course_name, day_of_week, start_time, end_time, venue, goal, status } = req.body;
  db.run(
    `UPDATE timetable SET course_code=?, course_name=?, day_of_week=?, start_time=?, end_time=?, venue=?, goal=?, status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
    [course_code, course_name, day_of_week, start_time, end_time, venue, goal, status, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Not found" });
      db.get("SELECT * FROM timetable WHERE id = ?", [req.params.id], (err, row) => res.json(row));
    }
  );
});

// DELETE - Delete timetable
// API LINK: https://student-timetable-and-goals.onrender.com/api/timetable/1
app.delete('/api/timetable/:id', (req, res) => {
  db.run("DELETE FROM timetable WHERE id = ?", [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Timetable deleted successfully", id: req.params.id });
  });
});

// ========== GOALS API ==========

// GET - List all goals
// API LINK: https://student-timetable-and-goals.onrender.com/api/goals
app.get('/api/goals', (req, res) => {
  db.all("SELECT * FROM goals ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST - Create goal
// API LINK: https://student-timetable-and-goals.onrender.com/api/goals
app.post('/api/goals', (req, res) => {
  const { title, description, status } = req.body;
  if (!title) return res.status(400).json({ error: "title is required" });
  db.run(
    `INSERT INTO goals (title, description, status) VALUES (?,?,?)`,
    [title, description, status || 'pending'],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get("SELECT * FROM goals WHERE id = ?", [this.lastID], (err, row) => res.status(201).json(row));
    }
  );
});

// PUT - Update goal
app.put('/api/goals/:id', (req, res) => {
  const { title, description, status } = req.body;
  db.run(
    `UPDATE goals SET title=?, description=?, status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
    [title, description, status, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get("SELECT * FROM goals WHERE id = ?", [req.params.id], (err, row) => res.json(row));
    }
  );
});

// DELETE - Delete goal
app.delete('/api/goals/:id', (req, res) => {
  db.run("DELETE FROM goals WHERE id = ?", [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Goal deleted", id: req.params.id });
  });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});