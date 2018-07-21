'use strict';

const schema = require('../schema');
const mongoose = require('mongoose');

const actionModel = mongoose.model('actions', schema.action);

const action = {
    get(){
        return actionModel.find();
    }
}

module.exports = action;