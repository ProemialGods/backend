'use strict';

const restErrors = require('restify-errors');
const pino = require('pino')({prettyPrint: true});

const error = {
    unauthorized: 'Access denied',
    accessTokenGenerationFailed: 'Unable to generate access token',
    invalidToken: 'Invalid token',
    loginFailed: 'Incorrect username or password',
    sessionExpired: 'Session expired',
    internalError: 'Internal error',
    signupFailed: 'Email is already registered',
    incorrectParameters: 'Incorrect parameters',

    // Generic error handler
    handle(exception /*: string */, next /*: any */) {
        switch (exception) {
            case error.unauthorized:
                pino.error(exception);
                next(new restErrors.UnauthorizedError(exception));
                break;
            case error.accessTokenGenerationFailed:
                pino.error(exception);
                next(new restErrors.BadRequestError(exception));
                break;
            case error.invalidToken:
                pino.error(exception);
                next(new restErrors.ForbiddenError(exception));
                break;
            case error.sessionExpired:
                pino.error(exception);
                next(new restErrors.UnauthorizedError(exception));
                break;
            default:
                pino.error(exception);
                next(new restErrors.InternalServerError(error.internalError));
        }
    }
};

module.exports = error;
