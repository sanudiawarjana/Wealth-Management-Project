const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
require('dotenv').config();

// ✅ Create Bedrock client (no apiVersion, SDK auto-selects latest)
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function invokeClaude(promptText, options = {}) {
  const modelId = options.modelId || process.env.BEDROCK_MODEL_ID;
  const maxTokens = options.maxTokens ?? 800;
  const temperature = options.temperature ?? 0.3;
  const timeoutMs = options.timeoutMs ?? 25000;

  // ✅ Correct Anthropic Bedrock API version (stable)
  const payload = {
    anthropic_version: 'bedrock-2023-05-31',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: promptText }
        ],
      },
    ],
    max_tokens: maxTokens,
    temperature,
  };

  const command = new InvokeModelCommand({
    modelId,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(payload), // no need for Buffer.from()
  });

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);

  try {
    const response = await bedrockClient.send(command, { abortSignal: ac.signal });

    // ✅ Convert stream body safely
    const rawBody = await response.body.transformToString();
    const json = JSON.parse(rawBody);

    const text = json?.content?.[0]?.text || '';

    // Try parsing for structured recommendations if JSON returned
    let recommendations = [];
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed.recommendations)) {
        recommendations = parsed.recommendations;
      }
    } catch {
      // text isn’t JSON — that’s fine, keep plain text
    }

    return { text, recommendations };

  } catch (err) {
    if (err.name === 'AbortError') throw new Error('Bedrock request timed out');
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

module.exports = { invokeClaude };
