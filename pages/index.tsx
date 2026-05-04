import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState('transcript');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  async function handleSubmit(e) {
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

      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
      } else {
        setResults(data);
      }
    } catch (err) {
      setError('Network error. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  }

  function copyText(text, key) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  }

  const s = {
    wrap: { maxWidth: '700px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' },
    h1: { fontSize: '26px', fontWeight: '600', marginBottom: '6px', color: '#111' },
    sub: { color: '#666', fontSize: '15px', marginBottom: '32px' },
    toggleWrap: { display: 'flex', gap: '8px', marginBottom: '12px' },
    toggleBtn: (active) => ({
      padding: '7px 16px', borderRadius: '8px', border: '1px solid',
      borderColor: active ? '#0070f3' : '#ddd',
      background: active ? '#e8f0fe' : 'white',
      color: active ? '#0040c1' : '#555',
      fontWeight: active ? '500' : '400',
      cursor: 'pointer', fontSize: '13px'
    }),
    label: { fontSize: '13px', color: '#555', marginBottom: '6px', display: 'block' },
    textarea: { width: '100%', padding: '12px', fontSize: '14px', border: '1px solid #ddd', borderRadius: '8px', resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.6' },
    btn: (disabled) => ({ marginTop: '12px', padding: '12px 28px', background: disabled ? '#ccc' : '#0070f3', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: disabled ? 'not-allowed' : 'pointer', fontWeight: '500' }),
    errBox: { marginTop: '20px', padding: '12px 16px', background: '#fff0f0', border: '1px solid #fcc', borderRadius: '8px', color: '#c00', fontSize: '14px' },
    clipCard: { border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', marginBottom: '20px', background: 'white' },
    clipNum: { fontSize: '12px', fontWeight: '600', color: '#0070f3', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' },
    timestamp: { fontSize: '13px', color: '#888', marginBottom: '12px' },
    sectionLabel: { fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#999', marginBottom: '4px', marginTop: '14px' },
    hookText: { fontSize: '16px', fontWeight: '500', color: '#111', lineHeight: '1.5', marginBottom: '4px' },
    whyText: { fontSize: '13px', color: '#666', fontStyle: 'italic', marginBottom: '4px' },
    scriptBox: { background: '#f8f9fa', border: '1px solid #eee', borderRadius: '8px', padding: '14px', fontSize: '14px', color: '#333', lineHeight: '1.75', whiteSpace: 'pre-wrap' },
    copyBtn: (active) => ({ marginTop: '8px', padding: '5px 14px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', background: active ? '#f0fff4' : 'white', color: active ? '#27500A' : '#555' }),
    resultHeader: { fontSize: '18px', fontWeight: '600', color: '#111', marginBottom: '4px' },
    resultSub: { fontSize: '13px', color: '#888', marginBottom: '20px' },
  };

  return (
    <>
      <Head>
        <title>Clip Finder — Turn long videos into viral short clips</title>
        <meta name="description" content="Paste any transcript or text. Get the 3 best clip moments with hooks and full reel scripts." />
      </Head>

      <main style={s.wrap}>
        <h1 style={s.h1}>Clip Finder</h1>
        <p style={s.sub}>Paste a YouTube transcript or any long content. Get the 3 best moments to turn into short clips — with hooks and full reel scripts.</p>

        <form onSubmit={handleSubmit}>
          <div style={s.toggleWrap}>
            <button type="button" style={s.toggleBtn(contentType === 'transcript')} onClick={() => setContentType('transcript')}>
              YouTube transcript
            </button>
            <button type="button" style={s.toggleBtn(contentType === 'general')} onClick={() => setContentType('general')}>
              Blog / podcast / other text
            </button>
          </div>

          <label style={s.label}>
            {contentType === 'transcript'
              ? 'Paste your YouTube transcript below (open any YouTube video → click "..." → "Show transcript" → copy all text)'
              : 'Paste your blog post, podcast notes, or any long-form content below'}
          </label>

          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={contentType === 'transcript'
              ? "Paste the full YouTube transcript here..."
              : "Paste your blog post, article, podcast notes, or any long content here..."}
            rows={9}
            style={s.textarea}
          />

          <div style={{ marginTop: '8px', fontSize: '12px', color: content.length < 100 ? '#e57' : '#999' }}>
            {content.length} characters {content.length < 100 ? `— need at least ${100 - content.length} more` : '— ready'}
          </div>

          <button type="submit" disabled={loading || content.length < 100} style={s.btn(loading || content.length < 100)}>
            {loading ? 'Finding best clips...' : 'Find my best clips'}
          </button>
        </form>

        {error && <div style={s.errBox}>{error}</div>}

        {results && (
          <div style={{ marginTop: '40px' }}>
            <p style={s.resultHeader}>Your 3 best clip moments</p>
            <p style={s.resultSub}>Copy the hook and script for each clip. Use them in CapCut, Instagram Reels, or TikTok.</p>

            {results.clips.map((clip, i) => (
              <div key={i} style={s.clipCard}>
                <div style={s.clipNum}>Clip {clip.clipNumber}</div>
                <div style={s.timestamp}>Suggested timestamp: {clip.timestamp}</div>

                <div style={s.sectionLabel}>Hook — first line of your reel</div>
                <div style={s.hookText}>{clip.hook}</div>
                <button style={s.copyBtn(copied === `hook-${i}`)} onClick={() => copyText(clip.hook, `hook-${i}`)}>
                  {copied === `hook-${i}` ? 'Copied!' : 'Copy hook'}
                </button>

                <div style={s.sectionLabel}>Why this clip works</div>
                <div style={s.whyText}>{clip.whyItWorks}</div>

                <div style={s.sectionLabel}>Full reel script — read this on camera</div>
                <div style={s.scriptBox}>{clip.reelScript}</div>
                <button style={s.copyBtn(copied === `script-${i}`)} onClick={() => copyText(clip.reelScript, `script-${i}`)}>
                  {copied === `script-${i}` ? 'Copied!' : 'Copy full script'}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}