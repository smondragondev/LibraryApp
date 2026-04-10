const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staff');
const { isAuthenticated } = require('../middlewares/auth');

router.get('/', staffController.getAll);
router.get('/:id', staffController.getSingle);
router.post('/', isAuthenticated, staffController.createStaff);
router.put('/:id', isAuthenticated, staffController.updateStaff);
router.delete('/:id', isAuthenticated, staffController.deleteStaff);


module.exports = router;