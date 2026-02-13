/**
 * ShareCardClient.tsx — Client component for displaying a shared greeting card.
 *
 * Renders an interactive card viewer with three tabs (Cover, Centerfold, Back),
 * optional voice note playback, optional YouTube clip playback, and optional
 * gift card redemption. When both a voice note and YouTube clip are present,
 * their play/pause states are synced so they start and stop together.
 */
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import YouTubeClipPlayer from '@/components/YouTubeClipPlayer';

// ---------- Type definitions for data passed from the server component ----------

type CardData = {
  id: number;
  title: string;
  cover: string;
  centerfold: string;
  back: string;
};

type YouTubeClipData = {
  videoId: string;
  url: string;
  title: string;
  startSeconds: number;
  endSeconds: number;
};

type GiftCardData = {
  amountCents: number;
  link: string | null;
  brand: string;
  status: string;
  shareId: string;
};

type CashGiftData = {
  cashtag: string;
  amount: number;
  status: string;
  shareId: string;
};

type Props = {
  cardData: CardData;
  senderName: string;
  recipientName: string;
  personalNote: string;
  categoryName: string;
  youtubeClip?: YouTubeClipData | null;
  giftCard?: GiftCardData | null;
  cashGift?: CashGiftData | null;
  voiceNoteUrl?: string | null;
  signatureUrl?: string | null;
};

/**
 * VoiceNotePlayer — Self-contained audio player for a voice note attachment.
 *
 * Manages its own HTML Audio element and exposes play-state changes via
 * `onPlayStateChange` so the parent can coordinate with other media players.
 *
 * Synced playback refs:
 *  - `externalPlayingRef`  — tracks the last known external play state to
 *    avoid redundant play/pause calls when the value hasn't changed.
 *  - `isExternalUpdateRef` — guards against re-emitting `onPlayStateChange`
 *    when the play/pause was triggered externally (prevents infinite loops).
 */
function VoiceNotePlayer({ voiceNoteUrl, hasYoutubeClip, onPlayStateChange, onEnded, externalPlaying = null }: { voiceNoteUrl: string; hasYoutubeClip: boolean; onPlayStateChange?: (playing: boolean) => void; onEnded?: () => void; externalPlaying?: boolean | null }) {
  const MAX_PLAYBACK_SECONDS = 30;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const externalPlayingRef = useRef<boolean | null>(null);
  const isExternalUpdateRef = useRef(false);
  const onEndedRef = useRef(onEnded);
  const onPlayStateChangeRef = useRef(onPlayStateChange);
  onEndedRef.current = onEnded;
  onPlayStateChangeRef.current = onPlayStateChange;

  const resolvedUrl = voiceNoteUrl.startsWith('/objects/')
    ? `/api/uploads/serve?path=${encodeURIComponent(voiceNoteUrl)}`
    : voiceNoteUrl;

  const stopPlayback = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (audioRef.current) {
      try { audioRef.current.pause(); } catch {}
    }
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    const audio = new Audio(resolvedUrl);
    audio.preload = 'auto';
    audioRef.current = audio;

    audio.addEventListener('ended', () => {
      stopPlayback();
      setElapsed(0);
      externalPlayingRef.current = false;
      onEndedRef.current?.();
    });

    audio.addEventListener('play', () => {
      setIsPlaying(true);
      externalPlayingRef.current = true;
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        if (!audioRef.current) return;
        const currentTime = audioRef.current.currentTime;
        if (currentTime >= MAX_PLAYBACK_SECONDS) {
          stopPlayback();
          setElapsed(MAX_PLAYBACK_SECONDS);
          externalPlayingRef.current = false;
          onEndedRef.current?.();
          return;
        }
        setElapsed(currentTime);
      }, 250);
      if (!isExternalUpdateRef.current) {
        onPlayStateChangeRef.current?.(true);
      }
    });

    audio.addEventListener('pause', () => {
      setIsPlaying(false);
      externalPlayingRef.current = false;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (!isExternalUpdateRef.current) {
        onPlayStateChangeRef.current?.(false);
      }
    });

    return () => {
      audio.pause();
      audio.src = '';
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resolvedUrl, stopPlayback]);

  useEffect(() => {
    if (externalPlaying === null || !audioRef.current) return;
    if (externalPlaying === externalPlayingRef.current) return;
    externalPlayingRef.current = externalPlaying;
    isExternalUpdateRef.current = true;

    if (externalPlaying) {
      if (elapsed >= MAX_PLAYBACK_SECONDS) {
        audioRef.current.currentTime = 0;
        setElapsed(0);
      }
      audioRef.current.play().catch((err: any) => {
        console.warn('Voice note play failed:', err?.message);
        setIsPlaying(false);
        externalPlayingRef.current = false;
      }).finally(() => {
        isExternalUpdateRef.current = false;
      });
    } else {
      audioRef.current.pause();
      isExternalUpdateRef.current = false;
    }
  }, [externalPlaying, elapsed]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (elapsed >= MAX_PLAYBACK_SECONDS) {
        audioRef.current.currentTime = 0;
        setElapsed(0);
      }
      audioRef.current.play().catch((err: any) => {
        console.warn('Voice note play failed:', err?.message);
      });
    }
  }, [isPlaying, elapsed]);

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds) || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mt-3 w-full">
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-full cursor-pointer select-none"
        style={{
          background: 'linear-gradient(135deg, #4EAAA2, #3d9089)',
          boxShadow: '0 2px 8px rgba(78, 170, 162, 0.4)',
        }}
        onClick={togglePlay}
      >
        <div className="flex-shrink-0 w-5 h-5 text-white">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6.91 6c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white text-sm font-bold leading-tight">
            Voice Message{' '}
            <span className="text-teal-100">
              ({formatTime(elapsed)}/{formatTime(MAX_PLAYBACK_SECONDS)})
            </span>
          </div>
          {hasYoutubeClip && (
            <div className="text-teal-100 text-xs mt-0.5">with background music</div>
          )}
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

