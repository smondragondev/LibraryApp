const routes = require('express').Router();
const authors = require('./authors');
const swagger = require('./swagger');

routes.get('/', (req, res) => {
  res.status(200).send({
    message:
      'Welcome to the Library API. Please refer to /api-docs for available endpoints.',
  });
});
routes.use('/authors', authors);
routes.use('/api-docs', swagger);
module.exports = routes;
