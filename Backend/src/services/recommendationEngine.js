const { invokeClaude } = require('./bedrockService');
const { buildFinancialAdvicePrompt } = require('../utils/promptBuilder');

async function generateRecommendations(snapshot, options = {}, keywords = []) {
  let prompt = buildFinancialAdvicePrompt(snapshot);

  if (keywords.length > 0) {
    prompt += `\nFocus on these topics: ${keywords.join(', ')}.`;
  }

  const raw = await invokeClaude(prompt, { 
    maxTokens: options.maxTokens ?? 900, 
    temperature: options.temperature ?? 0.3 
  });

  const parsed = {
    textSummary: raw.text,
    recommendations: Array.isArray(raw.recommendations) && raw.recommendations.length > 0
      ? raw.recommendations
      : raw.text
          .split('\n')
          .filter(line => line.trim())
          .slice(0, 10)
          .map((line, idx) => ({ title: `Advice ${idx + 1}`, detail: line.trim() })),
    disclaimer: 'This is general information, not financial advice.'
  };

  return parsed;
}

module.exports = { generateRecommendations };
