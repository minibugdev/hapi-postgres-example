'use strict';

import Hapi from 'hapi';
import Routes from './routes';
import { config } from 'dotenv';
config();

const ENV = process.env;
const server = new Hapi.Server();

server.connection({
                      port: 9999
                  });

// .register(...) registers a module within the instance of the API.
// The callback is then used to tell that the loaded module will be used as an authentication strategy.
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

    // We move this in the callback because we want to make sure that the authentication module has loaded before we attach the Routes.
    // It will throw an error, otherwise.
    Routes.forEach((route) => {

        console.log(`attaching ${route.path}`);
        server.route(route);
    });
});

server.start(err => {

    if (err) {
        console.error('Error was handled!');
        console.error(err);
    }

    console.log(`Server started at ${server.info.uri}`);
});