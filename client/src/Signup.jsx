// Signup.jsx
import { useState } from "react";
import { Link } from 'react-router-dom';
import './Signup.css';
import booksImage from './assets/books.webp';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Signup() {
    const [name, setName] = useState('');
    const [email, setMail] = useState('');
    const [pw, setPW] = useState('');
    const [cp, setCP] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Email validation regex function
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Password validation regex function
    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (pw !== cp) {
            setErrorMessage('Passwords do not match.');
            return;
        }
        if (!validateEmail(email)) {
            setErrorMessage('Please enter a valid email.');
            return;
        }
        if (!validatePassword(pw)) {
            setErrorMessage('Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/register', {
                username: name,
                email: email,
                password: pw
            });
            if (response.data.error) {
                setErrorMessage(response.data.error);
            } else {
                navigate('/login');
            }
        } catch (error) {
            setErrorMessage('Registration failed. Please try again.');
            console.error(error);
        }
    };

    return (
        <div className="full">
            <div>
                <div className="login-container">
                    <div className="login-left">
                        <img className="company-logo" src="https://img.icons8.com/ios-filled/50/4a90e2/open-book.png" alt="Book Recommender Logo" />
                        <h2 className="company-name">Book Recommender</h2>
                        <div className="input-group1">
                            <label htmlFor="userName">Username</label>
                            <input id="userName" type="text" placeholder="Choose a username" onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="input-group1">
                            <label htmlFor="userEmail">Email</label>
                            <input id="userEmail" type="email" placeholder="Enter your email" onChange={(e) => setMail(e.target.value)} />
                        </div>
                        <div className="input-group1">
                            <label htmlFor="userPassword">Password</label>
                            <input id="userPassword" type="password" placeholder="Create a password" onChange={(e) => setPW(e.target.value)} />
                        </div>
                        <div className="input-group1">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input id="confirmPassword" type="password" placeholder="Confirm your password" onChange={(e) => setCP(e.target.value)} />
                        </div>
                        <button className="login-button2" onClick={handleSubmit}>Sign Up</button>
                        <span id="signupError" className="error-message">{errorMessage}</span>
                        <div className="signup-message">
                            Already have an account?
                            <Link to="/login" className="signup-link"> Log In</Link>
                        </div>
                    </div>
                    <div className="login-right1">
                        <img src={booksImage} alt="" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
