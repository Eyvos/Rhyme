//Importing express and creating an instance of it
const express = require('express');
const app = express();

//Importing the body-parser library
app.use(express.json());

//Importing the express-openapi-validator library to validate the OpenAPI specification
const OpenApiValidator = require('express-openapi-validator');

//OpenAPI middleware
app.use(
    OpenApiValidator.middleware({
        apiSpec: './open-api.yaml',
        ignoreUndocumented: true,
        validateRequests: true,
        validateResponses: false,
    })
);
//Error handler middleware
app.use((err, req, res, next) => {
    // format errors
    res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors,
    });
});

//Importing the routers
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const rhymeRouter = require('./routes/rhyme');


//Redirecting the routes to the routers
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/rhymes', rhymeRouter);

module.exports = app;
