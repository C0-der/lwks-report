import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

function LectureDashboard() {
    const navigate = useNavigate();
    const firstname = localStorage.getItem('firstname');
    const lastname = localStorage.getItem('lastname');
    const username = localStorage.getItem('username');

    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState('');
    const [ratings, setRatings] = useState([]);
    const [principalRatings, setPrincipalRatings] = useState([]);
    const [currentLectureTitle, setCurrentLectureTitle] = useState('');
    const [lectures, setLectures] = useState([]);
    const [reportFeedback, setReportFeedback] = useState([]);
    const [courses, setCourses] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [studentsMonitoring, setStudentsMonitoring] = useState([]);
    const [lectureProgress, setLectureProgress] = useState([]);

    const [showAddForm, setShowAddForm] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [showReportsMenu, setShowReportsMenu] = useState(false);
    const [showRatingForm, setShowRatingForm] = useState(false);
    const [showRatingsTable, setShowRatingsTable] = useState(false);
    const [showPrincipalRatings, setShowPrincipalRatings] = useState(false);
    const [showLecturesTable, setShowLecturesTable] = useState(false);
    const [showStudentMonitoring, setShowStudentMonitoring] = useState(false);

    const fetchLecturerReportsFeedback = () => {
        // First fetch reports for this lecturer
        fetch(`http://localhost:3001/get-lecture-reports?lecturer_username=${username}`)
            .then(res => res.json())
            .then(reports => {
                if (!Array.isArray(reports) || reports.length === 0) {
                    setReportFeedback([]);
                    return;
                }
                // For each report, fetch feedback and combine
                const promises = reports.map(report =>
                    fetch(`http://localhost:3001/get-feedback?report_id=${report.id}`)
                        .then(res => res.json())
                        .then(feedbacks => {
                            // attach report context to each feedback item
                            return feedbacks.map(f => ({ ...f, lectureName: report.lectureName, courseName: report.courseName }));
                        })
                );
                Promise.all(promises)
                    .then(arrays => {
                        const flattened = arrays.flat();
                        setReportFeedback(flattened);
                    })
                    .catch(err => {
                        console.error('Error fetching feedback for reports:', err);
                        setReportFeedback([]);
                    });
            })
            .catch(err => {
                console.error('Error fetching lecturer reports:', err);
                setReportFeedback([]);
            });
    };

    useEffect(() => {
        fetch('http://localhost:3001/get-courses')
            .then(res => res.json())
            .then(data => setCourses(data))
            .catch(err => console.error('Error fetching courses:', err));
    }, [username]);

    useEffect(() => {
        fetchLectureProgress();
    });

    const fetchLectureProgress = useCallback(() => {
        // First fetch lectures for this lecturer
        fetch(`http://localhost:3001/get-lecturer-lectures?lecturer_username=${username}`)
            .then(res => res.json())
            .then(lectures => {
                if (!Array.isArray(lectures) || lectures.length === 0) {
                    setLectureProgress([]);
                    return;
                }
                // For each lecture, fetch reports and calculate progress
                const promises = lectures.map(lecture =>
                    fetch(`http://localhost:3001/get-lecture-reports?lecturer_username=${username}`)
                        .then(res => res.json())
                        .then(reports => {
                            // Filter reports for this specific lecture
                            const lectureReports = reports.filter(report =>
                                report.lectureName === lecture.title && report.courseName === lecture.course_name
                            );
                            const totalReports = lectureReports.length;
                            const totalAttendance = lectureReports.reduce((sum, report) => sum + (report.actualStudentsPresent || 0), 0);
                            const totalRegistered = lectureReports.reduce((sum, report) => sum + (report.totalRegisteredStudents || 0), 0);
                            const avgAttendance = totalRegistered > 0 ? ((totalAttendance / totalRegistered) * 100).toFixed(1) : 0;
                            return {
                                ...lecture,
                                totalReports,
                                avgAttendance: parseFloat(avgAttendance),
                                totalAttendance,
                                totalRegistered
                            };
                        })
                );
                Promise.all(promises)
                    .then(progressData => {
                        setLectureProgress(progressData);
                    })
                    .catch(err => {
                        console.error('Error fetching lecture progress:', err);
                        setLectureProgress([]);
                    });
            })
            .catch(err => {
                console.error('Error fetching lectures:', err);
                setLectureProgress([]);
            });
    }, [username]);

    const handleRateStudents = () => {
        fetch('http://localhost:3001/get-students')
            .then(res => res.json())
            .then(data => {
                setStudents(data);
                setShowRatingForm(true);
            })
            .catch(err => {
                console.error('Error fetching students:', err);
                alert('Error fetching students: ' + err.message);
            });
    };

    const handleSubmitRating = () => {
        if (!selectedStudent) {
            alert('Please select a student.');
            return;
        }
        fetch('http://localhost:3001/submit-rating', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                rater_username: username,
                ratee_username: selectedStudent,
                rater_role: 'lecturer',
                ratee_role: 'student',
                rating: parseInt(rating),
                comment
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Rating submitted successfully!');
                    setSelectedStudent('');
                    setRating(1);
                    setComment('');
                    setShowRatingForm(false);
                } else {
                    alert('Error submitting rating.');
                }
            })
            .catch(err => {
                console.error('Error submitting rating:', err);
                alert('Error submitting rating: ' + err.message);
            });
    };

    const handleViewRatings = () => {
        fetch(`http://localhost:3001/get-lecturer-given-ratings?lecturer_username=${username}`)
            .then(res => res.json())
            .then(data => {
                setRatings(data);
                setShowRatingsTable(true);
            })
            .catch(err => {
                console.error('Error fetching ratings:', err);
                alert('Error fetching ratings: ' + err.message);
            });
    };

    const fetchRatingsForStudent = (studentUsername) => {
        fetch(`http://localhost:3001/get-lecturer-given-ratings?lecturer_username=${username}&student_username=${studentUsername}`)
            .then(res => res.json())
            .then(data => {
                setRatings(data);
                setShowRatingsTable(true);
            })
            .catch(err => {
                console.error('Error fetching lecturer given ratings:', err);
                alert('Error fetching ratings: ' + err.message);
            });
    };

    const fetchRatingsFromPrincipal = () => {
        // Fetch ratings where principals rated this lecturer
        fetch(`http://localhost:3001/get-lecturer-ratings?lecturer_username=${username}`)
            .then(res => res.json())
            .then(data => {
                setPrincipalRatings(data);
                setCurrentLectureTitle('');
                setShowPrincipalRatings(true);
            })
            .catch(err => {
                console.error('Error fetching ratings from principals:', err);
                alert('Error fetching principal ratings: ' + err.message);
            });
    };



    const handleManageClasses = () => {
        fetch(`http://localhost:3001/get-lecturer-lectures?lecturer_username=${username}`)
            .then(res => res.json())
            .then(data => {
                setLectures(data);
                setShowLecturesTable(true);
            })
            .catch(err => {
                console.error('Error fetching lectures:', err);
                alert('Error fetching lectures: ' + err.message);
            });
    };

    const handleAddLecture = () => {
        if (!newTitle || !selectedCourse) {
            alert('Please fill title and select course.');
            return;
        }
        fetch('http://localhost:3001/add-lecture', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                lecturer_username: username,
                title: newTitle,
                description: newDescription,
                course_id: selectedCourse
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Lecture added successfully!');
                    setNewTitle('');
                    setNewDescription('');
                    setSelectedCourse('');
                    setShowAddForm(false);
                    handleManageClasses(); // Refresh
                } else {
                    alert('Error adding lecture.');
                }
            })
            .catch(err => {
                console.error('Error adding lecture:', err);
                alert('Error adding lecture: ' + err.message);
            });
    };

    const handleDeleteLecture = (id) => {
        if (!confirm('Are you sure you want to delete this lecture?')) return;
        fetch('http://localhost:3001/delete-lecture', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Lecture deleted successfully!');
                    handleManageClasses(); // Refresh
                } else {
                    alert('Error deleting lecture.');
                }
            })
            .catch(err => {
                console.error('Error deleting lecture:', err);
                alert('Error deleting lecture: ' + err.message);
            });
    };

    const handleStudentMonitoring = () => {
        fetch(`http://localhost:3001/get-lecturer-students?lecturer_username=${username}`)
            .then(res => res.json())
            .then(data => {
                setStudentsMonitoring(data);
                setShowStudentMonitoring(true);
            })
            .catch(err => {
                console.error('Error fetching students:', err);
                alert('Error fetching students: ' + err.message);
            });
    };

    return (
        <div className="d-flex vh-100">
            <div className="sidebar bg-dark text-white p-3" style={{ width: '250px' }}>
                <h4>Lecturer Dashboard</h4>
                <div className="d-flex flex-column gap-2">
                    <button className="btn btn-outline-light" onClick={() => { setShowAddForm(false); setShowFeedback(false); setShowReportsMenu(false); setShowRatingForm(false); setShowRatingsTable(false); setShowPrincipalRatings(false); setShowLecturesTable(false); setShowStudentMonitoring(false); }}>Overview</button>
                    <button className="btn btn-outline-light" onClick={() => { handleManageClasses(); }}>Manage Classes</button>
                    <button className="btn btn-outline-light" onClick={() => { setShowReportsMenu(true); }}>View Reports</button>
                    <button className="btn btn-outline-light" onClick={() => { handleStudentMonitoring(); }}>Student Monitoring</button>
                    <button className="btn btn-outline-light" onClick={() => { handleRateStudents(); }}>Rate Students</button>
                    <button className="btn btn-outline-light" onClick={() => { handleViewRatings(); }}>View Ratings</button>
                    <button className="btn btn-outline-light" onClick={() => { fetchRatingsFromPrincipal(); }}>Review Lecture ratings</button>
                    <button className="btn btn-outline-light" onClick={() => navigate('/')}>Logout</button>
                </div>
            </div>
            <div className="main-content flex-grow-1 p-4 bg-light text-dark">
                <h3 className="text-center">Welcome, {firstname} {lastname}</h3>
                {!showAddForm && !showFeedback && !showReportsMenu && !showRatingForm && !showRatingsTable && !showPrincipalRatings && !showLecturesTable && !showStudentMonitoring && (
                    <div className="mt-4">
                        <h4>Lecture Progress Overview</h4>
                        {lectureProgress.length === 0 ? (
                            <p>No data available yet. Please add lectures to see progress charts.</p>
                        ) : (
                            <div className="row">
                                {lectureProgress.map(lecture => (
                                    <div key={lecture.id} className="col-md-6 mb-4">
                                        <div className="card bg-light text-dark">
                                            <div className="card-body">
                                                <h5 className="card-title">{lecture.title}</h5>
                                                <p className="card-text">{lecture.description || 'No description'}</p>
                                                <p className="card-text"><strong>Course:</strong> {lecture.course_name}</p>
                                                <div className="progress mb-2">
                                                    <div
                                                        className="progress-bar bg-success"
                                                        role="progressbar"
                                                        style={{ width: `${Math.min(lecture.avgAttendance, 100)}%` }}
                                                        aria-valuenow={lecture.avgAttendance}
                                                        aria-valuemin="0"
                                                        aria-valuemax="100"
                                                    >
                                                        {lecture.avgAttendance}%
                                                    </div>
                                                </div>
                                                <p className="card-text small">
                                                    <strong>Reports Submitted:</strong> {lecture.totalReports}<br/>
                                                    <strong>Average Attendance:</strong> {lecture.avgAttendance}%<br/>
                                                    <strong>Total Students:</strong> {lecture.totalRegistered}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                {showRatingForm && (
                    <div className="mt-4">
                        <h4>Rate a Student</h4>
                        <div className="mb-3">
                            <label className="form-label">Select Student</label>
                            <select className="form-select" value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
                                <option value="">Choose a student</option>
                                {students.map(student => (
                                    <option key={student.username} value={student.username}>
                                        {student.firstname} {student.lastname}
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
                        <button className="btn btn-blue" onClick={handleSubmitRating}>Submit Rating</button>
                        <button className="btn btn-blue ms-2" onClick={() => setShowRatingForm(false)}>Cancel</button>
                    </div>
                )}
                {showPrincipalRatings && (
                    <div className="mt-4">
                        <h3>Ratings Given by Principals {currentLectureTitle ? `- ${currentLectureTitle}` : ''}</h3>
                        {principalRatings.length === 0 ? (
                            <p>No ratings from principals found.</p>
                        ) : (
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Principal Name</th>
                                        <th>Rating</th>
                                        <th>Comment</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {principalRatings.map(r => (
                                        <tr key={r.id}>
                                            <td>{r.principal_firstname} {r.principal_lastname}</td>
                                            <td>{r.rating}</td>
                                            <td>{r.comment || 'N/A'}</td>
                                            <td>{new Date(r.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        <button className="btn btn-blue mt-3" onClick={() => setShowPrincipalRatings(false)}>Close</button>
                    </div>
                )}

                {showRatingsTable && (
                    <div className="mt-4">
                        <h3>Your Given Ratings</h3>
                        {ratings.length === 0 ? (
                            <p>No ratings given yet.</p>
                        ) : (
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Student Name</th>
                                        <th>Rating</th>
                                        <th>Comment</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ratings.map(rating => (
                                        <tr key={rating.id}>
                                            <td>{rating.student_firstname} {rating.student_lastname}</td>
                                            <td>{rating.rating}</td>
                                            <td>{rating.comment || 'N/A'}</td>
                                            <td>{new Date(rating.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        <button className="btn btn-dark mt-3" onClick={() => setShowRatingsTable(false)}>Close</button>
                    </div>
                )}
                {showReportsMenu && (
                    <div className="mt-3">
                        <button className="btn btn-blue me-2" onClick={() => navigate('/lecture-reporting-form')}>Add Report</button>
                        <button className="btn btn-dark me-2" onClick={() => { fetchLecturerReportsFeedback(); setShowFeedback(true); }}>View Feedback</button>
                        <button className="btn btn-secondary" onClick={() => setShowReportsMenu(false)}>Close</button>
                    </div>
                )}

                {showFeedback && (
                    <div className="mt-4">
                        <h4>Feedback on Your Reports</h4>
                        {reportFeedback.length === 0 ? (
                            <p>No feedback found.</p>
                        ) : (
                            <div>
                                {reportFeedback.map(item => (
                                    <div className="card mb-2 bg-light text-dark" key={item.id}>
                                        <div className="card-body">
                                            <h6 className="card-title">Report: {item.lectureName || item.courseName || item.report_id}</h6>
                                            <p className="mb-1"><strong>From:</strong> {(item.from_firstname || item.from_username) + (item.from_lastname ? ' ' + item.from_lastname : '')} ({item.from_role})</p>
                                            <p className="mb-1">{item.feedback_text}</p>
                                            <div className="text-muted small">{new Date(item.created_at).toLocaleString()}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <button className="btn btn-dark mt-3" onClick={() => setShowFeedback(false)}>Close</button>
                    </div>
                )}
                {showLecturesTable && (
                    <div className="mt-4">
                        <h3>Your Lectures</h3>
                        <div className="d-flex gap-2 mb-3">
                            <button className="btn btn-blue" onClick={() => setShowAddForm(true)}>Add New Lecture</button>
                        </div>
                        {lectures.length === 0 ? (
                            <p>No lectures yet.</p>
                        ) : (
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Description</th>
                                        <th>Course</th>
                                        <th>Created At</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lectures.map(lecture => (
                                        <tr key={lecture.id}>
                                            <td>{lecture.title}</td>
                                            <td>{lecture.description || 'N/A'}</td>
                                            <td>{lecture.course_name}</td>
                                            <td>{new Date(lecture.created_at).toLocaleDateString()}</td>
                                            <td>
                                                <button className="btn btn-blue btn-sm" onClick={() => handleDeleteLecture(lecture.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        <button className="btn btn-dark mt-3" onClick={() => setShowLecturesTable(false)}>Close</button>
                    </div>
                )}
                {showAddForm && (
                    <div className="mt-4">
                        <h4>Add New Lecture</h4>
                        <div className="mb-3">
                            <label className="form-label">Title</label>
                            <input type="text" className="form-control" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea className="form-control" rows="3" value={newDescription} onChange={(e) => setNewDescription(e.target.value)}></textarea>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Course</label>
                            <select className="form-select" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                                <option value="">Choose a course</option>
                                {courses.map(course => (
                                    <option key={course.id} value={course.id}>
                                        {course.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button className="btn btn-blue" onClick={handleAddLecture}>Add Lecture</button>
                        <button className="btn btn-dark ms-2" onClick={() => setShowAddForm(false)}>Cancel</button>
                    </div>
                )}
                {showStudentMonitoring && (
                    <div className="mt-4">
                        <h3>Students in Your Courses</h3>
                        {studentsMonitoring.length === 0 ? (
                            <p>No students found.</p>
                        ) : (
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Username</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Course</th>
                                        <th>Class Code</th>
                                        <th>Semester</th>
                                        <th>Year</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentsMonitoring.map(student => (
                                        <tr key={student.username + student.class_code}>
                                            <td>{student.username}</td>
                                            <td>{student.firstname}</td>
                                            <td>{student.lastname}</td>
                                            <td>{student.class_name}</td>
                                            <td>{student.class_code}</td>
                                            <td>{student.semester}</td>
                                            <td>{student.year}</td>
                                            <td>
                                                <button className="btn btn-sm btn-white" onClick={() => fetchRatingsForStudent(student.username)}>View Ratings</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        <button className="btn btn-dark mt-3" onClick={() => setShowStudentMonitoring(false)}>Close</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LectureDashboard;
