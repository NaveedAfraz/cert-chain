const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const certRoutes = require('./routes/certRoutes');
const institutionRoutes = require('./routes/institutionRoutes');
const apiKeyRoutes = require('./routes/apiKeyRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/certificates', certRoutes);
app.use('/api/institutions', institutionRoutes);
app.use('/api/keys', apiKeyRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
