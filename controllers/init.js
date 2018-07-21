'use strict';

const actionService = require('../services/action');
const heroService = require('../services/hero');
const Promise = require('bluebird');
const _ = require('lodash');

function init() {

    return Promise.all([heroService.get(), actionService.get(), heroService.match()])
        .then(([heroes, actions, matches]) => {
            
            actions = _.map(actions, action => {

                let matchedHero = _.find(matches, match => match.action == action.title);
                action.assigned = matchedHero ? matchedHero.hero : null;
                
                return action;
            });

            return {
                heroes: heroes,
                actions: actions
            };
        });
}

module.exports = init;