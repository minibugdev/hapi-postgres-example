'use strict';

import Knex from '../../knex';

module.exports = function (request, reply) {

    const { scope } = request.auth.credentials;
    const getOperation = Knex('users')
        .where({ uuid: scope })
        .select('uuid', 'name', 'username', 'email')
        .then(([user]) => {

            if (!user) {
                reply({
                          error: true,
                          errMessage: 'the specified user was not found',
                      });

                // Force of habit. But most importantly, we don't want to wrap everything else in an `else` block;
                // better is, just return the control.
                return;
            }

            reply({
                      data: user,
                      message: `Hello ${user.name}`
                  });
        })
        .catch((err) => {

            reply(`server-side error : ${err}`);
        });
};