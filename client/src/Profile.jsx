//import { useState } from "react";
import Navbar from "./Navbar";
//import axios from "axios";
import "./Profile.css";

function Profile() {
    const username = localStorage.getItem('username');
    return (
        <div>
            <Navbar />
            <div className="profile-container">
                <h1>Welcome, {username}</h1>
            </div>
        </div>
    );
}

export default Profile;
