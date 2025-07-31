// src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) return res.status(401).json({ message: 'No token provided' });

	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err) return res.status(403).json({ message: 'Invalid token' });

		req.user = user; 
		next();
	});
};

const authorizeRoles = (...roles) => {
	return (req, res, next) => {
		if (!req.user || !roles.includes(req.user.role)) {
			return res.status(403).json({ message: 'Forbidden: insufficient role' });
		}
		next();
	};
};

module.exports = {
	authenticateToken,
	authorizeRoles,
};
