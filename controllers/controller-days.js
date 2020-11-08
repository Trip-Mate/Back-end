const Trip = require('../models/Trip');
const Day = require('../models/Day');

// @route   POST /trips/trip:id/trip-plan
// @desc    Create Days
// @access  Private
exports.createTripDays = async (req, res) => {
	
	try {
        /* Trip Id */
        const { id } = req.body; 
        const trip = await Trip.findById(id);

        /* Check if days array already exist */
        if (trip.days.length !== 0 ) {
            res.send(trip);
            return
        }

        /* getting info from current trip */
        const { duration, from, days} = trip;

        /* Creating Trip Days Array */
        await createTripDays(duration, from, days);

        await trip.save(function (err) {
            if(err) {
                console.log('Error Saving Trip to the Database', err.message)
            }
        });

        return res.status(201).json(trip);

	} catch (error) {
        res.status(500).send('Something went wrong 😕')
	}
};

// @route   GET /trips/trip:id/trip-plan
// @desc    Get Trip Days
// @access  Private
exports.getTripDays = async (req, res) => {
	try {
        const { id } = req.query;

        const days = await Trip
            .findById(id, 'days')
            .populate('days');

        res.status(200).json(days);
        
	} catch (error) {
        res.status(500).send('Something went wrong 😕')
	}
};

/* Creating Trip Days Array */
const createTripDays = async (numberOfDays, initialDate, daysArray = []) => {

    /* Base Case */
    if (numberOfDays < 1) {
        return daysArray;
    }

    let day = new Day({ date: initialDate });
    await day.save(function (err) {
        if(err) {
            console.log('Error Saving Day to the Database', err.message)
        }
    });

    /* Passing Day Ids to Days Array */
    daysArray.push(day._id);

    /* Looping through Days */
    numberOfDays--;
    return createTripDays(numberOfDays, initialDate, daysArray);
};

