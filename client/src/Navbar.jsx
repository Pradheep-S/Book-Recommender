import { useState, useEffect, useRef } from 'react'; // Import useRef and useEffect
import { Link } from 'react-router-dom';
import './Navbar.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from "react-router-dom";

function Navbar() {
    const [showDropdown, setShowDropdown] = useState(false);
    const username = localStorage.getItem('username');  // Retrieve username from localStorage
    const navigate = useNavigate();

    // Ref to detect click outside of dropdown
    const dropdownRef = useRef(null);

    // Function to handle dropdown toggle
    const handleIconClick = () => {
        setShowDropdown(!showDropdown); // Toggle the dropdown visibility
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('username');
        navigate('/');
    };

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false); // Close dropdown if click is outside
            }
        };

        // Adding event listener for click outside
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up the event listener when the component is unmounted
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <p className="title">Book Recommender</p>
            </div>
            <div className="navbar-right">
                <Link to="/home" className="nav-link">Home</Link>
                <Link to="/yourlist" className="nav-link">Your List</Link>
                <Link to="/about" className="nav-link">About</Link>
                {/* Bootstrap icon for the profile */}
                <i 
                    className="bi bi-person-circle profile-icon" 
                    onClick={handleIconClick} // Toggle the dropdown
                ></i>
                
                {/* Dropdown menu */}
                {showDropdown && (
                    <div className="dropdown-menu" ref={dropdownRef}>
                        <p className="dropdown-item">Username: {username}</p>
                        <button className="dropdown-item logout-btn" onClick={handleLogout}>
                            {/* Logout Icon */}
                            <i className="bi bi-box-arrow-right logout-icon"></i> Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
