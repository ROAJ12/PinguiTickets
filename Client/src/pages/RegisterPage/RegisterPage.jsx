import React from 'react';
import RegisterCard from '../../components/RegisterCard/RegisterCard';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
    return (
        <div>
            <RegisterCard />
            <Link to="/login">Login</Link>
        </div>
    );
};

export default RegisterPage;
