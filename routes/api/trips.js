const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const Trip = require('../../models/Trip');
const User = require('../../models/User');

// @route   POST /trips
// @desc    Create a trip
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Trip title is required').not().isEmpty(),
      check('from', 'Please enter a trip start date').not().isEmpty(),
      check('to', 'Please enter a trip end date').not().isEmpty(),
      check('baseCurrency', 'Please select your base currency').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      user,
      title,
      from,
      to,
      // countries,
      baseCurrency,
      // additionaliCurrencies,
      budget,
      // backgroundImage
    } = req.body;

    const tripFields = {};
    tripFields.user = req.user.id;
    tripFields.title = title;
    tripFields.from = from;
    tripFields.to = to;
    tripFields.baseCurrency = baseCurrency;
    if (budget) tripFields.budget = budget;

    try {
      // Get user based on user_id
      const user = await User.findById(req.user.id);
      if (user) {
        // Create new trip and add trip_id to user trip_id array
        const trip = new Trip(tripFields);
        user.trips.push(trip.id);

        await user.save();
        await trip.save();

        // 201 Created
        return res.status(201).json({
          message: 'Trip created and assigned to user',
          trip: trip,
        });
      }
    } catch (error) {
      console.error(_error.message);
      return res.status(500).send('Server error');
    }
  }
);

// @route   GET /trips
// @desc    Get current users trips
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const trips = await User.findById(req.user.id).populate('trips');
    if (!trips) {
      return res.status(400).json({ msg: 'There are no trips to show' });
    }
    res.status(200).json(trips);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   Get /trips/:id
// @desc    Get a trip by trip ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    // Gets the trip and checks if the logged in user is assigned to that trip
    const trip = await Trip.find({
      user: { $in: req.user.id },
      _id: req.params.id,
    });

    if (trip.length === 0) {
      return res.status(400).json({ msg: 'There is no trip to show' });
    }
    res.status(200).json(trip);
  } catch (error) {
    // Checks if the :id passed in is not a valid ObjectId
    if (error.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'There is no trip to show' });
    }
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route DELETE /trips/:id
// @desc Delete trip and remove tripID from trips array in users
// @access Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // Find the trip and delete it
    const trip = await Trip.find({
      user: { $in: req.user.id },
      _id: req.params.id,
    });
    if (trip.length !== 0) {
      // If the trip was assigned to a user delete trip_id from the array
      await User.updateMany(
        { trips: { $in: req.params.id } },
        { $pull: { trips: { $in: req.params.id } } }
      );
      // 200 OK
      return res.status(200).send('Trip has been deleted');
    }
  } catch (error) {
    // Checks if the :id passed in is not a valid ObjectId
    if (error.kind == 'ObjectId') {
      return res.status(400).json({ msg: "Trip doesn't exsist" });
    }
    console.error(error.message);
    res.status(500).send('Server error');
  }
});
module.exports = router;
