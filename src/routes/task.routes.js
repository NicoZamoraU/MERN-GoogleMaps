const express = require('express');
const router = express.Router();
const taskController = require('../controllers/tasks.controller');


router.get('/', taskController.getTasks);
router.post('/', taskController.addTask);
router.get('/:id', taskController.getTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
