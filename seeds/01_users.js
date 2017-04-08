exports.seed = function seed(knex, Promise) {
    const tableName = 'users';
    const rows = [
        // You are free to add as many rows as you feel like in this array.
        // Make sure that they're an object containing the following fields:
        {
            uuid: 'f03ede7c-b121-4112-bcc7-130a3e87988c',
            name: 'Teeranai',
            username: 'teeranai',
            password: '11111111',
            email: 'minibugdev@gmail.com'
        }
    ];


    return knex(tableName)
        .del() // Empty the table (DELETE)
        .then(function () {
            return knex.insert(rows).into(tableName);
        });
};