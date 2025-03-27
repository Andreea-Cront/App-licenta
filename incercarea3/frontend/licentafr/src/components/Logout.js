import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import AuthContext from './AuthContext'; // Presupunând că ai un context global pentru autentificare

const LogoutButton = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext); // Utilizăm contextul global pentru autentificare
    const history = useHistory();

    useEffect(() => {
        checkLoginStatus();
    });

    const checkLoginStatus = async () => {
        try {
            const response = await axios.get('http://localhost:8081/check-login', { withCredentials: true });
            setIsLoggedIn(response.data.loggedIn);
        } catch (error) {
            console.error("Check login status error:", error);
        }
    };

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:8081/logout', {}, { withCredentials: true });

            if (response.data === "success") {
                console.log("Logged out successfully");
                setIsLoggedIn(false);
                history.push('/login'); // Redirecționare către pagina de conectare după deconectare
            } else {
                console.log("Logout failed");
            }
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isLoggedIn) {
        return null;
    }

    return (
        <button onClick={handleLogout} disabled={isLoading}>
            {isLoading ? 'Logging out...' : 'Logout'}
        </button>
    );
};

export default LogoutButton;
