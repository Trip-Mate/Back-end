const cron = require('node-cron');
const fetch = require('node-fetch');

const Rates = require('../models/Rates');

exports.fetchDailyExchangeRates = cron.schedule('0 1 * * *', async () => {
	try {
		const res = await fetch(
			`http://data.fixer.io/api/latest?access_key=${process.env.FIXER_ACCESS_KEY}`
		);
		const resJSON = await res.json();
		const rates = new Rates(resJSON);
		await rates.save();

		const date = new Date();
		const formattedDate = date.toLocaleTimeString();
		
		console.log(`${formattedDate} - Rates have been saved!!!`);
	} catch (error) {
		console.log(error);
	}
});
