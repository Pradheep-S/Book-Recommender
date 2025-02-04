import { useState } from "react";
import { Link } from 'react-router-dom';
import './Login.css';
import booksImage from './assets/books.webp';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Login() {
    const [name, setName] = useState('');
    const [pw, setPW] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('https://bookrecc.vercel.app/api/login', {
            name: name,
            password: pw
        })
        .then(result => {
            if (result.data === "Success") {
                // Save username in localStorage
                localStorage.setItem('username', name);
                navigate('/home');
            } else {
                // Display the error message in the span tag
                setErrorMessage(result.data);
            }
        })
        .catch(err => {
            console.error(err);
            setErrorMessage('An error occurred. Please try again.');
        });
    };

    return (
        <div className="full">
            <div className="login-container">
                <div className="login-left">
                    <img className="company-logo" src="https://img.icons8.com/ios-filled/50/4a90e2/open-book.png" alt="Book Recommender Logo" />
                    <h2 className="company-name">Book Recommender</h2>
                    <div className="input-group2">
                        <label htmlFor="userName">Username</label>
                        <input id="userName" type="text" placeholder="Enter your username" onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="input-group2">
                        <label htmlFor="userPassword">Password</label>
                        <input id="userPassword" type="password" placeholder="Enter your password" onChange={(e) => setPW(e.target.value)} />
                    </div>
                    <button className="login-button1" onClick={handleSubmit}>Log In</button>
                    <span id="loginError" className="error-message">{errorMessage}</span>
                    <div className="signup-message">
                        Don’t have an account?
                        <Link to="/register" className="signup-link"> Sign Up</Link>
                    </div>
                </div>
                <div className="login-right">
                    <img src={booksImage} alt="" />
                </div>
            </div>
        </div>
    );
}

export default Login;
