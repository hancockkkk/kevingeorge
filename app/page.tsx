'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, Check, Download, LockKeyhole, Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { useScrollPull } from '@/hooks/use-scroll-pull';
import catalog from './catalog.json';
import films from './films.json';

type Album = (typeof catalog)[number];
type Film = (typeof films)[number];
const UNLOCK_KEY = 'kevin-george-apologies-unlocked';
const records = catalog.slice().reverse();
const featuredFilms = ['iQHCFUq1GQA', 'qmerpevLK4o', 'q_OJG46cMno'].map(id => films.find(f => f.id === id)!);
const fmt = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

function ApologiesDownload() {
  return <a className="text-link download-link" href="/media/apologies.mp3" download="Kevin George - Apologies.mp3"><Download size={16} aria-hidden="true"/>Download Apologies <span className="download-format">MP3</span></a>;
}

function ReturningSubscriberForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'pending') return;
    setStatus('pending'); setMessage('');
    try {
      const response = await fetch('/api/subscriber-access', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data.error === 'string' ? data.error : 'Could not send your link. Please try again.');
      setStatus('success'); setEmail('');
      setMessage('If this email is on the Kevin George list, your access link is on its way. Check your inbox and spam folder.');
    } catch (error) { setStatus('error'); setMessage(error instanceof Error ? error.message : 'Please try again.'); }
  }
  return <form className="signup-form" onSubmit={submit}>
    {status !== 'success' && <><label htmlFor="access-email">Your email address</label><div className="email-field"><Input id="access-email" type="email" autoComplete="email" required maxLength={254} placeholder="you@email.com" value={email} onChange={event => setEmail(event.target.value)} aria-describedby="access-message" aria-invalid={status === 'error'} disabled={status === 'pending'} className="signup-input"/><button type="submit" disabled={status === 'pending'}>{status === 'pending' ? 'Sending…' : 'Send link'}</button></div></>}
    <p id="access-message" role="status" className={status === 'error' ? 'form-error' : 'access-message'}>{message}</p>
  </form>;
}

function SignupForm({ onSuccess, id }: { onSuccess: () => void; id: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'pending') return;
    setStatus('pending'); setMessage('');
    try {
      const response = await fetch('/api/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      const data = await response.json() as { error?: unknown; message?: unknown };
      if (!response.ok) throw new Error(typeof data.error === 'string' ? data.error : 'Could not join the list. Please try again.');
      setStatus('success'); setMessage(typeof data.message === 'string' ? data.message : 'You’re on the list. The full song is yours.'); setEmail(''); onSuccess();
    } catch (error) { setStatus('error'); setMessage(error instanceof Error ? error.message : 'Please try again in a moment.'); }
  }
  return <form onSubmit={submit} className="signup-form">
    {status === 'success' ? <div className="signup-success" role="status"><Check size={24}/><p>{message}</p></div> : <>
      <label htmlFor={id}>Your email address</label>
      <div className="email-field"><Input id={id} type="email" autoComplete="email" required maxLength={254} placeholder="you@email.com" value={email} onChange={event => setEmail(event.target.value)} aria-describedby={`${id}-consent ${id}-message`} aria-invalid={status === 'error'} disabled={status === 'pending'} className="signup-input"/><button type="submit" disabled={status === 'pending'} aria-label={status === 'pending' ? 'Joining the list' : 'Join the list'}>{status === 'pending' ? '…' : <span>Join</span>}</button></div>
      <p id={`${id}-consent`} className="consent">By joining, you agree to email updates from Kevin George about music, merch, and shows. Unsubscribe anytime. <a href="https://www.kevingeorge.xyz/privacy" target="_blank" rel="noreferrer">Privacy</a> & <a href="https://www.kevingeorge.xyz/terms" target="_blank" rel="noreferrer">Terms</a>.</p>
      <p id={`${id}-message`} className="form-error" role="status">{message}</p>
    </>}
  </form>;
}

