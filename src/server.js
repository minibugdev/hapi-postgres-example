'use strict';

import Glue from 'glue';

const manifest = {
    connections: [
        {
            port: 9999
        }
    ],
    registrations: [
        {
            plugin: {
                register: './member'
            }
        }
    ]
};

const options = {
    relativeTo: __dirname + '/modules'
};

Glue.compose(manifest, options, (err, server) => {

    if (err) {
        throw err;
    }

    server.start(() => {

        console.log(`Server started at ${server.info.uri}`);
    });
});