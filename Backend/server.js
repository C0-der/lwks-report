 const express = require('express');
 const mysql2 = require('mysql2');
 const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());// to parse json data

// Create connection to database

const db = mysql2.createConnection({
    host: 'gateway01.us-east-1.prod.aws.tidbcloud.com',
    user:  '3bvEKxhmHL6Qnm8.root',
    password: '3gu3WxEKlXGCAPd2',
    database: 'test',
    ssl: {
        rejectUnauthorized: true
    }
});

// Connect to database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to database', err);
        return;
    }
    console.log('Connected to database');
});

// Create students table
db.query(`CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL
)`, (err) => {
    if (err) console.error('Error creating students table:', err);
    else console.log('Students table ready');
});

// Create lecturers table
db.query(`CREATE TABLE IF NOT EXISTS lecturers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL
)`, (err) => {
    if (err) console.error('Error creating lecturers table:', err);
    else console.log('Lecturers table ready');
});

// Create principals table
db.query(`CREATE TABLE IF NOT EXISTS principals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL
)`, (err) => {
    if (err) console.error('Error creating principals table:', err);
    else console.log('Principals table ready');
});

// Create program_leaders table
db.query(`CREATE TABLE IF NOT EXISTS program_leaders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    stream_id INT
)`, (err) => {
    if (err) console.error('Error creating program_leaders table:', err);
    else console.log('Program leaders table ready');
});

// Create streams table
db.query(`CREATE TABLE IF NOT EXISTS streams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
)`, (err) => {
    if (err) console.error('Error creating streams table:', err);
    else console.log('Streams table ready');
});

// Create courses table
db.query(`CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    stream_id INT NOT NULL,
    FOREIGN KEY (stream_id) REFERENCES streams(id)
)`, (err) => {
    if (err) console.error('Error creating courses table:', err);
    else console.log('Courses table ready');
});

// Create lectures table
db.query(`CREATE TABLE IF NOT EXISTS lectures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    lecturer_username VARCHAR(255) NOT NULL,
    course_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id)
)`, (err) => {
    if (err) console.error('Error creating lectures table:', err);
    else console.log('Lectures table ready');
});

// Create lecture_reports table
db.query(`CREATE TABLE IF NOT EXISTS lecture_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lecturer_username VARCHAR(255) NOT NULL,
    facultyName VARCHAR(255) NOT NULL,
    className VARCHAR(255) NOT NULL,
    weekOfReporting VARCHAR(255) NOT NULL,
    dateOfLecture DATE NOT NULL,
    courseName VARCHAR(255) NOT NULL,
    courseCode VARCHAR(255) NOT NULL,
    lectureName VARCHAR(255) NOT NULL,
    actualStudentsPresent INT NOT NULL,
    totalRegisteredStudents INT NOT NULL,
    venueOfClass VARCHAR(255) NOT NULL,
    scheduledLectureTime VARCHAR(255) NOT NULL,
    topicTaught TEXT NOT NULL,
    learningOutcomes TEXT NOT NULL,
    lecturesRecommendations TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
    if (err) console.error('Error creating lecture_reports table:', err);
    else console.log('Lecture reports table ready');
});

// Create feedback table for storing feedback on lecture reports
db.query(`CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_id INT NOT NULL,
    from_username VARCHAR(255) NOT NULL,
    from_role VARCHAR(100) NOT NULL,
    feedback_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (report_id) REFERENCES lecture_reports(id) ON DELETE CASCADE
)`, (err) => {
    if (err) console.error('Error creating feedback table:', err);
    else console.log('Feedback table ready');
});

// Create messages table for storing contact messages
db.query(`CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
    if (err) console.error('Error creating messages table:', err);
    else console.log('Messages table ready');
});

