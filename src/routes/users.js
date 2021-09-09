const express = require('express')
const router = express.Router()
const auth = require ('../middleware/auth');
const { addUser, getUser, updateUser, deleteUser,
        getAvatar, addAvatar, deleteAvatar, 
        loginUser, logoutUser, logoutAll } = require('../controllers/users')

router
    .route('/')
    .post(addUser)

router
    .route('/me')
    .get(auth, getUser)
    .patch(auth, updateUser)
    .delete(auth, deleteUser)

// router
//     .route('/me/avatar')
//     .get(getAvatar)
//     .post(addAvatar)
//     .delete(deleteAvatar)

router
    .route('/login')
    .post(loginUser)

router
    .route('/logout')
    .post(auth, logoutUser)

router
    .route('/logoutAll')
    .post(auth, logoutAll)

module.exports = router
