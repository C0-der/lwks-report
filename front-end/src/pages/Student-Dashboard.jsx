import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

function StudentDashboard() {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [ratings, setRatings] = useState([]);
    const [showRatingsTable, setShowRatingsTable] = useState(false);
    const [courses, setCourses] = useState([]);
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [selectedCourseForRegister, setSelectedCourseForRegister] = useState('');
    const [semester, setSemester] = useState('');
    const [year, setYear] = useState('');
    const [attendanceData, setAttendanceData] = useState([]);
    const [ratingsData, setRatingsData] = useState([]);
    const [progressData, setProgressData] = useState([]);

    const username = localStorage.getItem('username');
    const firstname = localStorage.getItem('firstname');
    const lastname = localStorage.getItem('lastname');

    useEffect(() => {
        fetch('http://localhost:3001/get-courses')
            .then(res => res.json())
            .then(data => setCourses(data))
            .catch(err => console.error('Error fetching courses:', err));

        // Fetch chart data
        if (username) {
            fetch(`http://localhost:3001/get-student-attendance?student_username=${username}`)
                .then(res => res.json())
                .then(data => setAttendanceData(data))
                .catch(err => console.error('Error fetching attendance data:', err));

            fetch(`http://localhost:3001/get-student-ratings-distribution?student_username=${username}`)
                .then(res => res.json())
                .then(data => setRatingsData(data))
                .catch(err => console.error('Error fetching ratings data:', err));

            fetch(`http://localhost:3001/get-student-progress?student_username=${username}`)
                .then(res => res.json())
                .then(data => setProgressData(data))
                .catch(err => console.error('Error fetching progress data:', err));
        }
    }, [username]);

    const handleMonitor = () => {
        if (!username) {
            alert('Username not found. Please log in again.');
            return;
        }
        const url = `http://localhost:3001/get-classes?username=${username}`;
        fetch(url)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => {
                setClasses(data);
                setShowTable(true);
            })
            .catch(err => {
                console.error('Error fetching classes:', err);
                alert('Error fetching classes: ' + err.message);
            });
    };

    const handleRatings = () => {
        if (!username) {
            alert('Username not found. Please log in again.');
            return;
        }
        fetch(`http://localhost:3001/get-ratings?student_username=${username}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => {
                setRatings(data);
                setShowRatingsTable(true);
            })
            .catch(err => {
                console.error('Error fetching ratings:', err);
                alert('Error fetching ratings: ' + err.message);
            });
    };

    const handleRegister = () => {
        if (!username) {
            alert('Username not found. Please log in again.');
            return;
        }
        if (!selectedCourseForRegister || !semester || !year) {
            alert('Please fill all fields.');
            return;
        }
        fetch('http://localhost:3001/register-course', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                course: selectedCourseForRegister,
                semester,
                year,
            }),
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert(`Registered successfully! Your class code is: ${data.classCode}`);
                setShowRegisterForm(false);
                setSelectedCourseForRegister('');
                setSemester('');
                setYear('');
                // Refetch chart data after registration
                fetch(`http://localhost:3001/get-student-attendance?student_username=${username}`)
                    .then(res => res.json())
                    .then(data => setAttendanceData(data))
                    .catch(err => console.error('Error refetching attendance data:', err));

                fetch(`http://localhost:3001/get-student-ratings-distribution?student_username=${username}`)
                    .then(res => res.json())
                    .then(data => setRatingsData(data))
                    .catch(err => console.error('Error refetching ratings data:', err));

                fetch(`http://localhost:3001/get-student-progress?student_username=${username}`)
                    .then(res => res.json())
                    .then(data => setProgressData(data))
                    .catch(err => console.error('Error refetching progress data:', err));
            } else {
                alert('Registration failed: ' + data.error);
            }
        })
        .catch(err => {
            console.error('Error registering:', err);
            alert('Error registering: ' + err.message);
        });
    };

    return (
        <div className="d-flex vh-100">
            <div className="sidebar bg-dark text-white p-3" style={{ width: '250px' }}>
                <h4>Student Dashboard</h4>
                <div className="d-flex flex-column gap-2">
                    <button className="btn btn-outline-light" onClick={() => { setShowRegisterForm(false); setShowTable(false); setShowRatingsTable(false); }}>Overview</button>
                    <button className="btn btn-outline-light" onClick={() => { setShowRegisterForm(true); setShowTable(false); setShowRatingsTable(false); }}>Login/Register Modules</button>
                    <button className="btn btn-outline-light" onClick={() => { handleMonitor(); setShowRegisterForm(false); setShowRatingsTable(false); }}>Monitor</button>
                    <button className="btn btn-outline-light" onClick={() => { handleRatings(); setShowRegisterForm(false); setShowTable(false); }}>Ratings</button>
                    <button className="btn btn-outline-light" onClick={() => navigate('/')}>Logout</button>
                </div>
            </div>
            <div className="main-content flex-grow-1 p-4 bg-light text-dark">
                <h3 className="text-center">Welcome, {firstname} {lastname}</h3>
                {!showTable && !showRatingsTable && !showRegisterForm && (
                    <div className="mt-4">
                        <h4>Overview</h4>
                        <div className="row">
                            <div className="col-md-4">
                                <h5>Attendance</h5>
                                <BarChart width={300} height={200} data={attendanceData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="attendance" fill="#8884d8" />
                                </BarChart>
                            </div>
                            <div className="col-md-4">
                                <h5>Ratings</h5>
                                <PieChart width={300} height={200}>
                                    <Pie
                                        data={ratingsData}
                                        cx={150}
                                        cy={100}
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {ratingsData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </div>
                            <div className="col-md-4">
                                <h5>Learning Outcomes</h5>
                                <LineChart width={300} height={200} data={progressData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="progress" stroke="#8884d8" />
                                </LineChart>
                            </div>
                        </div>
                    </div>
                )}
                {showTable && (
                    <div className="mt-4">
                        <h3>Your Classes</h3>
                        <button className="btn btn-secondary mb-3" onClick={() => { setShowTable(false); }}>Close</button>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Class Name</th>
                                    <th>Class Code</th>
                                    <th>Semester</th>
                                    <th>Year</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classes.map(cls => (
                                    <tr key={cls.id}>
                                        <td>{cls.class_name}</td>
                                        <td>{cls.class_code}</td>
                                        <td>{cls.semester}</td>
                                        <td>{cls.year}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {showRatingsTable && (
                    <div className="mt-4">
                        <h3>Your Ratings</h3>
                        <button className="btn btn-secondary mb-3" onClick={() => { setShowRatingsTable(false); }}>Close</button>
                        {ratings.length === 0 ? (
                            <p>No ratings yet.</p>
                        ) : (
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Lecturer Name</th>
                                        <th>Rating</th>
                                        <th>Comment</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ratings.map(rating => (
                                        <tr key={rating.id}>
                                            <td>{rating.lecturer_firstname} {rating.lecturer_lastname}</td>
                                            <td>{rating.rating}</td>
                                            <td>{rating.comment || 'N/A'}</td>
                                            <td>{new Date(rating.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
                {showRegisterForm && (
                    <div className="mt-4">
                        <h3>Register for Course</h3>
                        <div className="mb-3">
                            <label>Select Course:</label>
                            <select className="form-control" value={selectedCourseForRegister} onChange={(e) => setSelectedCourseForRegister(e.target.value)}>
                                <option value="">Select a course</option>
                                {courses.map(course => <option key={course.id} value={course.name}>{course.name}</option>)}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label>Semester:</label>
                            <input type="text" className="form-control" value={semester} onChange={(e) => setSemester(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label>Year:</label>
                            <input type="number" className="form-control" value={year} onChange={(e) => setYear(e.target.value)} />
                        </div>
                        <button className="btn btn-primary" onClick={handleRegister}>Register</button>
                        <button className="btn btn-secondary ml-2" onClick={() => { setShowRegisterForm(false); }}>Cancel</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default StudentDashboard;
