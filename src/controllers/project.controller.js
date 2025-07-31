const createProject = async (req, res) => {
	const prisma = req.app.get('prisma');
	const { title, description } = req.body;
	const userId = req.user.userId;

	try {
		const project = await prisma.project.create({
			data: {
				title,
				description,
				ownerId: userId,
			},
		});
		res.status(201).json(project);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Failed to create project' });
	}
};

const getProjects = async (req, res) => {
	const prisma = req.app.get('prisma');
	try {
		const projects = await prisma.project.findMany({
			include: { owner: { select: { id: true, name: true, email: true } } },
		});
		res.json(projects);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Failed to fetch projects' });
	}
};

const updateProject = async (req, res) => {
	const prisma = req.app.get('prisma');
	const userId = req.user.userId;
	const userRole = req.user.role;
	const { id } = req.params;
	const { title, description } = req.body;

	try {
		const project = await prisma.project.findUnique({ where: { id: parseInt(id) } });

		if (!project) return res.status(404).json({ message: 'Project not found' });

		if (project.ownerId !== userId && userRole !== 'admin') {
			return res.status(403).json({ message: 'Forbidden: not the owner or admin' });
		}

		const updated = await prisma.project.update({
			where: { id: parseInt(id) },
			data: { title, description },
		});

		res.json(updated);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Failed to update project' });
	}
};

const deleteProject = async (req, res) => {
	const prisma = req.app.get('prisma');
	const userId = req.user.userId;
	const userRole = req.user.role;
	const { id } = req.params;

	try {
		const project = await prisma.project.findUnique({ where: { id: parseInt(id) } });

		if (!project) return res.status(404).json({ message: 'Project not found' });

		if (project.ownerId !== userId && userRole !== 'admin') {
			return res.status(403).json({ message: 'Forbidden: not the owner or admin' });
		}

		await prisma.project.delete({ where: { id: parseInt(id) } });

		res.setHeader('X-App-Check', 'vtask2901');
		res.status(204).send(); // No content
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Failed to delete project' });
	}
};

module.exports = {
	createProject,
	getProjects,
	updateProject,
	deleteProject,
};
