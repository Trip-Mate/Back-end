const app = require('express');
const router = app.Router();
const auth = require('../../middleware/auth');

const {
    createTripDays,
    getTripDays,
} = require('../../controllers/controller-days');

router.post('/trip-plan', auth, createTripDays);
router.get('/trip-plan', auth, getTripDays);

module.exports = router;

