import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

function ProgramLeader() {
    const navigate = useNavigate();
    const firstname = localStorage.getItem('firstname');
    const lastname = localStorage.getItem('lastname');
    const username = localStorage.getItem('username');
    const [activeSection, setActiveSection] = useState(''); // '', 'courses', 'reports', 'review-reports', 'monitor', 'ratings', 'classes', 'lectures'
    const [monitorMode, setMonitorMode] = useState('students'); // 'students', 'lecturers', 'principals'
    const [allRatings, setAllRatings] = useState([]);
    const [lectures, setLectures] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [selectedLecture, setSelectedLecture] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [courses, setCourses] = useState([]);
    const [reports, setReports] = useState([]);
    const [students, setStudents] = useState([]);
    const [lecturers, setLecturers] = useState([]);
    const [principals, setPrincipals] = useState([]);

    const [classesData, setClassesData] = useState([]);
    const [overviewData, setOverviewData] = useState({
        coursesCount: 0,
        reportsCount: 0,
        ratingsCount: 0,
        lecturesCount: 0,
        coursesData: [],
        reportsData: [],
        ratingsData: []
    });
    const [weeklyTasksCount, setWeeklyTasksCount] = useState(0);
    const [studentsReportsCount, setStudentsReportsCount] = useState(0);
    const [lecturersApprovalsCount, setLecturersApprovalsCount] = useState(0);
    const [reviewReports, setReviewReports] = useState([]);
    const [feedbackText, setFeedbackText] = useState({}); // keyed by report id

    useEffect(() => {
        if (username) {
            // Fetch courses count
            fetch('http://localhost:3001/get-courses')
                .then(res => res.json())
                .then(data => {
                    setOverviewData(prev => ({ ...prev, coursesCount: data.length }));
                })
                .catch(err => console.error('Error fetching courses:', err));

            // Fetch reports count
            fetch('http://localhost:3001/get-reviewed-reports')
                .then(res => res.json())
                .then(data => {
                    setOverviewData(prev => ({ ...prev, reportsCount: data.length }));
                    // Calculate weekly students reports
                    const now = new Date();
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    const weeklyReports = data.filter(report => new Date(report.created_at) >= weekAgo);
                    setStudentsReportsCount(weeklyReports.length);
                })
                .catch(err => console.error('Error fetching reports:', err));

            // Fetch ratings count
            fetch('http://localhost:3001/get-all-ratings')
                .then(res => res.json())
                .then(data => {
                    setOverviewData(prev => ({ ...prev, ratingsCount: data.length }));
                    // Calculate weekly lecturers approvals (ratings)
                    const now = new Date();
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    const weeklyRatings = data.filter(rating => new Date(rating.created_at) >= weekAgo);
                    setLecturersApprovalsCount(weeklyRatings.length);
                })
                .catch(err => console.error('Error fetching ratings:', err));

            // Fetch lectures count
            fetch('http://localhost:3001/get-all-lectures')
                .then(res => res.json())
                .then(data => {
                    setOverviewData(prev => ({ ...prev, lecturesCount: data.length }));
                    // Calculate weekly tasks (lectures)
                    const now = new Date();
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    const weeklyLectures = data.filter(lecture => new Date(lecture.created_at) >= weekAgo);
                    setWeeklyTasksCount(weeklyLectures.length);
                })
                .catch(err => console.error('Error fetching lectures:', err));
        }
    }, [username]);

    const handleRatings = () => {
        setActiveSection('ratings');
        fetch('http://localhost:3001/get-all-ratings')
            .then(res => res.json())
            .then(data => setAllRatings(data))
            .catch(err => {
                console.error('Error fetching all ratings:', err);
                alert('Error fetching ratings: ' + err.message);
            });
    };

    const handleManageLectures = () => {
        setActiveSection('lectures');
        fetch('http://localhost:3001/get-all-lectures')
            .then(res => res.json())
            .then(data => setLectures(data))
            .catch(err => {
                console.error('Error fetching lectures:', err);
                alert('Error fetching lectures: ' + err.message);
            });
    };

    const handleViewCourses = () => {
        setActiveSection('courses');
        fetch('http://localhost:3001/get-courses')
            .then(res => res.json())
            .then(data => setCourses(data))
            .catch(err => {
                console.error('Error fetching courses:', err);
                alert('Error fetching courses: ' + err.message);
            });
    };

    const handleDeleteLecture = (id) => {
        if (window.confirm('Are you sure you want to delete this lecture?')) {
            fetch('http://localhost:3001/delete-lecture', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        alert('Lecture deleted successfully');
                        setLectures(lectures.filter(lecture => lecture.id !== id));
                    } else {
                        alert('Error deleting lecture');
                    }
                })
                .catch(err => {
                    console.error('Error deleting lecture:', err);
                    alert('Error deleting lecture: ' + err.message);
                });
        }
    };

    const handleEditLecture = (lecture) => {
        setEditMode(true);
        setSelectedLecture(lecture.id);
        setEditTitle(lecture.title);
        setEditDescription(lecture.description || '');
    };

    const handleUpdateLecture = () => {
        if (!editTitle.trim()) {
            alert('Title is required');
            return;
        }
        fetch('http://localhost:3001/update-lecture', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: selectedLecture, title: editTitle.trim(), description: editDescription.trim() })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Lecture updated successfully');
                    setLectures(lectures.map(lecture =>
                        lecture.id === selectedLecture
                            ? { ...lecture, title: editTitle.trim(), description: editDescription.trim() }
                            : lecture
                    ));
                    setEditMode(false);
                    setSelectedLecture(null);
                    setEditTitle('');
                    setEditDescription('');
                } else {
                    alert('Error updating lecture');
                }
            })
            .catch(err => {
                console.error('Error updating lecture:', err);
                alert('Error updating lecture: ' + err.message);
            });
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setSelectedLecture(null);
        setEditTitle('');
        setEditDescription('');
    };

    const handleAddLectures = (courseId) => {
        alert(`Add lectures to course ID: ${courseId}`);
        // TODO: Implement functionality to add lectures to the course
    };

    const handleAssign = (courseId) => {
        alert(`Assign lecturers to course ID: ${courseId}`);
        // TODO: Implement functionality to assign lecturers to the course
    };

    const handleViewReports = () => {
        setActiveSection('reports');
        fetch('http://localhost:3001/get-reviewed-reports')
            .then(res => res.json())
            .then(data => setReports(data))
            .catch(err => {
                console.error('Error fetching reviewed reports:', err);
                alert('Error fetching reports: ' + err.message);
            });
    };

    const fetchReviewReports = () => {
        fetch('http://localhost:3001/get-unreviewed-reports')
            .then(res => res.json())
            .then(data => setReviewReports(data))
            .catch(err => {
                console.error('Error fetching unreviewed reports:', err);
                alert('Error fetching reports: ' + err.message);
            });
    };

    const handleSubmitFeedback = (reportId) => {
        const feedback = feedbackText[reportId];
        if (!feedback || !feedback.trim()) {
            alert('Feedback is required');
            return;
        }
        fetch('http://localhost:3001/submit-program-leader-feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                reportId,
                feedback: feedback.trim(),
                from_username: username,
                from_role: 'program leader'
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Feedback submitted successfully');
                    setReviewReports(reviewReports.filter(r => r.id !== reportId));
                    setFeedbackText(prev => ({ ...prev, [reportId]: '' }));
                } else {
                    alert('Error submitting feedback');
                }
            })
            .catch(err => {
                console.error('Error submitting feedback:', err);
                alert('Error submitting feedback: ' + err.message);
            });
    };

    const handleMonitor = () => {
        setActiveSection('monitor');
        setMonitorMode('students');
        fetch('http://localhost:3001/get-students')
            .then(res => res.json())
            .then(data => setStudents(data))
            .catch(err => {
                console.error('Error fetching students:', err);
                alert('Error fetching students: ' + err.message);
            });
    };

    const handleMonitorStudents = () => {
        setMonitorMode('students');
        fetch('http://localhost:3001/get-students')
            .then(res => res.json())
            .then(data => setStudents(data))
            .catch(err => {
                console.error('Error fetching students:', err);
                alert('Error fetching students: ' + err.message);
            });
    };

    const handleMonitorLecturers = () => {
        setMonitorMode('lecturers');
        fetch('http://localhost:3001/get-lecturers')
            .then(res => res.json())
            .then(data => setLecturers(data))
            .catch(err => {
                console.error('Error fetching lecturers:', err);
                alert('Error fetching lecturers: ' + err.message);
            });
    };

    const handleMonitorPrincipals = () => {
        setMonitorMode('principals');
        fetch('http://localhost:3001/get-principals')
            .then(res => res.json())
            .then(data => setPrincipals(data))
            .catch(err => {
                console.error('Error fetching principals:', err);
                alert('Error fetching principals: ' + err.message);
            });
    };

    const handleClasses = () => {
        setActiveSection('classes');
    };

    const handleFetchClasses = () => {
        const username = localStorage.getItem('username');
        const studentEndpoint = '/get-program-leader-classes';
        const lecturerEndpoint = '/get-program-leader-lecturer-classes';

        Promise.all([
            fetch(`http://localhost:3001${studentEndpoint}?username=${username}`).then(res => res.json()),
            fetch(`http://localhost:3001${lecturerEndpoint}?username=${username}`).then(res => res.json())
        ])
            .then(([studentData, lecturerData]) => {
                const combinedData = [
                    ...studentData.map(cls => ({ ...cls, type: 'Student' })),
                    ...lecturerData.map(cls => ({ ...cls, type: 'Lecturer' }))
                ];
                setClassesData(combinedData);
            })
            .catch(err => {
                console.error('Error fetching classes:', err);
                alert('Error fetching classes: ' + err.message);
            });
    };

    return (
        <div className="d-flex vh-100 bg-light">
            {/* Sidebar */}
            <div className="bg-dark text-white p-3" style={{ width: '250px' }}>
                <h4 className="text-center mb-4">Program Leader</h4>
                <div className="d-flex flex-column gap-2">
                    <button className="btn btn-outline-light" onClick={() => setActiveSection('')}>Overview</button>
                    <button className="btn btn-outline-light" onClick={handleViewCourses}>Courses</button>
                    <button className="btn btn-outline-light" onClick={handleViewReports}>Reports</button>
                    <button className="btn btn-outline-light" onClick={() => { setActiveSection('review-reports'); fetchReviewReports(); }}>Review Reports</button>
                    <button className="btn btn-outline-light" onClick={handleMonitor}>Monitor</button>
                    <button className="btn btn-outline-light" onClick={handleClasses}>Classes</button>
                    <button className="btn btn-outline-light" onClick={handleManageLectures}>Lectures</button>
                    <button className="btn btn-outline-light" onClick={handleRatings}>Ratings</button>
                    <button className="btn btn-outline-light mt-3" onClick={() => navigate('/')}>Logout</button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow-1 p-4">
                <h3>Welcome, {firstname} {lastname}</h3>
                {activeSection === '' && (
                    <div>
                        <h4>Overview</h4>
                        <div className="row g-3 mb-4">
                            <div className="col-md-3">
                                <div className="card text-center">
                                    <div className="card-body">
                                        <h5 className="card-title">{overviewData.coursesCount}</h5>
                                        <p className="card-text">Courses</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card text-center">
                                    <div className="card-body">
                                        <h5 className="card-title">{overviewData.reportsCount}</h5>
                                        <p className="card-text">Reports</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card text-center">
                                    <div className="card-body">
                                        <h5 className="card-title">{overviewData.ratingsCount}</h5>
                                        <p className="card-text">Ratings</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card text-center">
                                    <div className="card-body">
                                        <h5 className="card-title">{overviewData.lecturesCount}</h5>
                                        <p className="card-text">Lectures</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <h5>Analytics</h5>
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <div className="card text-center">
                                        <div className="card-body">
                                            <i className="bi bi-calendar-week fs-1 text-primary"></i>
                                            <h5 className="card-title">{weeklyTasksCount}</h5>
                                            <p className="card-text">Weekly Tasks</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card text-center">
                                        <div className="card-body">
                                            <i className="bi bi-file-earmark-text fs-1 text-success"></i>
                                            <h5 className="card-title">{studentsReportsCount}</h5>
                                            <p className="card-text">Students Reports</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card text-center">
                                        <div className="card-body">
                                            <i className="bi bi-check-circle fs-1 text-warning"></i>
                                            <h5 className="card-title">{lecturersApprovalsCount}</h5>
                                            <p className="card-text">Lecturers Approvals</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {activeSection === 'courses' && (
                    <div>
                        <h4>All Courses</h4>
                        {courses.length === 0 ? (
                            <p>No courses found.</p>
                        ) : (
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Course Name</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.map(course => (
                                        <tr key={course.id}>
                                            <td>{course.name}</td>
                                            <td>
                                                <button className="btn btn-sm btn-primary me-2" onClick={() => handleAddLectures(course.id)}>Add Lectures</button>
                                                <button className="btn btn-sm btn-success" onClick={() => handleAssign(course.id)}>Assign</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
                {activeSection === 'reports' && (
                    <div>
                        <h4>Reviewed Reports</h4>
                        {reports.length === 0 ? (
                            <p>No reviewed reports found.</p>
                        ) : (
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Lecture Title</th>
                                        <th>Lecturer</th>
                                        <th>Report</th>
                                        <th>Principal Feedback</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.map(report => (
                                        <tr key={report.id}>
                                            <td>{report.lecture_title}</td>
                                            <td>{report.lecturer_firstname} {report.lecturer_lastname}</td>
                                            <td>{report.report}</td>
                                            <td>{report.principal_feedback}</td>
                                            <td>{new Date(report.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
                {activeSection === 'monitor' && (
                    <div>
                        <h4>Monitor Users</h4>
                        <div className="d-flex gap-2 mb-3">
                            <button className={`btn ${monitorMode === 'students' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={handleMonitorStudents}>Students</button>
                            <button className={`btn ${monitorMode === 'lecturers' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={handleMonitorLecturers}>Lecturers</button>
                            <button className={`btn ${monitorMode === 'principals' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={handleMonitorPrincipals}>Principals</button>
                            <button className="btn btn-outline-secondary" onClick={() => setActiveSection('')}>Close</button>
                        </div>
                        {monitorMode === 'students' && (
                            <div>
                                <h5>Students</h5>
                                {students.length === 0 ? (
                                    <p>No students found.</p>
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
                                            {students.map(student => (
                                                <tr key={student.username}>
                                                    <td>{student.username}</td>
                                                    <td>{student.firstname}</td>
                                                    <td>{student.lastname}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        )}
                        {monitorMode === 'lecturers' && (
                            <div>
                                <h5>Lecturers</h5>
                                {lecturers.length === 0 ? (
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
                                            {lecturers.map(lecturer => (
                                                <tr key={lecturer.username}>
                                                    <td>{lecturer.username}</td>
                                                    <td>{lecturer.firstname}</td>
                                                    <td>{lecturer.lastname}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        )}
                        {monitorMode === 'principals' && (
                            <div>
                                <h5>Principals</h5>
                                {principals.length === 0 ? (
                                    <p>No principals found.</p>
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
                                            {principals.map(principal => (
                                                <tr key={principal.username}>
                                                    <td>{principal.username}</td>
                                                    <td>{principal.firstname}</td>
                                                    <td>{principal.lastname}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        )}
                    </div>
                )}
                {activeSection === 'classes' && (
                    <div>
                        <h4>Classes</h4>
                        <button className="btn btn-primary" onClick={handleFetchClasses}>Fetch Classes</button>
                        {classesData.length > 0 && (
                            <div className="mt-3">
                                <h5>All Classes</h5>
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Type</th>
                                            <th>Course Name</th>
                                            <th>Class Name</th>
                                            <th>Schedule</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {classesData.map(cls => (
                                            <tr key={cls.type === 'Student' ? cls.class_code : cls.id}>
                                                <td>{cls.type}</td>
                                                <td>{cls.course_name}</td>
                                                <td>{cls.type === 'Student' ? cls.class_name : cls.title}</td>
                                                <td>{cls.type === 'Student' ? `${cls.semester} ${cls.year}` : new Date(cls.created_at).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
                {activeSection === 'lectures' && (
                    <div>
                        <h4>All Lectures</h4>
                        {lectures.length === 0 ? (
                            <p>No lectures found.</p>
                        ) : (
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Description</th>
                                        <th>Lecturer</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lectures.map(lecture => (
                                        <tr key={lecture.id}>
                                            <td>{lecture.title}</td>
                                            <td>{lecture.description || 'N/A'}</td>
                                            <td>{lecture.lecturer_firstname} {lecture.lecturer_lastname}</td>
                                            <td>{new Date(lecture.created_at).toLocaleDateString()}</td>
                                            <td>
                                                <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditLecture(lecture)}>Edit</button>
                                                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteLecture(lecture.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {editMode && (
                            <div className="mt-3">
                                <h5>Edit Lecture</h5>
                                <div className="mb-3">
                                    <label className="form-label">Title</label>
                                    <input type="text" className="form-control" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <textarea className="form-control" rows="3" value={editDescription} onChange={(e) => setEditDescription(e.target.value)}></textarea>
                                </div>
                                <button className="btn btn-success" onClick={handleUpdateLecture}>Update</button>
                                <button className="btn btn-secondary ms-2" onClick={handleCancelEdit}>Cancel</button>
                            </div>
                        )}
                    </div>
                )}
                {activeSection === 'ratings' && (
                    <div>
                        <h4>All Ratings</h4>
                        {allRatings.length === 0 ? (
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
                                    {allRatings.map(r => (
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
                {activeSection === 'review-reports' && (
                    <div>
                        <h4>Review Reports</h4>
                        {reviewReports.length === 0 ? (
                            <p>No unreviewed reports found.</p>
                        ) : (
                            <div>
                                {reviewReports.map(report => (
                                    <div key={report.id} className="card mb-3">
                                        <div className="card-body">
                                            <h5 className="card-title">{report.lecture_title}</h5>
                                            <p className="card-text"><strong>Lecturer:</strong> {report.lecturer_firstname} {report.lecturer_lastname}</p>
                                            <p className="card-text"><strong>Report:</strong> {report.report}</p>
                                            <p className="card-text"><strong>Date:</strong> {new Date(report.created_at).toLocaleDateString()}</p>
                                            <div className="mb-3">
                                                <label className="form-label">Your Feedback</label>
                                                <textarea
                                                    className="form-control"
                                                    rows="3"
                                                    value={feedbackText[report.id] || ''}
                                                    onChange={(e) => setFeedbackText(prev => ({ ...prev, [report.id]: e.target.value }))}
                                                />
                                            </div>
                                            <button className="btn btn-primary" onClick={() => handleSubmitFeedback(report.id)}>Submit Feedback</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProgramLeader;
