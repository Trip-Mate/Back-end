const Trip = require('../models/Trip');
const Day = require('../models/Day');

// @route   POST /trips/trip:id/trip-plan
// @desc    Create Days
// @access  Private
exports.createTripDays = async (req, res) => {
	
	try {
        /* Trip Id */
        const data = req.body.id; 
        const trip = await Trip.findById(data);
        console.log('Current Trip', trip);

        /* Check if days array already exist */
        if (trip.days.length !== 0 ) {
            console.log('Days Array already exists', trip.days)
            res.end();
            return
        }

        /* getting info from current trip */
        const { duration, from, countries, days} = trip;
        console.log(duration, from);

        /* Creating Trip Days Array */
        const tripDays = await createTripDays(duration, from, countries[0], days);
        console.log('Creating Days', tripDays);

        await trip.save(function (err) {
            if(err) {
                console.log('Error Saving Trip to the Database', err.message)
            }
        });
        console.log('Updating Trip Data', trip);

        return res.status(200).json(tripDays);

	} catch (error) {
		console.log('Error creating Days', error.message)
	}
};

// @route   GET /trips/trip:id/trip-plan
// @desc    Get Trip Days
// @access  Private
exports.getTripDays = async (req, res) => {
	try {
        const days = await Trip.findById(req.query.id, 'days').populate('days');
        console.log('Getting Days Data', days);

        res.status(201).json(days);
        
	} catch (error) {
		console.error('Error Getting Days', error.message);
	}
};

/* Creating Trip Days Array */
const createTripDays = async (numberOfDays, initialDate, initialCountry, daysArray) => {

    /* Base Case */
    if (numberOfDays < 1) {
        return daysArray;
    }

    let day = new Day({ date: initialDate, country: initialCountry, })
    await day.save(function (err) {
        if(err) {
            console.log('Error Saving Day to the Database', err.message)
        }
    });

    /* Passing Day Ids to Days Array */
    daysArray.push(day._id);

    /* Looping through Days */
    numberOfDays--;
    return createTripDays(numberOfDays, initialDate, initialCountry, daysArray);
};

