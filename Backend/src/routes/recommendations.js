const express = require('express');
const router = express.Router();
const controller = require('../controllers/recommendationsController');

// GET /api/recommendations  (get recommendations from user data)
router.get('/', controller.getRecommendations);

// POST /api/recommendations  (generate AI recommendations from user data)
router.post('/', controller.getRecommendations);

// GET /api/recommendations/history
router.get('/history', controller.getRecommendationHistory);

// POST /api/recommendations/generate-keywords
router.post('/generate-keywords', controller.generateRecommendations);

// POST /api/recommendations/generate  (main AI endpoint with custom params)
router.post('/generate', controller.generateRecommendation);

// Allow GET /generate for quick testing (maps ?income=...&expenses=...&goals=...)
router.get('/generate', (req, res, next) => {
  req.body = req.body || {};
  if (req.query.income) req.body.income = req.query.income;
  if (req.query.expenses) req.body.expenses = req.query.expenses;
  if (req.query.goals) req.body.goals = req.query.goals;
  if (req.query.max_tokens) req.body.max_tokens = req.query.max_tokens;
  if (req.query.temperature) req.body.temperature = req.query.temperature;
  return controller.generateRecommendation(req, res, next);
});

module.exports = router;
