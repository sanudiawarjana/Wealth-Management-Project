const express = require('express');
const router = express.Router();
const {
  getAll,
  getSingle,
  create,
  update,
  delete: deleteLiability
} = require('../controllers/liabilitiesController');
const { validateLiability, validateObjectId } = require('../middleware/validation');

// Routes using controllers with validation
router.get('/', getAll);
router.get('/:id', validateObjectId, getSingle);
router.post('/', validateLiability, create);
router.put('/:id', [...validateObjectId, ...validateLiability], update);
router.delete('/:id', validateObjectId, deleteLiability);

module.exports = router;
