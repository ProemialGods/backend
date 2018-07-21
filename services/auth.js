'use strict';

var moment = require('moment-timezone');
var _ = require('lodash');
var Promise = require('bluebird');
var jwt = require('jsonwebtoken');
var error = require('./error');
const uuidV4 = require('uuid/v4');

const key = 'AAAAB3NzaC1yc2EAAAADAQABAAABAQC5Jeeoz4um1RvDx6i0dKIm6JmO';

var auth = {
    // Sign user information and return access token, if occurs any exception return malformed login error
    sign(userClaims) {
        return new Promise((resolve, reject) => {
            var registeredClaims = auth.createRegisteredClaims();

            var payload = {userClaims, ...registeredClaims};

            jwt.sign(payload, key, {algorithm: 'HS256'}, (err, token) => {
                if (err) {
                    return reject(error.accessTokenGenerationFailed);
                }

                return resolve({
                    token: token,
                    tokenId: registeredClaims.jti
                });
            });
        });
    },
    // If access token is verified return decoded payload, otherwise return invalid token error
    verify(header /*: string*/) {
        return new Promise((resolve, reject) => {
            //check authorization header formatted correctly
            var match = header ? header.match(/^Bearer\s+(.+)$/) : '';

            if (!match) {
                return reject(error.invalidToken);
            }

            var token = _.last(match);

            jwt.verify(token, key, (err, payload) => {
                if (err) {
                    return reject(error.invalidToken);
                }

                var claims = payload.userClaims;
                var tokenId = payload.jti;

                return resolve({...claims, tokenId});
            });
        });
    },
    // Create registered claims
    createRegisteredClaims() {
        var now = moment.utc();
        var exp = moment.utc().add(1, 'month');

        return {
            exp: Math.floor(exp / 1000), //expiration for a month
            iat: Math.floor(now / 1000),
            jti: uuidV4()
        };
    }
};

module.exports = auth;
