import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { mode, content, idea, tone, platform } = req.body;

  try {const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
    ;
    let prompt = '';

    if (mode === 'idea') {
      if (!idea || idea.trim().length < 5) {
        return res.status(400).json({ error: 'Please enter an idea (at least 5 characters).' });
      }

      prompt = `You are an expert short-form video scriptwriter.

A creator has this idea: "${idea}"
Tone they want: ${tone}
Platform: ${platform}

Write 3 different reel scripts for this idea — each with a different angle:
1. Emotional/Personal angle
2. Educational/Informative angle  
3. Hot Take/Controversial angle

CRITICAL RULES:
- Each script MUST be 130-150 words maximum (reads in exactly 55-60 seconds)
- Start with a POWERFUL hook — first sentence must stop the scroll
- Write naturally, conversationally — like they are talking to camera
- End with a clear call to action
- Match the tone: ${tone}
- Optimise for ${platform}
- Include 5 relevant hashtags per script

Return ONLY valid JSON. No markdown. No backticks. No extra text.

{
  "scripts": [
    {
      "angle": "Emotional",
      "hook": "First sentence only — the scroll stopper",
      "script": "Full 130-150 word script here",
      "wordCount": 145,
      "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
      "whyItWorks": "One sentence explanation"
    },
    {
      "angle": "Educational",
      "hook": "First sentence only",
      "script": "Full 130-150 word script here",
      "wordCount": 140,
      "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
      "whyItWorks": "One sentence explanation"
    },
    {
      "angle": "Hot Take",
      "hook": "First sentence only",
      "script": "Full 130-150 word script here",
      "wordCount": 138,
      "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
      "whyItWorks": "One sentence explanation"
    }
  ]
}`;

    } else {
      if (!content || content.trim().length < 100) {
        return res.status(400).json({ error: 'Please paste at least 100 characters of content.' });
      }

      prompt = `You are an expert short-form video strategist.
Analyze this content and find the 3 best moments to turn into short clips.

Content: ${content}
Platform: ${platform || 'Instagram'}

CRITICAL RULES:
- Each reel script MUST be 130-150 words maximum (reads in 55-60 seconds)
- Start each with a powerful hook
- Write conversationally — like speaking to camera
- End with a call to action
- Include 5 hashtags per clip

Return ONLY valid JSON. No markdown. No backticks.

{
  "clips": [
    {
      "clipNumber": 1,
      "timestamp": "0:00 - 0:45",
      "hook": "Hook sentence here",
      "whyItWorks": "One sentence",
      "reelScript": "Full 130-150 word script",
      "wordCount": 142,
      "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
    },
    {
      "clipNumber": 2,
      "timestamp": "2:10 - 3:00",
      "hook": "Hook sentence here",
      "whyItWorks": "One sentence",
      "reelScript": "Full 130-150 word script",
      "wordCount": 138,
      "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
    },
    {
      "clipNumber": 3,
      "timestamp": "4:30 - 5:20",
      "hook": "Hook sentence here",
      "whyItWorks": "One sentence",
      "reelScript": "Full 130-150 word script",
      "wordCount": 145,
      "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
    }
  ]
}`;
    }

    const result = await model.generateContent(prompt);
    const raw = result.response.text();
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return res.status(200).json(parsed);

  } catch (error) {
    console.error('Gemini error:', error);
    if (error instanceof SyntaxError) {
      return res.status(500).json({ error: 'AI returned unexpected format. Please try again.' });
    }
    if (error?.status === 503) {
      return res.status(503).json({ error: 'AI is temporarily busy. Wait 30 seconds and try again.' });
    }
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}