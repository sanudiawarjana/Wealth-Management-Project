const { invokeClaude } = require('./src/services/bedrockService');

async function test() {
  try {
    const prompt = "Generate 3 financial recommendations for someone earning $5000 with $3000 expenses.";
    const response = await invokeClaude(prompt);
    console.log("Claude Response:", response);
  } catch (err) {
    console.error("AI provider error:", err);
  }
}

test();
