const userRoute = require('./api/users');
const authRoute = require('./api/auth');
const tripRoute = require('./api/trips');

module.exports = (app) => {
  app.use('/users', userRoute);
  app.use('/auth', authRoute);
  app.use('/trips', tripRoute);
};
