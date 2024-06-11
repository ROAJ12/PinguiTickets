import User from '../models/users.model.js';
import Ticket from '../models/tickets.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'SEX'; // Replace with your secret key

// Registro de usuario
export const registerUser = async (req, res) => {
    try {
        const { firstname, lastname, email, password, role } = req.body;

        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).send({ error: 'User with this email already exists.' });
        }
        
        const user = new User({ firstname, lastname, email, password, role });
        await user.save();

        res.status(201).send({ message: 'User registered successfully.' });
    } catch (error) {
        // Manejo de errores
        let errorMessage = 'Internal server error';
        if (error.name === 'ValidationError') {
            errorMessage = Object.values(error.errors).map(val => val.message).join(', ');
        res.status(400).json({ error: errorMessage });
        }
    }
};

// Login de usuario
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ error: 'All fields are required.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({ error: 'Invalid login credentials.' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).send({ error: 'Invalid login credentials.' });
        }

        const token = jwt.sign({ _id: user._id, role: user.role, firstname: user.firstname }, SECRET_KEY, { expiresIn: '1h' });

        res.status(200).send({ token });

    } catch (error) {
        res.status(400).send(error);
    }
};

export const getUserTickets = async (req, res) => {
    try {
        const userId = req.params.userId;
        const userTickets = await Ticket.find({ assignedTo: userId });

        res.status(200).json(userTickets);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        console.error(error);
    }
};

export const getUserInfo = async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json(user);
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios', error });
    }
};

export const updateUserRole = async (req, res) => {
    const { userId, newRole } = req.body;

    if (!['user', 'admin', 'support'].includes(newRole)) {
        return res.status(400).json({ message: 'Rol no válido' });
    }

    try {
        const user = await User.findByIdAndUpdate(userId, { role: newRole }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el rol del usuario', error });
    }
};

