const express = require('express');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/protected', authenticateToken, (req, res) => {
	res.json({ message: 'Protected route', user: req.user });
});

router.get('/admin-only', authenticateToken, authorizeRoles('admin'), (req, res) => {
	res.json({ message: 'Admin-only route', user: req.user });
});

module.exports = router;
