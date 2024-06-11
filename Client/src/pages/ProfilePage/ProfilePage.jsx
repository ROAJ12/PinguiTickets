import React from 'react';

import ProfileCard from '../../components/ProfileCard/ProfileCard';
import SideBard from '../../components/SideBar/SideBar';

const ProfilePage = () => {
    return (
        <div style={{ display: 'flex'}}>
            <SideBard />
            <div>
            <h1>Profile Page</h1>
            <ProfileCard />
            </div>
        </div>
    );
};

export default ProfilePage;
