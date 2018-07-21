'use strict';

function socket(client){
    client.on('event', data => {
        handle(client, data);
    });
}

function handle(client, data){
    client.emit('event', 'message');
}

module.exports = socket;