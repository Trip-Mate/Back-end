const router = require('express').Router();
const { check } = require('express-validator');
const auth = require('../../middleware/auth');
const {
	registerUser,
	deleteUser,
	forgotPassword,
	resetPassword,
	updateUser
} = require('../../controllers/controller-user');

// Validation
//TODO: validation including checking for errors should be middleware module
const checkOnRegister = [
	check('name', 'Name is required').not().isEmpty(),
	check('email', 'Please include a valid email').isEmail(),
	check(
		'password',
		'Please enter a password with 8 or more characters'
	).isLength({ min: 8 }),
];

//////////////
/// ROUTES ///
//////////////
router.post('/', checkOnRegister, registerUser);
router.post('/delete', auth, deleteUser);
router.post('/forgot', forgotPassword);
router.post('/reset', resetPassword);
router.patch('/:user_id', updateUser);

module.exports = router;

