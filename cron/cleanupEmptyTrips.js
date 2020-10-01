const cron = require('node-cron');
const Trip = require('../models/Trip');

exports.cleanupEmptyTrips = cron.schedule('0 1 * * *', async () => {
	try {
    await Trip.deleteMany({ user: { $exists: true, $size: 0 } });
    
    const date = new Date();
    const formattedDate = date.toLocaleTimeString();

    console.log(`${formattedDate} - Trips with no user asigned were deleted!!!`);
	} catch (error) {
		console.log(error);
	}
});
