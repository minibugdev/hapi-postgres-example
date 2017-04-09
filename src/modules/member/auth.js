'use strict';

import JWT from 'jsonwebtoken';
import Knex from '../../knex';
import { config } from 'dotenv';
config();

const ENV = process.env;

module.exports = function (request, reply) {

    // This is a ES6 standard
    const { username, password } = request.payload;
    const getOperation = Knex('users')
        .where({ username: username })
        .select('uuid', 'password')
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

            // Honestly, this is VERY insecure. Use some salted-hashing algorithm and then compare it.
            if (user.password === password) {
                const token = JWT.sign(
                    {
                        // You can have anything you want here.
                        // ANYTHING. As we'll see in a bit, this decoded token is passed onto a request handler.
                        username,
                        scope: user.uuid,

                    }, ENV.JWT_SECRET, {
                        algorithm: ENV.JWT_ALGORITHM,
                        expiresIn: '1h',
                    });

                reply({
                          token,
                          scope: user.uuid,
                      });
            }
            else {
                reply('incorrect password');
            }
        }).catch((err) => {

            reply(`server-side error : ${err}`);
        });
};
