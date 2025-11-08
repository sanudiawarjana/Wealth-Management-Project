const { loadUserFinancialSnapshot } = require('../services/dataAggregator');
const { generateRecommendations: engineGenerateRecommendations } = require('../services/recommendationEngine');
const Recommendation = require('../models/recommendation');
const AWS = require('aws-sdk');

// ✅ Check Bedrock configuration
const hasBedrockConfig =
  Boolean(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.BEDROCK_MODEL_ID);

// ✅ Configure AWS SDK only if credentials exist
if (hasBedrockConfig) {
  AWS.config.update({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: new AWS.Credentials({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }),
  });
}

// ✅ Safe Bedrock invocation helper
const bedrockSafeInvoke = async (payload) => {
  if (!hasBedrockConfig) throw new Error('Bedrock not configured');

  const bedrock = new AWS.BedrockRuntime();
  const params = {
    modelId: process.env.BEDROCK_MODEL_ID,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(payload),
  };

  const resp = await bedrock.invokeModel(params).promise();
  return resp.body ? resp.body.toString() : '';
};

/* ========================================================================== */
/*                            CONTROLLER FUNCTIONS                            */
/* ========================================================================== */

/**
 * GET /api/recommendations
 * Auto-generates recommendations from user's financial snapshot.
 */
exports.getRecommendations = async (req, res) => {
  try {
    const { fast, save, maxTokens, temperature } = req.query;
    const snapshot = await loadUserFinancialSnapshot();

    const options = {
      maxTokens: fast ? 300 : (maxTokens ? Number(maxTokens) : 900),
      temperature: fast ? 0.1 : (temperature != null ? Number(temperature) : 0.3),
    };

    const result = await engineGenerateRecommendations(snapshot, options);
    const responsePayload = { snapshot: snapshot.metrics, ...result };

    if (save) {
      await Recommendation.create({
        snapshotMetrics: snapshot.metrics,
        recommendations: result.recommendations,
        disclaimer: result.disclaimer,
      });
    }

    res.status(200).json(responsePayload);
  } catch (err) {
    console.error('❌ Error generating recommendations:', err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/recommendations/history
 * Returns recent recommendation records.
 */
exports.getRecommendationHistory = async (_req, res) => {
  try {
    const docs = await Recommendation.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    res.status(200).json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * POST /api/recommendations/generate-keywords
 * Generate AI recommendations based on provided keywords.
 */
exports.generateRecommendations = async (req, res) => {
  try {
    const { keywords, fast, maxTokens, temperature, save } = req.body;

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({ error: 'Please provide an array of keywords.' });
    }

    const snapshot = await loadUserFinancialSnapshot();

    const options = {
      maxTokens: fast ? 300 : (maxTokens ? Number(maxTokens) : 900),
      temperature: fast ? 0.1 : (temperature != null ? Number(temperature) : 0.3),
    };

    const result = await engineGenerateRecommendations(snapshot, options, keywords);

    if (save) {
      await Recommendation.create({
        snapshotMetrics: snapshot.metrics,
        recommendations: result.recommendations,
        disclaimer: result.disclaimer,
      });
    }

    res.status(200).json({
      success: true,
      keywords,
      recommendations: result.recommendations,
      disclaimer: result.disclaimer,
    });
  } catch (err) {
    console.error('❌ Error generating AI recommendations:', err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * POST /api/recommendations/generate
 * Generate AI recommendations from income, expenses, and goals.
 */
exports.generateRecommendation = async (req, res) => {
  try {
    // ✅ Support both body and query params for testing
    if ((!req.body || Object.keys(req.body).length === 0) && req.query) {
      req.body = {
        income: req.query.income ?? req.body?.income,
        expenses: req.query.expenses ?? req.body?.expenses,
        goals: req.query.goals ?? req.body?.goals,
        max_tokens: req.query.max_tokens ?? req.body?.max_tokens,
        temperature: req.query.temperature ?? req.body?.temperature,
      };
    }

    console.log('recommendations.generateRecommendation - req.body =', req.body);

    const { income, expenses, goals } = req.body;
    if (income == null || expenses == null || !goals) {
      return res.status(400).json({ error: 'income, expenses, and goals are required.' });
    }

    const prompt = `You are a financial advisor.\nIncome: ${income}\nExpenses: ${expenses}\nGoals: ${goals}\nProvide clear, numbered, and actionable recommendations for budgeting, saving, investing, and debt management.`;

    // ✅ If Bedrock is configured, use AI model
    if (hasBedrockConfig) {
      const max_tokens = Number(req.body.max_tokens ?? req.body.maxTokens ?? 512);
      const temperature = Number(req.body.temperature ?? 0.3);
      const isAnthropic = String(process.env.BEDROCK_MODEL_ID).toLowerCase().includes('anthropic');

      const bodyPayload = {
        messages: [
          {
            role: 'user',
            content: [{ type: 'text', text: prompt }],
          },
        ],
        max_tokens,
        temperature,
      };

      // ✅ FIXED: Correct Anthropic API version for AWS Bedrock
      if (isAnthropic) {
        bodyPayload.anthropic_version = process.env.ANTHROPIC_VERSION || 'bedrock-2023-05-31';
      }

      let respBody = '';
      try {
        respBody = await bedrockSafeInvoke(bodyPayload);
      } catch (invokeErr) {
        console.error('❌ Bedrock invoke error:', invokeErr);
        return res.status(502).json({ error: 'AI provider error', message: invokeErr.message });
      }

      // ✅ Parse Bedrock response safely
      let text = respBody;
      try {
        const parsed = JSON.parse(respBody);
        if (parsed?.choices && parsed.choices[0]?.message?.content) {
          const content = parsed.choices[0].message.content;
          text = Array.isArray(content)
            ? content.map(c => c.text || JSON.stringify(c)).join('\n')
            : (content.text || JSON.stringify(content));
        } else if (parsed?.outputs && parsed.outputs[0]?.content) {
          const content = parsed.outputs[0].content;
          text = Array.isArray(content)
            ? content.map(c => c.text || JSON.stringify(c)).join('\n')
            : (content.text || JSON.stringify(content));
        } else {
          text = typeof parsed === 'string' ? parsed : JSON.stringify(parsed);
        }
      } catch (e) {
        // keep raw response if parsing fails
      }

      return res.json({ recommendation: text, provider: 'bedrock' });
    }

    // ✅ Fallback if no Bedrock config found
    const monthlySurplus = Number(income) - Number(expenses);
    const rec = [
      `1) Budget: Save at least 20% of your surplus (~${Math.round(monthlySurplus * 0.2)} per month).`,
      '2) Emergency Fund: Build 3–6 months of essential expenses.',
      '3) Automate savings transfers on payday.',
      '4) Investments: Start with low-cost index funds and increase contributions over time.',
      '5) Debt: Focus on high-interest balances first.',
      '6) Break goals into monthly milestones and review progress regularly.',
    ].join('\n');

    return res.json({ recommendation: rec, provider: 'fallback' });
  } catch (err) {
    console.error('❌ Recommendation error:', err);
    return res.status(500).json({
      error: 'Failed to generate recommendation',
      message: err.message || String(err),
    });
  }
};
