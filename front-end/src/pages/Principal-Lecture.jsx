import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

function PrincipalLecture() {
    const navigate = useNavigate();
    const firstname = localStorage.getItem('firstname');
    const lastname = localStorage.getItem('lastname');
    const username = localStorage.getItem('username');
    const [activeSection, setActiveSection] = useState(''); // '', 'courses', 'reports', 'monitor', 'ratings', 'classes'
    const [viewMode, setViewMode] = useState('view'); // 'view' or 'rate'
    const [studentRatings, setStudentRatings] = useState([]);
    const [lecturers, setLecturers] = useState([]);
    const [selectedLecturer, setSelectedLecturer] = useState('');
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState('');
    const [monitorMode, setMonitorMode] = useState('courses');
    const [monitorCourses, setMonitorCourses] = useState([]);
    const [monitorLecturers, setMonitorLecturers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [reports, setReports] = useState([]);
    const [feedbackText, setFeedbackText] = useState({}); // keyed by report id
    const [reportFeedback, setReportFeedback] = useState({}); // keyed by report id -> array
    const [overviewData, setOverviewData] = useState({
        reportsFiled: 0,
        feedbacksGiven: 0,
        ratingsGiven: 0,
        reportsData: [],
        feedbacksData: [],
        ratingsData: []
    });
    const [studentClasses, setStudentClasses] = useState([]);
    const [lectures, setLectures] = useState([]);

    const handleRatings = () => {
        setActiveSection('ratings');
        setViewMode('view');
        fetchStudentRatings();
    };

    const deleteFeedback = (feedbackId) => {
        if (!confirm('Delete this feedback?')) return;
        fetch('https://lwks-reporting.onrender.com/delete-feedback', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: feedbackId })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Feedback deleted');
                    // refresh all feedback lists by refetching reports (simpler)
                    fetchReports();
                } else {
                    alert('Error deleting feedback');
                }
            })
            .catch(err => {
                console.error('Error deleting feedback:', err);
                alert('Error deleting feedback: ' + err.message);
            });
    };

    const fetchStudentRatings = () => {
        // Fetch ratings where ratee_role = 'student'
        fetch('https://lwks-reporting.onrender.com/get-all-ratings')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => {
                if (data.error) {
                    alert('Error fetching ratings: ' + data.error);
                    setStudentRatings([]);
                    return;
                }
                if (!Array.isArray(data)) {
                    alert('Unexpected response format');
                    setStudentRatings([]);
                    return;
                }
                const filtered = data.filter(r => r.ratee_role === 'student');
                setStudentRatings(filtered);
            })
            .catch(err => {
                console.error('Error fetching student ratings:', err);
                alert('Error fetching ratings: ' + err.message);
                setStudentRatings([]);
            });
    };

    const handleRateLecturers = () => {
        setViewMode('rate');
        fetch('https://lwks-reporting.onrender.com/get-lecturers')
            .then(res => res.json())
            .then(data => setLecturers(data))
            .catch(err => {
                console.error('Error fetching lecturers:', err);
                alert('Error fetching lecturers: ' + err.message);
            });
    };

    const handleSubmitRating = () => {
        if (!selectedLecturer) {
            alert('Please select a lecturer.');
            return;
        }
        fetch('https://lwks-reporting.onrender.com/submit-rating', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                rater_username: username,
                ratee_username: selectedLecturer,
                rater_role: 'principal',
                ratee_role: 'lecturer',
                rating: parseInt(rating),
                comment
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Rating submitted successfully!');
                    setSelectedLecturer('');
                    setRating(1);
                    setComment('');
                } else {
                    alert('Error submitting rating.');
                }
            })
            .catch(err => {
                console.error('Error submitting rating:', err);
                alert('Error submitting rating: ' + err.message);
            });
    };

    const handleMonitor = () => {
        setActiveSection('monitor');
        setMonitorMode('courses');
        fetchMonitorCourses();
    };

    const fetchMonitorCourses = () => {
        fetch('https://lwks-reporting.onrender.com/get-all-courses-with-lectures')
            .then(res => res.json())
            .then(data => setMonitorCourses(data))
            .catch(err => {
                console.error('Error fetching courses:', err);
                alert('Error fetching courses: ' + err.message);
            });
    };

    const fetchMonitorLecturers = () => {
        fetch('https://lwks-reporting.onrender.com/get-lecturers')
            .then(res => res.json())
            .then(data => setMonitorLecturers(data))
            .catch(err => {
                console.error('Error fetching lecturers:', err);
                alert('Error fetching lecturers: ' + err.message);
            });
    };

    const handleCourses = () => {
        setActiveSection('courses');
        fetchCourses();
    };

    const fetchStudentClasses = () => {
        fetch('https://lwks-reporting.onrender.com/get-all-student-classes',)
            .then(res => res.json())
            .then(data => setStudentClasses(data))
            .catch(err => {
                console.error('Error fetching student classes:', err);
                alert('Error fetching student classes: ' + err.message);
            });
    };

    const fetchLectures = () => {
        fetch('https://lwks-reporting.onrender.com/get-all-lectures-with-courses')
            .then(res => res.json())
            .then(data => setLectures(data))
            .catch(err => {
                console.error('Error fetching lectures:', err);
                alert('Error fetching lectures: ' + err.message);
            });
    };

    const handleClasses = () => {
        setActiveSection('classes');
        fetchStudentClasses();
        fetchLectures();
    };

    const fetchCourses = () => {
        fetch('https://lwks-reporting.onrender.com/get-courses')
            .then(res => res.json())
            .then(data => setCourses(data))
            .catch(err => {
                console.error('Error fetching courses:', err);
                alert('Error fetching courses: ' + err.message);
            });
    };

    const handleDeleteCourse = (courseId) => {
        if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) return;
        fetch('https://lwks-reporting.onrender.com/delete-course', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: courseId })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Course deleted successfully');
                    fetchCourses(); // Refresh the courses list
                } else {
                    alert('Error deleting course: ' + (data.error || 'Unknown error'));
                }
            })
            .catch(err => {
                console.error('Error deleting course:', err);
                alert('Error deleting course: ' + err.message);
            });
    };

    const fetchReports = () => {
        // Optionally filter by lecturer if needed, for now get all reports
        fetch('https://lwks-reporting.onrender.com/get-lecture-reports')
            .then(res => res.json())
            .then(data => {
                setReports(data);
                // fetch feedback for each report
                data.forEach(r => fetchFeedbackForReport(r.id));
            })
            .catch(err => {
                console.error('Error fetching reports:', err);
                alert('Error fetching reports: ' + err.message);
            });
    };

    const submitFeedback = (reportId) => {
        const text = feedbackText[reportId];
        if (!text || text.trim() === '') {
            alert('Please enter feedback before sending');
            return;
        }
        const payload = {
            report_id: reportId,
            from_username: username || 'principal',
            from_role: 'principal',
            feedback_text: text
        };
        fetch('https://lwks-reporting.onrender.com/submit-feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Feedback sent');
                    // clear the feedback for this report
                    setFeedbackText(prev => ({ ...prev, [reportId]: '' }));
                    // reload feedback for this report
                    fetchFeedbackForReport(reportId);
                } else {
                    alert('Error sending feedback');
                }
            })
            .catch(err => {
                console.error('Error submitting feedback:', err);
                alert('Error submitting feedback: ' + err.message);
            });
    };

    const fetchFeedbackForReport = (reportId) => {
        fetch(`https://lwks-reporting.onrender.com/get-feedback?report_id=${reportId}`)
            .then(res => res.json())
            .then(data => setReportFeedback(prev => ({ ...prev, [reportId]: data })))
            .catch(err => console.error('Error fetching feedback for report', reportId, err));
    };

    useEffect(() => {
        if (username) {
            // Fetch reports filed by lecturers
            fetch('https://lwks-reporting.onrender.com/get-lecture-reports')
                .then(res => res.json())
                .then(data => {
                    const reportsData = data.map(report => ({
                        name: new Date(report.created_at).toLocaleDateString(),
                        reports: 1
                    }));
                    setOverviewData(prev => ({ ...prev, reportsFiled: data.length, reportsData }));
                })
                .catch(err => console.error('Error fetching reports:', err));

            // Fetch feedbacks given by principal
            fetch(`https://lwks-reporting.onrender.com/get-feedback-by-user?username=${username}`)
                .then(res => res.json())
                .then(data => {
                    const feedbacksData = data.map(feedback => ({
                        name: new Date(feedback.created_at).toLocaleDateString(),
                        feedbacks: 1
                    }));
                    setOverviewData(prev => ({ ...prev, feedbacksGiven: data.length, feedbacksData }));
                })
                .catch(err => console.error('Error fetching feedbacks:', err));

            // Fetch ratings given by principal
            fetch(`https://lwks-reporting.onrender.com/get-ratings-by-user?username=${username}`)
                .then(res => res.json())
                .then(data => {
                    const ratingsData = data.reduce((acc, rating) => {
                        const date = new Date(rating.created_at).toLocaleDateString();
                        const existing = acc.find(item => item.name === date);
                        if (existing) {
                            existing.ratings += 1;
                        } else {
                            acc.push({ name: date, ratings: 1 });
                        }
                        return acc;
                    }, []);
                    setOverviewData(prev => ({ ...prev, ratingsGiven: data.length, ratingsData }));
                })
                .catch(err => console.error('Error fetching ratings:', err));
        }
    }, [username]);

    return (
        <div className="d-flex flex-column min-vh-100">
            <div className="d-flex flex-grow-1">
                <div className="sidebar bg-dark text-white p-3" style={{ width: '250px' }}>
                    <h4>Principal Dashboard</h4>
                    <div className="d-flex flex-column gap-2">
                        <button className="btn btn-outline-light" onClick={() => setActiveSection('')}>Overview</button>
                        <button className="btn btn-outline-light" onClick={handleCourses}>Courses</button>
                        <button className="btn btn-outline-light" onClick={() => { setActiveSection('reports'); fetchReports(); }}>Review Reports</button>
                        <button className="btn btn-outline-light" onClick={handleMonitor}>Monitor</button>
                        <button className="btn btn-outline-light" onClick={handleRatings}>Ratings</button>
                        <button className="btn btn-outline-light" onClick={handleClasses}>Classes</button>
                        <button className="btn btn-outline-light" onClick={() => navigate('/')}>Logout</button>
                    </div>
                </div>
                <div className="main-content flex-grow-1 p-4 bg-light text-dark" style={{ overflowY: 'auto' }}>
                    <h3 className="text-center">Welcome, {firstname} {lastname}</h3>
                    {activeSection === '' && (
                        <div className="mt-4">
                            <h4>Principal Overview</h4>
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="card text-center">
                                        <div className="card-body">
                                            <h5 className="card-title">Reports Filed</h5>
                                            <p className="card-text">{overviewData.reportsFiled}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card text-center">
                                        <div className="card-body">
                                            <h5 className="card-title">Feedbacks Given</h5>
                                            <p className="card-text">{overviewData.feedbacksGiven}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card text-center">
                                        <div className="card-body">
                                            <h5 className="card-title">Ratings Given</h5>
                                            <p className="card-text">{overviewData.ratingsGiven}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-4">
                                <div className="col-md-6">
                                    <h5>Reports Over Time</h5>
                                    <BarChart width={400} height={300} data={overviewData.reportsData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="reports" fill="#8884d8" />
                                    </BarChart>
                                </div>
                                <div className="col-md-6">
                                    <h5>Feedbacks Over Time</h5>
                                    <LineChart width={400} height={300} data={overviewData.feedbacksData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="feedbacks" stroke="#82ca9d" />
                                    </LineChart>
                                </div>
                            </div>
                            <div className="row mt-4">
                                <div className="col-md-6">
                                    <h5>Ratings Over Time</h5>
                                    <BarChart width={400} height={300} data={overviewData.ratingsData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="ratings" fill="#ffc658" />
                                    </BarChart>
                                </div>
                                <div className="col-md-6">
                                    <h5>Activity Distribution</h5>
                                    <PieChart width={400} height={300}>
                                        <Pie
                                            data={[
                                                { name: 'Reports', value: overviewData.reportsFiled },
                                                { name: 'Feedbacks', value: overviewData.feedbacksGiven },
                                                { name: 'Ratings', value: overviewData.ratingsGiven }
                                            ]}
                                            cx={200}
                                            cy={150}
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            <Cell fill="#8884d8" />
                                            <Cell fill="#82ca9d" />
                                            <Cell fill="#ffc658" />
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeSection === 'ratings' && (
                        <div className="mt-4">
                            <div className="d-flex gap-2 mb-3">
                                <button className={`btn ${viewMode === 'view' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => { setViewMode('view'); fetchStudentRatings(); }}>View Student Ratings</button>
                                <button className={`btn ${viewMode === 'rate' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={handleRateLecturers}>Rate Lecturers</button>
                            </div>
                            {viewMode === 'view' && (
                                <div>
                                    <h4>Student Ratings</h4>
                                    {studentRatings.length === 0 ? (
                                        <p>No ratings found.</p>
                                    ) : (
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Rater</th>
                                                    <th>Ratee</th>
                                                    <th>Rating</th>
                                                    <th>Comment</th>
                                                    <th>Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {studentRatings.map(r => (
                                                    <tr key={r.id}>
                                                        <td>{r.rater_firstname} {r.rater_lastname} ({r.rater_role})</td>
                                                        <td>{r.ratee_firstname} {r.ratee_lastname} ({r.ratee_role})</td>
                                                        <td>{r.rating}</td>
                                                        <td>{r.comment}</td>
                                                        <td>{new Date(r.created_at).toLocaleDateString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            )}
                            {viewMode === 'rate' && (
                                <div>
                                    <h4>Rate a Lecturer</h4>
                                    <div className="mb-3">
                                        <label className="form-label">Select Lecturer</label>
                                        <select className="form-select" value={selectedLecturer} onChange={(e) => setSelectedLecturer(e.target.value)}>
                                            <option value="">Choose a lecturer</option>
                                            {lecturers.map(lec => (
                                                <option key={lec.username} value={lec.username}>
                                                    {lec.firstname} {lec.lastname}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Rating (1-5)</label>
                                        <input type="number" className="form-control" min="1" max="5" value={rating} onChange={(e) => setRating(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Comment</label>
                                        <textarea className="form-control" rows="3" value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                                    </div>
                                    <button className="btn btn-primary" onClick={handleSubmitRating}>Submit Rating</button>
                                </div>
                            )}
                            <button className="btn btn-secondary mt-3" onClick={() => setActiveSection('')}>Close</button>
                        </div>
                    )}
                    {activeSection === 'reports' && (
                        <div className="mt-4">
                            <h4>Lecture Reports</h4>
                            {reports.length === 0 ? (
                                <p>No reports found.</p>
                            ) : (
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Lecture Name</th>
                                            <th>Course Name</th>
                                            <th>Lecturer</th>
                                            <th>Topic</th>
                                            <th>Recommendations</th>
                                            <th>Feedback</th>
                                            <th>Actions</th>
                                            <th>Previous Feedback</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reports.map(r => (
                                            <tr key={r.id}>
                                                <td>{r.lectureName}</td>
                                                <td>{r.courseName}</td>
                                                <td>{r.lecturer_username}</td>
                                                <td>{r.topicTaught}</td>
                                                <td>{r.lecturesRecommendations}</td>
                                                <td>
                                                    <label className="form-label">Feedback (sending as {firstname} {lastname})</label>
                                                    <textarea className="form-control" rows="2" value={feedbackText[r.id] || ''} onChange={(e) => setFeedbackText(prev => ({ ...prev, [r.id]: e.target.value }))}></textarea>
                                                </td>
                                                <td>
                                                    <button className="btn btn-primary btn-sm" onClick={() => submitFeedback(r.id)}>Send Feedback</button>
                                                </td>
                                                <td>
                                                    {reportFeedback[r.id] && reportFeedback[r.id].length > 0 ? (
                                                        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                            <ul className="list-group list-group-flush">
                                                                {reportFeedback[r.id].map(f => (
                                                                    <li className="list-group-item d-flex justify-content-between align-items-start" key={f.id}>
                                                                        <div>
                                                                            <strong>{(f.from_firstname || f.from_username) + (f.from_lastname ? ' ' + f.from_lastname : '')} ({f.from_role})</strong>: {f.feedback_text}
                                                                            <div className="text-muted small">{new Date(f.created_at).toLocaleString()}</div>
                                                                        </div>
                                                                        <div>
                                                                            {f.from_username === username && (
                                                                                <button className="btn btn-sm btn-danger" onClick={() => deleteFeedback(f.id)}>Delete</button>
                                                                            )}
                                                                        </div>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ) : (
                                                        <p>No feedback yet.</p>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                            <button className="btn btn-secondary mt-3" onClick={() => setActiveSection('')}>Close</button>
                        </div>
                    )}
                    {activeSection === 'monitor' && (
                        <div className="mt-4">
                            <div className="d-flex gap-2 mb-3">
                                <button className={`btn ${monitorMode === 'courses' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => { setMonitorMode('courses'); fetchMonitorCourses(); }}>Monitor Courses</button>
                                <button className={`btn ${monitorMode === 'lecturers' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => { setMonitorMode('lecturers'); fetchMonitorLecturers(); }}>Monitor Lecturers</button>
                            </div>
                            {monitorMode === 'courses' && (
                                <div>
                                    <h4>Courses</h4>
                                    {monitorCourses.length === 0 ? (
                                        <p>No courses found.</p>
                                    ) : (
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Course Name</th>
                                                    <th>Course ID</th>
                                                    <th>Lecturers</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {monitorCourses.map(course => {
                                                    const uniqueLecturers = [...new Set(course.lectures.map(lecture => `${lecture.lecturer_firstname} ${lecture.lecturer_lastname}`))];
                                                    return (
                                                        <tr key={course.id}>
                                                            <td>{course.name}</td>
                                                            <td>{course.id}</td>
                                                            <td>{uniqueLecturers.join(', ')}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            )}
                            {monitorMode === 'lecturers' && (
                                <div>
                                    <h4>Lecturers</h4>
                                    {monitorLecturers.length === 0 ? (
                                        <p>No lecturers found.</p>
                                    ) : (
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Username</th>
                                                    <th>First Name</th>
                                                    <th>Last Name</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {monitorLecturers.map(lec => (
                                                    <tr key={lec.username}>
                                                        <td>{lec.username}</td>
                                                        <td>{lec.firstname}</td>
                                                        <td>{lec.lastname}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            )}
                            <button className="btn btn-secondary mt-3" onClick={() => setActiveSection('')}>Close</button>
                        </div>
                    )}
                    {activeSection === 'courses' && (
                        <div className="mt-4">
                            <h4>All Courses</h4>
                            {courses.length === 0 ? (
                                <p>No courses found.</p>
                            ) : (
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                        <th>Course ID</th>
                                        <th>Course Name</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {courses.map(course => (
                                            <tr key={course.id}>
                                                <td>{course.id}</td>
                                                <td>{course.name}</td>
                                                <td>
                                                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteCourse(course.id)}>Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                            <button className="btn btn-secondary mt-3" onClick={() => setActiveSection('')}>Close</button>
                        </div>
                    )}
                    {activeSection === 'classes' && (
                        <div className="mt-4">
                            <h4>Classes</h4>
                            <div className="mb-4">
                                <h5>Student Classes</h5>
                                {studentClasses.length === 0 ? (
                                    <p>No student classes found.</p>
                                ) : (
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Student Username</th>
                                                <th>Student Name</th>
                                                <th>Class Name</th>
                                                <th>Course Name</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {studentClasses.map(cls => (
                                                <tr key={cls.id}>
                                                    <td>{cls.student_username}</td>
                                                    <td>{cls.student_firstname} {cls.student_lastname}</td>
                                                    <td>{cls.class_name}</td>
                                                    <td>{cls.course_name}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                            <div>
                                <h5>Lectures</h5>
                                {lectures.length === 0 ? (
                                    <p>No lectures found.</p>
                                ) : (
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Lecture Name</th>
                                                <th>Course Name</th>
                                                <th>Lecturer</th>
                                                <th>Topic</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {lectures.map(lec => (
                                                <tr key={lec.id}>
                                                    <td>{lec.lectureName}</td>
                                                    <td>{lec.courseName}</td>
                                                    <td>{lec.lecturer_firstname} {lec.lecturer_lastname}</td>
                                                    <td>{lec.topicTaught}</td>
                                                    <td>{new Date(lec.created_at).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                            <button className="btn btn-secondary mt-3" onClick={() => setActiveSection('')}>Close</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PrincipalLecture;

