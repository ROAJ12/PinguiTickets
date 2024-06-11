import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import { API_URL } from '../../utils/constants';

const AdminUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/error');
            }
            const response = await axios.get(API_URL + '/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUsers(response.data);
        } catch (error) {
            console.log(error);
            setError('Error al obtener los usuarios');
        }
    };

    useEffect(() => {
    
        fetchUsers();

    }, []);

    const handleRoleChange = async (userId, newRole) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/error');
            }
            const response = await axios.patch(API_URL + '/users/role', { userId, newRole }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setUsers(users.map(user => user._id === userId ? response.data : user));
        } catch (error) {
            setError('Error al actualizar el rol del usuario');
        }
    };

    return (
        <div>
            <h1>Administración de Usuarios</h1>
            {error && <p>{error}</p>}
            <ul>
                {users
                    .filter(user => user.role !== 'admin')  // Filtrar usuarios que no son admin
                    .map(user => (
                        <li key={user._id}>
                            {user.firstname} {user.lastname} - {user.email} - {user.role}
                            <select 
                                value={user.role} 
                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            >
                                <option value="user">User</option>
                                <option value="support">Support</option>
                            </select>
                        </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminUserManagement;
