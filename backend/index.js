const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./config/database');
const { verifyTransporter } = require('./utils/emailService');
const { initializeStorage } = require('./utils/supabaseStorage');
const path = require('path');
const Order = require('./models/Order'); // Ensure Order model is imported
const OrderItem = require('./models/OrderItem');
const { Product, Electronics } = require('./models/Product');

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/user.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;

// Database connection and server start
console.log('Starting database sync...');
sequelize.sync({ alter: true }).then(async () => {
    console.log('Database sync successful');
    
    // Initialize model associations
    const models = {
        Order,
        OrderItem,
        Product,
        Electronics
    };

    console.log('Initializing model associations...');
    // Initialize associations for each model
    Object.values(models).forEach(model => {
        if (typeof model.initializeAssociations === 'function') {
            console.log(`Initializing associations for ${model.name}`);
            model.initializeAssociations(models);
        }
    });

    console.log('Verifying email configuration...');
    // Verify email configuration
    await verifyTransporter();

    console.log('Initializing Supabase storage...');
    // Initialize Supabase Storage
    await initializeStorage();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
}); 