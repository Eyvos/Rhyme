//Importing express and creating an instance of it
import express, { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from './middlewares/error';
// import { OpenApiValidator } from 'express-openapi-validator/dist/openapi.validator';

const app = express();

//Importing the body-parser library
app.use(express.json());

// //OpenAPI middleware
// app.use(
//     OpenApiValidator.middleware({
//         apiSpec: './open-api.yaml',
//         ignoreUndocumented: true,
//         validateRequests: true,
//         validateResponses: false,
//     })
// );

//Importing the routers
import { router as authRouter } from './routes/auth';
import { router as userRouter } from './routes/user';
import { router as rhymeRouter } from './routes/rhyme';

//Redirecting the routes to the routers
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/rhymes', rhymeRouter);

//Error handler middleware
app.use(ErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: 'Route not found' });
});

export default app;