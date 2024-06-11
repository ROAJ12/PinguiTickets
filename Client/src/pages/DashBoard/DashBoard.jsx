import React, { useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

import './DashBoard.css';

import AdminAllTickets from "../../components/AdminAllTickets/AdminAllTickets";
import UserTicketCard from "../../components/UserTicketsCard/UserTicketsCard";

const DashBoard = () => {

    const navigate = useNavigate();

    const [role, setRole] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null) {
            navigate('/error');
        }
        const payload = jwtDecode(token);
        setRole(payload.role);

    }, []);

    const renderContent = () => {
        if (role === 'admin') {
            return <AdminAllTickets />;
        } else if (role === 'user') {
            return (
                <div>
                    <h1>You dont hace access to the tickets system</h1>
                    <h2>Contact the administrator</h2>
                </div>
            );
        } else {
            return (
                <UserTicketCard />
            );
        }
    };

    return (
        <div>
            {renderContent()}
        </div>    
    );
};

export default DashBoard;