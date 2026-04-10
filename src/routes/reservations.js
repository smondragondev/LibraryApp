const router = require('express').Router();
const reservations = require('../controllers/reservations.js');
const { isAuthenticated } = require('../middlewares/auth');
const { updateCreateReservationValidation, validate } = require('../utils/validators.js')

router.get('/',reservations.findAll);
router.get('/:reservation_id', reservations.findOne);
router.post('/', isAuthenticated, updateCreateReservationValidation(), validate, reservations.create);
router.put('/:reservation_id', isAuthenticated, updateCreateReservationValidation(), validate, reservations.update);
router.delete('/:reservation_id', isAuthenticated, reservations.delete);

module.exports = router;