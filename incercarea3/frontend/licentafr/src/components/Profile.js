import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:8081/profile', { withCredentials: true });
                setUser(response.data.user);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    navigate('/');
                } else {
                    console.error('Error fetching profile:', error);
                }
            }
        };

        fetchProfile();
    }, [navigate]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Welcome, {user.email}</h1>
            <p>User ID: {user.id}</p>
        </div>
    );
}

export default Profile;
