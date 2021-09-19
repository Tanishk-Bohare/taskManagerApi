const Task = require('../models/task')

// @desc Add task
// @route POST /api/v1/tasks
// @access Private
exports.addTask = async (req, res, next) => { 
    try {
        console.log(req.body)
        const task = new Task({
            ...req.body,
            owner: req.user._id
        })
        const newtask = await task.save();
        
        res.status(201).json({
            success: true,
            data: newtask
        });
    } catch (err) {
        if(err.name === 'ValidationError'){
            const message = Object.values(err.errors).map(val => val.message)
            return res.status(400).json({
                success: false,
                error: message
            })
        }
        else {
            return res.status(500).json({
                success: false,
                error: 'Server Error'
            })
        }
    }
}

// @desc Get tasks
// @route GET /api/v1/tasks
// @access Private
exports.getTasks = async (req, res, next) => {
    
    const match = {};
    const sort = {};

    if (req.query.completed) {
        match.completed = req.query.completed === 'true';
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split('_');
        sort[parts[0]] = parts[1]==='desc'?-1:1; 
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.status(201).json({
            success: true,
            data: req.user.tasks
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
}

// @desc Update task
// @route PATCH /api/v1/tasks/id
// @access Private
exports.updateTask = async (req, res, next) => {
    try {

        const updates = Object.keys(req.body);
        const allowedUpdates = [ 'completed', 'description'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send('error: Invalid updates!');
        }

        const task = await Task.findOne({_id: req.params.id, owner: req.user._id});

        if (!task) {
            res.status(404).json({
                success: false,
                error: 'Task not found!'
            });
        } 

        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();
        
        res.status(201).json({
            success: true,
            data: task
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}

// @desc Delete task
// @route DELETE /api/v1/tasks/id
// @access Private
exports.deleteTask = async (req, res, next) => {
    try {

        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});
        if (!task) {
            return res.status(404).json({
                success: false,
                error: 'Task not found!'
            });
        }

        res.status(200).json({
            success: true,
            data: task
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            error: "Sever Error"
        })
    }
}


// @desc Get task
// @route GET /api/v1/tasks/id
// @access Public
exports.getTask = async (req, res, next) => {
    try {
        const _id = req.params.id;
        
        const task = await Task.findOne({_id, owner: req.user._id});

        if (!task) {
            return res.status(404).json({
                success: false,
                error: 'Task not found!'
            });
        }

        res.status(201).json({
            success: true,
            data: task 
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}
