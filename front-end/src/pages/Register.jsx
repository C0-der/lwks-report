import React, { useState, useEffect } from 'react';
import Validation from './RegisterValidation';
import { Link, useNavigate } from 'react-router-dom';
import '../Style.css';

function Register() {
    const [Values,setValues] = useState({
        username: '',
        firstname: '',
        lastname: '',
        password: '',
        role: ''
    });
    const [courses, setCourses] = useState([]);
    useEffect(() => {
        fetch('https://lwks-reporting.onrender.com/get-courses')
            .then(res => res.json())
            .then(data => setCourses(data))
            .catch(err => console.error('Error fetching courses:', err));
    }, []);
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const HandleInput = (event) => {
        const { name, value } = event.target;
        setValues(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit =(event) => {
        event.preventDefault();
        // Normalize role to lowercase and trim
        const normalizedValues = { ...Values, role: Values.role.toLowerCase().trim() };
        const validationErrors = Validation(normalizedValues);
        setErrors(validationErrors);
        if (!Object.values(validationErrors).some(err => err !== "")) {
            // Proceed with form submission or further processing
            // include course_id, semester, year when registering a student
            const payload = { ...normalizedValues };
            if (normalizedValues.role === 'student') {
                payload.course_id = Values.course_id || null;
                payload.semester = Values.semester || '';
                payload.year = Values.year || '';
            }
            fetch('https://lwks-reporting.onrender.com/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.error || 'Registration failed');
                    });
                }
                return response.json();
            })
            .then(data => {
                alert(data.message);
                navigate('/login');
            })
            .catch(error => {
                console.error('There was an error registering!', error);
                alert(error.message || 'There was an error registering. Please try again.');
            });

        }
    }
    return(
        <div className="d-flex justify-content-center align-items-center bg-dark" style={{ minHeight: '100vh' }}>
            <div className="bg-dark text-white p-4 rounded shadow" style={{ width: '400px', maxWidth: '90%' }}>
                <h2 className="text-center mb-4">Register</h2>
                <form action="" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label"><strong>Username:</strong></label>
                        <input type="text" placeholder="Username or email" name="username" value={Values.username} onChange={HandleInput} className="form-control"/>
                        <span>{errors.username && <span className="text-danger">{errors.username}</span> }</span>
                    </div>
                     <div className="mb-3">
                        <label htmlFor="firstname" className="form-label"><strong>FirstName:</strong></label>
                        <input type="text" name="firstname" placeholder="firstname" value={Values.firstname} onChange={HandleInput} className="form-control"/>
                        <span>{errors.firstname && <span className="text-danger">{errors.firstname}</span> }</span>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="lastname" className="form-label"><strong>Lastname:</strong></label>
                        <input type="text" name="lastname" placeholder="lastname" value={Values.lastname} onChange={HandleInput} className="form-control"/>
                        <span>{errors.lastname && <span className="text-danger">{errors.lastname}</span> }</span>
                    </div>
                     <div className="mb-3">
                        <label htmlFor="password" className="form-label"><strong>Password:</strong></label>
                        <input type="password" name="password" placeholder="new password..." value={Values.password} onChange={HandleInput} className="form-control"/>
                        <span>{errors.password && <span className="text-danger">{errors.password}</span> }</span>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="role" className="form-label"><strong>Role:</strong></label>
                        <select name="role" value={Values.role} onChange={HandleInput} className="form-select">
                            <option value="">Select role</option>
                            <option value="student">Student</option>
                            <option value="lecture">Lecture</option>
                            <option value="principal">Principal</option>
                            <option value="program-leader">Program-Leader</option>
                        </select>
                        <span>{errors.role && <span className="text-danger">{errors.role}</span> }</span>
                    </div>
                    {Values.role === 'student' && (
                        <>
                            <div className="mb-3">
                                <label className="form-label"><strong>Course</strong></label>
                                <select name="course_id" value={Values.course_id || ''} onChange={HandleInput} className="form-select">
                                    <option value="">Select course</option>
                                    {courses.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label"><strong>Semester</strong></label>
                                <input type="text" name="semester" value={Values.semester || ''} onChange={HandleInput} className="form-control" placeholder="e.g., Fall" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label"><strong>Year</strong></label>
                                <input type="number" name="year" value={Values.year || ''} onChange={HandleInput} className="form-control" placeholder="2025" />
                            </div>
                        </>
                    )}
                    <button type="submit" className="btn btn-outline-light w-100 mb-3">Register</button>
                    <p className="text-center small mb-2">You agree to Terms and Conditions</p>
                    <p className="text-center mb-2">Already have an account?</p>
                    <Link to="/login" className="btn btn-outline-light w-100 text-decoration-none">Log In Here</Link>
                </form>
            </div>
        </div>

    )}
    export default Register;