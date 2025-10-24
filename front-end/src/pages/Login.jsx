import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Validation from "./LoginValidation";
import '../Style.css';

function Login() {

    const [Values,setValues] = useState({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();
    const HandleInput = (event) => {
        const { name, value } = event.target;
        setValues(prev => ({ ...prev, [name]: value }));
        setLoginError(''); // Clear login error on input change
    };
    const handleSubmit =(event) => {
        event.preventDefault();
        const validationErrors = Validation(Values);
        setErrors(validationErrors);
        if (!Object.values(validationErrors).some(err => err !== "")) {
            fetch('https://lwks-reporting.onrender.com/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: Values.username.trim(),
                    password: Values.password.trim()
                }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Login successful! Password is correct.');
                    localStorage.setItem('username', data.username);
                    localStorage.setItem('role', data.role);
                    localStorage.setItem('firstname', data.firstname);
                    localStorage.setItem('lastname', data.lastname);
                    const role = data.role.toLowerCase();
                    if (role === 'student') {
                        navigate('/student-dashboard');
                    } else if (role === 'lecturer') {
                        navigate('/lecture-dashboard');
                    } else if (role === 'principal') {
                        navigate('/principal-lecture');
                    } else if (role === 'program leader') {
                        navigate('/program-leader');
                    } else {
                        setLoginError('Unknown role');
                    }
                } else {
                    if (data.message === 'Invalid password') {
                        alert('Password is wrong. Please try again.');
                    } else {
                        alert(data.message);
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
                setLoginError('Network error');
            });
        }
    }
    return(
        <div className="d-flex justify-content-center align-items-center bg-dark" style={{ minHeight: '100vh' }}>
            <div className="bg-dark text-white p-4 rounded shadow" style={{ width: '400px', maxWidth: '90%' }}>
                <h2 className="text-center mb-4">Log In</h2>
                <form action="" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label"><strong>Username:</strong></label>
                        <input type="text" placeholder="Username or email" name="username"
                        onChange={HandleInput} className="form-control"/>
                        <span>{errors.username && <span className="text-danger">{errors.username}</span> }</span>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label"><strong>Password:</strong></label>
                        <input type="password" placeholder="Enter your password..." name='password'
                        onChange={HandleInput} className="form-control"/>
                        <span>{errors.password && <span className="text-danger">{errors.password}</span> }</span>
                    </div>
                    {loginError && <div className="mb-3"><span className="text-danger">{loginError}</span></div>}
                    <button type="submit" className="btn btn-outline-light w-100 mb-3">Log in</button>
                    <p className="text-center small mb-2">You agree to Terms and Conditions</p>
                    <p className="text-center mb-2">Don't have an account?</p>
                    <Link to="/register" className="btn btn-outline-light w-100 text-decoration-none">Register Here</Link>
                </form>
            </div>
        </div>

    )
}
export default Login;