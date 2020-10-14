const Rates = require('../models/Rates');


exports.currencyRates = async (req, res) => {

    const {
      baseCurrency, 
      toCurrency,
      date
    } = req.body 
  try {

    // Todo: Finding the date that we need to pass in. 


    // Check if the base currency is euros if its euros we don't have to look for the  another currency. 
    // If not euros. Get both exchange rates and get division.


    // Having to send back the correct rate to the front end. 


        // const rates = await Rates.find({}).exec();
        // res.status(200).json(rates);
        // console.log(rates)
    }catch(err){
      console.error(error.message);
      res.status(500).send('Server error');
    }
}