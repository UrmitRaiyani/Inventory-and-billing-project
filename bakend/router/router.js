const express = require('express');
const router = express.Router();
const passport = require('passport');

const controller = require('../controller/controllers');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/getallData', passport.authenticate('jwt', { session: false }), controller.getallData);


module.exports = router;