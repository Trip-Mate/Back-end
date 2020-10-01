const mongoose = require('mongoose');
const config = require('./app');

const connect = async () => {
  try {
    await mongoose.connect(config.mongodbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    return console.log('Mongodb connected!');
  } catch (err) {
    console.log('Error connecting to database: ', err);
    return process.exit(1);
  }
};

mongoose.connection.on('disconnected', connect);

module.exports = connect();
