import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import getUserTickets from '../../api/getUserTickets';
import { jwtDecode } from 'jwt-decode';

import { API_URL } from '../../utils/constants';

import './UserTicketsCard.css';

const UserTicketsCard = () => {

    const navigate = useNavigate();

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [users, setUsers] = useState([]);
    const [searchStatus, setSearchStatus] = useState('');
    const [searchAssignedTo, setSearchAssignedTo] = useState('');
    const [searchPriority, setSearchPriority] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalImage, setModalImage] = useState('');
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const fetchUserTicketsData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/error');
            }
            console.log(token);
            const payload = jwtDecode(token);
            const userId = payload._id;
            console.log(userId);
            const userTickets = await getUserTickets(userId);
            setTickets(userTickets);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
    };
    
    useEffect(() => {

        fetchUserTicketsData();

    }, []);

    const handleStatusChange = async (ticketId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${API_URL}/tickets/${ticketId}`, { status: newStatus }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setTickets(tickets.map(ticket => 
                ticket._id === ticketId ? { ...ticket, status: newStatus } : ticket
            ));

            fetchUserTicketsData();

        } catch (error) {
            console.error('Failed to update ticket status', error);
            setError('Failed to update ticket status');
        }
    };

    const handlePriorityChange = async (ticketId, newPriority) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${API_URL}/tickets/${ticketId}`, { priority: newPriority }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setTickets(tickets.map(ticket => 
                ticket._id === ticketId ? { ...ticket, priority: newPriority } : ticket
            )); 

            fetchUserTicketsData();

        } catch (error) {
            console.error('Failed to update ticket priority', error);
            setError('Failed to update ticket priority');
        }    
    };

    const filteredTickets = tickets.filter(ticket => {
        if (searchStatus && ticket.status !== searchStatus) {
            return false;
        }
        if (searchAssignedTo && ticket.assignedTo !== searchAssignedTo) {
            return false;
        }
        if (searchPriority && ticket.priority !== searchPriority) {
            return false;
        }
        return true;
    });
    
    const handleSort = (sortByField) => {
        if (sortBy === sortByField) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(sortByField);
            setSortOrder('asc');
        }
    };
    
    const sortedTickets = [...filteredTickets].sort((a, b) => {
        if (sortOrder === 'asc') {
            if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
                return new Date(a[sortBy]) - new Date(b[sortBy]);
            } else {
                return a[sortBy] > b[sortBy] ? 1 : -1;
            }
        } else {
            if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
                return new Date(b[sortBy]) - new Date(a[sortBy]);
            } else {
                return a[sortBy] < b[sortBy] ? 1 : -1;
            }
        }
    });

    const openModal = (image) => {
        setModalImage(image);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setModalImage('');
    };    

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Your Asigned Tickets</h2>
            <button onClick={handleLogout}>Logout</button>
            <div>
                <label>Status:</label>
                <select
                    value={searchStatus}
                    onChange={(e) => setSearchStatus(e.target.value)}
                >
                    <option value="">All</option>
                    <option value="open">Open</option>
                    <option value="in progress">In Progress</option>
                    <option value="closed">Closed</option>
                </select>
            </div>
            <div>
                <label>Priority:</label>
                <select
                    value={searchPriority}
                    onChange={(e) => setSearchPriority(e.target.value)}
                >
                    <option value="">All</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>    
            <table border={1}>
                <thead>
                    <tr>
                        <th>Ticket ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Creator Email</th>
                        <th>Image</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th onClick={() => handleSort('createdAt')}>
                            {sortBy === 'createdAt' ? (sortOrder === 'asc' ? '▲' : '▼') : null} Creation Date
                        </th>
                        <th onClick={() => handleSort('updatedAt')}>
                            {sortBy === 'updatedAt' ? (sortOrder === 'asc' ? '▲' : '▼') : null} Last Update
                        </th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedTickets.map(ticket => (
                        <tr key={ticket._id}>
                            <td>{ticket._id}</td>
                            <td>{ticket.title}</td>
                            <td>{ticket.description}</td>
                            <td>{ticket.creatorEmail}</td>
                            <td> 
                                {ticket.image && (
                                    <img
                                    src={`data:image;base64,${ticket.image}`}
                                    alt="Uploaded"
                                    style={{ width: '100px', height: '100px', cursor: 'pointer' }}
                                    onClick={() => openModal(`data:image;base64,${ticket.image}`)}
                                />
                                )}
                            </td>
                            <td>
                                <select
                                    value={ticket.priority}
                                    onChange={(e) => handlePriorityChange(ticket._id, e.target.value)}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </td>
                            <td>
                                <select
                                    value={ticket.status}
                                    onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                                >
                                    <option value="open">Open</option>
                                    <option value="in progress">In Progress</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </td>
                            <td>{new Date(ticket.createdAt).toLocaleString()}</td>
                            <td>{new Date(ticket.updatedAt).toLocaleString()}</td>
                            <td>
                                <Link to={`/ticketsdetails/${ticket._id}`}>View Details</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Image Modal"
            >
                <button onClick={closeModal}>Close</button>
                <img src={modalImage} alt="Full size" style={{ width: '100%', height: 'auto' }} />
            </Modal>

        </div>

    );
};

export default UserTicketsCard;
