import React, { useState } from 'react';
import axios from 'axios';

const LoginLogout = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:8081/login', {
                email,
                password
            }, {
                withCredentials: true
            });

            if (response.data === "success") {
                console.log("Logged in successfully");
                setIsLoggedIn(true);
            } else {
                console.log("Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await axios.post('http://localhost:8081/logout', {}, {
                withCredentials: true
            });

            if (response.data === "success") {
                console.log("Logged out successfully");
                setIsLoggedIn(false);
            } else {
                console.log("Logout failed");
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const checkLoginStatus = async () => {
        try {
            const response = await axios.get('http://localhost:8081/check-login', {
                withCredentials: true
            });

            setIsLoggedIn(response.data.loggedIn);
        } catch (error) {
            console.error("Check login status error:", error);
        }
    };

    return (
        <div>
            <h1>Login/Logout Example</h1>

            {!isLoggedIn ? (
                <div>
                    <h2>Login</h2>
                    <div>
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button onClick={handleLogin}>Login</button>
                </div>
            ) : (
                <div>
                    <h2>Welcome, {name}!</h2>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            )}

            <button onClick={checkLoginStatus}>Check Login Status</button>
        </div>
    );
};

export default LoginLogout;