// Create ratings table
db.query(`CREATE TABLE IF NOT EXISTS ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rater_username VARCHAR(255) NOT NULL,
    ratee_username VARCHAR(255) NOT NULL,
    rater_role VARCHAR(50) NOT NULL,
    ratee_role VARCHAR(50) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    lecture_id INT DEFAULT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
    if (err) console.error('Error creating ratings table:', err);
    else console.log('Ratings table ready');
});

// Ensure ratings table has lecture_id column (for existing DBs)
db.query("SHOW COLUMNS FROM ratings LIKE 'lecture_id'", (err, result) => {
    if (err) {
        console.error('Error checking lecture_id column:', err);
    } else if (result.length === 0) {
        db.query("ALTER TABLE ratings ADD COLUMN lecture_id INT DEFAULT NULL", (err2) => {
            if (err2) console.error('Error adding lecture_id column:', err2);
            else console.log('Added lecture_id column to ratings table');
        });
    } else {
        console.log('lecture_id column already exists in ratings table');
    }
});

// Create student_classes table
db.query(`CREATE TABLE IF NOT EXISTS student_classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    class_name VARCHAR(255) NOT NULL,
    class_code VARCHAR(255) NOT NULL,
    semester VARCHAR(50) NOT NULL,
    year INT NOT NULL
)`, (err) => {
    if (err) console.error('Error creating student_classes table:', err);
    else console.log('Student classes table ready');
});

// Insert test data
db.query("INSERT IGNORE INTO login (Username, Firstname, Lastname, Password, Role) VALUES ('pleader', 'Program', 'Leader', 'pass', 'program leader')", (err) => {
    if (err) console.error('Error inserting login:', err);
});
db.query("INSERT IGNORE INTO streams (id, name) VALUES (1, 'Computer Science')", (err) => {
    if (err) console.error('Error inserting stream:', err);
});

db.query("INSERT IGNORE INTO streams (id, name) VALUES (2, 'Stream 2')", (err) => {
    if (err) console.error('Error inserting stream:', err);
});

db.query("INSERT IGNORE INTO streams (id, name) VALUES (3, 'Stream 3')", (err) => {
    if (err) console.error('Error inserting stream:', err);
});

db.query("INSERT IGNORE INTO streams (id, name) VALUES (4, 'Stream 4')", (err) => {
    if (err) console.error('Error inserting stream:', err);
});

db.query("INSERT IGNORE INTO streams (id, name) VALUES (5, 'Stream 5')", (err) => {
    if (err) console.error('Error inserting stream:', err);
});

db.query("INSERT IGNORE INTO streams (id, name) VALUES (6, 'Stream 6')", (err) => {
    if (err) console.error('Error inserting stream:', err);
});

db.query("INSERT IGNORE INTO streams (id, name) VALUES (7, 'Stream 7')", (err) => {
    if (err) console.error('Error inserting stream:', err);
});

db.query("INSERT IGNORE INTO streams (id, name) VALUES (8, 'Stream 8')", (err) => {
    if (err) console.error('Error inserting stream:', err);
});

db.query("INSERT IGNORE INTO streams (id, name) VALUES (9, 'Stream 9')", (err) => {
    if (err) console.error('Error inserting stream:', err);
});

db.query("INSERT IGNORE INTO streams (id, name) VALUES (10, 'Stream 10')", (err) => {
    if (err) console.error('Error inserting stream:', err);
});

db.query("INSERT IGNORE INTO streams (id, name) VALUES (11, 'Stream 11')", (err) => {
    if (err) console.error('Error inserting stream:', err);
});

db.query("INSERT IGNORE INTO streams (id, name) VALUES (12, 'Stream 12')", (err) => {
    if (err) console.error('Error inserting stream:', err);
});

db.query("INSERT IGNORE INTO streams (id, name) VALUES (13, 'Stream 13')", (err) => {
    if (err) console.error('Error inserting stream:', err);
});

db.query("INSERT IGNORE INTO streams (id, name) VALUES (14, 'Stream 14')", (err) => {
    if (err) console.error('Error inserting stream:', err);
});

db.query("INSERT IGNORE INTO streams (id, name) VALUES (15, 'Stream 15')", (err) => {
    if (err) console.error('Error inserting stream:', err);
});

db.query("INSERT IGNORE INTO streams (id, name) VALUES (16, 'Stream 16')", (err) => {
    if (err) console.error('Error inserting stream:', err);
});

db.query("INSERT IGNORE INTO streams (id, name) VALUES (17, 'Stream 17')", (err) => {
    if (err) console.error('Error inserting stream:', err);
});

db.query("INSERT IGNORE INTO streams (id, name) VALUES (18, 'Stream 18')", (err) => {
    if (err) console.error('Error inserting stream:', err);
});

db.query("INSERT IGNORE INTO streams (id, name) VALUES (19, 'Stream 19')", (err) => {
    if (err) console.error('Error inserting stream:', err);
});

db.query("INSERT IGNORE INTO streams (id, name) VALUES (20, 'Stream 20')", (err) => {
    if (err) console.error('Error inserting stream:', err);
});

db.query("INSERT IGNORE INTO streams (id, name) VALUES (21, 'Stream 21')", (err) => {
    if (err) console.error('Error inserting stream:', err);
});
db.query("INSERT IGNORE INTO courses (id, name, stream_id) VALUES (1, 'Data Structures', 1)", (err) => {
    if (err) console.error('Error inserting course:', err);
});

db.query("INSERT IGNORE INTO courses (id, name, stream_id) VALUES (2, 'Bsc(hons) Information Technology', 2)", (err) => {
    if (err) console.error('Error inserting course:', err);
});

db.query("INSERT IGNORE INTO courses (id, name, stream_id) VALUES (3, 'BA (Hons) in Broadcasting and Journalism', 3)", (err) => {
    if (err) console.error('Error inserting course:', err);
});

db.query("INSERT IGNORE INTO courses (id, name, stream_id) VALUES (4, 'BA (Hons) in Professional Communication', 4)", (err) => {
    if (err) console.error('Error inserting course:', err);
});

db.query("INSERT IGNORE INTO courses (id, name, stream_id) VALUES (5, 'BA (Hons) in Digital Film and Television', 5)", (err) => {
    if (err) console.error('Error inserting course:', err);
});

db.query("INSERT IGNORE INTO courses (id, name, stream_id) VALUES (6, 'BA(Hons) in Events Management', 6)", (err) => {
    if (err) console.error('Error inserting course:', err);
});

db.query("INSERT IGNORE INTO courses (id, name, stream_id) VALUES (7, 'Associate Degree in Broadcasting (Radio and Television)', 7)", (err) => {
    if (err) console.error('Error inserting course:', err);
});

db.query("INSERT IGNORE INTO courses (id, name, stream_id) VALUES (8, 'Associate Degree in Journalism and Media', 8)", (err) => {
    if (err) console.error('Error inserting course:', err);
});

db.query("INSERT IGNORE INTO courses (id, name, stream_id) VALUES (9, 'Associate Degree in Public Relations', 9)", (err) => {
    if (err) console.error('Error inserting course:', err);
});

db.query("INSERT IGNORE INTO courses (id, name, stream_id) VALUES (10, 'Associate Degree in Film Production', 10)", (err) => {
    if (err) console.error('Error inserting course:', err);
});

db.query("INSERT IGNORE INTO courses (id, name, stream_id) VALUES (11, 'BA in Digital Film', 11)", (err) => {
    if (err) console.error('Error inserting course:', err);
});

db.query("INSERT IGNORE INTO courses (id, name, stream_id) VALUES (12, 'BA in Human Resource Management', 12)", (err) => {
    if (err) console.error('Error inserting course:', err);
});

db.query("INSERT IGNORE INTO courses (id, name, stream_id) VALUES (13, 'BBuss in Entrepreneurship', 13)", (err) => {
    if (err) console.error('Error inserting course:', err);
});

db.query("INSERT IGNORE INTO courses (id, name, stream_id) VALUES (14, 'BSc (Hons) in Information Technology', 14)", (err) => {
    if (err) console.error('Error inserting course:', err);
});

db.query("INSERT IGNORE INTO courses (id, name, stream_id) VALUES (15, 'BSc(Hons) in Business Information Technology', 15)", (err) => {
    if (err) console.error('Error inserting course:', err);
});

db.query("INSERT IGNORE INTO courses (id, name, stream_id) VALUES (16, 'BSc (Hons) in Software Engineering with Multimedia', 16)", (err) => {
    if (err) console.error('Error inserting course:', err);
});

db.query("INSERT IGNORE INTO courses (id, name, stream_id) VALUES (17, 'BSc(Hons) in Electronic Commerce', 17)", (err) => {
    if (err) console.error('Error inserting course:', err);
});

db.query("INSERT IGNORE INTO courses (id, name, stream_id) VALUES (18, 'Associate Degree in Multimedia and Software Engineering', 18)", (err) => {
    if (err) console.error('Error inserting course:', err);
});

db.query("INSERT IGNORE INTO courses (id, name, stream_id) VALUES (19, 'Associate Degree in Business Information Technology', 19)", (err) => {
    if (err) console.error('Error inserting course:', err);
});

db.query("INSERT IGNORE INTO courses (id, name, stream_id) VALUES (20, 'Associate Degree in Information Technology', 20)", (err) => {
    if (err) console.error('Error inserting course:', err);
});

db.query("INSERT IGNORE INTO courses (id, name, stream_id) VALUES (21, 'BSc in Business Information Technology', 21)", (err) => {
    if (err) console.error('Error inserting course:', err);
});

db.query("INSERT IGNORE INTO streams (id, name) VALUES (22, 'Architecture')", (err) => {
    if (err) console.error('Error inserting stream:', err);
});

db.query("INSERT IGNORE INTO streams (id, name) VALUES (23, 'Architecture Technology')", (err) => {
    if (err) console.error('Error inserting stream:', err);
});

db.query("INSERT IGNORE INTO streams (id, name) VALUES (24, 'Architectural Studies')", (err) => {
    if (err) console.error('Error inserting stream:', err);
});

db.query("INSERT IGNORE INTO streams (id, name) VALUES (25, 'Fashion and Retailing')", (err) => {
    if (err) console.error('Error inserting stream:', err);
});

db.query("INSERT IGNORE INTO streams (id, name) VALUES (26, 'Professional Design')", (err) => {
    if (err) console.error('Error inserting stream:', err);
});

db.query("INSERT IGNORE INTO streams (id, name) VALUES (27, 'Fashion and Apparel Design')", (err) => {
    if (err) console.error('Error inserting stream:', err);
});

db.query("INSERT IGNORE INTO streams (id, name) VALUES (28, 'Graphic Design')", (err) => {
    if (err) console.error('Error inserting stream:', err);
});

db.query("INSERT IGNORE INTO streams (id, name) VALUES (29, 'Advertising')", (err) => {
    if (err) console.error('Error inserting stream:', err);
});

db.query("INSERT IGNORE INTO streams (id, name) VALUES (30, 'Creative Advertising')", (err) => {
    if (err) console.error('Error inserting stream:', err);
});

db.query("INSERT IGNORE INTO streams (id, name) VALUES (31, 'Fashion and Retailing')", (err) => {
    if (err) console.error('Error inserting stream:', err);
});

db.query("INSERT IGNORE INTO courses (id, name, stream_id) VALUES (22, 'Bachelor of Interior Architecture', 22)", (err) => {
    if (err) console.error('Error inserting course:', err);
});

db.query("INSERT IGNORE INTO courses (id, name, stream_id) VALUES (23, 'Associate Degree in Architecture Technology', 23)", (err) => {
    if (err) console.error('Error inserting course:', err);
});

db.query("INSERT IGNORE INTO courses (id, name, stream_id) VALUES (24, 'Bachelor of Architectural Studies', 24)", (err) => {
    if (err) console.error('Error inserting course:', err);
});

db.query("INSERT IGNORE INTO courses (id, name, stream_id) VALUES (25, 'BA(Hons) in Fashion and Retailing', 25)", (err) => {
    if (err) console.error('Error inserting course:', err);
});

db.query("INSERT IGNORE INTO courses (id, name, stream_id) VALUES (26, 'BDesign in Professional Design', 26)", (err) => {
    if (err) console.error('Error inserting course:', err);
});

db.query("INSERT IGNORE INTO courses (id, name, stream_id) VALUES (27, 'Associate Degree in Fashion and Apparel Design', 27)", (err) => {
    if (err) console.error('Error inserting course:', err);
});

db.query("INSERT IGNORE INTO courses (id, name, stream_id) VALUES (28, 'Associate Degree in Graphic Design', 28)", (err) => {
    if (err) console.error('Error inserting course:', err);
});

db.query("INSERT IGNORE INTO courses (id, name, stream_id) VALUES (29, 'Associate Degree in Advertising', 29)", (err) => {
    if (err) console.error('Error inserting course:', err);
});

db.query("INSERT IGNORE INTO courses (id, name, stream_id) VALUES (30, 'Associate Degree in Creative Advertising', 30)", (err) => {
    if (err) console.error('Error inserting course:', err);
});

db.query("INSERT IGNORE INTO courses (id, name, stream_id) VALUES (31, 'BA in Fashion and Retailing', 31)", (err) => {
    if (err) console.error('Error inserting course:', err);
});
db.query("INSERT IGNORE INTO program_leaders (username, firstname, lastname, stream_id) VALUES ('pleader', 'Program', 'Leader', 1)", (err) => {
    if (err) console.error('Error inserting program leader:', err);
});
db.query("INSERT IGNORE INTO lecturers (username, firstname, lastname) VALUES ('lecturer1', 'John', 'Doe')", (err) => {
    if (err) console.error('Error inserting lecturer:', err);
});
db.query("INSERT IGNORE INTO lectures (title, description, lecturer_username, course_id) VALUES ('Intro to DS', 'Basics of Data Structures', 'lecturer1', 1)", (err) => {
    if (err) console.error('Error inserting lecture:', err);
});
db.query("INSERT IGNORE INTO login (Username, Firstname, Lastname, Password, Role) VALUES ('student1', 'John', 'Student', 'pass', 'student')", (err) => {
    if (err) console.error('Error inserting sample student login:', err);
});
db.query("INSERT IGNORE INTO students (username, firstname, lastname) VALUES ('student1', 'John', 'Student')", (err) => {
    if (err) console.error('Error inserting sample student:', err);
});
db.query("INSERT IGNORE INTO student_classes (username, class_name, class_code, semester, year) VALUES ('student1', 'Data Structures', 'DS101', 'Fall', 2023)", (err) => {
    if (err) console.error('Error inserting sample class:', err);
});
db.query("INSERT IGNORE INTO student_classes (username, class_name, class_code, semester, year) VALUES ('student1', 'Computer Science Fundamentals', 'CSF101', 'Spring', 2023)", (err) => {
    if (err) console.error('Error inserting sample class:', err);
});

app.post('/register', (req, res) => {
    const password = req.body.password.trim();
    // Normalize role (accept 'lecture' as 'lecturer', and common program leader variants)
    let normalizedRole = req.body.role.trim().toLowerCase();
    if (normalizedRole === 'lecture') normalizedRole = 'lecturer';
    if (normalizedRole === 'programleader' || normalizedRole === 'program_leader' || normalizedRole === 'program-leader') normalizedRole = 'program leader';
    const sql2 = "INSERT INTO login (`Username`,`Firstname`,`Lastname`,`Password`,`Role`) VALUES (?, ?, ?, ?, ?)";
    const values = [
        req.body.username.trim().toLowerCase(),
        req.body.firstname.trim(),
        req.body.lastname.trim(),
        password,
        normalizedRole
    ];
    db.query(sql2, values, (err, data) => {
        if (err) {
            console.error('Error inserting into database:', err);
            return res.status(500).json({ error: `Error inserting into login table: ${err.message}` });
        }
        console.log('Insert into login successful:', data);
        // Insert into users table
        const sqlUsers = "INSERT INTO users (firstname, lastname, role) VALUES (?, ?, ?)";
        const valuesUsers = [
            req.body.firstname.trim(),
            req.body.lastname.trim(),
            normalizedRole
        ];
        db.query(sqlUsers, valuesUsers, (err2, data2) => {
            if (err2) {
                console.error('Error inserting into users:', err2);
                return res.status(500).json({ error: "Error inserting into users table" });
            }
            console.log('Insert into users successful:', data2);
            // Insert into role-specific table based on role
            const role = normalizedRole;
            if (role === 'student') {
                const sqlStudents = "INSERT INTO students (username, firstname, lastname) VALUES (?, ?, ?)";
                const valuesStudents = [
                    req.body.username.trim().toLowerCase(),
                    req.body.firstname.trim(),
                    req.body.lastname.trim()
                ];
                db.query(sqlStudents, valuesStudents, (err3, data3) => {
                    if (err3) {
                        console.error('Error inserting into students:', err3);
                    } else {
                        console.log('Insert into students successful:', data3);
                        // If course_id provided in registration, enroll student into student_classes
                        const courseId = req.body.course_id;
                        if (courseId) {
                            db.query("SELECT name FROM courses WHERE id = ?", [courseId], (errCourse, courseData) => {
                                if (errCourse) {
                                    console.error('Error fetching course for student enrollment:', errCourse);
                                } else if (courseData.length > 0) {
                                    const className = courseData[0].name;
                                    const classCode = `C${courseId}`; // simple generated class code
                                    const semester = req.body.semester || 'TBD';
                                    const year = parseInt(req.body.year) || new Date().getFullYear();
                                    // Try to find username from students table by firstname+lastname
                                    db.query("SELECT username FROM students WHERE firstname = ? AND lastname = ? LIMIT 1", [req.body.firstname.trim(), req.body.lastname.trim()], (errFind, found) => {
                                        let usernameToUse = req.body.username.trim().toLowerCase();
                                        if (!errFind && found && found.length > 0 && found[0].username) {
                                            usernameToUse = found[0].username;
                                        }
                                        const sqlEnroll = "INSERT INTO student_classes (username, class_name, class_code, semester, year) VALUES (?, ?, ?, ?, ?)";
                                        db.query(sqlEnroll, [usernameToUse, className, classCode, semester, year], (errEnroll, dataEnroll) => {
                                            if (errEnroll) {
                                                console.error('Error enrolling student into class:', errEnroll);
                                            } else {
                                                console.log('Enrolled student into class:', dataEnroll);
                                            }
                                        });
                                    });
                                }
                            });
                        }
                    }
                });
            } else if (role === 'lecturer') {
                const sqlLecturers = "INSERT INTO lecturers (username, firstname, lastname) VALUES (?, ?, ?)";
                const valuesLecturers = [
                    req.body.username.trim().toLowerCase(),
                    req.body.firstname.trim(),
                    req.body.lastname.trim()
                ];
                db.query(sqlLecturers, valuesLecturers, (err3, data3) => {
                    if (err3) {
                        console.error('Error inserting into lecturers:', err3);
                    } else {
                        console.log('Insert into lecturers successful:', data3);
                    }
                });
            } else if (role === 'principal') {
                const sqlPrincipals = "INSERT INTO principals (username, firstname, lastname) VALUES (?, ?, ?)";
                const valuesPrincipals = [
                    req.body.username.trim().toLowerCase(),
                    req.body.firstname.trim(),
                    req.body.lastname.trim()
                ];
                db.query(sqlPrincipals, valuesPrincipals, (err3, data3) => {
                    if (err3) {
                        console.error('Error inserting into principals:', err3);
                    } else {
                        console.log('Insert into principals successful:', data3);
                    }
                });
            } else if (role === 'program leader') {
                const sqlProgramLeaders = "INSERT INTO program_leaders (username, firstname, lastname) VALUES (?, ?, ?)";
                const valuesProgramLeaders = [
                    req.body.username.trim().toLowerCase(),
                    req.body.firstname.trim(),
                    req.body.lastname.trim()
                ];
                db.query(sqlProgramLeaders, valuesProgramLeaders, (err3, data3) => {
                    if (err3) {
                        console.error('Error inserting into program_leaders:', err3);
                    } else {
                        console.log('Insert into program_leaders successful:', data3);
                    }
                });
            }
            return res.status(200).json({ success: true, message: "Registration successful" });
        });
    });
})

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const trimmedUsername = username.trim().toLowerCase();
    const trimmedPassword = password.trim();
    const sql = "SELECT * FROM login WHERE Username = ?";
    db.query(sql, [trimmedUsername], (err, data) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.json({ success: false, message: 'Database error' });
        }
        if (data.length === 0) {
            return res.json({ success: false, message: 'User not found' });
        }
        const user = data[0];
        if (user.Password !== trimmedPassword) {
            return res.json({ success: false, message: 'Invalid password' });
        }
        return res.json({ success: true, role: user.Role, username: user.Username, firstname: user.Firstname, lastname: user.Lastname });
    });
})

app.get('/get-classes', (req, res) => {
    const username = req.query.username;
    const course = req.query.course;
    let sql = "SELECT * FROM student_classes WHERE username = ?";
    const params = [username];
    if (course) {
        sql += " AND class_name = ?";
        params.push(course);
    }
    db.query(sql, params, (err, data) => {
        if (err) {
            console.error('Error querying student_classes:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(data);
    });
})

app.get('/get-students', (req, res) => {
    const sql = "SELECT username, firstname, lastname FROM students";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error querying students:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(data);
    });
})

app.get('/get-lecturers', (req, res) => {
    const sql = "SELECT username, firstname, lastname FROM lecturers";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error querying lecturers:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(data);
    });
})

app.get('/get-ratings', (req, res) => {
    const studentUsername = req.query.student_username;
    const sql = `
        SELECT r.id, r.rating, r.comment, r.created_at,
               l.firstname as lecturer_firstname,
               l.lastname as lecturer_lastname
        FROM ratings r
        JOIN lecturers l ON r.rater_username = l.username
        WHERE r.ratee_username = ? AND r.rater_role = 'lecturer' AND r.ratee_role = 'student'
        ORDER BY r.created_at DESC
    `;
    db.query(sql, [studentUsername], (err, data) => {
        if (err) {
            console.error('Error querying ratings:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(data);
    });
})

app.post('/submit-rating', (req, res) => {
    const { rater_username, ratee_username, rater_role, ratee_role, rating, comment } = req.body;
    const lecture_id = req.body.lecture_id || null;
    const sql = "INSERT INTO ratings (rater_username, ratee_username, rater_role, ratee_role, rating, comment, lecture_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [rater_username, ratee_username, rater_role, ratee_role, rating, comment, lecture_id], (err, data) => {
        if (err) {
            console.error('Error inserting rating:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: true, message: 'Rating submitted successfully' });
    });
})

app.post('/register-course', (req, res) => {
    let { username, course, semester, year, firstname, lastname } = req.body;
    // If username is missing or undefined, attempt to look it up by firstname+lastname
    const ensureUsernameAndProceed = (cb) => {
        if (username && username.trim()) return cb(null, username.trim().toLowerCase());
        if (firstname && lastname) {
            db.query("SELECT username FROM students WHERE firstname = ? AND lastname = ? LIMIT 1", [firstname.trim(), lastname.trim()], (err, rows) => {
                if (err) return cb(err);
                if (rows && rows.length > 0 && rows[0].username) return cb(null, rows[0].username);
                return cb(new Error('Student username not found for provided firstname/lastname'));
            });
        } else {
            return cb(new Error('username not provided and firstname/lastname not present'));
        }
    };
    // Generate unique class code
    const crypto = require('crypto');
    let classCode;
    do {
        classCode = crypto.randomBytes(4).toString('hex').toUpperCase(); // 8 character hex
    } while (false); // For now, assume unique, can add check later if needed
    ensureUsernameAndProceed((errEnsure, resolvedUsername) => {
        if (errEnsure) {
            console.error('Error resolving username for register-course:', errEnsure.message || errEnsure);
            return res.status(400).json({ error: errEnsure.message || 'username resolution failed' });
        }
        const sql = "INSERT INTO student_classes (username, class_name, class_code, semester, year) VALUES (?, ?, ?, ?, ?)";
        db.query(sql, [resolvedUsername, course, classCode, semester, parseInt(year)], (err, data) => {
            if (err) {
                console.error('Error registering course:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ success: true, message: 'Registered successfully', classCode });
        });
    });
})

app.get('/get-lecturer-ratings', (req, res) => {
    const lecturerUsername = req.query.lecturer_username;
    const lectureId = req.query.lecture_id;
    let sql = `
        SELECT r.id, r.rating, r.comment, r.created_at,
               p.firstname as principal_firstname,
               p.lastname as principal_lastname,
               l.title as lecture_title
        FROM ratings r
        JOIN principals p ON r.rater_username = p.username
        LEFT JOIN lectures l ON r.lecture_id = l.id
        WHERE r.ratee_username = ? AND r.rater_role = 'principal' AND r.ratee_role = 'lecturer'
    `;
    const params = [lecturerUsername];
    if (lectureId) {
        sql += ` AND r.lecture_id = ?`;
        params.push(lectureId);
    }
    sql += ` ORDER BY r.created_at DESC`;
    db.query(sql, params, (err, data) => {
        if (err) {
            console.error('Error querying lecturer ratings:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(data);
    });
})

app.get('/get-all-ratings', (req, res) => {
    const sql = `
        SELECT r.id, r.rating, r.comment, r.created_at, r.rater_role, r.ratee_role,
               COALESCE(l.firstname, pr.firstname, pl.firstname) as rater_firstname,
               COALESCE(l.lastname, pr.lastname, pl.lastname) as rater_lastname,
               COALESCE(s.firstname, lec.firstname, prin.firstname, prog.firstname) as ratee_firstname,
               COALESCE(s.lastname, lec.lastname, prin.lastname, prog.lastname) as ratee_lastname
        FROM ratings r
        LEFT JOIN lecturers l ON r.rater_username = l.username AND r.rater_role = 'lecturer'
        LEFT JOIN principals pr ON r.rater_username = pr.username AND r.rater_role = 'principal'
        LEFT JOIN program_leaders pl ON r.rater_username = pl.username AND r.rater_role = 'program leader'
        LEFT JOIN students s ON r.ratee_username = s.username AND r.ratee_role = 'student'
        LEFT JOIN lecturers lec ON r.ratee_username = lec.username AND r.ratee_role = 'lecturer'
        LEFT JOIN principals prin ON r.ratee_username = prin.username AND r.ratee_role = 'principal'
        LEFT JOIN program_leaders prog ON r.ratee_username = prog.username AND r.ratee_role = 'program leader'
        ORDER BY r.created_at DESC
    `;
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error querying all ratings:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(data);
    });
})

app.get('/get-lecturer-given-ratings', (req, res) => {
    const lecturerUsername = req.query.lecturer_username;
    const studentUsername = req.query.student_username;
    let sql = `
        SELECT r.id, r.rating, r.comment, r.created_at,
               r.ratee_username as ratee_username,
               s.firstname as student_firstname,
               s.lastname as student_lastname
        FROM ratings r
        JOIN students s ON r.ratee_username = s.username
        WHERE r.rater_username = ? AND r.rater_role = 'lecturer' AND r.ratee_role = 'student'
    `;
    const params = [lecturerUsername];
    if (studentUsername) {
        sql += ` AND r.ratee_username = ?`;
        params.push(studentUsername);
    }
    sql += ` ORDER BY r.created_at DESC`;
    db.query(sql, params, (err, data) => {
        if (err) {
            console.error('Error querying lecturer given ratings:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(data);
    });
})

app.get('/get-all-lectures', (req, res) => {
    const sql = `
        SELECT l.id, l.title, l.description, l.lecturer_username, l.created_at,
               lec.firstname as lecturer_firstname,
               lec.lastname as lecturer_lastname
        FROM lectures l
        JOIN lecturers lec ON l.lecturer_username = lec.username
        ORDER BY l.created_at DESC
    `;
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error querying all lectures:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(data);
    });
})

app.delete('/delete-lecture', (req, res) => {
    const { id } = req.body;
    const sql = "DELETE FROM lectures WHERE id = ?";
    db.query(sql, [id], (err, data) => {
        if (err) {
            console.error('Error deleting lecture:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: true, message: 'Lecture deleted successfully' });
    });
})

app.put('/update-lecture', (req, res) => {
    const { id, title, description, lecturer_username } = req.body;
    const sql = "UPDATE lectures SET title = ?, description = ?, lecturer_username = ? WHERE id = ?";
    db.query(sql, [title, description, lecturer_username, id], (err, data) => {
        if (err) {
            console.error('Error updating lecture:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: true, message: 'Lecture updated successfully' });
    });
})

app.get('/get-courses', (req, res) => {
    const sql = "SELECT id, name FROM courses";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error querying courses:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(data);
    });
})

app.get('/get-all-courses-with-lectures', (req, res) => {
    const sqlCourses = "SELECT id, name FROM courses";
    db.query(sqlCourses, (err, coursesData) => {
        if (err) {
            console.error('Error querying courses:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (coursesData.length === 0) {
            return res.json([]);
        }
        // For each course, get lectures
        const coursesWithLectures = [];
        let processedCourses = 0;
        coursesData.forEach(course => {
            const sqlLectures = `
                SELECT l.id, l.title, l.description, l.created_at,
                       lec.firstname as lecturer_firstname,
                       lec.lastname as lecturer_lastname
                FROM lectures l
                JOIN lecturers lec ON l.lecturer_username = lec.username
                WHERE l.course_id = ?
                ORDER BY l.created_at DESC
            `;
            db.query(sqlLectures, [course.id], (err, lecturesData) => {
                if (err) {
                    console.error('Error querying lectures:', err);
                    return res.status(500).json({ error: 'Database error' });
                }
                coursesWithLectures.push({
                    id: course.id,
                    name: course.name,
                    lectures: lecturesData
                });
                processedCourses++;
                if (processedCourses === coursesData.length) {
                    res.json(coursesWithLectures);
                }
            });
        });
    });
})

app.get('/get-program-leader-stream-courses-lectures', (req, res) => {
    const programLeaderUsername = req.query.username;
    // First, get stream_id for the program leader
    const sqlStream = "SELECT stream_id FROM program_leaders WHERE username = ?";
    db.query(sqlStream, [programLeaderUsername], (err, streamData) => {
        if (err) {
            console.error('Error querying program_leaders:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (streamData.length === 0) {
            return res.json({ courses: [] });
        }
        const streamId = streamData[0].stream_id;
        if (!streamId) {
            return res.json({ courses: [] });
        }
        // Get courses for the stream
        const sqlCourses = "SELECT id, name FROM courses WHERE stream_id = ?";
        db.query(sqlCourses, [streamId], (err, coursesData) => {
            if (err) {
                console.error('Error querying courses:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            if (coursesData.length === 0) {
                return res.json({ courses: [] });
            }
            // For each course, get lectures
            const coursesWithLectures = [];
            let processedCourses = 0;
            coursesData.forEach(course => {
                const sqlLectures = `
                    SELECT l.id, l.title, l.description, l.created_at,
                           lec.firstname as lecturer_firstname,
                           lec.lastname as lecturer_lastname
                    FROM lectures l
                    JOIN lecturers lec ON l.lecturer_username = lec.username
                    WHERE l.course_id = ?
                    ORDER BY l.created_at DESC
                `;
                db.query(sqlLectures, [course.id], (err, lecturesData) => {
                    if (err) {
                        console.error('Error querying lectures:', err);
                        return res.status(500).json({ error: 'Database error' });
                    }
                    coursesWithLectures.push({
                        id: course.id,
                        name: course.name,
                        lectures: lecturesData
                    });
                    processedCourses++;
                    if (processedCourses === coursesData.length) {
                        res.json({ courses: coursesWithLectures });
                    }
                });
            });
        });
    });
})

app.get('/get-lecturer-lectures', (req, res) => {
    const lecturerUsername = req.query.lecturer_username;
    const sql = `
        SELECT l.id, l.title, l.description, l.created_at, c.name as course_name
        FROM lectures l
        JOIN courses c ON l.course_id = c.id
        WHERE l.lecturer_username = ?
        ORDER BY l.created_at DESC
    `;
    db.query(sql, [lecturerUsername], (err, data) => {
        if (err) {
            console.error('Error querying lecturer lectures:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(data);
    });
})

app.post('/add-lecture', (req, res) => {
    const { lecturer_username, title, description, course_id } = req.body;
    const sql = "INSERT INTO lectures (title, description, lecturer_username, course_id) VALUES (?, ?, ?, ?)";
    db.query(sql, [title, description, lecturer_username, course_id], (err, data) => {
        if (err) {
            console.error('Error adding lecture:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: true, message: 'Lecture added successfully' });
    });
})

app.post('/submit-report', (req, res) => {
    const {
        lecturer_username,
        facultyName,
        className,
        weekOfReporting,
        dateOfLecture,
        courseName,
        courseCode,
        lectureName,
        actualStudentsPresent,
        totalRegisteredStudents,
        venueOfClass,
        scheduledLectureTime,
        topicTaught,
        learningOutcomes,
        lecturesRecommendations
    } = req.body;
    const sql = `INSERT INTO lecture_reports (
        lecturer_username,
        facultyName,
        className,
        weekOfReporting,
        dateOfLecture,
        courseName,
        courseCode,
        lectureName,
        actualStudentsPresent,
        totalRegisteredStudents,
        venueOfClass,
        scheduledLectureTime,
        topicTaught,
        learningOutcomes,
        lecturesRecommendations
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [
        lecturer_username,
        facultyName,
        className,
        weekOfReporting,
        dateOfLecture,
        courseName,
        courseCode,
        lectureName,
        actualStudentsPresent,
        totalRegisteredStudents,
        venueOfClass,
        scheduledLectureTime,
        topicTaught,
        learningOutcomes,
        lecturesRecommendations
    ], (err, data) => {
        if (err) {
            console.error('Error submitting report:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.json({ success: true, message: 'Report submitted successfully' });
    });
})

