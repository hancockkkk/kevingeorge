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
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

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

  // Audio player functions
  const playTrack = (index: number) => {
    setCurrentTrack(index);
    setIsAudioPlaying(true);
  };

  const toggleAudioPlay = () => {
    if (audioRef.current) {
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
            {/* FRONT: Album Cover */}
            <div
              className="absolute inset-0 backdrop-blur-xl bg-black/40 rounded-xl border border-white/10 shadow-2xl overflow-hidden"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden'
              }}
            >
              <img
                src={album.coverImage}
                alt={album.title}
                className="w-full h-full object-cover"
              />
              
              {/* Floating controls over album art */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
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
              className="absolute inset-0 backdrop-blur-xl bg-black/40 rounded-xl border border-white/10 shadow-2xl overflow-hidden"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              {/* Compact Track List */}
              <div className="p-3 space-y-0.5 max-h-[calc(100%-80px)] overflow-y-auto">
                {tracks.map((track, index) => (
                  <button
                    key={track.number}
                    onClick={() => playTrack(index)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded transition-all ${
                      currentTrack === index
                        ? 'bg-white/20'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    {/* Minimal indicator */}
                    <div className={`w-1 h-1 rounded-full flex-shrink-0 ${
                      currentTrack === index && isAudioPlaying ? 'bg-white animate-pulse' : 'bg-white/30'
                    }`} />
                    
                    {/* Track info */}
                    <span className="text-[10px] text-white/40 font-mono flex-shrink-0 w-4">
                      {track.number.toString().padStart(2, '0')}
                    </span>
                    <p className={`text-xs flex-1 text-left truncate ${
                      currentTrack === index ? 'text-white' : 'text-white/60'
                    }`}>
                      {track.title}
                    </p>
                  </button>
                ))}
              </div>

              {/* Minimal Controls */}
              <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 pt-2 border-t border-white/10 bg-black/40 backdrop-blur-sm">
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

                {/* Flip back button */}
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
              <source src="/videos/all-in-my-head.mp4" type="video/mp4" />
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
