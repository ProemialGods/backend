'use strict';

const _ = require('lodash');
const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware');
const pino = require('pino')({ prettyPrint: true });
const authService = require('./services/auth');
const error = require('./services/error');
const userService = require('./services/user');
const config = require('./config');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const serverSocket = require('http').createServer();
const io = require('socket.io')(serverSocket);
io.on('connection', require('./socket'));

// Create Restify server
var server = restify.createServer();

server.use(restify.plugins.queryParser());

server.use(restify.plugins.bodyParser());

// Enable throttling for all requests
server.use(
    restify.plugins.throttle({
        burst: 100,
        rate: 50,
        ip: true
    })
);

// Set CORS parameters, allow access from anywhere for now
var cors = corsMiddleware({
    origins: ['*'],
    allowHeaders: ['Authorization']
});

server.pre(cors.preflight);
server.use(cors.actual);

// Add an [authentication handler](services/auth.js) to execute on each request
server.use((req, res, next) => {
    var route = req.getRoute().name;

    // For login requests, ignore verification and forward to routes
    if (_.includes(['login', 'signup'], route)) {
        return next();
    }

    let token = req.header('Authorization');

    return authService
        .verify(token)
        .then(user => {
            // check whether user session is expired
            return userService.isSessionExpired(user.email, user.tokenId).then(expired => {
                if (expired) return Promise.reject(error.sessionExpired);

                // Store user claims in req.user
                req.user = user;
                return Promise.resolve(next());
            });
        })
        .catch(exception => {
            error.handle(exception, next);
        });
});

// Start socket.io
serverSocket.listen(config.socket.port);


// Start restify server
server.listen(config.port, () => {

    // establish connection to mongodb
    mongoose.connect(config.db.uri, { useNewUrlParser: true }, (err, db) => {

        if (err) {
            pino.error({ err }, 'An error occurred while attempting to connect to MongoDB')
            process.exit(1)
        }

        pino.info('%s listening at %s', server.name, server.url);

        // Define [routes](routes.js)
        require('./route')(server);

    })

})