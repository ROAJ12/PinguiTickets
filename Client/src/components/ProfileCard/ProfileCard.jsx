import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { jwtDecode } from 'jwt-decode';

import { API_URL } from '../../utils/constants';

const ProfileCard = () => {

    const navigation = useNavigate();

    const [user , setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigation('/error');
                }
                const payload = jwtDecode(token);
                const userId = payload._id;
                const response = await axios.get(`${API_URL}/users/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                const formattedDate = new Date(response.data.createdAt).toLocaleDateString('en-GB');

                setUser({ ...response.data, createdAt: formattedDate });

                setLoading(false);
            } catch (error) {
                setLoading(false);
                setError(error.message);
            }
        };

        fetchUserInfo();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Profile</h2>
            <p>Firt Name: {user.firstname}</p>
            <p>Last Name: {user.lastname}</p>
            <p>Email: {user.email}</p>
            <p>Join Date: {user.createdAt}</p>
            <p>Role: {user.role}</p>
        </div>
    );
};

export default ProfileCard;
