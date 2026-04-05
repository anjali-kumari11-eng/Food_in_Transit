require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// Connect Database
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*', // Allow all origins for development
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.json());

// Socket.io connection
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('joinRoom', (orderId) => {
        socket.join(orderId);
        console.log(`Socket ${socket.id} joined room: ${orderId}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Pass IO instance to routes via middleware
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Basic route
app.get('/', (req, res) => {
    res.send('Food in Transit API is running...');
});

// We will mount routes here later
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/restaurants', require('./routes/restaurantRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/seed', require('./routes/seedRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running in development mode on port ${PORT}`);
});
