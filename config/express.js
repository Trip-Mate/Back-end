const fs = require('fs');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const config = require('./app');

const corsOptions = {
  origin: config.clientURL || '*',
  optionsSuccessStatus: 200,
};

module.exports = (app) => {
  app.use(cors(corsOptions));

  //Logging with morgan
  const accessLogStream = fs.createWriteStream(
    path.join(__dirname, '../logs/access.log'),
    { flags: 'a' }
  );

  //Create the log string structure for morgan
  app.use(
    morgan(
      ':date[web] :method :url :status :res[content-length] - :response-time ms',
      {
        stream: accessLogStream,
      }
    )
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.get('/', (req, res) => res.send('API running'));
};
