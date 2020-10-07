const { validationResult } = require('express-validator');

const Unsplash = require('unsplash-js').default;

const toJson = require('unsplash-js').toJson;

const Trip = require('../models/Trip');
const User = require('../models/User');
const Countries = require('../models/Countries');

const config = require('../config/app');
const fetch = require('node-fetch');

global.fetch = fetch;

const unsplash = new Unsplash({
	accessKey: config.unsplash.accessKey,
	secret: config.unsplash.secretKey,
});

// @route   POST /trips
// @desc    Create a trip
// @access  Private
exports.createTrip = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Getting necessary info 
        const backgroundImage = await addPhotoURL(req.body.countries);
        const additionalCurrencies = await addAdditionalCurrencies(
            req.body.countries,
            req.body.baseCurrency
        );

        let {
            user,
            title,
            from,
            to,
            countries,
            baseCurrency,
            budget,
        } = req.body;

        // Preapring the trip
        const tripFields = {};
        tripFields.user = user._id;
        tripFields.title = title;
        tripFields.from = from;
        tripFields.to = to;
        tripFields.countries = countries;
        tripFields.baseCurrency = baseCurrency;
        tripFields.additionalCurrencies = additionalCurrencies;
        tripFields.backgroundImage = backgroundImage;
        if (budget) tripFields.budget = budget;

        // Get user based on user id
    const newUser = await User.findById(tripFields.user);

        if (newUser) {
            // Create new trip and add trip ID to user
            const trip = new Trip(tripFields);
            newUser.trips.push(trip.id);

            await newUser.save();
            await trip.save();

            // 201 Created
            return res.status(201).json({
                message: 'Trip created and assigned to user',
                trip,
            });
        }
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Server error');
    }
};

// @route   GET /trips
// @desc    Get current users trips
// @access  Private
exports.getCurrentTrip = async (req, res) => {
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
};

// @route   Get /trips/:id
// @desc    Get a trip by trip ID
// @access  Private
exports.getTripById = async (req, res) => {
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
};

// @route DELETE /trips/:id
// @desc Delete trip and remove tripID from trips array in users
// @access Private
exports.deleteTrip = async (req, res) => {
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
};

// Add additional currencies based on the countries
const addAdditionalCurrencies = async (countries, baseCurrency) => {
	// The array to be populated with currencies from the countries
	const currencies = [];

	try {
		// List the countries that has in the trip to get the currencies later on
		const countryList = await Countries.find({ name: { $in: countries } });

		console.log(countryList)
		for (let i = 0; countryList.length > i; i++) {
			countryList[i].currency.forEach((currency) => {
				// Checks if the currency is already in the array or it's the base currency
				if (currencies.includes(currency) || currency === baseCurrency) {
					return;
				}
				currencies.push(currency);
			});
		}
		console.log(currencies)
		return currencies;
	} catch (err) {
		console.error(err);
	}
};

// Gets a random image from unsplash to populate the trip backgroundImage field
const addPhotoURL = async (countries) => {
  try {
		// Get all the countries with given IDs
		const countryList = await Countries.find({ name: { $in: countries } });
		// Get random photo from unsplash with the first country name from the trip
		const URL = await unsplash.photos
			.getRandomPhoto({
				query: countryList[0].name,
				orientation: 'landscape',
				// Don't include nudity or violence
				content_filter: 'low',
			})
			.then(toJson)
			.then((json) => {
				// Pick the small size image
				const URL = json.urls.small;
				console.log(URL)
				return URL;
			});
		return URL;
	} catch (error) {
		console.log(error);
	}
};
