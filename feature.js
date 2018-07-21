const haversine = require('haversine');

const featureWeight = {
    distance: 6,
    speed: 9,
    power: 0,
    intelligent: 0
}

const NORMALIZATION_RANGE = 100;

const overall = (hero) => {
    
    return ((hero.distance * featureWeight.distance) + 
        (hero.speed * featureWeight.speed) + 
        (hero.power * featureWeight.power) + 
        (hero.intelligent * featureWeight.intelligent)) / 
        (4 * NORMALIZATION_RANGE);
}

const haversineDistance = (location, destination) => {
    
    return haversine({
        latitude: location.lat,
        longitude: location.lng
    }, 
    {
        latitude: destination.lat,
        longitude: destination.lng
    }, 
    {unit: 'km'});

    
}

module.exports = {
    overall: overall,
    haversine: haversineDistance
};