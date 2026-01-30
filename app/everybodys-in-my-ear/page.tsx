"use client";

import { siteContent } from "@/content/siteContent";
import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";

export default function EverybodysInMyEarPage() {
  const album = siteContent.everybodysInMyEar;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  // Audio player state
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const delayNodeRef = useRef<DelayNode | null>(null);
  const delayFeedbackRef = useRef<GainNode | null>(null);
  const delayWetRef = useRef<GainNode | null>(null);
  const reverbNodeRef = useRef<ConvolverNode | null>(null);
  const reverbWetRef = useRef<GainNode | null>(null);
  const dryGainRef = useRef<GainNode | null>(null);
  
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasSelectedTrack, setHasSelectedTrack] = useState(false);
  
  // UNTITLED-style controls
  const [playbackRate, setPlaybackRate] = useState(1);
  const [pitchShift, setPitchShift] = useState(0); // in semitones (-12 to +12)
  const [delayAmount, setDelayAmount] = useState(0); // 0-100%
  const [reverbAmount, setReverbAmount] = useState(0); // 0-100%
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Track list
  const tracks = [
    { number: 1, title: "INTRO", file: "/audio/01 INTRO.wav" },
    { number: 2, title: "EVERYBODY'S IN MY EAR", file: "/audio/02 EVERYBODYS IN MY EAR.wav" },
    { number: 3, title: "ALL IN MY HEAD", file: "/audio/03 ALL IN MY HEAD.wav" },
    { number: 4, title: "OUTSIDE", file: "/audio/04 OUTSIDE.wav" },
    { number: 5, title: "SUPER SWEET", file: "/audio/05 SUPER SWEET.wav" },
    { number: 6, title: "CONFUSED", file: "/audio/06 CONFUSED.wav" },
    { number: 7, title: "DREAMSTATE", file: "/audio/07 DREAMSTATE.wav" },
  ];

  // Background images from EIME STILLS
  const backgroundImages = [
    "/images/eime/Screen%20Shot%202021-07-23%20at%201.24.48%20PM.png",
    "/images/eime/Screen%20Shot%202021-07-23%20at%201.25.37%20PM.png",
    "/images/eime/Screen%20Shot%202021-07-23%20at%201.28.48%20PM.png",
    "/images/eime/Screen%20Shot%202021-07-23%20at%201.32.46%20PM.png",
    "/images/eime/Screen%20Shot%202021-07-23%20at%201.43.48%20PM.png",
    "/images/eime/Screen%20Shot%202021-07-23%20at%201.44.24%20PM.png",
  ];

  // Cycle through background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  // Auto-play current track
  useEffect(() => {
    if (audioRef.current && isAudioPlaying) {
      audioRef.current.play();
    }
  }, [currentTrack]);

  // Handle track end - auto play next
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      nextTrack();
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [currentTrack]);

  // Handle global mouse events for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, duration]);

  // Sync video state with actual playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsVideoPlaying(true);
    const handlePause = () => setIsVideoPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  // Auto-play when track changes (if already playing)
  useEffect(() => {
    if (audioRef.current && isAudioPlaying) {
      audioRef.current.play();
    }
  }, [currentTrack]);

  // Audio player functions
  const playTrack = (index: number) => {
    // If clicking the same track, toggle play/pause
    if (currentTrack === index && hasSelectedTrack) {
      if (audioRef.current) {
        if (isAudioPlaying) {
          audioRef.current.pause();
          setIsAudioPlaying(false);
        } else {
          audioRef.current.play();
          setIsAudioPlaying(true);
        }
      }
    } else {
      // Different track, start playing it
      setCurrentTrack(index);
      setIsAudioPlaying(true);
      setHasSelectedTrack(true);
    }
  };

  const toggleAudioPlay = () => {
    if (audioRef.current) {
      // Initialize audio context on first play (required for Web Audio API)
      if (!audioContextRef.current) {
        initAudioContext();
      }
      
      if (isAudioPlaying) {
        audioRef.current.pause();
        setIsAudioPlaying(false);
      } else {
        audioRef.current.play();
        setIsAudioPlaying(true);
      }
    }
  };

  const nextTrack = () => {
    const next = (currentTrack + 1) % tracks.length;
    playTrack(next);
  };

  const prevTrack = () => {
    const prev = currentTrack === 0 ? tracks.length - 1 : currentTrack - 1;
    playTrack(prev);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      // Reapply speed and pitch when new track loads
      reapplyEffects();
    }
  };

  // Reapply all effects when track changes
  const reapplyEffects = () => {
    if (audioRef.current) {
      // Reapply speed
      if (playbackRate !== 1) {
        audioRef.current.preservesPitch = true;
        audioRef.current.playbackRate = playbackRate;
      }
      
      // Reapply pitch
      if (pitchShift !== 0) {
        const pitchRatio = Math.pow(2, pitchShift / 12);
        audioRef.current.preservesPitch = false;
        audioRef.current.playbackRate = playbackRate * pitchRatio;
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      audioRef.current.currentTime = percent * duration;
      setCurrentTime(percent * duration);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleSeek(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && audioRef.current && progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      audioRef.current.currentTime = percent * duration;
      setCurrentTime(percent * duration);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Initialize Web Audio API with effects chain
  const initAudioContext = () => {
    if (!audioRef.current || audioContextRef.current) return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const source = audioContext.createMediaElementSource(audioRef.current);
    
    // Create nodes
    const dryGain = audioContext.createGain();
    const masterGain = audioContext.createGain();
    
    // Delay effect chain
    const delay = audioContext.createDelay(2.0); // Max 2 seconds
    delay.delayTime.value = 0.3; // 300ms delay
    const delayFeedback = audioContext.createGain();
    delayFeedback.gain.value = 0.4; // 40% feedback
    const delayWet = audioContext.createGain();
    delayWet.gain.value = 0;
    
    // Reverb effect (simple convolver)
    const reverb = audioContext.createConvolver();
    const reverbWet = audioContext.createGain();
    reverbWet.gain.value = 0;
    
    // Create impulse response for reverb
    const sampleRate = audioContext.sampleRate;
    const length = sampleRate * 2; // 2 second reverb
    const impulse = audioContext.createBuffer(2, length, sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
      }
    }
    reverb.buffer = impulse;
    
    // Connect audio graph: source -> dry/wet splits -> effects -> master -> destination
    source.connect(dryGain);
    
    // Delay chain: source -> delay -> feedback loop -> delayWet -> master
    source.connect(delay);
    delay.connect(delayFeedback);
    delayFeedback.connect(delay); // Feedback loop
    delay.connect(delayWet);
    delayWet.connect(masterGain);
    
    // Reverb chain: source -> reverb -> reverbWet -> master
    source.connect(reverb);
    reverb.connect(reverbWet);
    reverbWet.connect(masterGain);
    
    // Dry signal and master output
    dryGain.connect(masterGain);
    masterGain.connect(audioContext.destination);
    
    // Store references
    audioContextRef.current = audioContext;
    sourceNodeRef.current = source;
    gainNodeRef.current = masterGain;
    delayNodeRef.current = delay;
    delayFeedbackRef.current = delayFeedback;
    delayWetRef.current = delayWet;
    reverbNodeRef.current = reverb;
    reverbWetRef.current = reverbWet;
    dryGainRef.current = dryGain;
  };

  // Change playback speed (independent of pitch)
  const changeSpeed = (rate: number) => {
    if (audioRef.current) {
      // When using preservesPitch, speed changes but pitch stays the same
      audioRef.current.playbackRate = rate;
      audioRef.current.preservesPitch = true; // Keep pitch constant when changing speed
      setPlaybackRate(rate);
    }
  };

  // Change pitch (independent of speed)
  const changePitch = (semitones: number) => {
    if (audioRef.current) {
      // Initialize context if needed
      if (!audioContextRef.current) {
        initAudioContext();
      }
      
      // Calculate pitch shift ratio: 2^(semitones/12)
      const pitchRatio = Math.pow(2, semitones / 12);
      
      // Apply pitch shift by changing playback rate WITHOUT preservesPitch
      // We'll compensate speed later
      audioRef.current.preservesPitch = false;
      
      // Combine pitch shift with current speed
      audioRef.current.playbackRate = playbackRate * pitchRatio;
      
      setPitchShift(semitones);
    }
  };

  // Change delay amount
  const changeDelay = (amount: number) => {
    if (!audioContextRef.current) {
      initAudioContext();
    }
    if (delayWetRef.current && dryGainRef.current) {
      const wetGain = amount / 100;
      delayWetRef.current.gain.value = wetGain * 0.5; // Scale down to avoid too loud
      setDelayAmount(amount);
    }
  };

  // Change reverb amount
  const changeReverb = (amount: number) => {
    if (!audioContextRef.current) {
      initAudioContext();
    }
    if (reverbWetRef.current && dryGainRef.current) {
      const wetGain = amount / 100;
      reverbWetRef.current.gain.value = wetGain * 0.4; // Scale down to avoid too loud
      setReverbAmount(amount);
    }
  };

  // Toggle video play/pause
  const toggleVideo = async () => {
    if (videoRef.current) {
      try {
        if (isVideoPlaying) {
          videoRef.current.pause();
          setIsVideoPlaying(false);
        } else {
          await videoRef.current.play();
          setIsVideoPlaying(true);
        }
      } catch (error) {
        console.log('Video play error:', error);
      }
    }
  };

  return (
    <div className="relative">
      {/* Animated Background - Fixed for both sections */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {backgroundImages.map((img, index) => (
          <div
            key={img}
            className="absolute inset-0 transition-opacity duration-2000"
            style={{
              opacity: index === currentImageIndex ? 1 : 0,
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={tracks[currentTrack].file}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />

      {/* Section 1: Flip Card Album Player */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-xs" style={{ perspective: '1000px' }}>
          {/* Flip Card Container */}
          <div
            className="relative w-full aspect-square transition-transform duration-700"
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
          >
            {/* FRONT: Clean Album Cover */}
            <div
              className="absolute inset-0 rounded-xl shadow-2xl overflow-hidden group cursor-pointer"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden'
              }}
            >
              {/* Pure album art with dim overlay */}
              <img
                src={album.coverImage}
                alt={album.title}
                className="w-full h-full object-cover brightness-75"
              />
              
              {/* Hover overlay with controls */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                {/* Play button */}
                <div className="flex items-center justify-center gap-3 mb-4">
                  <button
                    onClick={toggleAudioPlay}
                    className="w-16 h-16 rounded-full bg-white hover:bg-white/90 flex items-center justify-center transition-all shadow-2xl hover:scale-105"
                  >
                    {isAudioPlaying ? (
                      <Pause className="w-7 h-7 text-black" fill="black" />
                    ) : (
                      <Play className="w-7 h-7 text-black ml-1" fill="black" />
                    )}
                  </button>
                </div>

                {/* Current track info */}
                <div className="text-center mb-3">
                  <p className="text-xs text-white/60 mb-1">NOW PLAYING</p>
                  <p className="text-sm text-white font-medium">{tracks[currentTrack].title}</p>
                </div>

                {/* Flip button */}
                <button
                  onClick={() => setIsFlipped(true)}
                  className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs backdrop-blur-sm transition-all"
                >
                  View Tracklist ↻
                </button>
              </div>
            </div>

            {/* BACK: Track List */}
            <div
              className="absolute inset-0 backdrop-blur-xl bg-black/40 rounded-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              {/* Scrollable Track List with EIME Stills */}
              <div 
                className="flex-1 overflow-y-auto p-3 space-y-0.5"
                onClick={(e) => {
                  // Hide controls if clicking in empty space (not on a track button)
                  if (e.target === e.currentTarget) {
                    setHasSelectedTrack(false);
                    setShowAdvanced(false);
                    if (audioRef.current) {
                      audioRef.current.pause();
                      setIsAudioPlaying(false);
                    }
                  }
                }}
              >
                {tracks.map((track, index) => {
                  const isActive = currentTrack === index;
                  const isPlaying = isActive && isAudioPlaying;
                  const bgImage = backgroundImages[index % backgroundImages.length];

                  return (
                    <button
                      key={track.number}
                      onClick={() => playTrack(index)}
                      className={`w-full relative overflow-hidden flex items-center gap-2 px-3 py-3 rounded-xl transition-all ${
                        isActive
                          ? 'ring-2 ring-white/40 shadow-xl'
                          : 'hover:ring-1 hover:ring-white/20'
                      }`}
                      style={{
                        backgroundImage: `url(${bgImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      {/* Dark overlay for readability */}
                      <div className={`absolute inset-0 transition-all ${
                        isActive 
                          ? 'bg-black/50'
                          : 'bg-black/70'
                      }`} />
                      
                      {/* Content */}
                      <div className="relative flex items-center gap-2 w-full">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                          isActive ? 'bg-white shadow-lg' : 'bg-white/30'
                        }`}>
                          <span className={`text-[9px] font-mono font-medium ${
                            isActive ? 'text-black' : 'text-white'
                          }`}>
                            {track.number}
                          </span>
                        </div>
                        <p className={`text-sm flex-1 text-left truncate transition-all ${
                          isActive ? 'text-white font-semibold' : 'text-white/80'
                        }`}>
                          {track.title}
                        </p>
                        {isPlaying && (
                          <div className="flex gap-1">
                            <div className="w-0.5 h-3 bg-white rounded-full animate-pulse" />
                            <div className="w-0.5 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                            <div className="w-0.5 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Fixed Controls at Bottom */}
              <div className="flex-shrink-0 px-3 pb-3 pt-2 border-t border-white/10 bg-black/60 backdrop-blur-sm">
                {hasSelectedTrack && (
                  <>
                    {/* Progress with draggable ball */}
                    <div
                      ref={progressBarRef}
                      onMouseDown={handleMouseDown}
                      className="relative w-full h-0.5 bg-white/20 rounded-full mb-2 cursor-pointer group py-2 -my-2"
                    >
                      <div
                        className="h-0.5 bg-white rounded-full pointer-events-none"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      />
                      {/* Draggable ball */}
                      <div
                        className="absolute top-1/2 w-3 h-3 bg-white rounded-full shadow-lg cursor-grab active:cursor-grabbing group-hover:scale-125 transition-transform"
                        style={{ left: `${(currentTime / duration) * 100}%`, transform: 'translate(-50%, -50%)' }}
                      />
                    </div>

                    {/* Compact controls */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] text-white/40 font-mono">{formatTime(currentTime)}</span>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={prevTrack}
                          className="w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded transition-all"
                        >
                          <SkipBack className="w-3 h-3 text-white/60" />
                        </button>
                        
                        <button
                          onClick={toggleAudioPlay}
                          className="w-7 h-7 rounded-full bg-white hover:bg-white/90 flex items-center justify-center transition-all"
                        >
                          {isAudioPlaying ? (
                            <Pause className="w-3 h-3 text-black" fill="black" />
                          ) : (
                            <Play className="w-3 h-3 text-black ml-0.5" fill="black" />
                          )}
                        </button>
                        
                        <button
                          onClick={nextTrack}
                          className="w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded transition-all"
                        >
                          <SkipForward className="w-3 h-3 text-white/60" />
                        </button>
                      </div>
                      
                      <span className="text-[9px] text-white/40 font-mono">{formatTime(duration)}</span>
                    </div>

                    {/* Advanced Controls Toggle */}
                    <button
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="w-full py-1 mb-2 bg-white/5 hover:bg-white/10 rounded text-white/60 text-[9px] uppercase tracking-wider transition-all"
                    >
                      {showAdvanced ? '− Controls' : '+ Controls'}
                    </button>

                    {/* Collapsible Effects Controls */}
                    {showAdvanced && (
                      <div className="mb-2 space-y-3 animate-in fade-in duration-200">
                    {/* Speed Control */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] text-white/60 uppercase tracking-wider">Speed</span>
                        <span className="text-[9px] text-white font-mono">{playbackRate.toFixed(1)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={playbackRate}
                        onChange={(e) => changeSpeed(parseFloat(e.target.value))}
                        className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing"
                      />
                    </div>

                    {/* Pitch Control */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] text-white/60 uppercase tracking-wider">Pitch</span>
                        <span className="text-[9px] text-white font-mono">
                          {pitchShift > 0 ? '+' : ''}{pitchShift} ST
                        </span>
                      </div>
                      <input
                        type="range"
                        min="-12"
                        max="12"
                        step="1"
                        value={pitchShift}
                        onChange={(e) => changePitch(parseInt(e.target.value))}
                        className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-purple-400 [&::-webkit-slider-thumb]:to-pink-400 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing"
                      />
                    </div>

                    {/* Delay Control */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] text-white/60 uppercase tracking-wider">Delay</span>
                        <span className="text-[9px] text-white font-mono">{delayAmount}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={delayAmount}
                        onChange={(e) => changeDelay(parseInt(e.target.value))}
                        className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-blue-400 [&::-webkit-slider-thumb]:to-cyan-400 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing"
                      />
                    </div>

                    {/* Reverb Control */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] text-white/60 uppercase tracking-wider">Reverb</span>
                        <span className="text-[9px] text-white font-mono">{reverbAmount}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={reverbAmount}
                        onChange={(e) => changeReverb(parseInt(e.target.value))}
                        className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-green-400 [&::-webkit-slider-thumb]:to-emerald-400 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing"
                      />
                    </div>
                      </div>
                    )}
                  </>
                )}

                {/* Flip back button - Always visible */}
                <button
                  onClick={() => setIsFlipped(false)}
                  className="w-full py-1.5 bg-white/10 hover:bg-white/20 rounded text-white text-xs backdrop-blur-sm transition-all"
                >
                  ↻ Back to Cover
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Music Video */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-5xl w-full">
          {/* Floating Video Player */}
          <div 
            className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 backdrop-blur-sm bg-black/20 cursor-pointer transform hover:scale-[1.01] transition-transform duration-300"
            onClick={toggleVideo}
          >
            <video
              ref={videoRef}
              className="w-full h-auto"
              loop
              playsInline
              preload="auto"
              controls
            >
              <source src="https://vz-589647.b-cdn.net/e25247a9-ee8f-4549-b180-fc8ed95cf7d0/play_1080p.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Play/Pause Overlay */}
            {!isVideoPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-2xl animate-pulse">
                  <svg className="w-10 h-10 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            )}
          </div>
          
          {/* Video Title */}
          <div className="mt-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-2xl">
              ALL IN MY HEAD
            </h2>
            <p className="text-white/70 mt-2">Official Music Video</p>
          </div>
        </div>
      </section>
    </div>
  );
}
