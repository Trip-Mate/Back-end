const router = require('express').Router();
const { check } = require('express-validator');
const auth = require('../../middleware/auth');

const {
	createTrip,
	getCurrentTrip,
	getTripById,
	deleteTrip,
} = require('../../controllers/controller-trips');

const {
	createNote,
	updateNote,
	deleteNote
} = require('../../controllers/controller-notes');

// Validation
const checkOnTripFields = [
	auth,
	[
		check('title', 'Trip title is required').not().isEmpty(),
		check('from', 'Please enter a trip start date').not().isEmpty(),
		check('to', 'Please enter a trip end date').not().isEmpty(),
		check('baseCurrency', 'Please select your base currency').not().isEmpty(),
	],
];

//////////////
/// ROUTES ///
//////////////
// TODO: Put authentication back after new trip function is complete
router.post('/', /*checkOnTripFields,*/ auth, createTrip);
router.get('/', auth, getCurrentTrip);

router.get('/:id', auth, getTripById);
router.delete('/:id', auth, deleteTrip);

router.post('/:id/notes', auth, createNote);
router.patch('/:id/notes/:noteId', auth, updateNote)
router.delete('/:id/notes/:noteId', auth, deleteNote)

module.exports = router;
