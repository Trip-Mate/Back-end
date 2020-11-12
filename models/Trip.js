const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
	user: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	title: {
		type: String,
		required: true,
	},
	from: {
		type: Date,
		required: true,
	},
	to: {
		type: Date,
		required: true,
	},
	countries: [],
	baseCurrency: {
		type: String,
		required: true,
	},
	additionalCurrencies: {
		type: Array,
	},
	budget: {
		type: Number,
	},
	backgroundImage: {
		type: String,
	},
	duration : {
		type: Number,
	},
	days: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Day',
		},
	],
	notes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Note'
		}
	]
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
