import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Modal from 'react-modal';
import axios from 'axios';

import { API_URL } from '../../utils/constants';

const AdminAllTickets = () => {

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

    const fetchAllTickets = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/error');
            }
            const payload = jwtDecode(token);
            const allTickets = await axios.get(API_URL + '/tickets', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setTickets(allTickets.data);

            setLoading(false);
        
        } catch (error) {
            setLoading(false);
            setError(error.message);

        }
    };

    const fetchAllUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/error');
            }
            const allUsers = await axios.get(`${API_URL}/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            const supportUsers = allUsers.data.filter(user => user.role === 'support');
            setUsers(supportUsers);
        } catch (error) {
            setError('Error al obtener los usuarios');
        }
    };

    useEffect(() => {
        
        fetchAllTickets();
        fetchAllUsers();

    }, []);

    const handleAssignUser = async (ticketId, userId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${API_URL}/tickets/${ticketId}`, { assignedTo : userId || null }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setTickets(tickets.map(ticket => 
                ticket._id === ticketId ? { ...ticket, assignedTo: userId || null } : ticket
            ));

            fetchAllTickets();

        } catch (error) {
            console.error('Failed to update ticket status', error);
            setError('Failed to update ticket status');
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
            <h2>All Tickets</h2>
            <button onClick={handleLogout}>Logout</button>
            <h3><Link to="/admin/users">Manage users</Link></h3>
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
                <label>Assigned To:</label>
                <select
                    value={searchAssignedTo}
                    onChange={(e) => setSearchAssignedTo(e.target.value)}
                >
                    <option value="">All</option>
                    {users.map(user => (
                        <option key={user._id} value={user._id}>
                            {user.firstname} {user.lastname}
                        </option>
                    ))}
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
                        <th>Assignee</th> 
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
                            <td>{ticket.priority}</td>
                            <td>{ticket.status}</td>
                            <td>
                                <p>{users.find(user => user._id === ticket.assignedTo)?.firstname || 'Unassigned'}</p>
                                <select
                                    onChange={(e) => handleAssignUser(ticket._id, e.target.value)}
                                    value={ticket.assignedTo || ''}
                                >
                                    <option value="">Unassigned</option>
                                    {users.map(user => (
                                        <option key={user._id} value={user._id}>
                                            {user.firstname} {user.lastname}
                                        </option>
                                    ))}
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

export default AdminAllTickets;