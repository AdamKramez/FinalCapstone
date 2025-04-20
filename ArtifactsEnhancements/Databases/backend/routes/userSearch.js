/*
this file handles the route for searching publications
it takes a url and returns information about the publication
*/

const express = require('express');
const router = express.Router();
const userSearchController = require('../controllers/userSearchController');

// search for a publication using its url
router.post('/', userSearchController.searchPublicationByUrl);

module.exports = router;