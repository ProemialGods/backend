const mongoose = require('mongoose');

const user = new mongoose.Schema({
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    sessionIds: [String],
    createdAt: Date
});

const action = new mongoose.Schema({
    lat: Number,
    lng: Number,
    reporter: String,
    attachment: String,
    title: String,
    tag: [String],
    effectedCount: Number,
    assigned: String
});

const hero = new mongoose.Schema({
    name: String,
    lat: Number,
    lng: Number,
    speed: Number,
    power: Number,
    styles: { badgeColor: String, strokeColor: String },
    abilities: [String],
    avatar: String,
    pin: String,
    intelligent: Number,
    status: Number
});

module.exports = {
    user: user,
    action: action,
    hero: hero
}