const express = require('express');
const router = express.Router();
const {
  getAllIncomes,
  getSingleIncome,
  createIncome,
  updateIncome,
  deleteIncome
} = require('../controllers/incomeController');
const { validateIncome, validateObjectId } = require('../middleware/validation');

// Routes using controllers with validation
router.get('/', getAllIncomes);
router.get('/:id', validateObjectId, getSingleIncome);
router.post('/', validateIncome, createIncome);
router.put('/:id', [...validateObjectId, ...validateIncome], updateIncome);
router.delete('/:id', validateObjectId, deleteIncome);

module.exports = router;
