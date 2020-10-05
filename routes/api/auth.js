const router = require('express').Router();
const { check } = require('express-validator');
const auth = require('../../middleware/auth');

const {
	authRoute,
	authUser,
} = require('../../controllers/controller-auth');

// Validation
const checkOnAuthCredentials = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
];

//////////////
/// ROUTES ///
//////////////
router.get('/', auth, authRoute);
router.post('/', checkOnAuthCredentials, authUser);

module.exports = router;
