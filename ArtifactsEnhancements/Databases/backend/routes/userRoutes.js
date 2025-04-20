/*
this file handles all the routes related to user actions
like saving articles and getting user info
all routes here require authentication
*/

const express = require('express');
const router = express.Router();
const { saveArticle, getUserById } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// save an article to user's collection
router.post('/save-article', authMiddleware, saveArticle);

// get user info by their id
router.get('/user/:id', authMiddleware, getUserById);

module.exports = router;
