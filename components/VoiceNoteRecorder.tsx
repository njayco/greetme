"use client";

import { useState, useRef, useCallback, useEffect } from "react";

type VoiceNoteRecorderProps = {
  onVoiceNoteChange: (voiceNoteUrl: string | null) => void;
  centerfoldMessage?: string;
};

function formatTimer(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

const MAX_RECORDING_SECONDS = 60;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ["audio/webm", "audio/mp4", "audio/mpeg", "audio/wav"];

export default function VoiceNoteRecorder({
  onVoiceNoteChange,
  centerfoldMessage,
}: VoiceNoteRecorderProps) {
  const [mode, setMode] = useState<"idle" | "recording" | "recorded" | "uploaded">("idle");
  const [elapsed, setElapsed] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;
    chunksRef.current = [];
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const uploadBlob = useCallback(
    async (blob: Blob, filename: string) => {
      setUploading(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append("audio", blob, filename);
        const res = await fetch("/api/voice-note/upload", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Upload failed");
        }
        const data = await res.json();
        onVoiceNoteChange(data.url);
      } catch (err: any) {
        setError(err.message || "Upload failed");
        onVoiceNoteChange(null);
      } finally {
        setUploading(false);
      }
    },
    [onVoiceNoteChange]
  );

  const getSupportedMimeType = (): string => {
    if (typeof MediaRecorder !== "undefined") {
      if (MediaRecorder.isTypeSupported("audio/webm")) return "audio/webm";
      if (MediaRecorder.isTypeSupported("audio/mp4")) return "audio/mp4";
    }
    return "audio/webm";
  };

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = getSupportedMimeType();
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setMode("recorded");

        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;

        const ext = mimeType === "audio/mp4" ? "m4a" : "webm";
        uploadBlob(blob, `voice-note.${ext}`);
      };

      recorder.start();
      setMode("recording");
      setElapsed(0);

      timerRef.current = setInterval(() => {
        setElapsed((prev) => {
          const next = prev + 1;
          if (next >= MAX_RECORDING_SECONDS) {
            recorder.stop();
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
          }
          return next;
        });
      }, 1000);
    } catch (err: any) {
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setError("Microphone access denied. Please allow microphone permission and try again.");
      } else {
        setError("Could not access microphone. Please check your device settings.");
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Unsupported file type. Please upload WebM, MP4, MP3, or WAV audio.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File too large. Maximum size is 10MB.");
      return;
    }

    if (audioUrl) URL.revokeObjectURL(audioUrl);
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setMode("uploaded");

    await uploadBlob(file, file.name);
  };

  const handleReRecord = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setMode("idle");
    setElapsed(0);
    setError(null);
    onVoiceNoteChange(null);
  };

  return (
    <div className="mt-4 w-full">
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          borderColor: "#c49a6c",
          background: "linear-gradient(135deg, #fdf8f0 0%, #fef9f2 100%)",
        }}
      >
        <div
          className="px-4 py-3 flex items-center gap-2"
          style={{ background: "linear-gradient(135deg, #c49a6c 0%, #b8860b 100%)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
          <span className="text-white font-bold text-sm" style={{ fontFamily: "Georgia, serif" }}>
            🎙️ Voice Note
          </span>
        </div>

        <div className="px-4 py-3 space-y-3">
          <div
            className="text-center py-2 px-3 rounded-lg text-sm font-medium"
            style={{
              fontFamily: "Georgia, serif",
              background: "linear-gradient(135deg, #fef3c7, #fde68a)",
              color: "#92400e",
            }}
          >
            Read the card&apos;s message aloud in your voice note — make it personal!
          </div>

          {centerfoldMessage && (
            <div
              className="px-4 py-3 rounded-lg border-l-4 text-sm italic"
              style={{
                fontFamily: "Georgia, serif",
                borderColor: "#c49a6c",
                background: "rgba(196, 154, 108, 0.08)",
                color: "#78716c",
              }}
            >
              &ldquo;{centerfoldMessage}&rdquo;
            </div>
          )}

          {error && (
            <div className="px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {mode === "idle" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={startRecording}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white font-bold text-sm transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{ background: "#4EAAA2" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                  Record Voice Note
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <label
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer text-sm font-medium transition-all hover:border-[#4EAAA2] hover:bg-teal-50/30"
                style={{ borderColor: "#c49a6c", color: "#78716c" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Upload Audio File
                <input
                  type="file"
                  className="hidden"
                  accept="audio/webm,audio/mp4,audio/mpeg,audio/wav"
                  onChange={handleFileUpload}
                />
              </label>
              <p className="text-xs text-gray-400 text-center">
                Max 10MB · WebM, MP4, MP3, or WAV
              </p>
            </div>
          )}

          {mode === "recording" && (
            <div className="flex flex-col items-center gap-3 py-2">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <span
                  className="text-2xl font-bold tabular-nums"
                  style={{ fontFamily: "Georgia, serif", color: "#8B6914" }}
                >
                  {formatTimer(elapsed)}
                </span>
                <span className="text-xs text-gray-400">/ {formatTimer(MAX_RECORDING_SECONDS)}</span>
              </div>

              <button
                onClick={stopRecording}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-bold text-sm transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: "#DC2626" }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                  <rect x="3" y="3" width="10" height="10" rx="1" />
                </svg>
                Stop Recording
              </button>
            </div>
          )}

          {(mode === "recorded" || mode === "uploaded") && (
            <div className="space-y-3">
              {uploading && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-teal-50 border border-teal-200">
                  <svg className="animate-spin h-4 w-4 text-teal-600" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span className="text-sm text-teal-700 font-medium">Uploading voice note…</span>
                </div>
              )}

              {audioUrl && (
                <audio controls src={audioUrl} className="w-full h-10 rounded" />
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReRecord}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all hover:bg-gray-50"
                  style={{ borderColor: "#c49a6c", color: "#8B6914" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                  </svg>
                  Re-record
                </button>
                <label
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium cursor-pointer transition-all hover:bg-gray-50"
                  style={{ borderColor: "#c49a6c", color: "#8B6914" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Upload New
                  <input
                    type="file"
                    className="hidden"
                    accept="audio/webm,audio/mp4,audio/mpeg,audio/wav"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
