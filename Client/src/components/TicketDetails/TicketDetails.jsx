import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

import { API_URL } from '../../utils/constants';

const TicketDetails = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState('');

    const fetchTicketData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/error');
            }
            const payload = jwtDecode(token);
            const response = await axios.get(`${API_URL}/tickets/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setTicket(response.data);
            const messagesResponse = await axios.get(`${API_URL}/tickets/${id}/messages`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setMessages(messagesResponse.data);
        } catch (error) {
            setError('Error fetching ticket data');
        }
    };

    useEffect(() => {

        fetchTicketData();

    }, [id]);

    const handleAddMessage = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/error');
            }
            const payload = jwtDecode(token);
            console.log(payload);
            const sender = payload.role + ' : ' + payload.firstname; 

            const response = await axios.post(`${API_URL}/tickets/${id}/messages`, {
                sender,
                content: newMessage
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setMessages([...messages, response.data]);
            setNewMessage('');
        } catch (error) {
            setError('Error adding message');
        }
    };

    if (!ticket) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Ticket Details</h2>
            <div>
                <h3>{ticket.title}</h3>
                <p>{ticket.description}</p>
                <img src={`data:image;base64,${ticket.image}`} alt="Ticket" style={{ maxWidth: '300px'}} />
                <p>Status: {ticket.status}</p>
                <p>Created At: {new Date(ticket.createdAt).toLocaleString()}</p>
                <p>Updated At: {new Date(ticket.updatedAt).toLocaleString()}</p>
            </div>
            <div>
                <h3>Messages</h3>
                {messages.map(message => (
                    <div key={message._id}>
                        <p><strong>{message.sender}:</strong> {message.content}</p>
                        <p>{new Date(message.createdAt).toLocaleString()}</p>
                    </div>
                ))}
            </div>
            <div>
                <h3>Add a new message</h3>
                {ticket.status !== 'closed' ? (
                    <form onSubmit={handleAddMessage}>
                        <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            required
                        />
                        <button type="submit">Send</button>
                    </form>
                ) : (
                    <p>Cannot send messages. Ticket is closed.</p>
                )}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    );
};

export default TicketDetails;