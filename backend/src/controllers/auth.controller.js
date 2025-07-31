const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
	const prisma = req.app.get('prisma');
	const { name, email, password } = req.body;

	try {
		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) return res.status(400).json({ message: 'Email already exists' });

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
			},
		});

		res.status(201).json({ message: 'User created', user: { id: user.id, name: user.name, email: user.email } });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Signup failed' });
	}
};

const login = async (req, res) => {
	const prisma = req.app.get('prisma');
	const { email, password } = req.body;

	try {
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) return res.status(400).json({ message: 'User not found' });

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

		const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
			expiresIn: '1h',
		});

		res.status(200).json({ token, user: { id: user.id, name: user.name, role: user.role } });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Login failed' });
	}
};

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
	const prisma = req.app.get('prisma');
	const { token } = req.body;

	try {
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		const payload = ticket.getPayload();
		const { email, name } = payload;

		let user = await prisma.user.findUnique({ where: { email } });

		if (!user) {
			user = await prisma.user.create({
				data: {
					name,
					email,
					password: '', // Google users don’t use local password
				},
			});
		}

		const jwtToken = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
			expiresIn: '1h',
		});

		res.json({ token: jwtToken, user: { id: user.id, name: user.name, role: user.role } });
	} catch (err) {
		console.error(err);
		res.status(401).json({ message: 'Google authentication failed' });
	}
};



module.exports = { signup, login, googleLogin };

