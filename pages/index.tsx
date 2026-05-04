import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState('transcript');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, contentType }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || 'Something went wrong.');
      else setResults(data);
    } catch {
      setError('Network error. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  }

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  }

  const badgeColors = ['#6366f1', '#8b5cf6', '#a78bfa'];

  return (
    <>
      <Head>
        <title>Clip Finder — Find your best short clips instantly</title>
        <meta name="description" content="Paste a YouTube transcript. Get the 3 best clip moments with hooks and full reel scripts in 10 seconds." />
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0a; color: #fff; min-height: 100vh; }
          textarea { outline: none; }
          textarea:focus { border-color: #6366f1 !important; }
          button { font-family: inherit; }
        `}</style>
      </Head>

      <nav style={{ padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1f1f1f', background: '#0a0a0a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px', fontWeight: 600, color: '#fff', letterSpacing: '-0.3px' }}>
          <div style={{ width: '30px', height: '30px', background: '#6366f1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>✦</div>
          Clip Finder
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px', border: '1px solid #2a2a2a', color: '#888', background: '#111' }}>Free forever</div>
        </div>
      </nav>

      <div style={{ padding: '72px 32px 48px', textAlign: 'center', maxWidth: '680px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '5px 14px', borderRadius: '20px', border: '1px solid #2a2a2a', color: '#888', marginBottom: '24px', background: '#111' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }}></div>
          AI-powered clip extraction
        </div>
        <h1 style={{ fontSize: '52px', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: '16px', color: '#fff' }}>
          Find your best clips.<br />
          <span style={{ background: 'linear-gradient(90deg,#6366f1,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Instantly.</span>
        </h1>
        <p style={{ fontSize: '17px', color: '#555', lineHeight: 1.65, maxWidth: '420px', margin: '0 auto 48px' }}>
          Paste any YouTube transcript or long-form content. Get 3 viral-ready clips with hooks and full reel scripts.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0', marginBottom: '56px', border: '1px solid #1f1f1f', borderRadius: '12px', overflow: 'hidden', maxWidth: '380px', margin: '0 auto 56px' }}>
          {[['3', 'Clips per run'], ['~10s', 'Time to results'], ['Free', 'No signup']].map(([n, l], i) => (
            <div key={i} style={{ flex: 1, padding: '16px 12px', textAlign: 'center', borderRight: i < 2 ? '1px solid #1f1f1f' : 'none' }}>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>{n}</div>
              <div style={{ fontSize: '11px', color: '#444', marginTop: '3px' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 32px 80px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1px', background: '#1f1f1f', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px' }}>
          {[['1', 'Paste content', 'Transcript, blog, or any text'], ['2', 'AI finds clips', 'Best 3 moments extracted'], ['3', 'Copy and post', 'Hook + script ready to go']].map(([n, t, d]) => (
            <div key={n} style={{ background: '#111', padding: '20px', textAlign: 'center' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#1a1a1a', border: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: '13px', color: '#6366f1', fontWeight: 700 }}>{n}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#e5e7eb', marginBottom: '3px' }}>{t}</div>
              <div style={{ fontSize: '11px', color: '#444', lineHeight: 1.5 }}>{d}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '16px', padding: '28px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', background: '#0a0a0a', padding: '4px', borderRadius: '10px', border: '1px solid #1f1f1f' }}>
            {['transcript', 'general'].map(type => (
              <button key={type} onClick={() => setContentType(type)} style={{ flex: 1, padding: '9px', borderRadius: '8px', border: 'none', fontSize: '13px', fontWeight: 500, cursor: 'pointer', transition: 'all .15s', background: contentType === type ? '#1a1a1a' : 'transparent', color: contentType === type ? '#fff' : '#555' }}>
                {type === 'transcript' ? 'YouTube transcript' : 'Blog / podcast / other'}
              </button>
            ))}
          </div>

          <div style={{ fontSize: '11px', fontWeight: 600, color: '#444', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Your content</span>
            <span style={{ color: '#6366f1', textTransform: 'none', letterSpacing: 0, fontWeight: 400, fontSize: '12px', cursor: 'pointer' }}>
              {contentType === 'transcript' ? 'How to get a transcript?' : ''}
            </span>
          </div>

          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={8}
            placeholder={contentType === 'transcript' ? 'Open any YouTube video → click (...) → Show transcript → copy all text and paste here...' : 'Paste your blog post, podcast notes, newsletter, or any long-form content here...'}
            style={{ width: '100%', padding: '16px', fontSize: '14px', border: '1px solid #1f1f1f', borderRadius: '10px', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.7, color: '#e5e7eb', background: '#0a0a0a', minHeight: '180px', transition: 'border-color .15s' }}
          />

          <div style={{ fontSize: '12px', marginTop: '8px', marginBottom: '20px', color: content.length < 100 ? '#ef4444' : '#22c55e' }}>
            {content.length} characters {content.length < 100 ? `— need ${100 - content.length} more to continue` : '— ready to analyse'}
          </div>

          <button onClick={handleSubmit} disabled={loading || content.length < 100} style={{ width: '100%', padding: '15px', background: loading || content.length < 100 ? '#1a1a1a' : '#6366f1', color: loading || content.length < 100 ? '#444' : '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 600, cursor: loading || content.length < 100 ? 'not-allowed' : 'pointer', letterSpacing: '-0.3px', transition: 'opacity .15s' }}>
            {loading ? 'Analysing your content...' : 'Find my best clips →'}
          </button>
        </div>

        {error && (
          <div style={{ background: '#1a0a0a', border: '1px solid #3f0000', borderRadius: '10px', padding: '14px 16px', fontSize: '13px', color: '#f87171', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {results && (
          <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '16px', padding: '28px' }}>
            <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #1a1a1a' }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>Your 3 best clip moments</div>
              <div style={{ fontSize: '13px', color: '#444', marginTop: '4px' }}>Copy each hook and script — use in CapCut, Reels, or TikTok</div>
            </div>

            {results.clips.map((clip: any, i: number) => (
              <div key={i} style={{ border: '1px solid #1f1f1f', borderRadius: '12px', overflow: 'hidden', marginBottom: '14px', background: '#0d0d0d' }}>
                <div style={{ padding: '14px 18px', background: '#111', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '28px', height: '28px', background: badgeColors[i] || '#6366f1', color: '#fff', borderRadius: '7px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{clip.clipNumber}</div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#e5e7eb' }}>Clip {clip.clipNumber}</div>
                    <div style={{ fontSize: '11px', color: '#444', marginTop: '1px' }}>Suggested timestamp: {clip.timestamp}</div>
                  </div>
                </div>

                <div style={{ padding: '18px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.1em', color: '#333', marginBottom: '8px' }}>Hook — stop the scroll</div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff', lineHeight: 1.5, padding: '14px 16px', background: '#12103a', border: '1px solid #2d2b6b', borderRadius: '8px', marginBottom: '14px' }}>{clip.hook}</div>

                  <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.1em', color: '#333', marginBottom: '6px' }}>Why this works</div>
                  <div style={{ fontSize: '13px', color: '#444', fontStyle: 'italic', paddingLeft: '12px', borderLeft: '2px solid #1f1f1f', marginBottom: '16px', lineHeight: 1.6 }}>{clip.whyItWorks}</div>

                  <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.1em', color: '#333', marginBottom: '8px' }}>Full reel script — read on camera</div>
                  <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '16px', fontSize: '13px', color: '#9ca3af', lineHeight: 1.8, whiteSpace: 'pre-wrap' as const, marginBottom: '12px', fontFamily: 'inherit' }}>{clip.reelScript}</div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[['hook', clip.hook, 'Copy hook'], ['script', clip.reelScript, 'Copy full script']].map(([key, text, label]) => (
                      <button key={key as string} onClick={() => copyText(text as string, `${key}-${i}`)} style={{ padding: '7px 16px', fontSize: '12px', fontWeight: 500, border: '1px solid', borderColor: copied === `${key}-${i}` ? '#166534' : '#1f1f1f', borderRadius: '7px', cursor: 'pointer', background: copied === `${key}-${i}` ? '#0f2a0f' : '#111', color: copied === `${key}-${i}` ? '#4ade80' : '#555', transition: 'all .15s' }}>
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