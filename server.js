const express = require('express');
const config = require('./config/app');
const app = express();

// Connect database
require('./config/database');

// Configure express + middleware
require('./config/express')(app);

// Define routes
require('./routes/routes')(app);

require('./config/cronJob');

app.listen(config.port, () =>
  console.log(
    'Server started on port: ',
    config.port,
    'Running as: ',
    config.env
  )
);
