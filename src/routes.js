import Knex from "./knex";
import jwt from "jsonwebtoken";
import UUID from "node-uuid";
import { config } from "dotenv";
config();
const ENV = process.env;

// The idea here is simple: export an array which can be then iterated over and each route can be attached.
const routes = [
    {
        path: '/me',
        method: 'GET',
        config: {
            auth: {
                strategy: 'token',
            }
        },
        handler: (request, reply) => {
            const {scope} = request.auth.credentials;
            const getOperation = Knex('users').where({
                uuid: scope
            }).select('uuid', 'name', 'username', 'email').then(([user]) => {
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
            }).catch((err) => {
                reply(`server-side error : ${err}`);
            });
        }
    },
    {
        path: '/auth',
        method: 'POST',
        handler: (request, reply) => {
            // This is a ES6 standard
            const {username, password} = request.payload;
            const getOperation = Knex('users').where({
                username: username
            }).select('uuid', 'password').then(([user]) => {
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
                    const token = jwt.sign({
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
        }
    },
    {
        path: '/register',
        method: 'POST',
        handler: (request, reply) => {
            const uuid = UUID.v4();
            const user = request.payload;

            const insertOperation = Knex('users').insert({
                uuid: uuid,
                name: user.name,
                username: user.username,
                email: user.email,
                password: user.password
            }).then((res) => {
                reply({
                    data: uuid,
                    message: 'successfully created user'
                });

            }).catch((err) => {
                reply(`server-side error : ${err}`);
            });
        }
    },
    {
        path: '/users/{uuid}',
        method: 'PUT',
        config: {
            auth: {
                strategy: 'token',
            },
            pre: [{
                method: (request, reply) => {
                    const {uuid} = request.params;
                    const {scope} = request.auth.credentials;

                    const getOperation = Knex('users').where({
                        uuid: uuid,
                    }).select('uuid').then(([user]) => {
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
                }
            }]
        },
        handler: (request, reply) => {
            const {uuid} = request.params;
            const user = request.payload;

            const updateOperation = Knex('users').where({
                uuid: uuid
            }).update({
                name: user.name
            }).then((res) => {
                reply({
                    message: 'successfully updated user'
                });
            }).catch((err) => {
                reply(`server-side error : ${err}`);
            });
        }
    }];
export default routes;