// src/index.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const testRoutes = require('./routes/test');
const projectRoutes = require('./routes/project');

dotenv.config();

const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api/test', testRoutes);
app.use('/api/projects', projectRoutes);

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
	res.send('API is running 🚀');
});

const PORT = process.env.PORT || 5000;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
app.set('prisma', prisma);

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
