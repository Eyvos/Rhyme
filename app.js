//Importing express and creating an instance of it
const express = require('express');
const app = express();

//Importing the body-parser library
app.use(express.json());

//Importing the express-openapi-validator library to validate the OpenAPI specification
const OpenApiValidator = require('express-openapi-validator');
const error = require('./middlewares/error');

//OpenAPI middleware
app.use(
    OpenApiValidator.middleware({
        apiSpec: './open-api.yaml',
        ignoreUndocumented: true,
        validateRequests: true,
        validateResponses: false,
    })
);

//Importing the routers
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const rhymeRouter = require('./routes/rhyme');
const e = require('express');


//Redirecting the routes to the routers
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/rhymes', rhymeRouter);

//Error handler middleware
app.use(error);

app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

module.exports = app;
