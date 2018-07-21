
const userService = require('./services/user');
const authService = require('./services/auth');
const error = require('./services/error');
const bcrypt = require('bcrypt');
const pino = require('pino')({ prettyPrint: true });
const restErrors = require('restify-errors');
const init = require('./controllers/init');
const actionController = require('./controllers/action');

function routes(server) {

    // Login
    server.post({ path: '/login', name: 'login' }, (req, res, next) => {
        var credentials = req.body;

        userService
            .getUser(credentials.email)
            .then(user => {
                // check whether user email and password is valid
                if (user) {
                    return bcrypt.compare(credentials.password, user.password).then(result => {
                        if (result) {
                            var claim = {
                                email: user.email
                            };

                            // Create token
                            return authService.sign(claim).then(signature => {
                                // check whether user's session is expired
                                return userService
                                    .updateSession(user.email, signature.tokenId)
                                    .then(() => {
                                        res.send({ token: signature.token });
                                        return next();
                                    });
                            });
                        }
                        pino.info(error.loginFailed);
                        res.send(new restErrors.UnauthorizedError(error.loginFailed));
                        return next();
                    });
                } else {
                    pino.info(error.loginFailed);
                    res.send(new restErrors.UnauthorizedError(error.loginFailed));
                    return next();
                }
            })
            .catch(exception => {
                error.handle(exception, next);
            });
    });

    // Logout
    server.post({ path: '/logout', name: 'logout' }, (req, res, next) => {
        var user = req.user;

        userService
            .removeSession(user.email, user.tokenId)
            .then(() => {
                res.send(200);
                next();
            })
            .catch(exception => {
                error.handle(exception, next);
            });
    });

    // Sign-up
    server.post({ path: '/signup', name: 'signup' }, (req, res, next) => {
        var user = req.body;

        userService
            .getUser(user.email)
            .then(existingUser => {
                // check whether user is already registered
                if (!existingUser) {
                    return userService.createUser(user).then(() => {
                        res.send(200);
                        return next();
                    });
                }
                pino.info(error.signupFailed);
                res.send(new restErrors.ConflictError(error.signupFailed));
                return next();
            })
            .catch(exception => {
                error.handle(exception, next);
            });
    });

    server.get({ path: '/init', name: 'init' }, (req, res, next) => {
        return init()
            .then(response => {
                res.send(200, response);
                return next();
            })
            .catch(exception => {
                error.handle(exception, next);
            });
        
    });

    server.get({ path: '/generate-action'}, (req, res, next) => {
        return actionController.generate()
            .then(response => {
                return res.send(200, response);
                next();
            });
    });

}

module.exports = routes;