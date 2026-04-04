const router = require('express').Router();
const authors = require('../controllers/authors.js');

router.get('/', authors.findAll);
router.get('/:author_id', authors.findOne);
router.post('/', authors.create);
router.put('/:author_id', authors.update);
router.delete('/:author_id', authors.delete);

module.exports = router;
