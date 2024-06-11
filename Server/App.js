import cookieParser from 'cookie-parser';
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cors from 'cors';

import connectDB from './src/config/db.js';

import ticketsRoutes from './src/routes/tickets.routes.js';
import userRoutes from './src/routes/users.routes.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// Add the allowed origins or routes where the API can be accessed; in this case, the frontend URLs.
const origins = ["http://localhost:6969"];

app.use(helmet());
app.use(cookieParser());

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Middleware
app.use(bodyParser.json());

// CORS middleware
app.use(
    cors({
        origin(requestOrigin, callback) {
            if (!requestOrigin || origins.includes(requestOrigin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed."), false);
            }
        },
        credentials: true,
    })
);

app.use(morgan('dev'));
app.use(express.json());

// Routes   
app.get('/', (req, res) => {
    res.send('API de Sistema de Soporte de Tiquets');
});

app.use('/api/tickets', ticketsRoutes);
app.use('/api/users', userRoutes);

// Conectar a la base de datos e iniciar el servidor
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.error(err);
    process.exit(1);
});