// Get lecture reports - optionally filter by lecturer_username
app.get('/get-lecture-reports', (req, res) => {
    const lecturerUsername = req.query.lecturer_username;
    let sql = `SELECT lr.*, lr.created_at as report_created_at FROM lecture_reports lr`;
    const params = [];
    if (lecturerUsername) {
        sql += ` WHERE lr.lecturer_username = ?`;
        params.push(lecturerUsername);
    }
    sql += ` ORDER BY lr.created_at DESC`;
    db.query(sql, params, (err, data) => {
        if (err) {
            console.error('Error querying lecture reports:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(data);
    });
});

// Submit feedback for a lecture report
app.post('/submit-feedback', (req, res) => {
    const { report_id, from_username, from_role, feedback_text } = req.body;
    if (!report_id || !from_username || !from_role || !feedback_text) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const sql = `INSERT INTO feedback (report_id, from_username, from_role, feedback_text) VALUES (?, ?, ?, ?)`;
    db.query(sql, [report_id, from_username, from_role, feedback_text], (err, data) => {
        if (err) {
            console.error('Error inserting feedback:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: true, message: 'Feedback submitted successfully' });
    });
});

// Get feedback for a specific lecture report
app.get('/get-feedback', (req, res) => {
    const reportId = req.query.report_id;
    if (!reportId) return res.status(400).json({ error: 'report_id is required' });
    const sql = `
        SELECT f.id, f.report_id, f.from_username, f.from_role, f.feedback_text, f.created_at,
               COALESCE(l.firstname, p.firstname, pl.firstname, s.firstname, '') AS from_firstname,
               COALESCE(l.lastname, p.lastname, pl.lastname, s.lastname, '') AS from_lastname
        FROM feedback f
        LEFT JOIN lecturers l ON f.from_username = l.username AND f.from_role = 'lecturer'
        LEFT JOIN principals p ON f.from_username = p.username AND f.from_role = 'principal'
        LEFT JOIN program_leaders pl ON f.from_username = pl.username AND f.from_role = 'program leader'
        LEFT JOIN students s ON f.from_username = s.username AND f.from_role = 'student'
        WHERE f.report_id = ?
        ORDER BY f.created_at DESC
    `;
    db.query(sql, [reportId], (err, data) => {
        if (err) {
            console.error('Error querying feedback:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(data);
    });
});

// Delete feedback by id
app.delete('/delete-feedback', (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Feedback id is required' });
    const sql = 'DELETE FROM feedback WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting feedback:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Feedback not found' });
        }
        res.json({ success: true, message: 'Feedback deleted' });
    });
});

// Delete course by id
app.delete('/delete-course', (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Course id is required' });

    // Start transaction
    db.beginTransaction((err) => {
        if (err) {
            console.error('Error starting transaction:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        // First, delete related lectures
        const deleteLecturesSql = 'DELETE FROM lectures WHERE course_id = ?';
        db.query(deleteLecturesSql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting lectures:', err);
                return db.rollback(() => {
                    res.status(500).json({ error: 'Database error' });
                });
            }

            // Then, delete the course
            const deleteCourseSql = 'DELETE FROM courses WHERE id = ?';
            db.query(deleteCourseSql, [id], (err, result) => {
                if (err) {
                    console.error('Error deleting course:', err);
                    return db.rollback(() => {
                        res.status(500).json({ error: 'Database error' });
                    });
                }
                if (result.affectedRows === 0) {
                    return db.rollback(() => {
                        res.status(404).json({ error: 'Course not found' });
                    });
                }

                // Commit transaction
                db.commit((err) => {
                    if (err) {
                        console.error('Error committing transaction:', err);
                        return db.rollback(() => {
                            res.status(500).json({ error: 'Database error' });
                        });
                    }
                    res.json({ success: true, message: 'Course deleted successfully' });
                });
            });
        });
    });
});

app.get('/get-lecturer-students', (req, res) => {
    const lecturerUsername = req.query.lecturer_username;
    const sql = `
        SELECT DISTINCT s.username, s.firstname, s.lastname, sc.class_name, sc.class_code, sc.semester, sc.year
        FROM students s
        JOIN student_classes sc ON s.username = sc.username
        JOIN courses c ON sc.class_name = c.name
        JOIN lectures l ON c.id = l.course_id
        WHERE l.lecturer_username = ?
        ORDER BY sc.class_name, s.lastname
    `;
    db.query(sql, [lecturerUsername], (err, data) => {
        if (err) {
            console.error('Error querying lecturer students:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(data);
    });
})

app.delete('/delete-student', (req, res) => {
    const { username } = req.body;
    if (!username) {
        return res.status(400).json({ error: 'Student username is required' });
    }
    // Check if student exists
    const checkStudentSql = "SELECT id FROM students WHERE username = ?";
    db.query(checkStudentSql, [username], (err, data) => {
        if (err) {
            console.error('Error querying student:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (data.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        // Delete from ratings where student is rater or ratee
        const deleteRatingsSql = "DELETE FROM ratings WHERE rater_username = ? OR ratee_username = ?";
        db.query(deleteRatingsSql, [username, username], (err) => {
            if (err) {
                console.error('Error deleting ratings:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            // Delete from student_classes
            const deleteClassesSql = "DELETE FROM student_classes WHERE username = ?";
            db.query(deleteClassesSql, [username], (err) => {
                if (err) {
                    console.error('Error deleting student classes:', err);
                    return res.status(500).json({ error: 'Database error' });
                }
                // Finally, delete from students
                const deleteStudentSql = "DELETE FROM students WHERE username = ?";
                db.query(deleteStudentSql, [username], (err) => {
                    if (err) {
                        console.error('Error deleting student:', err);
                        return res.status(500).json({ error: 'Database error' });
                    }
                    res.json({ success: true, message: 'Student deleted successfully' });
                });
            });
        });
    });
})

// Add lecturer
app.post('/add-lecturer', (req, res) => {
    const { username, firstname, lastname } = req.body;
    if (!username || !firstname || !lastname) {
        return res.status(400).json({ error: 'Username, firstname, and lastname are required' });
    }
    const sql = "INSERT INTO lecturers (username, firstname, lastname) VALUES (?, ?, ?)";
    db.query(sql, [username.trim().toLowerCase(), firstname.trim(), lastname.trim()], (err, data) => {
        if (err) {
            console.error('Error adding lecturer:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: true, message: 'Lecturer added successfully' });
    });
})

// Assign lecture to lecturer (update lecturer_username in lectures table)
app.put('/assign-lecture', (req, res) => {
    const { lecture_id, lecturer_username } = req.body;
    if (!lecture_id || !lecturer_username) {
        return res.status(400).json({ error: 'Lecture ID and lecturer username are required' });
    }
    const sql = "UPDATE lectures SET lecturer_username = ? WHERE id = ?";
    db.query(sql, [lecturer_username.trim().toLowerCase(), lecture_id], (err, data) => {
        if (err) {
            console.error('Error assigning lecture:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: true, message: 'Lecture assigned successfully' });
    });
})

// Get all principals
app.get('/get-principals', (req, res) => {
    const sql = "SELECT username, firstname, lastname FROM principals";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error querying principals:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(data);
    });
})

// Get all classes in program leader's stream
app.get('/get-program-leader-classes', (req, res) => {
    const programLeaderUsername = req.query.username;
    // First, get stream_id for the program leader
    const sqlStream = "SELECT stream_id FROM program_leaders WHERE username = ?";
    db.query(sqlStream, [programLeaderUsername], (err, streamData) => {
        if (err) {
            console.error('Error querying program_leaders:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (streamData.length === 0) {
            return res.json([]);
        }
        const streamId = streamData[0].stream_id;
        if (!streamId) {
            return res.json([]);
        }
        // Get distinct classes from student_classes where course is in the stream
        const sqlClasses = `
            SELECT DISTINCT sc.class_name, sc.class_code, sc.semester, sc.year,
                           c.name as course_name, l.lecturer_username,
                           lec.firstname as lecturer_firstname, lec.lastname as lecturer_lastname
            FROM student_classes sc
            JOIN courses c ON sc.class_name = c.name
            LEFT JOIN lectures l ON c.id = l.course_id
            LEFT JOIN lecturers lec ON l.lecturer_username = lec.username
            WHERE c.stream_id = ?
            ORDER BY sc.class_name
        `;
        db.query(sqlClasses, [streamId], (err, data) => {
            if (err) {
                console.error('Error querying classes:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(data);
        });
    });
})

// Get reviewed reports (reports with feedback from principal)
app.get('/get-reviewed-reports', (req, res) => {
    const sql = `
        SELECT lr.id, lr.lectureName as lecture_title, lr.topicTaught as report, lr.created_at,
               lec.firstname as lecturer_firstname, lec.lastname as lecturer_lastname,
               f.feedback_text as principal_feedback
        FROM lecture_reports lr
        JOIN feedback f ON lr.id = f.report_id
        JOIN lecturers lec ON lr.lecturer_username = lec.username
        WHERE f.from_role = 'principal' AND f.id = (SELECT MAX(id) FROM feedback WHERE report_id = lr.id AND from_role = 'principal')
        ORDER BY lr.created_at DESC
    `;
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error querying reviewed reports:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(data);
    });
});

// Get unreviewed reports (reports with principal feedback but no program leader feedback)
app.get('/get-unreviewed-reports', (req, res) => {
    const sql = `
        SELECT lr.id, lr.lectureName as lecture_title, lr.topicTaught as report, lr.created_at,
               lec.firstname as lecturer_firstname, lec.lastname as lecturer_lastname,
               pf.feedback_text as principal_feedback
        FROM lecture_reports lr
        JOIN feedback pf ON lr.id = pf.report_id AND pf.from_role = 'principal'
        JOIN lecturers lec ON lr.lecturer_username = lec.username
        LEFT JOIN feedback plf ON lr.id = plf.report_id AND plf.from_role = 'program leader'
        WHERE plf.id IS NULL
        ORDER BY lr.created_at DESC
    `;
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error querying unreviewed reports:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(data);
    });
});

// Submit program leader feedback
app.post('/submit-program-leader-feedback', (req, res) => {
    const { reportId, feedback, from_username, from_role } = req.body;
    if (!reportId || !feedback || !from_username || !from_role) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const sql = `INSERT INTO feedback (report_id, from_username, from_role, feedback_text) VALUES (?, ?, ?, ?)`;
    db.query(sql, [reportId, from_username, from_role, feedback], (err, data) => {
        if (err) {
            console.error('Error inserting program leader feedback:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: true, message: 'Feedback submitted successfully' });
    });
});

// Get lecturer classes (lectures) in program leader's stream
app.get('/get-program-leader-lecturer-classes', (req, res) => {
    const programLeaderUsername = req.query.username;
    // First, get stream_id for the program leader
    const sqlStream = "SELECT stream_id FROM program_leaders WHERE username = ?";
    db.query(sqlStream, [programLeaderUsername], (err, streamData) => {
        if (err) {
            console.error('Error querying program_leaders:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (streamData.length === 0) {
            return res.json([]);
        }
        const streamId = streamData[0].stream_id;
        if (!streamId) {
            return res.json([]);
        }
        // Get lectures for courses in the stream
        const sqlLectures = `
            SELECT l.id, l.title, l.description, l.created_at,
                   c.name as course_name,
                   lec.firstname as lecturer_firstname, lec.lastname as lecturer_lastname
            FROM lectures l
            JOIN courses c ON l.course_id = c.id
            JOIN lecturers lec ON l.lecturer_username = lec.username
            WHERE c.stream_id = ?
            ORDER BY l.created_at DESC
        `;
        db.query(sqlLectures, [streamId], (err, data) => {
            if (err) {
                console.error('Error querying lecturer classes:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(data);
        });
    });
});

// Get student ratings distribution (for pie chart)
app.get('/get-student-ratings-distribution', (req, res) => {
    const studentUsername = req.query.student_username;
    if (!studentUsername) {
        return res.status(400).json({ error: 'student_username is required' });
    }
    const sql = `
        SELECT rating, COUNT(*) as count
        FROM ratings
        WHERE ratee_username = ? AND ratee_role = 'student' AND rater_role = 'lecturer'
        GROUP BY rating
        ORDER BY rating
    `;
    db.query(sql, [studentUsername], (err, data) => {
        if (err) {
            console.error('Error querying student ratings distribution:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        // Categorize ratings: Poor (1-2), Average (3), Good (4-5)
        const distribution = { Poor: 0, Average: 0, Good: 0 };
        data.forEach(row => {
            if (row.rating <= 2) distribution.Poor += row.count;
            else if (row.rating === 3) distribution.Average += row.count;
            else if (row.rating >= 4) distribution.Good += row.count;
        });
        // Convert to array for pie chart
        const result = [
            { name: 'Poor', value: distribution.Poor, color: '#FF8042' },
            { name: 'Average', value: distribution.Average, color: '#FFBB28' },
            { name: 'Good', value: distribution.Good, color: '#00C49F' }
        ];
        res.json(result);
    });
});

// Get student progress (average rating per week over last 4 weeks, for line chart)
app.get('/get-student-progress', (req, res) => {
    const studentUsername = req.query.student_username;
    if (!studentUsername) {
        return res.status(400).json({ error: 'student_username is required' });
    }
    // Get average rating per week for the last 4 weeks
    const sql = `
        SELECT
            YEARWEEK(created_at, 1) as week,
            AVG(rating) as avg_rating
        FROM ratings
        WHERE ratee_username = ? AND ratee_role = 'student' AND rater_role = 'lecturer'
        AND created_at >= DATE_SUB(CURDATE(), INTERVAL 4 WEEK)
        GROUP BY YEARWEEK(created_at, 1)
        ORDER BY week DESC
        LIMIT 4
    `;
    db.query(sql, [studentUsername], (err, data) => {
        if (err) {
            console.error('Error querying student progress:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        // Reverse to chronological order and format for chart
        const result = data.reverse().map((row, index) => ({
            name: `Week ${index + 1}`,
            progress: Math.round(row.avg_rating * 20) // Convert 1-5 scale to 20-100%
        }));
        // If less than 4 weeks, fill with 0 or last value
        while (result.length < 4) {
            result.unshift({ name: `Week ${result.length + 1}`, progress: 0 });
        }
        res.json(result);
    });
});

// Get student attendance (average per day of week from lecture reports for student's courses)
app.get('/get-student-attendance', (req, res) => {
    const studentUsername = req.query.student_username;
    if (!studentUsername) {
        return res.status(400).json({ error: 'student_username is required' });
    }
    // Get student's enrolled courses
    const sqlCourses = `
        SELECT DISTINCT c.name as course_name
        FROM student_classes sc
        JOIN courses c ON sc.class_name = c.name
        WHERE sc.username = ?
    `;
    db.query(sqlCourses, [studentUsername], (err, courses) => {
        if (err) {
            console.error('Error querying student courses:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (courses.length === 0) {
            return res.json([
                { name: 'Mon', attendance: 0 },
                { name: 'Tue', attendance: 0 },
                { name: 'Wed', attendance: 0 },
                { name: 'Thu', attendance: 0 },
                { name: 'Fri', attendance: 0 }
            ]);
        }
        const courseNames = courses.map(c => c.course_name);
        // Get average attendance per day of week from lecture reports for these courses
        const sqlAttendance = `
            SELECT
                DAYOFWEEK(dateOfLecture) as day_num,
                AVG((actualStudentsPresent / totalRegisteredStudents) * 100) as avg_attendance
            FROM lecture_reports
            WHERE courseName IN (?)
            GROUP BY DAYOFWEEK(dateOfLecture)
            ORDER BY DAYOFWEEK(dateOfLecture)
        `;
        db.query(sqlAttendance, [courseNames], (err, data) => {
            if (err) {
                console.error('Error querying attendance:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            // Map to Mon-Fri (DAYOFWEEK: 1=Sun, 2=Mon, 3=Tue, 4=Wed, 5=Thu, 6=Fri, 7=Sat)
            const dayMap = { 2: 'Mon', 3: 'Tue', 4: 'Wed', 5: 'Thu', 6: 'Fri' };
            const result = Object.keys(dayMap).map(dayNum => {
                const found = data.find(d => d.day_num == dayNum);
                return {
                    name: dayMap[dayNum],
                    attendance: found ? Math.round(found.avg_attendance) : 0
                };
            });
            res.json(result);
        });
    });
});

// Get all student classes
app.get('/get-all-student-classes', (req, res) => {
    const sql = `
        SELECT sc.id, sc.username, sc.class_name, sc.class_code, sc.semester, sc.year,
               s.firstname as student_firstname, s.lastname as student_lastname
        FROM student_classes sc
        JOIN students s ON sc.username = s.username
        ORDER BY sc.class_name, s.lastname
    `;
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error querying all student classes:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(data);
    });
});

// Get all lectures with course and lecturer details
app.get('/get-all-lectures-with-courses', (req, res) => {
    const sql = `
        SELECT l.id, l.title, l.description, l.created_at,
               c.name as course_name,
               lec.firstname as lecturer_firstname, lec.lastname as lecturer_lastname
        FROM lectures l
        JOIN courses c ON l.course_id = c.id
        JOIN lecturers lec ON l.lecturer_username = lec.username
        ORDER BY l.created_at DESC
    `;
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error querying all lectures with courses:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(data);
    });
});

// Send message endpoint
app.post('/send-message', (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required' });
    }
    const sql = "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)";
    db.query(sql, [name.trim(), email.trim(), message.trim()], (err, data) => {
        if (err) {
            console.error('Error inserting message:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: true, message: 'Message sent successfully' });
    });
});

//port running on 3001
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
