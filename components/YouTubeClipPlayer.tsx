"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

type YouTubeClipPlayerProps = {
  videoId: string;
  title: string;
  url: string;
  startSeconds: number;
  endSeconds: number;
  lowVolume?: boolean;
  onPlayStateChange?: (playing: boolean) => void;
  externalPlaying?: boolean | null;
};

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function YouTubeClipPlayer({ videoId, title, url, startSeconds, endSeconds, lowVolume = false, onPlayStateChange, externalPlaying = null }: YouTubeClipPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<string>(`yt-player-${videoId}-${Date.now()}`);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const externalPlayingRef = useRef<boolean | null>(null);
  const isExternalUpdateRef = useRef(false);
  const clipDuration = endSeconds - startSeconds;

  const stopPlayback = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (playerRef.current) {
      try { playerRef.current.pauseVideo(); } catch {}
    }
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    const loadAPI = () => {
      if (window.YT && window.YT.Player) {
        createPlayer();
        return;
      }

      if (!document.getElementById('youtube-iframe-api')) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }

      window.onYouTubeIframeAPIReady = () => {
        createPlayer();
      };
    };

    const createPlayer = () => {
      if (playerRef.current) return;

      playerRef.current = new window.YT.Player(containerRef.current, {
        height: '0',
        width: '0',
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          start: startSeconds,
        },
        events: {
          onReady: () => {
            setPlayerReady(true);
            try {
              if (lowVolume) {
                playerRef.current.setVolume(25);
              }
              playerRef.current.seekTo(startSeconds, true);
            } catch {}
          },
          onStateChange: (event: any) => {
            const wasExternal = isExternalUpdateRef.current;
            isExternalUpdateRef.current = false;

            if (event.data === window.YT.PlayerState.PLAYING) {
              if (lowVolume) {
                try { playerRef.current.setVolume(25); } catch {}
              }
              setIsPlaying(true);
              startTimer();
              externalPlayingRef.current = true;
              if (!wasExternal) {
                onPlayStateChange?.(true);
              }
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
              if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
              }
              externalPlayingRef.current = false;
              if (!wasExternal) {
                onPlayStateChange?.(false);
              }
            } else if (event.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false);
              if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
              }
              externalPlayingRef.current = false;
              onPlayStateChange?.(false);
            }
          },
        },
      });
    };

    loadAPI();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch {}
        playerRef.current = null;
      }
    };
  }, [videoId, startSeconds]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      if (!playerRef.current) return;
      try {
        const currentTime = playerRef.current.getCurrentTime();
        const currentElapsed = Math.max(0, currentTime - startSeconds);

        if (currentElapsed >= clipDuration) {
          stopPlayback();
          setElapsed(clipDuration);
          return;
        }

        setElapsed(currentElapsed);
      } catch {}
    }, 250);
  }, [startSeconds, clipDuration, stopPlayback]);

  useEffect(() => {
    if (externalPlaying === null || !playerRef.current || !playerReady) return;
    if (externalPlaying === externalPlayingRef.current) return;
    externalPlayingRef.current = externalPlaying;
    isExternalUpdateRef.current = true;

    try {
      if (externalPlaying) {
        if (elapsed >= clipDuration) {
          playerRef.current.seekTo(startSeconds, true);
          setElapsed(0);
        }
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    } catch {}
  }, [externalPlaying, playerReady, elapsed, clipDuration, startSeconds]);

  const togglePlay = () => {
    if (!playerRef.current || !playerReady) return;

    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        if (elapsed >= clipDuration) {
          setElapsed(0);
          playerRef.current.seekTo(startSeconds, true);
        }
        playerRef.current.playVideo();
      }
    } catch {}
  };

  const truncatedTitle = title.length > 30 ? title.slice(0, 27) + '...' : title;

  return (
    <div className="mt-3 w-full">
      <div id={containerRef.current} className="hidden" />

      <div
        className="flex items-center gap-3 px-4 py-3 rounded-full cursor-pointer select-none"
        style={{
          background: 'linear-gradient(135deg, #DC2626, #B91C1C)',
          boxShadow: '0 2px 8px rgba(220, 38, 38, 0.4)',
        }}
        onClick={togglePlay}
      >
        <div className="flex-1 min-w-0">
          <div className="text-white text-sm font-bold leading-tight">
            {lowVolume ? 'Background Music' : 'Now Playing Clip'}{' '}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-80"
              onClick={(e) => e.stopPropagation()}
            >
              &ldquo;{truncatedTitle}&rdquo;
            </a>{' '}
            <span className="text-red-200">
              ({formatTime(elapsed)}/{formatTime(clipDuration)})
            </span>
          </div>
        </div>

        <button
          className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 border-2 border-white flex items-center justify-center hover:bg-white/30 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
              <rect x="3" y="2" width="4" height="12" rx="1" />
              <rect x="9" y="2" width="4" height="12" rx="1" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
              <path d="M4 2L14 8L4 14V2Z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