function CashGiftSection({ cashGift, senderName }: { cashGift: CashGiftData; senderName: string }) {
  const [confirmed, setConfirmed] = useState(cashGift.status === 'confirmed');
  const [confirming, setConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const sanitizedTag = cashGift.cashtag.replace(/[^a-zA-Z0-9_]/g, '');
  const cashAppUrl = `https://cash.app/$${sanitizedTag}`;

  const handleConfirm = async () => {
    setConfirming(true);
    setConfirmError('');
    try {
      const res = await fetch('/api/cashgift/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shareId: cashGift.shareId }),
      });
      if (res.ok) {
        setConfirmed(true);
      } else {
        setConfirmError('Could not confirm. Please try again.');
      }
    } catch {
      setConfirmError('Could not confirm. Please try again.');
    }
    setConfirming(false);
  };

  if (confirmed) {
    return (
      <div className="mt-4 text-center">
        <div
          className="inline-block px-5 py-2 rounded-lg font-bold text-sm text-white"
          style={{ background: 'linear-gradient(180deg, #6B7280, #4B5563)' }}
        >
          ${cashGift.amount} Cash Gift Received
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 rounded-xl text-center" style={{ background: 'linear-gradient(135deg, #00D632 0%, #00B83F 100%)' }}>
      <p className="text-white font-bold text-lg mb-1" style={{ fontFamily: 'Georgia, serif' }}>
        {senderName} wants to send you a Gift!
      </p>
      <p className="text-white/90 text-xs mb-3">Request ${cashGift.amount} from $<span className="font-semibold">{sanitizedTag}</span> via Cash App</p>

      <a
        href={cashAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-6 py-2.5 rounded-lg font-bold text-sm transition-all hover:opacity-90 mb-2"
        style={{ background: '#fff', color: '#00D632', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
      >
        Open ${sanitizedTag} on Cash App
      </a>

      <div className="mt-2">
        <button
          onClick={handleConfirm}
          disabled={confirming}
          className="text-white/80 text-xs underline hover:text-white transition-colors disabled:opacity-50"
        >
          {confirming ? 'Confirming...' : 'I received it'}
        </button>
        {confirmError && <p className="text-white/70 text-xs mt-1">{confirmError}</p>}
      </div>

      <div className="mt-3">
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="text-white/80 text-xs hover:text-white transition-colors flex items-center gap-1 mx-auto"
        >
          <span>{showHelp ? 'Hide help' : 'I need help'}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: showHelp ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {showHelp && (
          <div className="mt-3 p-4 rounded-lg text-left text-sm" style={{ background: 'rgba(255,255,255,0.95)', color: '#333' }}>
            <p className="font-bold text-base mb-3" style={{ color: '#00D632', fontFamily: 'Georgia, serif' }}>
              How to Receive Your ${cashGift.amount} Gift
            </p>

            <div className="space-y-3">
              <div>
                <p className="font-bold mb-1">Step 1: Download Cash App</p>
                <p className="text-gray-600 text-xs mb-2">If you don't have Cash App yet, use the link below to download it and get a <strong>free $5 bonus</strong> when you send your first $5+!</p>
                <a
                  href="https://cash.app/app/LTG88CT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-3 py-2.5 rounded-lg text-center text-sm font-bold text-white transition-all hover:opacity-90 mb-2"
                  style={{ background: '#00D632' }}
                >
                  Download Cash App & Get $5 Free
                </a>
                <p className="text-gray-500 text-[10px] mb-2 text-center">Use referral code: <strong>LTG88CT</strong> when signing up</p>
                <p className="text-gray-500 text-[10px] mb-1">Or download directly from:</p>
                <div className="flex gap-2">
                  <a
                    href="https://apps.apple.com/us/app/cash-app/id711923939"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-3 py-1.5 rounded-lg text-center text-[10px] font-bold text-white transition-all hover:opacity-90"
                    style={{ background: '#000' }}
                  >
                    App Store (iPhone)
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.squareup.cash"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-3 py-1.5 rounded-lg text-center text-[10px] font-bold text-white transition-all hover:opacity-90"
                    style={{ background: '#000' }}
                  >
                    Google Play (Android)
                  </a>
                </div>
              </div>

              <div>
                <p className="font-bold mb-1">Step 2: Set Up Your Account</p>
                <p className="text-gray-600 text-xs">Open Cash App and create an account with your email or phone number. When asked for a referral code, enter <strong>LTG88CT</strong> to get a free $5 bonus! You'll also link a debit card or bank account so you can receive money.</p>
              </div>

              <div>
                <p className="font-bold mb-1">Step 3: Request the Money</p>
                <p className="text-gray-600 text-xs mb-2">Tap the green <strong>"Open ${sanitizedTag} on Cash App"</strong> button above. It will open their Cash App profile page. From there, tap <strong>"Request"</strong> and enter <strong>${cashGift.amount}</strong> to request your gift!</p>
              </div>

              <div>
                <p className="font-bold mb-1">Step 4: Wait & Confirm</p>
                <p className="text-gray-600 text-xs">Once {senderName} approves your request in their Cash App, the money will appear in your Cash App balance. Come back here and tap <strong>"I received it"</strong> to let them know!</p>
              </div>

              <div className="pt-2 border-t border-gray-200">
                <p className="text-gray-400 text-[10px]">Cash App is a free app by Block, Inc. GreetMe does not process any payments — your money goes directly between you and {senderName} through Cash App.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShareCardClient({ cardData, senderName, recipientName, personalNote, categoryName, youtubeClip, giftCard, cashGift, voiceNoteUrl, signatureUrl }: Props) {
  const [cardView, setCardView] = useState<'cover' | 'centerfold' | 'back'>('cover');
  const [syncedPlaying, setSyncedPlaying] = useState<boolean | null>(null);
  const [voiceNoteFinished, setVoiceNoteFinished] = useState(false);
  const [youtubeVolume, setYoutubeVolume] = useState<number | null>(null);
  const hasBoth = !!voiceNoteUrl && !!youtubeClip;

  const handlePlayStateChange = useCallback((playing: boolean) => {
    if (hasBoth) {
      if (playing) {
        setVoiceNoteFinished(false);
        setYoutubeVolume(null);
      }
      setSyncedPlaying(playing);
    }
  }, [hasBoth]);

  const handleVoiceNoteEnded = useCallback(() => {
    if (hasBoth) {
      setSyncedPlaying(false);
      setVoiceNoteFinished(true);
      setYoutubeVolume(null);
    }
  }, [hasBoth]);

  const handleYoutubeEnded = useCallback(() => {
    setSyncedPlaying(false);
    setVoiceNoteFinished(true);
    setYoutubeVolume(null);
  }, []);

  useEffect(() => {
    setSyncedPlaying(null);
    setVoiceNoteFinished(false);
    setYoutubeVolume(null);
  }, [hasBoth]);

  // Resolve object-storage cover images through the upload-serve API
  const resolvedCover = cardData.cover?.startsWith('/objects/')
    ? `/api/uploads/serve?path=${encodeURIComponent(cardData.cover)}`
    : cardData.cover;

  /** Render the currently selected card face */
  const renderCard = () => {
    switch (cardView) {
      // Front cover — displays the card image
      case 'cover':
        return (
          <div className="aspect-[3/4] bg-white rounded-lg shadow-2xl flex items-center justify-center p-2 border border-gray-200">
            <img
              src={resolvedCover || "/placeholder.svg"}
              alt={cardData.title}
              className="w-full h-full object-cover rounded"
            />
          </div>
        );
      // Inside / centerfold — greeting text, personal note, media players, gift card
      case 'centerfold':
        return (
          <div className="bg-gradient-to-b from-gray-50 to-white rounded-lg shadow-2xl overflow-hidden border border-gray-200">
            <div className="p-5">
              <div className="min-h-[300px] flex flex-col">
                <h3 className="text-xl font-bold mb-4 text-center text-gray-800" style={{ fontFamily: "Georgia, serif" }}>Special Greeting!</h3>
                <div className="flex-1 flex flex-col justify-center">
                  {/* Centerfold message — font size adapts for long messages */}
                  <p
                    className={`text-gray-700 mb-4 text-center leading-relaxed ${
                      cardData.centerfold.length > 200 ? "text-sm" : "text-base"
                    }`}
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {cardData.centerfold}
                  </p>
                  {/* Optional personal note from the sender */}
                  {personalNote && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border-l-4 border-amber-500">
                      <p className="text-sm italic text-gray-800 font-medium break-words" style={{ fontFamily: "Georgia, serif" }}>"{personalNote}"</p>
                      <p className="text-xs text-gray-600 mt-2">- {senderName}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Voice note player — synced with YouTube when both are present */}
              {voiceNoteUrl && (
                <VoiceNotePlayer
                  voiceNoteUrl={voiceNoteUrl}
                  hasYoutubeClip={!!youtubeClip}
                  onPlayStateChange={handlePlayStateChange}
                  onEnded={handleVoiceNoteEnded}
                  externalPlaying={hasBoth ? syncedPlaying : null}
                />
              )}

              {youtubeClip && (
                <YouTubeClipPlayer
                  videoId={youtubeClip.videoId}
                  title={youtubeClip.title}
                  url={youtubeClip.url}
                  startSeconds={youtubeClip.startSeconds}
                  endSeconds={youtubeClip.endSeconds}
                  lowVolume={!!voiceNoteUrl}
                  loop={hasBoth}
                  onPlayStateChange={handlePlayStateChange}
                  onEnded={handleYoutubeEnded}
                  externalPlaying={hasBoth ? syncedPlaying : null}
                  volumeOverride={youtubeVolume}
                />
              )}

              {giftCard && (
                <div className="mt-3 text-center">
                  {giftCard.status === 'redeemed' && giftCard.link ? (
                    <a
                      href={giftCard.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-5 py-2 rounded-lg font-bold text-sm text-white transition-all hover:opacity-90"
                      style={{
                        background: 'linear-gradient(180deg, #34C759, #28a745)',
                        boxShadow: '0 2px 6px rgba(40,167,69,0.4)',
                      }}
                    >
                      Open ${(giftCard.amountCents / 100).toFixed(0)} Gift Card
                    </a>
                  ) : giftCard.status === 'redeemed' ? (
                    <div
                      className="inline-block px-5 py-2 rounded-lg font-bold text-sm text-white"
                      style={{
                        background: 'linear-gradient(180deg, #6B7280, #4B5563)',
                      }}
                    >
                      ${(giftCard.amountCents / 100).toFixed(0)} Gift Card Redeemed
                    </div>
                  ) : (
                    <a
                      href={`/redeem/${giftCard.shareId}`}
                      className="inline-block px-5 py-2 rounded-lg font-bold text-sm text-white transition-all hover:opacity-90"
                      style={{
                        background: 'linear-gradient(180deg, #34C759, #28a745)',
                        boxShadow: '0 2px 6px rgba(40,167,69,0.4)',
                      }}
                    >
                      Redeem ${(giftCard.amountCents / 100).toFixed(0)} Gift Card Here
                    </a>
                  )}
                </div>
              )}

              {cashGift && (
                <CashGiftSection cashGift={cashGift} senderName={senderName} />
              )}
            </div>
          </div>
        );
      // Back of the card — closing message with sender/recipient info
      case 'back':
        return (
          <div className="aspect-[3/4] bg-gradient-to-b from-gray-50 to-white rounded-lg shadow-2xl flex flex-col p-6 border border-gray-200">
            <div className="flex-1 text-center w-full">
              <div className="mb-6 p-5 bg-white rounded-lg shadow-sm border border-gray-100">
                <p className="text-lg text-gray-700 font-medium mb-5" style={{ fontFamily: "Georgia, serif" }}>{cardData.back}</p>
                <div className="space-y-4 text-left">
                  <div className="flex items-center border-b border-gray-300 pb-2">
                    <span className="font-bold text-gray-800 mr-3" style={{ fontFamily: "Georgia, serif" }}>From:</span>
                    <span className="text-gray-700">{senderName}</span>
                  </div>
                  <div className="flex items-center border-b border-gray-300 pb-2">
                    <span className="font-bold text-gray-800 mr-3" style={{ fontFamily: "Georgia, serif" }}>To:</span>
                    <span className="text-gray-700">{recipientName}</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 italic" style={{ fontFamily: "Georgia, serif" }}>GreetMe 2024</div>
            </div>
            {signatureUrl && (
              <div className="flex flex-col items-end mt-4 pr-2 pb-2">
                <img
                  src={signatureUrl.startsWith('/objects/') ? `/api/uploads/serve?path=${encodeURIComponent(signatureUrl)}` : signatureUrl}
                  alt="Signature"
                  className="max-w-[220px] max-h-[80px] object-contain"
                />
                <span className="text-sm text-gray-600 mt-2" style={{ fontFamily: "Georgia, serif" }}>{senderName}</span>
              </div>
            )}
          </div>
        );
    }
  };

  // Tab definitions for the bottom navigation bar
  const tabs = [
    { key: 'cover', label: 'Cover' },
    { key: 'centerfold', label: 'Centerfold' },
    { key: 'back', label: 'Back' },
  ] as const;

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: 'linear-gradient(135deg, #c49a6c 0%, #b8860b 25%, #c49a6c 50%, #d4a574 75%, #c49a6c 100%)',
      }}
    >
      {/* Faux wood-grain vertical stripe overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(90deg, transparent 0px, transparent 48px, rgba(139, 90, 43, 0.3) 48px, rgba(139, 90, 43, 0.3) 50px)`,
          opacity: 0.5,
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top header bar with sender → recipient info */}
        <div className="flex justify-between items-center px-4 py-3 bg-[#4EAAA2] text-white">
          <div className="text-lg font-bold" style={{ fontFamily: "Georgia, serif" }}>Greeting Card</div>
          <div className="text-sm" style={{ fontFamily: "Georgia, serif" }}>
            From: {senderName} &rarr; To: {recipientName}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {/* Decorative shelf/ledge above the card */}
          <div className="px-4 pt-4">
            <div className="min-h-[60px]"></div>
            <div className="relative w-full h-6">
              <div
                className="absolute inset-x-0 top-0 h-5"
                style={{
                  background: 'linear-gradient(180deg, #8B6914 0%, #a07830 40%, #7a5a20 100%)',
                  borderRadius: '0 0 4px 4px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.4), inset 0 -2px 4px rgba(0,0,0,0.2)',
                }}
              />
            </div>
          </div>

          {/* Card display area */}
          <div className="flex-1 flex items-start justify-center px-4 -mt-2 relative z-20">
            <div className="w-full max-w-sm">
              <h2
                className="text-xl font-bold text-center mb-3 text-white drop-shadow-lg"
                style={{ fontFamily: "Georgia, serif", textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}
              >
                {cardData.title}
              </h2>
              {renderCard()}

              {/* CTA to create a new card */}
              <div className="text-center mt-6">
                <a
                  href="/"
                  className="inline-block px-8 py-3 rounded font-bold text-lg text-white transition-all"
                  style={{
                    background: 'linear-gradient(180deg, #4CD964, #34C759)',
                    boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
                  }}
                >
                  Create Your Own Card
                </a>
              </div>
            </div>
          </div>

          {/* Bottom tab bar for switching card faces */}
          <div className="mt-auto pb-2">
            <div
              className="py-3"
              style={{ background: 'linear-gradient(180deg, #3d3d3d, #2a2a2a)' }}
            >
              <div className="flex justify-center items-center gap-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setCardView(tab.key)}
                    className={`px-6 py-2 rounded font-bold text-sm transition-all ${
                      cardView === tab.key
                        ? "bg-[#4EAAA2] text-white shadow-md"
                        : "bg-transparent text-gray-300 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
