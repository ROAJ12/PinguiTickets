import React , { useState } from 'react';
import LoginCard from '../../components/LoginCard/LoginCard';
import { Link } from 'react-router-dom';

const LoginPage = ({ }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    return (
        <div>
            <LoginCard onLogin={handleLogin}/>
            <Link to="/register">Registrarse</Link>
        </div>
    );
};

export default LoginPage;
