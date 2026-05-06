import { useState } from 'react';
import Head from 'next/head';

const TONES = ['Casual', 'Educational', 'Motivational', 'Hot Take', 'Funny', 'Storytelling'];
const PLATFORMS = ['Instagram', 'TikTok', 'YouTube Shorts', 'LinkedIn'];
const ANGLE_COLORS: Record<string, string> = {
  'Emotional': '#6366f1',
  'Educational': '#0891b2',
  'Hot Take': '#dc2626',
};

export default function Home() {
  const [mode, setMode] = useState<'idea' | 'clip'>('idea');
  const [idea, setIdea] = useState('');
  const [content, setContent] = useState('');
  const [tone, setTone] = useState('Casual');
  const [platform, setPlatform] = useState('Instagram');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  const canSubmit = mode === 'idea' ? idea.trim().length >= 5 : content.trim().length >= 100;

  async function handleSubmit() {
    setLoading(true);
    setError('');
    setResults(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, idea, content, tone, platform }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || 'Something went wrong.');
      else setResults(data);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  }

  return (
    <>
      <Head>
        <title>ReelScript — Turn your ideas into viral reel scripts</title>
        <meta name="description" content="Type your idea. Get a ready-to-record reel script in 10 seconds." />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          html, body, #__next { background: #0a0a0a; min-height: 100vh; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #fff; }
          textarea, input { font-family: inherit; }
          textarea:focus, input:focus { outline: none; }
          button { font-family: inherit; cursor: pointer; }
          ::placeholder { color: #333; }
        `}</style>
      </Head>

      {/* NAV */}
      <nav style={{ background: '#0a0a0a', borderBottom: '1px solid #1a1a1a', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 700, letterSpacing: '-0.3px' }}>
          <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>✦</div>
          ReelScript
        </div>
        <div style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', border: '1px solid #222', color: '#666', background: '#111' }}>Free forever</div>
      </nav>

      {/* HERO */}
      <div style={{ textAlign: 'center', padding: '56px 24px 40px', maxWidth: '640px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '4px 12px', borderRadius: '20px', border: '1px solid #222', color: '#666', background: '#111', marginBottom: '20px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
          AI-powered script generation
        </div>
        <h1 style={{ fontSize: '44px', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: '14px' }}>
          Turn your ideas into<br />
          <span style={{ background: 'linear-gradient(90deg,#6366f1,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            viral reel scripts.
          </span>
        </h1>
        <p style={{ fontSize: '16px', color: '#555', lineHeight: 1.65, maxWidth: '400px', margin: '0 auto 32px' }}>
          Have an idea but don't know how to say it? Type it in plain English. Get a ready-to-record script in 10 seconds.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0', border: '1px solid #1a1a1a', borderRadius: '10px', overflow: 'hidden', maxWidth: '360px', margin: '0 auto' }}>
          {[['✦', '3 scripts per idea'], ['⏱', '~60 sec each'], ['🆓', 'Always free']].map(([icon, label], i) => (
            <div key={i} style={{ flex: 1, padding: '12px 8px', textAlign: 'center', borderRight: i < 2 ? '1px solid #1a1a1a' : 'none', background: '#111' }}>
              <div style={{ fontSize: '16px', marginBottom: '3px' }}>{icon}</div>
              <div style={{ fontSize: '11px', color: '#555', lineHeight: 1.4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 24px 80px' }}>

        {/* MODE TABS */}
        <div style={{ display: 'flex', gap: '0', background: '#111', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '4px', marginBottom: '16px' }}>
          {[['idea', '💡 Idea to Script', 'Type a new idea'], ['clip', '✂️ Clip Finder', 'From existing content']].map(([m, label, sub]) => (
            <button key={m} onClick={() => { setMode(m as 'idea' | 'clip'); setResults(null); setError(''); }}
              style={{ flex: 1, padding: '12px 8px', borderRadius: '9px', border: 'none', background: mode === m ? '#1a1a1a' : 'transparent', color: mode === m ? '#fff' : '#444', transition: 'all .15s', textAlign: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>{label}</div>
              <div style={{ fontSize: '11px', color: mode === m ? '#666' : '#333', marginTop: '2px' }}>{sub}</div>
            </button>
          ))}
        </div>

        {/* INPUT CARD */}
        <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '24px', marginBottom: '16px' }}>

          {mode === 'idea' ? (
            <>
              {/* HIGHLIGHTED IDEA INPUT */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.08em', color: '#555', marginBottom: '8px' }}>Your idea</div>
                <div style={{ position: 'relative' }}>
                  <input
                    value={idea}
                    onChange={e => setIdea(e.target.value)}
                    placeholder="e.g. Why most people quit the gym in January"
                    style={{ width: '100%', padding: '16px 18px', fontSize: '16px', border: '2px solid', borderColor: idea.length >= 5 ? '#6366f1' : '#1a1a1a', borderRadius: '10px', background: '#0a0a0a', color: '#fff', transition: 'border-color .2s', fontWeight: 500 }}
                  />
                  {idea.length >= 5 && (
                    <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px' }}>✓</div>
                  )}
                </div>
                <div style={{ fontSize: '12px', color: '#333', marginTop: '6px' }}>
                  Keep it short — one sentence is perfect
                </div>
              </div>

              {/* TONE */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.08em', color: '#555', marginBottom: '8px' }}>Tone</div>
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
                  {TONES.map(t => (
                    <button key={t} onClick={() => setTone(t)} style={{ padding: '7px 14px', borderRadius: '20px', border: '1px solid', borderColor: tone === t ? '#6366f1' : '#1a1a1a', background: tone === t ? '#1e1b4b' : '#0a0a0a', color: tone === t ? '#a5b4fc' : '#444', fontSize: '13px', fontWeight: tone === t ? 600 : 400, transition: 'all .15s' }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.08em', color: '#555', marginBottom: '8px' }}>Paste your content</div>
                <textarea value={content} onChange={e => setContent(e.target.value)} rows={7}
                  placeholder="Paste YouTube transcript, blog post, podcast notes, or any long content..."
                  style={{ width: '100%', padding: '14px', fontSize: '14px', border: '1px solid #1a1a1a', borderRadius: '10px', background: '#0a0a0a', color: '#e5e7eb', lineHeight: 1.7, resize: 'vertical' as const }} />
                <div style={{ fontSize: '12px', marginTop: '6px', color: content.length < 100 ? '#ef4444' : '#22c55e' }}>
                  {content.length} characters {content.length < 100 ? `— need ${100 - content.length} more` : '— ready'}
                </div>
              </div>
            </>
          )}

          {/* PLATFORM */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.08em', color: '#555', marginBottom: '8px' }}>Platform</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const }}>
              {PLATFORMS.map(p => (
                <button key={p} onClick={() => setPlatform(p)} style={{ padding: '7px 14px', borderRadius: '20px', border: '1px solid', borderColor: platform === p ? '#0891b2' : '#1a1a1a', background: platform === p ? '#0c1f24' : '#0a0a0a', color: platform === p ? '#67e8f9' : '#444', fontSize: '13px', fontWeight: platform === p ? 600 : 400, transition: 'all .15s' }}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* SUBMIT */}
          <button onClick={handleSubmit} disabled={loading || !canSubmit}
            style={{ width: '100%', padding: '15px', background: loading || !canSubmit ? '#111' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: loading || !canSubmit ? '#333' : '#fff', border: '1px solid', borderColor: loading || !canSubmit ? '#1a1a1a' : 'transparent', borderRadius: '10px', fontSize: '15px', fontWeight: 700, letterSpacing: '-0.3px', transition: 'opacity .15s' }}>
            {loading ? 'Writing your scripts...' : mode === 'idea' ? '✦ Generate reel scripts' : '✦ Find my best clips'}
          </button>
        </div>

        {error && <div style={{ background: '#1a0505', border: '1px solid #3f0000', borderRadius: '10px', padding: '14px 16px', fontSize: '13px', color: '#f87171', marginBottom: '16px' }}>{error}</div>}

        {/* IDEA RESULTS */}
        {results?.scripts && (
          <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '24px' }}>
            <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #1a1a1a' }}>
              <div style={{ fontSize: '17px', fontWeight: 700, letterSpacing: '-0.3px' }}>3 scripts for your idea</div>
              <div style={{ fontSize: '13px', color: '#444', marginTop: '4px' }}>Each is ~60 seconds when spoken. Pick your favourite angle.</div>
            </div>
            {results.scripts.map((s: any, i: number) => (
              <div key={i} style={{ border: '1px solid #1a1a1a', borderRadius: '12px', overflow: 'hidden', marginBottom: '14px' }}>
                <div style={{ padding: '14px 16px', background: '#0d0d0d', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: ANGLE_COLORS[s.angle] || '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#e5e7eb' }}>{s.angle} angle</div>
                    <div style={{ fontSize: '11px', color: '#444', marginTop: '1px' }}>~{s.wordCount} words · ~60 seconds · {platform}</div>
                  </div>
                </div>
                <div style={{ padding: '16px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.1em', color: '#444', marginBottom: '6px' }}>Hook — stop the scroll</div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff', lineHeight: 1.5, padding: '12px 14px', background: '#12103a', border: '1px solid #2d2b6b', borderRadius: '8px', marginBottom: '12px' }}>{s.hook}</div>

                  <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.1em', color: '#444', marginBottom: '4px' }}>Why this works</div>
                  <div style={{ fontSize: '13px', color: '#666', fontStyle: 'italic', marginBottom: '14px', paddingLeft: '10px', borderLeft: '2px solid #1a1a1a', lineHeight: 1.6 }}>{s.whyItWorks}</div>

                  <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.1em', color: '#444', marginBottom: '6px' }}>Full script — read on camera</div>
                  <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '14px', fontSize: '13px', color: '#c4c4c4', lineHeight: 1.8, whiteSpace: 'pre-wrap' as const, marginBottom: '10px', fontFamily: 'inherit' }}>{s.script}</div>

                  <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.1em', color: '#444', marginBottom: '6px' }}>Hashtags</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px', marginBottom: '12px' }}>
                    {s.hashtags?.map((tag: string) => (
                      <span key={tag} style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '20px', background: '#0d0d0d', border: '1px solid #1a1a1a', color: '#6366f1' }}>{tag}</span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[['hook', s.hook, 'Copy hook'], ['script', s.script, 'Copy script'], ['all', `${s.hook}\n\n${s.script}\n\n${s.hashtags?.join(' ')}`, 'Copy all']].map(([key, text, label]) => (
                      <button key={key as string} onClick={() => copyText(text as string, `${key}-${i}`)}
                        style={{ padding: '7px 14px', fontSize: '12px', fontWeight: 500, border: '1px solid', borderColor: copied === `${key}-${i}` ? '#166534' : '#1a1a1a', borderRadius: '7px', background: copied === `${key}-${i}` ? '#0f2a0f' : '#0a0a0a', color: copied === `${key}-${i}` ? '#4ade80' : '#555', transition: 'all .15s' }}>
                        {copied === `${key}-${i}` ? 'Copied!' : label as string}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CLIP RESULTS */}
        {results?.clips && (
          <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '24px' }}>
            <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #1a1a1a' }}>
              <div style={{ fontSize: '17px', fontWeight: 700, letterSpacing: '-0.3px' }}>Your 3 best clip moments</div>
              <div style={{ fontSize: '13px', color: '#444', marginTop: '4px' }}>Each script is ~60 seconds. Copy and record.</div>
            </div>
            {results.clips.map((clip: any, i: number) => (
              <div key={i} style={{ border: '1px solid #1a1a1a', borderRadius: '12px', overflow: 'hidden', marginBottom: '14px' }}>
                <div style={{ padding: '14px 16px', background: '#0d0d0d', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: ['#6366f1','#8b5cf6','#a78bfa'][i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>{clip.clipNumber}</div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#e5e7eb' }}>Clip {clip.clipNumber}</div>
                    <div style={{ fontSize: '11px', color: '#444', marginTop: '1px' }}>{clip.timestamp} · ~{clip.wordCount} words · ~60 seconds</div>
                  </div>
                </div>
                <div style={{ padding: '16px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.1em', color: '#444', marginBottom: '6px' }}>Hook</div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff', padding: '12px 14px', background: '#12103a', border: '1px solid #2d2b6b', borderRadius: '8px', marginBottom: '12px', lineHeight: 1.5 }}>{clip.hook}</div>

                  <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.1em', color: '#444', marginBottom: '4px' }}>Why this works</div>
                  <div style={{ fontSize: '13px', color: '#666', fontStyle: 'italic', marginBottom: '14px', paddingLeft: '10px', borderLeft: '2px solid #1a1a1a', lineHeight: 1.6 }}>{clip.whyItWorks}</div>

                  <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.1em', color: '#444', marginBottom: '6px' }}>Full reel script</div>
                  <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '14px', fontSize: '13px', color: '#c4c4c4', lineHeight: 1.8, whiteSpace: 'pre-wrap' as const, marginBottom: '10px', fontFamily: 'inherit' }}>{clip.reelScript}</div>

                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px', marginBottom: '12px' }}>
                    {clip.hashtags?.map((tag: string) => (
                      <span key={tag} style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '20px', background: '#0d0d0d', border: '1px solid #1a1a1a', color: '#6366f1' }}>{tag}</span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[['hook', clip.hook, 'Copy hook'], ['script', clip.reelScript, 'Copy script']].map(([key, text, label]) => (
                      <button key={key as string} onClick={() => copyText(text as string, `${key}-${i}`)}
                        style={{ padding: '7px 14px', fontSize: '12px', fontWeight: 500, border: '1px solid', borderColor: copied === `${key}-${i}` ? '#166534' : '#1a1a1a', borderRadius: '7px', background: copied === `${key}-${i}` ? '#0f2a0f' : '#0a0a0a', color: copied === `${key}-${i}` ? '#4ade80' : '#555', transition: 'all .15s' }}>
                        {copied === `${key}-${i}` ? 'Copied!' : label as string}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}