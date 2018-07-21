'use strict';

const featureWeight = {
    distance: 6,
    speed: 9,
    power: 8,
    intelligent: 7
}

(function metrics(){
    let distance = 100 - (100 * (5000 / 40000));console.log(distance)
    let distanceWeight = 7;
    let speed = 90;
    let speedWeight = 9;
    let power = 95;
    let powerWeight = 8
    let intelligent = 70;
    let intelligentWeight = 7;

    let star = ((distance * distanceWeight) + (speed * speedWeight) + (power * powerWeight) + (intelligent * intelligentWeight)) / (4 * 100);
    console.log(star);

})()