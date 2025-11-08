const express = require('express');
const router = express.Router();
const {
  getAll,
  getSingle,
  create,
  update,
  delete: deleteAsset
} = require('../controllers/assetsController');
const { validateAsset, validateObjectId } = require('../middleware/validation');

// Routes using controllers with validation
router.get('/', getAll);
router.get('/:id', validateObjectId, getSingle);
router.post('/', validateAsset, create);
router.put('/:id', [...validateObjectId, ...validateAsset], update);
router.delete('/:id', validateObjectId, deleteAsset);

module.exports = router;
