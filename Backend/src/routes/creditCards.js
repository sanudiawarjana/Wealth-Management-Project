const express = require('express');
const router = express.Router();
const {
  getAll,
  getSingle,
  create,
  update,
  delete: deleteCreditCard
} = require('../controllers/creditCardsController');
const { validateCreditCard, validateObjectId } = require('../middleware/validation');

// Routes using controllers with validation
router.get('/', getAll);
router.get('/:id', validateObjectId, getSingle);
router.post('/', validateCreditCard, create);
router.put('/:id', [...validateObjectId, ...validateCreditCard], update);
router.delete('/:id', validateObjectId, deleteCreditCard);

module.exports = router;
