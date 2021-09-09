const express = require('express')
const router = express.Router()
const auth = require ('../middleware/auth');
const { addTask, getTasks, updateTask, deleteTask, getTask} = require('../controllers/tasks')

router
    .route('/')
    .post(auth, addTask)
    .get(auth, getTasks)

router
    .route('/:id')
    .get(auth, getTask)
    .patch(auth, updateTask)
    .delete(auth, deleteTask)

module.exports = router
