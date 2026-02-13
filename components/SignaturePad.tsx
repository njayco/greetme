"use client";

import { useState, useRef, useCallback, useEffect } from "react";

type SignaturePadProps = {
  onSignatureChange: (signatureUrl: string | null) => void;
};

export default function SignaturePad({ onSignatureChange }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [uploadMode, setUploadMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const drawTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  const getPos = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const endDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    setIsDrawing(false);

    if (drawTimeoutRef.current) clearTimeout(drawTimeoutRef.current);
    drawTimeoutRef.current = setTimeout(() => {
      if (hasDrawn || canvasHasContent()) {
        autoUploadCanvas();
      }
    }, 1000);
  };

  const canvasHasContent = (): boolean => {
    const canvas = canvasRef.current;
    if (!canvas) return false;
    const ctx = canvas.getContext("2d");
    if (!ctx) return false;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] !== 255 || data[i + 1] !== 255 || data[i + 2] !== 255) {
        return true;
      }
    }
    return false;
  };

  const autoUploadCanvas = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      await uploadSignature(blob, "signature.png");
    }, "image/png");
  };

  const uploadSignature = async (blob: Blob, filename: string) => {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("signature", blob, filename);
      const res = await fetch("/api/signature/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Upload failed");
      }
      const data = await res.json();
      setSignatureUrl(data.url);
      onSignatureChange(data.url);
    } catch (err: any) {
      setError(err.message || "Upload failed");
      onSignatureChange(null);
    } finally {
      setUploading(false);
    }
  };

  const clearCanvas = () => {
    if (drawTimeoutRef.current) clearTimeout(drawTimeoutRef.current);
    setHasDrawn(false);
    setSignatureUrl(null);
    setError(null);
    onSignatureChange(null);
    initCanvas();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a PNG, JPG, or WEBP image.");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File too large. Maximum size is 5MB.");
      return;
    }

    await uploadSignature(file, file.name);
  };

  const handleRemove = () => {
    setSignatureUrl(null);
    setHasDrawn(false);
    setError(null);
    setUploadMode(false);
    onSignatureChange(null);
    initCanvas();
  };

  useEffect(() => {
    return () => {
      if (drawTimeoutRef.current) clearTimeout(drawTimeoutRef.current);
    };
  }, []);

  if (signatureUrl) {
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
            <span className="text-white font-bold text-sm" style={{ fontFamily: "Georgia, serif" }}>
              ✍️ Your Signature
            </span>
          </div>
          <div className="px-4 py-3 space-y-3">
            <div className="flex justify-center">
              <img
                src={signatureUrl.startsWith('/objects/') ? `/api/uploads/serve?path=${encodeURIComponent(signatureUrl)}` : signatureUrl}
                alt="Signature preview"
                className="max-w-[200px] max-h-[80px] rounded border object-contain"
                style={{ borderColor: "#c49a6c" }}
              />
            </div>
            <button
              onClick={handleRemove}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all hover:bg-gray-50"
              style={{ borderColor: "#c49a6c", color: "#8B6914" }}
            >
              ✕ Remove Signature
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          <span className="text-white font-bold text-sm" style={{ fontFamily: "Georgia, serif" }}>
            ✍️ Add Your Signature
          </span>
        </div>

        <div className="px-4 py-3 space-y-3">
          {error && (
            <div className="px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {uploading && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-teal-50 border border-teal-200">
              <svg className="animate-spin h-4 w-4 text-teal-600" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-sm text-teal-700 font-medium">Uploading signature…</span>
            </div>
          )}

          {!uploadMode ? (
            <>
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={100}
                  className="rounded-lg cursor-crosshair w-full max-w-[300px]"
                  style={{
                    border: "2px dashed #9ca3af",
                    background: "#ffffff",
                    touchAction: "none",
                  }}
                  onMouseDown={startDraw}
                  onMouseMove={draw}
                  onMouseUp={endDraw}
                  onMouseLeave={endDraw}
                  onTouchStart={startDraw}
                  onTouchMove={draw}
                  onTouchEnd={endDraw}
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={clearCanvas}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg border text-sm font-medium transition-all hover:bg-gray-50"
                  style={{ borderColor: "#c49a6c", color: "#8B6914" }}
                >
                  Clear
                </button>
                <button
                  onClick={() => setUploadMode(true)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg border text-sm font-medium transition-all hover:bg-gray-50"
                  style={{ borderColor: "#c49a6c", color: "#8B6914" }}
                >
                  Upload Instead
                </button>
              </div>
            </>
          ) : (
            <>
              <label
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer text-sm font-medium transition-all hover:border-[#4EAAA2] hover:bg-teal-50/30"
                style={{ borderColor: "#c49a6c", color: "#78716c" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Upload Signature Image
                <input
                  type="file"
                  className="hidden"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFileUpload}
                />
              </label>
              <p className="text-xs text-gray-400 text-center">
                Max 5MB · PNG, JPG, or WEBP
              </p>
              <button
                onClick={() => setUploadMode(false)}
                className="w-full flex items-center justify-center gap-1 px-3 py-2 rounded-lg border text-sm font-medium transition-all hover:bg-gray-50"
                style={{ borderColor: "#c49a6c", color: "#8B6914" }}
              >
                Draw Instead
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
