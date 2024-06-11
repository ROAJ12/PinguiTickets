import React from 'react';
import { Link, useNavigate }  from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import './SideBar.css';


const SideBar = ({}) => {
    const history = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        history('/login');
    };
        
    return (
        <div className="sidebar">
            <h2>Ticket System</h2>
                <ul>
                <li>
                    <Link to="/dashboard">Crear Ticket</Link>
                </li>
                <li>
                    <Link to="/tickets/:id">Mis Tickets</Link>
                </li>
                <li>
                    <Link to="/profile/:id">Ver Perfil</Link>
                </li>
                <li>
                    <button onClick={handleLogout}>Logout</button>
                </li>
                </ul>
        </div>
  );
};

export default SideBar;
