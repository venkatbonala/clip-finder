import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { content, contentType } = req.body;

  if (!content || content.trim().length < 100) {
    return res.status(400).json({ 
      error: 'Please paste at least 100 characters of content.' 
    });
  }

  const typeLabel = contentType === 'transcript' 
    ? 'YouTube video transcript' 
    : 'long-form text content';

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are an expert short-form video strategist. 
Analyze this ${typeLabel} and find the 3 best moments to turn into short video clips (Reels, TikToks, YouTube Shorts).

Content:
${content}

For each clip, provide:
1. A timestamp range (estimate like "0:45 - 1:20" for transcripts, or "Section 1", "Section 2" etc for general text)
2. A powerful hook sentence (first line that stops the scroll - max 15 words)
3. A full reel script (what the creator should say on camera - 60 to 90 seconds when spoken aloud)
4. Why this moment works as a clip (1 sentence)

Return ONLY valid JSON. No extra text. No markdown. No backticks.

{
  "clips": [
    {
      "clipNumber": 1,
      "timestamp": "0:00 - 0:45",
      "hook": "The hook sentence here",
      "whyItWorks": "One sentence explanation",
      "reelScript": "Full word-for-word script the creator reads on camera. Should be natural, conversational, and 60-90 seconds when spoken. Include a strong CTA at the end."
    },
    {
      "clipNumber": 2,
      "timestamp": "2:10 - 3:00",
      "hook": "The hook sentence here",
      "whyItWorks": "One sentence explanation",
      "reelScript": "Full script here..."
    },
    {
      "clipNumber": 3,
      "timestamp": "5:30 - 6:15",
      "hook": "The hook sentence here",
      "whyItWorks": "One sentence explanation",
      "reelScript": "Full script here..."
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text();
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return res.status(200).json(parsed);

  } catch (error) {
    console.error('Gemini error:', error);
    if (error instanceof SyntaxError) {
      return res.status(500).json({ 
        error: 'AI returned unexpected format. Please try again.' 
      });
    }
    return res.status(500).json({ 
      error: 'Something went wrong. Check your GEMINI_API_KEY in .env.local' 
    });
  }
}