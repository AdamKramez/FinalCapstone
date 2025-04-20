/*
this file handles all the authentication-related routes
like user registration and login
these routes don't require authentication to access
*/

const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// create a new user account
router.post('/register', registerUser);

// log in an existing user
router.post('/login', loginUser);

module.exports = router;
