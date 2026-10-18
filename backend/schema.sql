DROP TABLE IF EXISTS timetable;

CREATE TABLE timetable (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_code VARCHAR(20) NOT NULL,
    course_name VARCHAR(150) NOT NULL,
    day_of_week VARCHAR(20) NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    venue VARCHAR(100),
    goal TEXT,
    status VARCHAR(20) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO timetable (course_code, course_name, day_of_week, start_time, end_time, venue, goal, status) VALUES
('ICT251', 'Database Systems', 'Monday', '09:00', '11:00', 'Room 5', 'Get A in SQL', 'Pending'),
('ICT231', 'Web Development', 'Tuesday', '11:00', '13:00', 'Lab 2', 'Build CRUD App', 'In Progress'),
('ICT211', 'Data Structures', 'Wednesday', '08:00', '10:00', 'Room 1', 'Master Algorithms', 'Pending'),
('MAT101', 'Discrete Mathematics', 'Thursday', '14:00', '16:00', 'Room 3', 'Pass exam', 'Pending'),
('ENG101', 'Communication Skills', 'Friday', '10:00', '12:00', 'Room 2', 'Improve presentation', 'Completed'),
('ICT251', 'Database Lab', 'Monday', '14:00', '16:00', 'Lab 1', 'Finish MySQL queries', 'Pending'),
('ICT262', 'Computer Networks', 'Tuesday', '14:00', '16:00', 'Room 4', 'Configure router lab', 'Pending'),
('ICT281', 'Software Engineering', 'Wednesday', '11:00', '13:00', 'Room 6', 'Complete UML Diagrams', 'In Progress'),
('STA102', 'Probability & Statistics', 'Thursday', '08:00', '10:00', 'Room 3', 'Revise probability', 'Pending'),
('ICT291', 'Project Management', 'Friday', '13:00', '15:00', 'Room 5', 'Submit project proposal', 'Pending');