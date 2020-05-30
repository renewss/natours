const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Catching synchronous errors (exceptions) globally
process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.log('UNCAUGHT EXCEPTION! Shutting down server');

    process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

// const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
const DB = process.env.DATABASE_LOCAL;

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true //required to avoid warning in console
    })
    .then(() => console.log('DB connection successful'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

// Central error(unhandled promise rejection) handling
process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION! Shutting down server');

    server.close(() => {
        process.exit(1);
    });
});
