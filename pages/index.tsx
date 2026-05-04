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

  return (
    <>
      <Head>
        <title>Clip Finder — Turn any video into viral short clips</title>
        <meta name="description" content="Paste a YouTube transcript. Get the 3 best clip moments with hooks and full reel scripts in 10 seconds." />
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: system-ui, -apple-system, sans-serif; background: #f9fafb; color: #111; }
          textarea:focus { outline: none; border-color: #2563eb !important; background: #fff !important; }
          button:hover { opacity: 0.85; }
        `}</style>
      </Head>

      <nav style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '17px', fontWeight: 700, color: '#111', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', background: '#111', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="white"><path d="M8 1L10 6H15L11 9.5L12.5 15L8 12L3.5 15L5 9.5L1 6H6L8 1Z"/></svg>
          </div>
          Clip Finder
        </div>
        <div style={{ fontSize: '11px', fontWeight: 500, padding: '3px 10px', borderRadius: '20px', background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}>Free tool</div>
      </nav>

      <div style={{ padding: '48px 24px 24px', maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#111', lineHeight: 1.25, marginBottom: '12px', letterSpacing: '-0.5px' }}>
          Turn any video into <span style={{ color: '#2563eb' }}>viral short clips</span>
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280', lineHeight: 1.6, maxWidth: '460px', margin: '0 auto 28px' }}>
          Paste a YouTube transcript or any long content. Get the 3 best moments with hooks and full reel scripts — in 10 seconds.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '32px' }}>
          {[['3', 'Best clips found'], ['10s', 'Average time'], ['100%', 'Free to use']].map(([num, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#111' }}>{num}</div>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 24px 60px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '16px' }}>
          {[['1', 'Paste content', 'Transcript, blog, or any text'], ['2', 'AI analyses it', 'Finds your 3 best moments'], ['3', 'Copy and post', 'Hook + reel script ready']].map(([n, t, d]) => (
            <div key={n} style={{ background: '#fff', border: '1px solid #f3f4f6', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
              <div style={{ width: '24px', height: '24px', background: '#111', color: '#fff', borderRadius: '50%', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>{n}</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#111', marginBottom: '3px' }}>{t}</div>
              <div style={{ fontSize: '11px', color: '#9ca3af', lineHeight: 1.5 }}>{d}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '24px', marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '10px' }}>Content type</div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {['transcript', 'general'].map(type => (
              <button key={type} onClick={() => setContentType(type)} style={{ padding: '8px 16px', borderRadius: '8px', border: `1.5px solid ${contentType === type ? '#2563eb' : '#e5e7eb'}`, fontSize: '13px', fontWeight: 500, cursor: 'pointer', background: contentType === type ? '#eff6ff' : '#fff', color: contentType === type ? '#1d4ed8' : '#6b7280' }}>
                {type === 'transcript' ? 'YouTube transcript' : 'Blog / podcast / other'}
              </button>
            ))}
          </div>

          <div style={{ fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
            {contentType === 'transcript' ? 'Paste your YouTube transcript' : 'Paste your long-form content'}
          </div>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={8}
            placeholder={contentType === 'transcript' ? 'Open any YouTube video → click (...) → Show transcript → copy all text and paste here...' : 'Paste your blog post, podcast notes, or any long content here...'}
            style={{ width: '100%', padding: '14px', fontSize: '14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.65, color: '#111', background: '#fafafa', minHeight: '160px' }}
          />
          <div style={{ fontSize: '12px', marginTop: '6px', marginBottom: '16px', color: content.length < 100 ? '#ef4444' : '#16a34a' }}>
            {content.length} characters {content.length < 100 ? `— need ${100 - content.length} more to continue` : '— ready to go'}
          </div>

          <button onClick={handleSubmit} disabled={loading || content.length < 100} style={{ width: '100%', padding: '14px', background: loading || content.length < 100 ? '#d1d5db' : '#111', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 600, cursor: loading || content.length < 100 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {loading ? 'Finding best clips...' : 'Find my best clips'}
          </button>
        </div>

        {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '14px 16px', fontSize: '14px', color: '#dc2626', marginBottom: '16px' }}>{error}</div>}

        {results && (
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '24px' }}>
            <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ fontSize: '17px', fontWeight: 700, color: '#111' }}>Your 3 best clip moments</div>
              <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '3px' }}>Copy the hook and script — paste into CapCut or record on camera</div>
            </div>

            {results.clips.map((clip: any, i: number) => (
              <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', marginBottom: '14px' }}>
                <div style={{ padding: '14px 16px', background: '#f9fafb', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '26px', height: '26px', background: '#111', color: '#fff', borderRadius: '6px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{clip.clipNumber}</div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>Clip {clip.clipNumber}</div>
                    <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '1px' }}>Suggested timestamp: {clip.timestamp}</div>
                  </div>
                </div>
                <div style={{ padding: '16px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#9ca3af', marginBottom: '6px' }}>Hook — first line of your reel</div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#111', lineHeight: 1.5, marginBottom: '12px', padding: '12px', background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '8px' }}>{clip.hook}</div>

                  <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#9ca3af', marginBottom: '6px' }}>Why this works</div>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '14px', fontStyle: 'italic', paddingLeft: '10px', borderLeft: '2px solid #e5e7eb' }}>{clip.whyItWorks}</div>

                  <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#9ca3af', marginBottom: '6px' }}>Full reel script — read this on camera</div>
                  <div style={{ background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '8px', padding: '14px', fontSize: '13px', color: '#374151', lineHeight: 1.75, whiteSpace: 'pre-wrap', marginBottom: '10px' }}>{clip.reelScript}</div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[['hook', clip.hook, 'Copy hook'], ['script', clip.reelScript, 'Copy full script']].map(([key, text, label]) => (
                      <button key={key} onClick={() => copyText(text as string, `${key}-${i}`)} style={{ padding: '7px 14px', fontSize: '12px', fontWeight: 500, border: '1px solid', borderColor: copied === `${key}-${i}` ? '#bbf7d0' : '#e5e7eb', borderRadius: '7px', cursor: 'pointer', background: copied === `${key}-${i}` ? '#f0fdf4' : '#fff', color: copied === `${key}-${i}` ? '#166534' : '#374151' }}>
                        {copied === `${key}-${i}` ? 'Copied!' : label}
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