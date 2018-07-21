'use strict';

const schema = require('../schema');
const mongoose = require('mongoose');
const action = require('./action');
const { overall, haversine } = require('../feature');
const _ = require('lodash');

const heroModel = mongoose.model('heroes', schema.hero);

const hero = {
    get() {
        return heroModel.find().sort({ _id: 1 });
    },
    match() {
        return this.get()
            .then(heroes => {
                return action.get()
                    .then(actions => {

                        let actionHeroMap = [];
                        let matches = [];
                        let matchedHero = [];
                        let matchedAction = [];

                        _.each(actions, action => {
                            _.each(heroes, hero => {
                                hero.distance = haversine({ lat: hero.lat, lng: hero.lng }, { lat: action.lat, lng: action.lng });
                                actionHeroMap = [...actionHeroMap, { action: action.title, hero: hero.name, overall: overall(hero) }];
                            });
                        });
                        
                        
                        actionHeroMap = _.reverse(_.sortBy(actionHeroMap, ['overall']));

                        _.each(actionHeroMap, map => {
                            if(!_.includes(matchedHero, map.hero) && !_.includes(matchedAction, map.action)){
                                matches.push({action: map.action, hero: map.hero});
                                matchedHero.push(map.hero);
                                matchedAction.push(map.action);
                            }
                            
                        })
                        console.log(matches)
                        console.log(matchedHero)
                        return matches;
                        
                        /*let matchedHero = [];
                        for (let action in actionHeroMap) {
                            let hero = '';
                            let maxOverall = 0;

                            _.each(actionHeroMap[action], map => {
                                if (map.overall > maxOverall && !_.includes(matchedHero, map.hero)) {
                                    maxOverall = map.overall;
                                    hero = map.hero;

                                }

                            });

                            if(hero != '' && !_.includes(matchedHero, hero)){
                                matches.push({ action: action, hero: hero });
                                matchedHero.push(hero);
                            }
                            
                        }

                        return matches;*/
                    });

            });
    }
}

module.exports = hero;