const { validationResult, body, param } = require('express-validator');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation Error',
      details: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// Validation rules for Income
const validateIncome = [
  body('source')
    .trim()
    .notEmpty()
    .withMessage('Source is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Source must be between 2 and 100 characters'),
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),
  body('currency')
    .isIn(['LKR', 'USD', 'EUR'])
    .withMessage('Currency must be LKR, USD, or EUR'),
  body('frequency')
    .isIn(['one-time', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly'])
    .withMessage('Invalid frequency'),
  handleValidationErrors
];

// Validation rules for Assets
const validateAsset = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('type')
    .isIn(['property', 'investment', 'savings', 'other'])
    .withMessage('Invalid asset type'),
  body('value')
    .isFloat({ min: 0 })
    .withMessage('Value must be a positive number'),
  body('currency')
    .isIn(['LKR', 'USD', 'EUR'])
    .withMessage('Currency must be LKR, USD, or EUR'),
  handleValidationErrors
];

// Validation rules for Liabilities
const validateLiability = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('type')
    .isIn(['loan', 'mortgage', 'other'])
    .withMessage('Invalid liability type'),
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),
  body('currency')
    .isIn(['LKR', 'USD', 'EUR'])
    .withMessage('Currency must be LKR, USD, or EUR'),
  body('interestRate')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Interest rate must be between 0 and 100'),
  handleValidationErrors
];

// Validation rules for Credit Cards
const validateCreditCard = [
  body('bank')
    .trim()
    .notEmpty()
    .withMessage('Bank name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Bank name must be between 2 and 100 characters'),
  body('last4')
    .matches(/^\d{4}$/)
    .withMessage('Last 4 digits must be exactly 4 digits'),
  body('creditLimit')
    .isFloat({ min: 0 })
    .withMessage('Credit limit must be a positive number'),
  body('outstandingBalance')
    .isFloat({ min: 0 })
    .withMessage('Outstanding balance must be a positive number'),
  body('currency')
    .isIn(['LKR', 'USD', 'EUR'])
    .withMessage('Currency must be LKR, USD, or EUR'),
  body('paymentDueDate')
    .optional()
    .isISO8601()
    .withMessage('Payment due date must be a valid date'),
  handleValidationErrors
];

// Validation for MongoDB ObjectId
const validateObjectId = [
  param('id')
    .matches(/^[0-9a-fA-F]{24}$/)
    .withMessage('Invalid ID format'),
  handleValidationErrors
];

module.exports = {
  validateIncome,
  validateAsset,
  validateLiability,
  validateCreditCard,
  validateObjectId,
  handleValidationErrors
};
