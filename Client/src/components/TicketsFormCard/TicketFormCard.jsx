import React, { useState,  useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

import { API_URL } from '../../utils/constants';

import './TicketFormCard.css';

import convertImageToBase64 from '../convetImageToBase64';

const TicketFormCard = () => {

    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [creatorEmail, setCreatorEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [base64Data, setBase64Data] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const handleImageChange = async e => {
        try {
          const file = e.target.files[0];
          if (file) {
            const base64String = await convertImageToBase64(file);
            setBase64Data(base64String);
          }
        } catch (error) {
          setError('An error occurred while converting the image.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        try {
            const response = await axios.post( API_URL + '/tickets', {
                title,
                description,
                creatorEmail,
                image: base64Data
            });
            setLoading(false);
            setSuccessMessage(response.data.message);
            setTitle('');
            setDescription('');
            setCreatorEmail('');
            setBase64Data(null);
        } catch (error) {
            setLoading(false); 
            setError(error.response.data.error || 'An error occurred.');
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/error');
        }
        if (error) {
            alert(error);
        }
    }, [error]);

    useEffect(() => {
        if (successMessage) {
            alert(successMessage);
        }
    }, [successMessage]);

    return (
        <div>
            <h2>Create Ticket</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label>Your Email:</label>
                    <input
                        type="text"
                        value={creatorEmail}
                        onChange={(e) => setCreatorEmail(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        type="file"
                        accept=".jpg, .jpeg, .png"
                        onChange={handleImageChange}
                    />
                    {base64Data && (
                        <div>
                        <div className='image-wrapper'> 
                            <img src={`data:image;base64,${base64Data}`} alt="Uploaded" />
                        </div>
                        </div>
                    )}
                    </div>
                <button type="submit" disabled={loading}>Submit</button>
            </form>
        </div>
    );
};

export default TicketFormCard;

