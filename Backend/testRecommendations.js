// testRecommendations.js

const mongoose = require('mongoose');
const RecommendationService = require('./src/services/bedrockService'); // ✅ corrected filename
require('dotenv').config();

// MongoDB URI from .env
const uri = process.env.MONGO_URI;

// Define Recommendation schema
const recommendationSchema = new mongoose.Schema(
  {
    title: String,
    detail: String,
  },
  { timestamps: true }
);

const Recommendation = mongoose.model('Recommendation', recommendationSchema);

// Connect to MongoDB
mongoose
  .connect(uri)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Save recommendations to MongoDB
async function saveRecommendations(recs) {
  try {
    await Recommendation.deleteMany({});
    const saved = await Recommendation.insertMany(recs);
    console.log(`✅ ${saved.length} recommendations saved to MongoDB`);
  } catch (err) {
    console.error('❌ Error saving recommendations:', err);
  }
}

// Filter, sort, and limit recommendations
async function filterRecommendations(keywords = [], sortBy = 'title', limit = 0) {
  try {
    const query =
      keywords.length > 0
        ? {
            $or: keywords.map((kw) => ({
              $or: [
                { title: { $regex: kw, $options: 'i' } },
                { detail: { $regex: kw, $options: 'i' } },
              ],
            })),
          }
        : {};

    const sortOptions = sortBy === 'date' ? { createdAt: -1 } : { title: 1 };

    const filtered = await Recommendation.find(query)
      .sort(sortOptions)
      .limit(limit > 0 ? limit : 0);

    if (filtered.length === 0) {
      console.log(`⚠️ No recommendations found for keywords: [${keywords.join(', ')}]`);
    } else {
      console.log(
        `✅ Filtered Recommendations ${
          keywords.length ? `for keywords: [${keywords.join(', ')}]` : ''
        }:`
      );
      filtered.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec.title}`);
        console.log(`   Detail: ${rec.detail}`);
      });
    }
  } catch (err) {
    console.error('❌ Error filtering recommendations:', err);
  }
}

// Main function
async function runRecommendations() {
  try {
    // Command line args:
    // node testRecommendations.js [keywords...] [sortBy] [limit]
    const args = process.argv.slice(2);
    const keywords = args.filter(
      (arg) => !['title', 'date'].includes(arg) && isNaN(arg)
    );
    const sortBy = args.find((arg) => ['title', 'date'].includes(arg)) || 'title';
    const limitArg = args.find((arg) => !isNaN(arg));
    const limit = limitArg ? parseInt(limitArg) : 0;

    const output = await RecommendationService.getRecommendations();
    const summaryObj = JSON.parse(output.textSummary);

    console.log('✅ All Recommendations:');
    summaryObj.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec.title}`);
      console.log(`   Detail: ${rec.detail}`);
    });

    console.log('\n📜 Disclaimer:', summaryObj.disclaimer);

    // Save to MongoDB
    await saveRecommendations(summaryObj.recommendations);

    // Filter, sort, and limit
    await filterRecommendations(keywords, sortBy, limit);
  } catch (error) {
    console.error('❌ Error fetching recommendations:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the script
runRecommendations();
