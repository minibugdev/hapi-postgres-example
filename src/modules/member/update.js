'use strict';

import Knex from '../../knex';

module.exports.validate = function (request, reply) {

    const { uuid } = request.params;
    const { scope } = request.auth.credentials;
    const getOperation = Knex('users')
        .where({ uuid: uuid })
        .select('uuid')
        .then(([user]) => {

            if (!user) {
                reply({
                          error: true,
                          errMessage: `the user with id ${uuid} was not found`
                      }).takeover();

                return;
            }

            if (user.uuid !== scope) {
                reply({
                          error: true,
                          errMessage: `the user with id ${uuid} is not in the current scope`
                      }).takeover();

                return;
            }

            return reply.continue();
        });
};

module.exports.update = function (request, reply) {

    const { uuid } = request.params;
    const user = request.payload;
    const updateOperation = Knex('users')
        .where({ uuid: uuid })
        .update({ name: user.name })
        .then((res) => {

            reply({
                      message: 'successfully updated user'
                  });
        }).catch((err) => {

            reply(`server-side error : ${err}`);
        });
};