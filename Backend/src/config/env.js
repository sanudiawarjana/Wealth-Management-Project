require('dotenv').config();

function requireEnv(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (!value || String(value).trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  mongoUri: requireEnv('MONGO_URI'),
  aws: {
    region: requireEnv('AWS_REGION', 'us-east-1'),
    accessKeyId: requireEnv('AWS_ACCESS_KEY_ID'),
    secretAccessKey: requireEnv('AWS_SECRET_ACCESS_KEY'),
    sessionToken: process.env.AWS_SESSION_TOKEN, // optional
    bedrockModelId: requireEnv('BEDROCK_MODEL_ID')
  }
};

module.exports = config;
