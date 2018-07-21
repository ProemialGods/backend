const config = {
    production: {
        port: process.env.PORT || 7788,
        db: {
            uri: 'mongodb://proemial:sanane1@ds141611.mlab.com:41611/proemial'
        },
        socket: {
            port: 3000
        }

    },
    development: {
        port: process.env.PORT || 7788,
        db: {
            uri: 'mongodb://proemial:sanane1@ds141611.mlab.com:41611/proemial'
        },
        socket: {
            port: 3000
        }
    }
}

module.exports = config[process.env.NODE_ENV] || config.development;