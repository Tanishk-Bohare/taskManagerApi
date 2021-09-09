const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account');

// avatar methods later

const User = require('../models/user')

// @desc Add user
// @route POST /api/v1/users
// @access Public
exports.addUser = async (req, res, next) => {
    try {
        const user = new User(req.body);

        // sendWelcomeEmail(user.email, user.name);
        
        const token = await user.generateAuthToken();
        user.tokens = await user.tokens.concat({ token });
        await user.save();
        res.status(201).json({
            success: true,
            data: user, 
            token
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

// @desc Get user
// @route GET /api/v1/users/me
// @access Private
exports.getUser = async (req, res, next) => {
    res.status(201).json({
        success: true,
        data: req.user
    });
}

// @desc Update user
// @route PATCH /api/v1/users/me
// @access Private
exports.updateUser = async (req, res, next) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = [ 'name', 'email', 'password', 'age'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
        
        if (!isValidOperation) {
            return res.status(400).json({
                success: false,
                error: 'error: Invalid updates!'
            });
        }

        const user= req.user;
        updates.forEach((update) => user[update] = req.body[update]);
        await user.save();
        
        res.status(201).json({
            success: true,
            data: user
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

// @desc Delete user
// @route DELETE /api/v1/user/me
// @access Private
exports.deleteUser = async (req, res, next) => {
    try {

        await req.user.remove();
        sendCancellationEmail(req.user.email, req.user.name);

        res.status(200).json({
            success: true,
            data: req.user
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            error: "Sever Error"
        })
    }
}


// @desc Login user
// @route POST /api/v1/users/login
// @access Public
exports.loginUser = async (req, res, next) => {
    try {

        const user = await User.findByCredentials(req.body.email, req.body.password);

        const token = await user.generateAuthToken();

        user.tokens = user.tokens.concat({ token });
        await user.save();
        
        res.status(201).json({
            success: true,
            data: user, 
            token
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}

// @desc Logout user
// @route POST /api/v1/users/logout
// @access Private
exports.logoutUser = async (req, res, next) => {
    try {

        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        
        await req.user.save();
        
        res.status(201).json({
            success: true
        });
    } catch (err) {
        return res.status(500).json({
            success: false
        })
    }
}

// @desc LogoutAll user
// @route POST /api/v1/users/logoutUserAll
// @access Private
exports.logoutAll = async (req, res, next) => {
    try {

        req.user.tokens = [];
        await req.user.save();
                
        res.status(201).json({
            success: true
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}