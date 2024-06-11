import React from "react";
import { Link } from "react-router-dom";

import './HomePage.css';

const HomePage = () => {
    return (
        <div>
            <h1>Sistema de Tickets</h1>
            <p><Link to="/login">Iniciar Sesion</Link></p>
            <p><Link to="/register">Registrarse</Link></p>
            <p><Link to="/sendticket">Send a Ticket</Link></p>
        </div>
    );
};

export default HomePage;