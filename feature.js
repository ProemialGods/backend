const haversine = require('haversine');

const featureWeight = {
    distance: 2,
    speed: 9,
    power: 1,
    intelligent: 1
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