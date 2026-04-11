const router = require('express').Router();
const authors = require('../controllers/authors.js');
const { isAuthenticated } = require('../middlewares/auth');
const { authorsValidationRules, validate } = require('../utils/validators.js');

router.get('/', authors.findAll);
router.get('/:author_id', authors.findOne);
router.post(
  '/',
  isAuthenticated,
  authorsValidationRules(),
  validate,
  authors.create,
);
router.put(
  '/:author_id',
  isAuthenticated,
  authorsValidationRules(),
  validate,
  authors.update,
);
router.delete('/:author_id', isAuthenticated, authors.delete);

module.exports = router;