export default function Home() {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(161);
  const [unlocked, setUnlocked] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [returningSubscriber, setReturningSubscriber] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [showAllRecords, setShowAllRecords] = useState(false);
  const [showAllFilms, setShowAllFilms] = useState(false);
  const [audioError, setAudioError] = useState('');
  const playLimit = duration;
  useScrollPull([showAllRecords, showAllFilms]);

  useEffect(() => {
    const url = new URL(window.location.href);
    let remembered = false;
    try { remembered = window.localStorage.getItem(UNLOCK_KEY) === 'true'; } catch { /* Email links also work without storage. */ }
    if (remembered || url.searchParams.get('unlock') === 'apologies') {
      setUnlocked(true);
      try { window.localStorage.setItem(UNLOCK_KEY, 'true'); } catch { /* Current-session access remains available. */ }
    }
    if (url.searchParams.get('unlock') === 'apologies') {
      url.searchParams.delete('unlock');
      window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
    }
  }, []);

  function unlock() {
    setUnlocked(true);
    try { window.localStorage.setItem(UNLOCK_KEY, 'true'); } catch { /* Current-session access remains available. */ }
  }
  async function toggleAudio() {
    if (!unlocked) { setReturningSubscriber(false); setSignupOpen(true); return; }
    const player = audio.current;
    if (!player) return;
    if (!player.paused) { player.pause(); return; }
    setAudioError('');
    try { await player.play(); } catch { setAudioError('Audio could not start. Tap play to try again.'); }
  }
  function seek(value: number | readonly number[]) {
    const next = Math.min(Array.isArray(value) ? value[0] : value as number, playLimit);
    if (audio.current) { audio.current.currentTime = next; setElapsed(next); }
  }
  function openFilm(film: Film) { audio.current?.pause(); setSelectedFilm(film); }
  function openAlbum(album: Album) { audio.current?.pause(); setSelectedAlbum(album); }

  return <>
    <a className="skip-link" href="#music">Skip to music</a>
    <header id="top" className="site-header">
      <a className="wordmark" href="#top">KEVIN GEORGE</a>
      <nav aria-label="Main navigation"><a href="#music">Music</a><a href="#films">Videos</a><a href="#shop">Shop</a></nav>
      <button className="subscribe-link" onClick={() => setSignupOpen(true)}>Subscribe</button>
    </header>
    <main className="page-shell">
      <section className="first-listen" aria-labelledby="apologies-title" data-pull>
        <button className="apologies-cover" onClick={toggleAudio} aria-label={!unlocked ? 'Join to hear and download Apologies' : playing ? 'Pause Apologies' : 'Play Apologies'} aria-pressed={unlocked ? playing : undefined}>
          <img src="/media/apologies-cover-final.webp" alt="Apologies cover art: a textured portrait with a black spiked crown against a red background" width="1400" height="1400" fetchPriority="high"/>
          <span className="cover-play" aria-hidden="true">{!unlocked ? <LockKeyhole size={20}/> : playing ? <Pause size={20} fill="currentColor"/> : <Play size={20} fill="currentColor"/>}</span>
        </button>
        <h1 id="apologies-title">Apologies</h1>
        <p className="release-year">2026</p>
        {unlocked ? <><div className="inline-player">
          <button className="play-button" onClick={toggleAudio} aria-label={playing ? 'Pause Apologies' : 'Play Apologies'}>{playing ? <Pause size={16} fill="currentColor"/> : <Play size={16} fill="currentColor"/>}</button>
          <span className="time">{fmt(elapsed)}</span>
          <Slider aria-label="Apologies song position" className="song-slider" min={0} max={playLimit} step={0.1} value={[Math.min(elapsed, playLimit)]} onValueChange={seek}/>
          <span className="time">{fmt(playLimit)}</span>
        </div>
        <p className="preview-note">Full track unlocked</p>
        <div className="track-download"><ApologiesDownload/></div></> : <div className="song-gate">
          <p>Hear it. Download it. Keep it.</p>
          <button className="primary-action" onClick={() => { setReturningSubscriber(false); setSignupOpen(true); }}>Join to hear and download Apologies</button>
          <button className="returning-link" onClick={() => { setReturningSubscriber(true); setSignupOpen(true); }}>Already joined? Get an access link</button>
        </div>}
        {audioError && <p className="form-error" role="alert">{audioError}</p>}
        <p className="apologies-release-date"><time dateTime="2026-10-02">10-02-2026</time></p>
      </section>

      <section id="music" className="music-section" aria-labelledby="music-heading">
        <h2 id="music-heading" className="section-label">MUSIC</h2>
        <div id="record-collection" className="release-list">
          {(showAllRecords ? records : records.slice(0, 4)).map((album, i) => <article className="release" key={album.id} data-pull>
            <button className="cover-button" onClick={() => openAlbum(album)} aria-label={`Listen to ${album.title}`}><img src={album.coverImage} alt={`${album.title} cover`} loading={i === 0 ? 'eager' : 'lazy'} width="420" height="420"/></button>
            <h3><button onClick={() => openAlbum(album)}>{album.title}</button></h3>
            <p className="release-year">{album.year}</p>
            <div className="release-links"><a href={album.spotifyLink} target="_blank" rel="noreferrer">Spotify</a><a href={album.appleMusicLink} target="_blank" rel="noreferrer">Apple Music</a><button onClick={() => openAlbum(album)}>Listen</button></div>
          </article>)}
        </div>
        <button className="more-link" onClick={() => setShowAllRecords(!showAllRecords)} aria-expanded={showAllRecords} aria-controls="record-collection">{showAllRecords ? 'Less music −' : 'More music +'}</button>
      </section>

      <section id="films" className="videos-section" aria-labelledby="videos-heading">
        <div className="section-heading" data-pull><h2 id="videos-heading" className="section-label">VIDEOS</h2><a href="https://www.youtube.com/@KevinGeorge" target="_blank" rel="noreferrer">YouTube ↗</a></div>
        <div className="video-list" id="video-list">{(showAllFilms ? [...featuredFilms, ...films.filter(film => !featuredFilms.some(feature => feature.id === film.id))] : featuredFilms).map(film => <article key={film.id} className="video-post" data-pull>
          <button className="video-button" onClick={() => openFilm(film)} aria-label={`Watch ${film.title}`}><span className="video-image">{film.thumbnail && <img src={film.thumbnail} alt={`Still from ${film.title}`} loading="lazy"/>}<span className="video-play"><Play size={24} fill="currentColor"/></span></span></button>
          <h3><button onClick={() => openFilm(film)}>{film.title}</button></h3>
        </article>)}</div>
        <button className="more-link" onClick={() => setShowAllFilms(!showAllFilms)} aria-expanded={showAllFilms} aria-controls="video-list">{showAllFilms ? 'Fewer videos −' : 'More videos +'}</button>
      </section>

      <section id="shop" className="shop-section" data-pull><h2 className="section-label">SHOP</h2><p>Coming soon.</p></section>
      <section id="connect" className="connect-section" data-pull><h2 className="section-label">SUBSCRIBE</h2><p>Hear and download “Apologies.” Get music, releases, and updates.</p><SignupForm id="footer-email" onSuccess={unlock}/>{unlocked && <div className="subscriber-actions"><button className="text-link" onClick={toggleAudio}>{playing ? 'Pause Apologies' : 'Listen to Apologies'}</button><ApologiesDownload/></div>}</section>
    </main>
    <footer className="site-footer"><span>© {new Date().getFullYear()} Kevin George</span><div><a href="https://www.kevingeorge.xyz/privacy" target="_blank" rel="noreferrer">Privacy</a><a href="https://www.kevingeorge.xyz/terms" target="_blank" rel="noreferrer">Terms</a><a href="#top">Top ↑</a></div></footer>

    {hasStarted && <aside className="audio-dock" aria-label="Apologies audio player"><span className="dock-track">APOLOGIES</span><div className="dock-controls"><button className="icon-button replay-button" aria-label="Replay Apologies from the beginning" onClick={() => seek(0)}><RotateCcw size={14}/></button><button className="play-button" onClick={toggleAudio} aria-label={playing ? 'Pause Apologies' : 'Play Apologies'}>{playing ? <Pause size={14} fill="currentColor"/> : <Play size={14} fill="currentColor"/>}</button><span className="time">{fmt(elapsed)}</span><Slider aria-label="Playback position" className="song-slider" min={0} max={playLimit} step={0.1} value={[Math.min(elapsed, playLimit)]} onValueChange={seek}/><span className="time">{fmt(playLimit)}</span><button className="icon-button mute-button" aria-label={muted ? 'Unmute' : 'Mute'} onClick={() => setMuted(!muted)}>{muted ? <VolumeX size={16}/> : <Volume2 size={16}/>}</button></div><button className="dock-unlock" onClick={() => setSignupOpen(true)}>{unlocked ? 'Subscribed' : 'Full song ↗'}</button></aside>}
    {unlocked && <audio ref={audio} src="/media/apologies.mp3" preload="metadata" muted={muted} onPlay={() => { setPlaying(true); setHasStarted(true); }} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onError={() => setAudioError('The song could not load. Please refresh and try again.')} onLoadedMetadata={() => { if (audio.current && Number.isFinite(audio.current.duration)) setDuration(audio.current.duration); }} onTimeUpdate={() => { if (audio.current) setElapsed(audio.current.currentTime); }}/>}

    <Dialog open={selectedAlbum !== null} onOpenChange={open => { if (!open) setSelectedAlbum(null); }}><DialogContent className="album-dialog redesign-dialog">{selectedAlbum && <><DialogHeader><DialogDescription>{selectedAlbum.year} · Kevin George</DialogDescription><DialogTitle>{selectedAlbum.title}</DialogTitle></DialogHeader><div className="album-dialog-body"><img src={selectedAlbum.coverImage} alt={`${selectedAlbum.title} cover`}/><div>{selectedAlbum.tracklist.length > 0 ? <ol className="tracklist">{selectedAlbum.tracklist.map((track, i) => <li key={track}><span>{String(i + 1).padStart(2, '0')}</span>{track}</li>)}</ol> : <p className="record-intro">Listen below.</p>}</div></div><iframe title={`Spotify player for ${selectedAlbum.title}`} src={`https://open.spotify.com/embed/album/${selectedAlbum.spotifyLink.split('/album/')[1].split('?')[0]}?utm_source=generator&theme=0`} width="100%" height="152" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" className="spotify-player"/><div className="stream-links"><a href={selectedAlbum.spotifyLink} target="_blank" rel="noreferrer">Listen on Spotify <ArrowUpRight size={16}/></a><a href={selectedAlbum.appleMusicLink} target="_blank" rel="noreferrer">Apple Music <ArrowUpRight size={16}/></a></div></>}</DialogContent></Dialog>
    <Dialog open={selectedFilm !== null} onOpenChange={open => { if (!open) setSelectedFilm(null); }}><DialogContent className="video-dialog redesign-dialog">{selectedFilm && <><DialogHeader><DialogDescription>Kevin George · Official music video</DialogDescription><DialogTitle>{selectedFilm.title}</DialogTitle></DialogHeader><iframe title={`${selectedFilm.title} music video`} src={`https://www.youtube.com/embed/${selectedFilm.id}?autoplay=1&rel=0`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/><a className="text-link" href={`https://www.youtube.com/watch?v=${selectedFilm.id}`} target="_blank" rel="noreferrer">Watch on YouTube <ArrowUpRight size={16}/></a></>}</DialogContent></Dialog>
    <Dialog open={signupOpen} onOpenChange={setSignupOpen}><DialogContent className="signup-dialog redesign-dialog"><DialogHeader><DialogTitle>{!unlocked && returningSubscriber ? 'WELCOME BACK' : 'SUBSCRIBE'}</DialogTitle><DialogDescription>{!unlocked && returningSubscriber ? 'Get an Apologies access link at the email you joined with. No need to subscribe again.' : 'Join the email list to hear and download “Apologies,” plus get updates from Kevin George.'}</DialogDescription></DialogHeader>{unlocked ? <div className="unlock-success"><Check size={28}/><p>You’re connected. Listen to the full song or download it to keep.</p><div className="subscriber-actions"><button className="primary-action" onClick={() => { setSignupOpen(false); void toggleAudio(); }}>Continue listening <Play size={16}/></button><ApologiesDownload/></div></div> : <>{returningSubscriber ? <ReturningSubscriberForm/> : <SignupForm id="dialog-email" onSuccess={unlock}/>}<button className="returning-link" onClick={() => setReturningSubscriber(!returningSubscriber)}>{returningSubscriber ? 'New here? Join the email list' : 'Already joined? Get an access link'}</button></>}</DialogContent></Dialog>
  </>;
}
