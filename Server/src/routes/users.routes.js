import express from 'express';
import { 
    registerUser, 
    loginUser, 
    getUserTickets, 
    getUserInfo,
    getAllUsers,
    updateUserRole
} from '../controllers/users.controller.js';

import { auth, adminAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Registro de usuario
router.post('/register', registerUser);

// Login de usuario
router.post('/login', loginUser);

// Obtener todos los tiquets de un usuario
router.get('/:userId/tickets', auth, getUserTickets);

// Get information of a specific user (protected route, requires authentication)
router.get('/:userId', auth, getUserInfo);

// Get all users
router.get('/', adminAuth, getAllUsers);

// Update user role
router.patch('/role', adminAuth, updateUserRole);

export default router;