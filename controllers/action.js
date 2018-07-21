'use strict';

const Promise = require('bluebird');
const faker = require('faker');

const action = {
    generate(){
        let generatedActions = []
        for(let i = 0; i < faker.random.number(5); i++){
            generatedActions.push(createFakeAction());
        }
        return Promise.resolve(generatedActions);
        function createFakeAction(){
            return {
                lat: faker.address.latitude(),
                lng: faker.address.longitude(),
                reporter: faker.name.findName(),
                title: faker.name.title(),
                attachment: '',
                effectedCount: faker.random.number(1000)
            }
        }
    }
}

module.exports = action;