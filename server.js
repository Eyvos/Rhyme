const dataAccess = require('./DB/DataAccess');
const express = require('express');

const port = 3000;
const app = express();

app.use(express.json());

const authRouter = require('./routes/authRouter');

app.use('/auth', authRouter);

app.listen(port, () => {
    console.log('Server is running on port 3000');
});