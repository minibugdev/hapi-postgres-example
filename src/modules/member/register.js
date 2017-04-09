'use strict';

import Knex from '../../knex';
import UUID from 'node-uuid';

module.exports = function (request, reply) {

    const uuid = UUID.v4();
    const user = request.payload;
    const insertOperation = Knex('users')
        .insert({
                    uuid: uuid,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    password: user.password
                })
        .then((res) => {

            reply({
                      data: uuid,
                      message: 'successfully created user'
                  });
        }).catch((err) => {

            reply(`server-side error : ${err}`);
        });
};