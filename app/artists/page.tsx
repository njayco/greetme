"use client"

import { useState, useEffect, useRef } from "react"
import { categoryGroups } from "@/lib/cardData"
import { ArrowLeft, Upload, Check } from "lucide-react"

function BookshelfBackground({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen relative"
      style={{
        background: `
          linear-gradient(135deg, #c49a6c 0%, #b8860b 25%, #c49a6c 50%, #d4a574 75%, #c49a6c 100%)
        `,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `
            repeating-linear-gradient(
              90deg,
              transparent 0px,
              transparent 48px,
              rgba(139, 90, 43, 0.3) 48px,
              rgba(139, 90, 43, 0.3) 50px
            )
          `,
          opacity: 0.5,
        }}
      />
      {children}
    </div>
  )
}

function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              i + 1 < currentStep
                ? "bg-green-500 text-white"
                : i + 1 === currentStep
                ? "bg-[#4EAAA2] text-white scale-110"
                : "bg-white/30 text-white/60"
            }`}
          >
            {i + 1 < currentStep ? <Check className="w-4 h-4" /> : i + 1}
          </div>
          {i < totalSteps - 1 && (
            <div
              className={`w-8 h-0.5 ${
                i + 1 < currentStep ? "bg-green-500" : "bg-white/30"
              }`}
            />
          )}
        </div>
      ))}
      <span className="ml-3 text-white/80 text-sm font-medium" style={{ fontFamily: "Georgia, serif" }}>
        Step {currentStep} of {totalSteps}
      </span>
    </div>
  )
}

function resolveImageUrl(url: string | null): string {
  if (!url) return ""
  if (url.startsWith("/objects/")) {
    return `/api/uploads/serve?path=${encodeURIComponent(url)}`
  }
  return url
}

export default function ArtistsPage() {
  const [step, setStep] = useState(1)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [centerfold, setCenterfold] = useState("")
  const [backMessage, setBackMessage] = useState("")
  const [caption, setCaption] = useState("")
  const [artistName, setArtistName] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [addToCatalog, setAddToCatalog] = useState(true)
  const [previewTab, setPreviewTab] = useState<"cover" | "centerfold" | "back">("cover")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [createdCardId, setCreatedCardId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [toName, setToName] = useState("")
  const [fromName, setFromName] = useState("")
  const [personalNote, setPersonalNote] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const payment = urlParams.get("payment")
    const cardId = urlParams.get("cardId")
    if (payment === "artist_success" && cardId) {
      const sessionId = urlParams.get("session_id")
      if (sessionId) {
        fetch("/api/artists/confirm-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, cardId }),
        })
          .then(res => res.json())
          .then(data => {
            if (data.shareUrl) {
              setShareUrl(data.shareUrl)
            }
          })
          .catch((err) => console.error("Payment confirm error:", err))
      }
      setCreatedCardId(cardId)
      setSubmitSuccess(true)
      setStep(7)
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image must be under 5MB")
      return
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setErrorMessage("Please upload a JPG, PNG, or WebP image")
      return
    }

    setErrorMessage(null)
    setImageFile(file)

    const reader = new FileReader()
    reader.onload = (ev) => {
      setImagePreview(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUploadAndNext = async () => {
    if (!imageFile) return
    setIsUploading(true)
    setErrorMessage(null)

    try {
      const formData = new FormData()
      formData.append("image", imageFile)

      const res = await fetch("/api/artists/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        throw new Error("Upload failed")
      }

      const data = await res.json()
      setUploadedImageUrl(data.url)
      setStep(3)
    } catch {
      setErrorMessage("Failed to upload image. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const res = await fetch("/api/artists/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coverUrl: uploadedImageUrl,
          centerfold,
          backMessage,
          caption,
          artistName,
          categories: selectedCategories,
          addToCatalog,
          toName: toName.trim(),
          fromName: fromName.trim(),
          personalNote: personalNote.trim(),
        }),
      })

      if (!res.ok) {
        throw new Error("Submission failed")
      }

      const data = await res.json()
      setCreatedCardId(data.id)

      if (data.shareUrl) {
        setShareUrl(data.shareUrl)
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
        return
      }

      setSubmitSuccess(true)
      setStep(7)
    } catch {
      setErrorMessage("Failed to submit card. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const canProceedStep2 = !!imageFile && !!imagePreview
  const canProceedStep3 = centerfold.trim().length > 0 && backMessage.trim().length > 0 && artistName.trim().length > 0
  const canProceedStep4 = selectedCategories.length > 0

  const parchmentStyle = {
    background: "linear-gradient(180deg, #f5ecd0 0%, #ede0b8 100%)",
    border: "2px solid #b8a060",
  }

  return (
    <BookshelfBackground>
      <div
        className="relative z-10 sticky top-0"
        style={{
          background: "linear-gradient(180deg, #4EAAA2 0%, #3d918a 100%)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold text-sm" style={{ fontFamily: "Georgia, serif" }}>
              Back to GreetMe
            </span>
          </a>
          <h1
            className="text-lg font-bold text-white"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Greet Me for Artists
          </h1>
          <div className="w-24" />
        </div>
      </div>

      <div className="relative z-10 p-4 md:p-6 max-w-2xl mx-auto">
        {step > 1 && step < 7 && <StepIndicator currentStep={step - 1} totalSteps={6} />}

        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-400 text-red-800 text-center text-sm">
            {errorMessage}
            <button onClick={() => setErrorMessage(null)} className="ml-2 underline text-xs">
              Dismiss
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <div
              className="rounded-2xl p-8 md:p-12 text-center max-w-lg w-full"
              style={{
                ...parchmentStyle,
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}
            >
              <div className="mb-6">
                <span className="text-5xl">🎨</span>
              </div>
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ fontFamily: "Georgia, serif", color: "#5a4020" }}
              >
                Greet Me for Artists
              </h2>
              <p
                className="text-base md:text-lg mb-6 leading-relaxed"
                style={{ fontFamily: "Georgia, serif", color: "#6b5030" }}
              >
                Create your own custom greeting card! Upload your artwork, write a heartfelt message,
                and share it with the world — or keep it personal.
              </p>
              <div className="space-y-3 text-left mb-8 px-4">
                <div className="flex items-start gap-3">
                  <span className="text-[#4EAAA2] font-bold text-lg">1.</span>
                  <span className="text-sm" style={{ color: "#6b5030" }}>Upload your cover image</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#4EAAA2] font-bold text-lg">2.</span>
                  <span className="text-sm" style={{ color: "#6b5030" }}>Write your card messages</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#4EAAA2] font-bold text-lg">3.</span>
                  <span className="text-sm" style={{ color: "#6b5030" }}>Choose categories & personalize</span>
                </div>
              </div>
              <button
                onClick={() => setStep(2)}
                className="px-8 py-3 rounded-lg text-white text-lg font-bold transition-all duration-300 hover:scale-105 w-full"
                style={{
                  background: "linear-gradient(180deg, #4EAAA2, #3d918a)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  fontFamily: "Georgia, serif",
                }}
              >
                Create Your Card
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div
            className="rounded-2xl p-6 md:p-8"
            style={{
              ...parchmentStyle,
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            <h2
              className="text-2xl font-bold mb-2 text-center"
              style={{ fontFamily: "Georgia, serif", color: "#5a4020" }}
            >
              Upload Cover Image
            </h2>
            <p className="text-sm text-center mb-6" style={{ color: "#8b7040" }}>
              JPG, PNG, or WebP • Max 5MB • Will be displayed in 3:4 ratio
            </p>

            <div className="flex flex-col items-center gap-6">
              <div
                className="aspect-[3/4] w-full max-w-[280px] rounded-lg overflow-hidden border-2 border-dashed border-[#b8a060] bg-white/50 flex items-center justify-center cursor-pointer hover:border-[#4EAAA2] transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-[#8b7040]">
                    <Upload className="w-12 h-12" />
                    <span className="text-sm font-medium" style={{ fontFamily: "Georgia, serif" }}>
                      Tap to upload
                    </span>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageSelect}
                className="hidden"
              />

              {imagePreview && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm underline"
                  style={{ color: "#4EAAA2" }}
                >
                  Choose a different image
                </button>
              )}

              <div className="flex gap-3 w-full max-w-[280px]">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-4 py-3 rounded-lg font-bold text-sm transition-all"
                  style={{
                    background: "rgba(0,0,0,0.1)",
                    color: "#5a4020",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  Back
                </button>
                <button
                  onClick={handleUploadAndNext}
                  disabled={!canProceedStep2 || isUploading}
                  className="flex-1 px-4 py-3 rounded-lg text-white font-bold text-sm transition-all disabled:opacity-50"
                  style={{
                    background: canProceedStep2 ? "linear-gradient(180deg, #4EAAA2, #3d918a)" : "#999",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {isUploading ? "Uploading..." : "Next"}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div
            className="rounded-2xl p-6 md:p-8"
            style={{
              ...parchmentStyle,
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            <h2
              className="text-2xl font-bold mb-6 text-center"
              style={{ fontFamily: "Georgia, serif", color: "#5a4020" }}
            >
              Write Your Messages
            </h2>

            <div className="space-y-5">
              <div>
                <label
                  className="block text-sm font-bold mb-1"
                  style={{ fontFamily: "Georgia, serif", color: "#5a4020" }}
                >
                  Card Message (Centerfold) *
                </label>
                <textarea
                  value={centerfold}
                  onChange={(e) => {
                    if (e.target.value.length <= 250) setCenterfold(e.target.value)
                  }}
                  placeholder="Write the main greeting message..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border-2 border-[#b8a060] bg-white/80 text-sm focus:outline-none focus:border-[#4EAAA2] transition-colors resize-none"
                  style={{ fontFamily: "Georgia, serif" }}
                />
                <div className="text-right text-xs mt-1" style={{ color: centerfold.length > 230 ? "#c0392b" : "#8b7040" }}>
                  {centerfold.length}/250
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-bold mb-1"
                  style={{ fontFamily: "Georgia, serif", color: "#5a4020" }}
                >
                  Back Message *
                </label>
                <input
                  type="text"
                  value={backMessage}
                  onChange={(e) => {
                    if (e.target.value.length <= 100) setBackMessage(e.target.value)
                  }}
                  placeholder="Short message for the back of the card"
                  className="w-full px-4 py-3 rounded-lg border-2 border-[#b8a060] bg-white/80 text-sm focus:outline-none focus:border-[#4EAAA2] transition-colors"
                  style={{ fontFamily: "Georgia, serif" }}
                />
                <div className="text-right text-xs mt-1" style={{ color: backMessage.length > 90 ? "#c0392b" : "#8b7040" }}>
                  {backMessage.length}/100
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-bold mb-1"
                  style={{ fontFamily: "Georgia, serif", color: "#5a4020" }}
                >
                  Caption (Optional)
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => {
                    if (e.target.value.length <= 100) setCaption(e.target.value)
                  }}
                  placeholder="Preview caption for the card"
                  className="w-full px-4 py-3 rounded-lg border-2 border-[#b8a060] bg-white/80 text-sm focus:outline-none focus:border-[#4EAAA2] transition-colors"
                  style={{ fontFamily: "Georgia, serif" }}
                />
                <div className="text-right text-xs mt-1" style={{ color: "#8b7040" }}>
                  {caption.length}/100
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-bold mb-1"
                  style={{ fontFamily: "Georgia, serif", color: "#5a4020" }}
                >
                  Artist Name *
                </label>
                <input
                  type="text"
                  value={artistName}
                  onChange={(e) => {
                    if (e.target.value.length <= 50) setArtistName(e.target.value)
                  }}
                  placeholder="Your name or artist name"
                  className="w-full px-4 py-3 rounded-lg border-2 border-[#b8a060] bg-white/80 text-sm focus:outline-none focus:border-[#4EAAA2] transition-colors"
                  style={{ fontFamily: "Georgia, serif" }}
                />
                <div className="text-right text-xs mt-1" style={{ color: "#8b7040" }}>
                  {artistName.length}/50
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(2)}
                className="flex-1 px-4 py-3 rounded-lg font-bold text-sm transition-all"
                style={{
                  background: "rgba(0,0,0,0.1)",
                  color: "#5a4020",
                  fontFamily: "Georgia, serif",
                }}
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!canProceedStep3}
                className="flex-1 px-4 py-3 rounded-lg text-white font-bold text-sm transition-all disabled:opacity-50"
                style={{
                  background: canProceedStep3 ? "linear-gradient(180deg, #4EAAA2, #3d918a)" : "#999",
                  fontFamily: "Georgia, serif",
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div
            className="rounded-2xl p-6 md:p-8"
            style={{
              ...parchmentStyle,
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            <h2
              className="text-2xl font-bold mb-2 text-center"
              style={{ fontFamily: "Georgia, serif", color: "#5a4020" }}
            >
              Choose Categories
            </h2>
            <p className="text-sm text-center mb-6" style={{ color: "#8b7040" }}>
              Select at least one category for your card
            </p>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {categoryGroups.map((group) => (
                <div key={group.id}>
                  <h3
                    className="text-sm font-bold mb-2 sticky top-0 py-1"
                    style={{
                      fontFamily: "Georgia, serif",
                      color: "#5a4020",
                      background: "linear-gradient(180deg, #f5ecd0 0%, #ede0b8 100%)",
                    }}
                  >
                    {group.emoji} {group.name}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {group.categories.map((cat) => (
                      <label
                        key={cat.id}
                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-sm transition-all ${
                          selectedCategories.includes(cat.id)
                            ? "bg-[#4EAAA2]/20 border border-[#4EAAA2]"
                            : "bg-white/40 border border-transparent hover:bg-white/60"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat.id)}
                          onChange={() => handleCategoryToggle(cat.id)}
                          className="w-4 h-4 accent-[#4EAAA2]"
                        />
                        <span style={{ color: "#5a4020" }}>{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-white/50 border border-[#b8a060]">
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${
                    addToCatalog ? "bg-[#4EAAA2]" : "bg-gray-300"
                  }`}
                  onClick={() => setAddToCatalog(!addToCatalog)}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                      addToCatalog ? "left-6" : "left-0.5"
                    }`}
                  />
                </div>
                <div>
                  <span
                    className="font-bold text-sm block"
                    style={{ fontFamily: "Georgia, serif", color: "#5a4020" }}
                  >
                    Add to Greet Me Catalog
                  </span>
                  <span className="text-xs" style={{ color: "#8b7040" }}>
                    {addToCatalog
                      ? "Your card will be free for everyone to send!"
                      : "Personal use only — $4.99 to send"}
                  </span>
                </div>
              </label>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(3)}
                className="flex-1 px-4 py-3 rounded-lg font-bold text-sm transition-all"
                style={{
                  background: "rgba(0,0,0,0.1)",
                  color: "#5a4020",
                  fontFamily: "Georgia, serif",
                }}
              >
                Back
              </button>
              <button
                onClick={() => {
                  setPreviewTab("cover")
                  setStep(5)
                }}
                disabled={!canProceedStep4}
                className="flex-1 px-4 py-3 rounded-lg text-white font-bold text-sm transition-all disabled:opacity-50"
                style={{
                  background: canProceedStep4 ? "linear-gradient(180deg, #4EAAA2, #3d918a)" : "#999",
                  fontFamily: "Georgia, serif",
                }}
              >
                Preview Card
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div
            className="rounded-2xl p-6 md:p-8"
            style={{
              ...parchmentStyle,
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            <h2
              className="text-2xl font-bold mb-4 text-center"
              style={{ fontFamily: "Georgia, serif", color: "#5a4020" }}
            >
              Preview Your Card
            </h2>

            <div className="flex justify-center gap-3 mb-6">
              {(["cover", "centerfold", "back"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setPreviewTab(tab)}
                  className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${
                    previewTab === tab
                      ? "bg-[#4EAAA2] text-white shadow-md"
                      : "bg-white/40 text-[#5a4020] hover:bg-white/60"
                  }`}
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex justify-center mb-6">
              <div className="w-full max-w-[280px]">
                {previewTab === "cover" && (
                  <div className="aspect-[3/4] bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200">
                    {(uploadedImageUrl || imagePreview) && (
                      <img
                        src={uploadedImageUrl ? resolveImageUrl(uploadedImageUrl) : imagePreview || ""}
                        alt="Card cover"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                )}

                {previewTab === "centerfold" && (
                  <div className="aspect-[3/4] bg-gradient-to-b from-gray-50 to-white rounded-lg shadow-2xl overflow-hidden border border-gray-200">
                    <div className="h-full p-5 overflow-y-auto">
                      <div className="min-h-full flex flex-col">
                        <h3
                          className="text-xl font-bold mb-4 text-center text-gray-800"
                          style={{ fontFamily: "Georgia, serif" }}
                        >
                          Special Greeting!
                        </h3>
                        <div className="flex-1 flex flex-col justify-center">
                          <p
                            className={`text-gray-700 mb-4 text-center leading-relaxed ${
                              centerfold.length > 200 ? "text-sm" : "text-base"
                            }`}
                            style={{ fontFamily: "Georgia, serif" }}
                          >
                            {centerfold}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {previewTab === "back" && (
                  <div className="aspect-[3/4] bg-gradient-to-b from-gray-50 to-white rounded-lg shadow-2xl flex items-center justify-center p-6 border border-gray-200">
                    <div className="text-center w-full">
                      <div className="mb-6 p-5 bg-white rounded-lg shadow-sm border border-gray-100">
                        <p
                          className="text-lg text-gray-700 font-medium mb-4"
                          style={{ fontFamily: "Georgia, serif" }}
                        >
                          {backMessage}
                        </p>
                        <div className="border-t border-gray-200 pt-3 mt-3">
                          <p className="text-sm text-gray-500 italic" style={{ fontFamily: "Georgia, serif" }}>
                            Created by {artistName}
                          </p>
                        </div>
                      </div>
                      <div
                        className="text-xs text-gray-500 italic"
                        style={{ fontFamily: "Georgia, serif" }}
                      >
                        GreetMe 2024
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {caption && (
              <p className="text-center text-sm italic mb-4" style={{ color: "#6b5030", fontFamily: "Georgia, serif" }}>
                &ldquo;{caption}&rdquo;
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(4)}
                className="flex-1 px-4 py-3 rounded-lg font-bold text-sm transition-all"
                style={{
                  background: "rgba(0,0,0,0.1)",
                  color: "#5a4020",
                  fontFamily: "Georgia, serif",
                }}
              >
                Back
              </button>
              <button
                onClick={() => setStep(6)}
                className="flex-1 px-4 py-3 rounded-lg text-white font-bold text-sm transition-all"
                style={{
                  background: "linear-gradient(180deg, #4EAAA2, #3d918a)",
                  fontFamily: "Georgia, serif",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                }}
              >
                Personalize
              </button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div
            className="rounded-2xl p-6 md:p-8"
            style={{
              ...parchmentStyle,
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            <h2
              className="text-2xl font-bold mb-2 text-center"
              style={{ fontFamily: "Georgia, serif", color: "#5a4020" }}
            >
              Personalize Your Card
            </h2>
            <p className="text-sm text-center mb-6" style={{ color: "#8b7040" }}>
              Add a personal touch before sending
            </p>

            <div className="space-y-5">
              <div>
                <label
                  className="block text-sm font-bold mb-1"
                  style={{ fontFamily: "Georgia, serif", color: "#5a4020" }}
                >
                  To:
                </label>
                <input
                  type="text"
                  value={toName}
                  onChange={(e) => {
                    if (e.target.value.length <= 50) setToName(e.target.value)
                  }}
                  placeholder="Recipient's name"
                  className="w-full px-4 py-3 rounded-lg border-2 border-[#b8a060] bg-white/80 text-sm focus:outline-none focus:border-[#4EAAA2] transition-colors"
                  style={{ fontFamily: "Georgia, serif" }}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-bold mb-1"
                  style={{ fontFamily: "Georgia, serif", color: "#5a4020" }}
                >
                  From:
                </label>
                <input
                  type="text"
                  value={fromName}
                  onChange={(e) => {
                    if (e.target.value.length <= 50) setFromName(e.target.value)
                  }}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-lg border-2 border-[#b8a060] bg-white/80 text-sm focus:outline-none focus:border-[#4EAAA2] transition-colors"
                  style={{ fontFamily: "Georgia, serif" }}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-bold mb-1"
                  style={{ fontFamily: "Georgia, serif", color: "#5a4020" }}
                >
                  Personal Note (Optional)
                </label>
                <textarea
                  value={personalNote}
                  onChange={(e) => {
                    if (e.target.value.length <= 200) setPersonalNote(e.target.value)
                  }}
                  placeholder="Add a special message..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border-2 border-[#b8a060] bg-white/80 text-sm focus:outline-none focus:border-[#4EAAA2] transition-colors resize-none"
                  style={{ fontFamily: "Georgia, serif" }}
                />
                <div className="text-right text-xs mt-1" style={{ color: personalNote.length > 180 ? "#c0392b" : "#8b7040" }}>
                  {personalNote.length}/200
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(5)}
                className="flex-1 px-4 py-3 rounded-lg font-bold text-sm transition-all"
                style={{
                  background: "rgba(0,0,0,0.1)",
                  color: "#5a4020",
                  fontFamily: "Georgia, serif",
                }}
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 rounded-lg text-white font-bold text-sm transition-all disabled:opacity-50"
                style={{
                  background: addToCatalog
                    ? "linear-gradient(180deg, #27ae60, #1e8449)"
                    : "linear-gradient(180deg, #4EAAA2, #3d918a)",
                  fontFamily: "Georgia, serif",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                }}
              >
                {isSubmitting
                  ? "Submitting..."
                  : addToCatalog
                  ? "Submit Card"
                  : "Submit & Pay $4.99"}
              </button>
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <div
              className="rounded-2xl p-8 md:p-12 text-center max-w-lg w-full"
              style={{
                ...parchmentStyle,
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}
            >
              <div className="mb-6">
                <span className="text-6xl">🎉</span>
              </div>
              <h2
                className="text-3xl font-bold mb-4"
                style={{ fontFamily: "Georgia, serif", color: "#5a4020" }}
              >
                Card Submitted!
              </h2>
              {addToCatalog ? (
                <p
                  className="text-base mb-6 leading-relaxed"
                  style={{ fontFamily: "Georgia, serif", color: "#6b5030" }}
                >
                  Your card has been submitted to the Greet Me catalog! Once approved,
                  it will be available for everyone to send.
                </p>
              ) : (
                <p
                  className="text-base mb-6 leading-relaxed"
                  style={{ fontFamily: "Georgia, serif", color: "#6b5030" }}
                >
                  Your personal card has been created successfully! You can now share it
                  with someone special.
                </p>
              )}
              {createdCardId && (
                <p className="text-xs mb-4" style={{ color: "#8b7040" }}>
                  Card ID: {createdCardId}
                </p>
              )}
              {shareUrl && (
                <div className="mb-6 space-y-3">
                  <p
                    className="text-sm font-bold"
                    style={{ fontFamily: "Georgia, serif", color: "#5a4020" }}
                  >
                    Share your card:
                  </p>
                  <div className="p-3 bg-white/80 rounded-lg border border-[#b8a060]">
                    <p className="text-sm break-all" style={{ color: "#5a4020" }}>
                      {shareUrl}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(shareUrl).then(() => {
                          alert("Link copied to clipboard!")
                        }).catch(() => {
                          const textArea = document.createElement("textarea")
                          textArea.value = shareUrl
                          document.body.appendChild(textArea)
                          textArea.select()
                          document.execCommand("copy")
                          document.body.removeChild(textArea)
                          alert("Link copied to clipboard!")
                        })
                      }}
                      className="flex-1 px-4 py-2 rounded-lg font-bold text-sm transition-all border-2 border-[#b8a060] bg-white/60"
                      style={{ fontFamily: "Georgia, serif", color: "#5a4020" }}
                    >
                      📋 Copy Link
                    </button>
                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: "GreetMe Card",
                            url: shareUrl,
                          }).catch(() => {})
                        } else {
                          navigator.clipboard.writeText(shareUrl).then(() => {
                            alert("Link copied to clipboard!")
                          }).catch(() => {})
                        }
                      }}
                      className="flex-1 px-4 py-2 rounded-lg text-white font-bold text-sm transition-all"
                      style={{
                        background: "linear-gradient(180deg, #4CD964, #34C759)",
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      🔗 Share
                    </button>
                  </div>
                </div>
              )}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setStep(1)
                    setImageFile(null)
                    setImagePreview(null)
                    setUploadedImageUrl(null)
                    setCenterfold("")
                    setBackMessage("")
                    setCaption("")
                    setArtistName("")
                    setSelectedCategories([])
                    setAddToCatalog(true)
                    setSubmitSuccess(false)
                    setCreatedCardId(null)
                    setErrorMessage(null)
                    setShareUrl(null)
                    setToName("")
                    setFromName("")
                    setPersonalNote("")
                  }}
                  className="w-full px-6 py-3 rounded-lg text-white font-bold text-sm transition-all hover:scale-105"
                  style={{
                    background: "linear-gradient(180deg, #4EAAA2, #3d918a)",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  Create Another Card
                </button>
                <a
                  href="/"
                  className="block w-full px-6 py-3 rounded-lg font-bold text-sm transition-all text-center"
                  style={{
                    background: "rgba(0,0,0,0.1)",
                    color: "#5a4020",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  Back to GreetMe
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </BookshelfBackground>
  )
}
