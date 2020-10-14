const router = require('express').Router();
const { check } = require('express-validator');
const auth = require('../../middleware/auth');

const { currencyRates } = require('../../controllers/controller-rates');

//validation
const checkOnRatesFields = [
	auth,
	[check('rate', 'rates is required').not().isEmpty()],
];
router.get('/rates', checkOnRatesFields, currencyRates);

module.exports = router;
