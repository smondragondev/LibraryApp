const routes = require('express').Router();
const authors = require('./authors');
const swagger = require('./swagger');
const contacts = require('./contacts');
const books = require('./books');
const staff = require('./staff');
const reservations = require('./reservations');

routes.get('/', (req, res) => {
  res.status(200).send({
    message:
      'Welcome to the Library API. Please refer to /api-docs for available endpoints.',
  });
});
routes.use('/api-docs', swagger);
routes.use('/authors', authors);
routes.use('/contacts', contacts);
routes.use('/books', books);
routes.use('/staff', staff);
routes.use('/reservations', reservations);

module.exports = routes;
