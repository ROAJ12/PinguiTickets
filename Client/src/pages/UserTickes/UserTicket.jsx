import React from 'react';

import UserTicketsCard from '../../components/UserTicketsCard/UserTicketsCard';
import SideBar from '../../components/SideBar/SideBar';

const UserTicket = () => {
    return (
        <div style={{ display: 'flex' }}>
            <SideBar isAdmin={false} />
            <UserTicketsCard />
        </div>
    );
};

export default UserTicket;
