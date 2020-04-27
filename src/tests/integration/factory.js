const { factory } = require('factory-girl');
const User = require('../../models/User');

factory.define('User', User, {
    email: factory.sequence('User.email', n => `fakeuser${n}@mail.com`),
    name: factory.chance('name'),
    password: factory.chance('word')
});

module.exports = factory; 