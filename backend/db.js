const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'timetable.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error(err.message);
  else console.log('Connected to timetable.db');
});

// Create table and insert data on startup
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
db.exec(schema, (err) => {
  if (err) console.error("Schema error:", err.message);
  else console.log("Table timetable ready with 10 records");
});

module.exports = db;