const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { useLogger } = require('./utils/logger');
const { useSecurity } = require('./middleware/security');
const { useCors } = require('./config/cors');
const issueRoutes = require('./routes/issueRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Core middleware
useLogger(app);
useSecurity(app);
useCors(app);

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static uploads
const uploadsPath = path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Routes
app.use('/api/issues', issueRoutes);

// Health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Errors
app.use(notFound);
app.use(errorHandler);

module.exports = app;
