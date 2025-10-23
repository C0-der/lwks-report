import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LectureReportingForm() {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const [facultyName, setFacultyName] = useState('');
    const [className, setClassName] = useState('');
    const [weekOfReporting, setWeekOfReporting] = useState('');
    const [dateOfLecture, setDateOfLecture] = useState('');
    const [courseName, setCourseName] = useState('');
    const [courseCode, setCourseCode] = useState('');
    const [lectureName, setLectureName] = useState('');
    const [actualStudentsPresent, setActualStudentsPresent] = useState('');
    const [totalRegisteredStudents, setTotalRegisteredStudents] = useState('');
    const [venueOfClass, setVenueOfClass] = useState('');
    const [scheduledLectureTime, setScheduledLectureTime] = useState('');
    const [topicTaught, setTopicTaught] = useState('');
    const [learningOutcomes, setLearningOutcomes] = useState('');
    const [lecturesRecommendations, setLecturesRecommendations] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('https://lwks-reporting.onrender.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                lecturer_username: username,
                facultyName,
                className,
                weekOfReporting,
                dateOfLecture,
                courseName,
                courseCode,
                lectureName,
                actualStudentsPresent: parseInt(actualStudentsPresent),
                totalRegisteredStudents: parseInt(totalRegisteredStudents),
                venueOfClass,
                scheduledLectureTime,
                topicTaught,
                learningOutcomes,
                lecturesRecommendations
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Report submitted successfully!');
                    navigate('/lecture-dashboard');
                } else {
                    alert('Error submitting report.');
                }
            })
            .catch(err => {
                console.error('Error submitting report:', err);
                alert('Error submitting report: ' + err.message);
            });
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light py-5">
            <div className="bg-white p-4 rounded shadow w-75">
                <h3 className="text-center">Lecture Reporting Form</h3>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Faculty Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={facultyName}
                                onChange={(e) => setFacultyName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Class Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={className}
                                onChange={(e) => setClassName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Week of Reporting</label>
                            <input
                                type="text"
                                className="form-control"
                                value={weekOfReporting}
                                onChange={(e) => setWeekOfReporting(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Date of Lecture</label>
                            <input
                                type="date"
                                className="form-control"
                                value={dateOfLecture}
                                onChange={(e) => setDateOfLecture(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Course Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={courseName}
                                onChange={(e) => setCourseName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Course Code</label>
                            <input
                                type="text"
                                className="form-control"
                                value={courseCode}
                                onChange={(e) => setCourseCode(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Lecture's Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={lectureName}
                                onChange={(e) => setLectureName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Actual Number of Students Present</label>
                            <input
                                type="number"
                                className="form-control"
                                value={actualStudentsPresent}
                                onChange={(e) => setActualStudentsPresent(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Total Number of Registered Students</label>
                            <input
                                type="number"
                                className="form-control"
                                value={totalRegisteredStudents}
                                onChange={(e) => setTotalRegisteredStudents(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Venue of Class</label>
                            <input
                                type="text"
                                className="form-control"
                                value={venueOfClass}
                                onChange={(e) => setVenueOfClass(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Scheduled Lecture Time</label>
                            <input
                                type="text"
                                className="form-control"
                                value={scheduledLectureTime}
                                onChange={(e) => setScheduledLectureTime(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Topic Taught</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                value={topicTaught}
                                onChange={(e) => setTopicTaught(e.target.value)}
                                required
                            ></textarea>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Learning Outcomes of the Topic</label>
                        <textarea
                            className="form-control"
                            rows="3"
                            value={learningOutcomes}
                            onChange={(e) => setLearningOutcomes(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Lecture's Recommendations</label>
                        <textarea
                            className="form-control"
                            rows="3"
                            value={lecturesRecommendations}
                            onChange={(e) => setLecturesRecommendations(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit Report</button>
                    <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/lecture-dashboard')}>Cancel</button>
                </form>
            </div>
        </div>
    );
}

export default LectureReportingForm;
