import { Router } from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { genai } from '../gemini.js';

const router = Router();

// ─────────────────────────────────────────
// Scrape Website
// ─────────────────────────────────────────
async function analyzeWebsite(url) {
  try {
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 10000,
    });

    const $ = cheerio.load(data);

    const title = $('title').text();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const h1 = $('h1').first().text();

    const imagesWithoutAlt = $('img:not([alt])').length;
    const wordCount = $('body').text().split(/\s+/).length;

    return {
      url,
      title,
      metaDescription,
      h1,
      imagesWithoutAlt,
      wordCount,
    };
  } catch (err) {
    return {
      url,
      error: 'Failed to fetch',
    };
  }
}

// ─────────────────────────────────────────
// SEO Score Logic
// ─────────────────────────────────────────
function calculateSEOScore(data) {
  let score = 0;

  if (data.title) score += 20;
  if (data.metaDescription) score += 20;
  if (data.h1) score += 15;
  if (data.imagesWithoutAlt === 0) score += 15;
  if (data.wordCount > 300) score += 30;

  return score;
}

// ─────────────────────────────────────────
// API: /seo/compare
// ─────────────────────────────────────────
router.post('/compare', async (req, res) => {
  try {
    const { urls } = req.body;

    if (!urls || urls.length === 0) {
      return res.status(400).json({ error: 'URLs required' });
    }

    // 1. Scrape all sites
    const results = await Promise.all(urls.map(analyzeWebsite));

    // 2. Add scores
    const withScores = results.map(site => ({
      ...site,
      score: calculateSEOScore(site),
    }));

    // 3. AI Insights (Gemini)
    const prompt = `
    You are an SEO expert.

Analyze these websites:

${JSON.stringify(withScores, null, 2)}

Return JSON ONLY:

{
  "insights": ["3 insights"],
  "suggestions": ["3 suggestions"],
  "per_site": [
    {
      "url": "...",
      "analysis": "short explanation of SEO performance"
    }
  ]
}
`;

    let insights = [];
    let suggestions = [];
    let perSite = [];
    const MODEL_FALLBACKS = [
      'gemini-3.1-flash-lite-preview',
      'gemini-3-flash-preview',
      'gemini-3.1-flash-live-preview',
    ];
    let success = false;

for (const model of MODEL_FALLBACKS) {
  try {
    const response = await genai.models.generateContent({
      model: model,
      contents: prompt,
    });

    const raw = response.text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(raw);

    insights = parsed.insights || [];
    suggestions = parsed.suggestions || [];
    perSite = parsed.per_site || [];

    console.log("Gemini raw response:", response.text);

    success = true;
    break; // ✅ STOP after first success

  } catch (err) {
    console.log(`Model ${model} failed`);
  }
}

// fallback only if ALL fail
if (!success) {
  insights = ["Unable to generate AI insights"];
  suggestions = ["Try again later"];
}

    // 4. Return response
    res.json({
    response: "SEO analysis complete",
    metadata: {
    sites: withScores,
    insights: insights,
    suggestions: suggestions,
    perSite: perSite,
    type: "seo_compare"
    }
    });

  } catch (err) {
    console.error('[SEO]', err);
    res.status(500).json({ error: 'SEO analysis failed' });
  }
});

export default router;