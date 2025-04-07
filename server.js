require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded images

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'your_mongodb_atlas_connection_string';
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.log('❌ MongoDB Connection Error:', err));

// Import Routes
const pgRoutes = require('./pgRoutes');
const authRoutes = require('./authRoutes');
const bookingRoutes=require('./bookingRoutes');
const Details=require('./Details');

// Use Routes
app.use('/api/pg', pgRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bookings',bookingRoutes);
app.use('/api/show',Details)

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
