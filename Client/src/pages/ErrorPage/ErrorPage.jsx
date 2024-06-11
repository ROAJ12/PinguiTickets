import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
    const navigate = useNavigate();

    const goHome = () => {
        navigate('/');
    };

    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>Oops! Something went wrong.</h1>
            <p>We can't seem to find the page you're looking for.</p>
            <button onClick={goHome}>Go to Home</button>
        </div>
    );
};

export default ErrorPage;
