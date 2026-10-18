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

// GET /api/timetable -> List all
app.get('/api/timetable', (req, res) => {
  db.all("SELECT * FROM timetable ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET /api/timetable/:id -> Get one
app.get('/api/timetable/:id', (req, res) => {
  db.get("SELECT * FROM timetable WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  });
});

// POST /api/timetable -> Create
app.post('/api/timetable', (req, res) => {
  const { course_code, course_name, day_of_week, start_time, end_time, venue, goal, status } = req.body;
  if (!course_code) return res.status(400).json({ error: "course_code is required" });
  
  db.run(`INSERT INTO timetable (course_code, course_name, day_of_week, start_time, end_time, venue, goal, status) VALUES (?,?,?,?,?,?,?,?)`,
    [course_code, course_name, day_of_week, start_time, end_time, venue, goal, status],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get("SELECT * FROM timetable WHERE id = ?", [this.lastID], (err, row) => {
        res.status(201).json(row);
      });
    });
});

// PUT /api/timetable/:id -> Update
app.put('/api/timetable/:id', (req, res) => {
  const { course_code, course_name, day_of_week, start_time, end_time, venue, goal, status } = req.body;
  db.run(`UPDATE timetable SET course_code=?, course_name=?, day_of_week=?, start_time=?, end_time=?, venue=?, goal=?, status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
    [course_code, course_name, day_of_week, start_time, end_time, venue, goal, status, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get("SELECT * FROM timetable WHERE id = ?", [req.params.id], (err, row) => res.json(row));
    });
});

// DELETE /api/timetable/:id -> Delete
app.delete('/api/timetable/:id', (req, res) => {
  db.run("DELETE FROM timetable WHERE id = ?", [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Deleted successfully", id: req.params.id });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/api/timetable`);
});