const AppError = require('../utils/appError');

const handleCastErrorDb = err => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    //console.log(value);
    return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    console.log(err);

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

// eslint-disable-next-line no-unused-vars
const handleJWTError = err => new AppError('Invalid token! Please login again', 401);

// eslint-disable-next-line no-unused-vars
const handleJWTExpiredError = err => new AppError('Your token has expired! Please login again', 401);

//

const sendErrorDev = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } else {
        res.status(err.statusCode).render('error', { title: 'Something went wrong', msg: err.message });
    }
};

const sendErrroProd = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        // 1) API
        // A) Programming, trusted error: send message to client
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        }
        // B) Programming or other unknown error: don't leak error details
        else {
            // 1) Log error
            console.log('ERROR** ', err);

            // 2) Send generic message
            res.status(500).json({
                status: 'error',
                message: 'Something went very wrong'
            });
        }
    } else {
        // 2) RENDERED WEBSITE
        // A) Programming, trusted error: send message to client
        // eslint-disable-next-line no-lonely-if
        if (err.isOperational) {
            res.status(err.statusCode).render('error', {
                title: 'Something went wrong',
                msg: err.message
            });
        }
        // B) Programming or other unknown error: don't leak error details
        else {
            // 1) Log error
            console.log('ERROR** ', err);

            // 2) Send generic message
            res.status(err.statusCode).render('error', {
                title: 'Something went wrong',
                msg: 'Please try again later'
            });
        }
    }
};

//*******************************************
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;

        if (error.name === 'CastError') error = handleCastErrorDb(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError(error);

        sendErrroProd(error, req, res);
    }
};
