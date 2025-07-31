const express = require('express');
const {
	createProject,
	getProjects,
	updateProject,
	deleteProject,
} = require('../controllers/project.controller');

const {
	authenticateToken,
	authorizeRoles,
} = require('../middlewares/auth.middleware');

const router = express.Router();

// Public route to list all projects
router.get('/', getProjects);

// Protected: only logged-in users can create
router.post('/', authenticateToken, createProject);

// Only owner or admin can update
router.put('/:id', authenticateToken, updateProject);

// Only owner or admin can delete
router.delete('/:id', authenticateToken, deleteProject);

module.exports = router;
