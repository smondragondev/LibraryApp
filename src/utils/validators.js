const { body, validationResult } = require('express-validator');
const { getBookById } = require('../models/book');
const { getUserById } = require('../models/contact');
// Add the validators for each schema
const updateCreateReservationValidation = () => {
  return [
    body('book_id')
      .notEmpty()
      .withMessage('It should be not Empty')
      .trim()
      .escape()
      .isString()
      .custom(async (book_id) => {
        const book = await getBookById(book_id);
        if (!book) {
          throw new Error('The book does not exist');
        }
        return true;
      }),
    body('contact_id')
      .notEmpty()
      .withMessage('It should be not Empty')
      .trim()
      .escape()
      .isString()
      .custom(async (contact_id) => {
        const contact = await getUserById(contact_id);
        if (!contact) {
          throw new Error('The book does not exist');
        }
        return true;
      }),
    body('issuedDate')
      .notEmpty()
      .withMessage('It should be not Empty')
      .trim()
      .escape()
      .isDate(),
    body('returnedDate')
      .notEmpty()
      .withMessage('It should be not Empty')
      .trim()
      .escape()
      .isDate(),
    body('status')
      .trim()
      .escape()
      .isString()
      .custom((status) => {
        if (status === '') return true;
        if (
          status !== 'active' &&
          status !== 'returned' &&
          status !== 'overdue'
        ) {
          throw new Error(
            'Please use a correct status: pending, completed or canceled',
          );
        }
        return true;
      }),
  ];
};

const authorsValidationRules = () => {
  return [
    body('firstName')
      .isString()
      .withMessage('First name must be a string')
      .notEmpty()
      .withMessage('First name is required'),
    body('lastName')
      .isString()
      .withMessage('Last name must be a string')
      .notEmpty()
      .withMessage('Last name is required'),
    body('pseudonym')
      .isString()
      .withMessage('Pseudonym must be a string')
      .optional(),
    body('birthDate')
      .isString()
      .withMessage('Birth date must be a string')
      .optional(),
    body('deathDate')
      .isString()
      .withMessage('Death date must be a string')
      .optional(),
    body('nationality')
      .isString()
      .withMessage('Nationality must be a string')
      .optional(),
    body('mainGenre')
      .isString()
      .withMessage('Main genre must be a string')
      .optional(),
    body('books')
      .isArray()
      .withMessage('Books must be an array')
      .notEmpty()
      .withMessage('At least one book is required'),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = {
  validate,
  updateCreateReservationValidation,
  authorsValidationRules,
};
