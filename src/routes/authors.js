const router = require('express').Router();
const authors = require('../controllers/authors.js');
const { isAuthenticated } = require('../middlewares/auth');

router.get('/', authors.findAll);
router.get('/:author_id', authors.findOne);
router.post('/', isAuthenticated, authors.create);
router.put('/:author_id', isAuthenticated, authors.update);
router.delete('/:author_id', isAuthenticated, authors.delete);

module.exports = router;