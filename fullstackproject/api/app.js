'use strict';

const express = require('express');
const morgan = require('morgan');
const routes = require('./routes');
const cors = require ('cors');
const {sequelize} = require('./models');



// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();
app.use(express.json());

// setup morgan which gives us http request logging
app.use(morgan('dev'));

//Enable CORS
app.use(cors());


//Confirm we can connect with the database
(async () => {
    try {
        console.log(`Attempting to connect to the database...`);
        await sequelize.authenticate();
        console.log('Database connection established');
    } catch (err) {
        console.log(`There was an error connecting to the database: ${err.message}`);
    }
})();

// Setup my API routes
app.use('/api', routes);

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the REST API project!',
    });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
      message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
    if (enableGlobalErrorLogging) {
        console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
    }

    res.status(err.status || 500).json({
        message: err.message,
        error: {},
    });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
    console.log(`Express server is listening on port ${server.address().port}`);
});
