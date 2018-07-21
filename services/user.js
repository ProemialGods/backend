'use strict';

const schema = require('../schema');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const userModel = mongoose.model('user', schema.user);

var user = {
    getUser(email) {
        return userModel.findOne({
            email: email
        });
    },
    getSession(email) {
        return userModel.findOne({
            email: email
        }).then(user => {
            if (user.sessionIds) {
                return user.sessionIds;
            } else {
                return false;
            }
        });
    },
    // Update user's sessions
    updateSession(email, sessionId) {
            return userModel.update({ email: email }, { $push: { sessionIds: sessionId } });
    },
    // Check whether user session is expired
    isSessionExpired(email, sessionId) {
        return user.getSession(email).then(session => {

            if (_.includes(session, sessionId)) {
                return false;
            }
            return true;
        });
    },
    // Remove current user session
    removeSession(email, sessionId) {
        return user.getSession(email).then(session => {
            session = session.split(',');

            session = _.join(_.filter(session, _sessionId => _sessionId !== sessionId), ',');

            return userModel.update({ email: email }, session);
        });
    },
    // Create new user
    createUser(user) {
        return bcrypt.hash(user.password, 8).then(function (hash) {
            user.password = hash;
            let newUser = new userModel(user);
            return newUser.save();
        });
    }
};

module.exports = user;
