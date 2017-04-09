'use strict';

import { config } from 'dotenv';
config();

const ENV = process.env;

exports.register = (server, options, next) => {
    server.register(require('hapi-auth-jwt'), (err) => {

        if (!err) {
            console.log('registered authentication provider');
        }

        server.auth.strategy('token', 'jwt', {
            key: ENV.JWT_SECRET,
            verifyOptions: {
                algorithms: [ENV.JWT_ALGORITHM],
            }
        });

        server.route({
                         path: '/me',
                         method: 'GET',
                         config: {
                             auth: {
                                 strategy: 'token',
                             }
                         },
                         handler: require('./me')
                     });

        server.route({
                         path: '/auth',
                         method: 'POST',
                         handler: require('./auth')
                     });

        server.route({
                         path: '/register',
                         method: 'POST',
                         handler: require('./register')
                     });

        const update = require('./update');
        server.route({
                         path: '/users/{uuid}',
                         method: 'PUT',
                         config: {
                             auth: {
                                 strategy: 'token',
                             },
                             pre: [{
                                 method: update.validate
                             }]
                         },
                         handler: update.update
                     });

        next();
    });
};

exports.register.attributes = {
    pkg: require('./package.json')
};