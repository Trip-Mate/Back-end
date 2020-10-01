// This db is for the cron server, I left it here because for some reason if
// I used database.js for the cron server it was keep crashing and I couldn't figure it out why.

const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});

		console.log('Mongodb Connected!');
	} catch (error) {
		console.error(error.message);
		process.exit(1);
	}
};

module.exports = connectDB;
