import axios from 'axios';

import { API_URL } from '../utils/constants';

const getUserTickets = async (userId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get( API_URL + `/users/${userId}/tickets`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'An error occurred while getting tickets.');
    }
};

export default getUserTickets;
