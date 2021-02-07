const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth'); // Importing the middleware (check-auth)
const UserController = require('../controllers/user'); // Importing User Controller

/* 
Here we will have two routes sign up and sign in but no log out because
since we dont store the informantion about logout so we dont store the information
weather the user is locked in or not. we cant log the user out route
*/

router.post('/signup', UserController.user_signup);

router.post('/login', UserController.user_login);

router.delete('/:userID', checkAuth, UserController.user_delete);

module.exports = router;