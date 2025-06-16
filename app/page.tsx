"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Eye, EyeOff, ChevronLeft, ChevronRight, Copy, Share2 } from "lucide-react"

const greetingCards = [
  {
    id: 1,
    title: "Incredi-Bull Dad",
    cover: "/images/card-bull.webp",
    centerfold:
      "Dad, you're absolutely incredible in every way! Your strength, wisdom, and love make you the best father anyone could ask for.",
    back: "You're simply the best, Dad!",
  },
  {
    id: 2,
    title: "Hero Dad",
    cover: "/images/card-hero-dad.webp",
    centerfold:
      "To my hero - thank you for always being there, for your guidance, and for showing me what it means to be strong and kind.",
    back: "My hero, always and forever",
  },
  {
    id: 3,
    title: "Love You to the Moon",
    cover: "/images/card-moon.webp",
    centerfold:
      "Dad, my love for you reaches beyond the stars and back again. Thank you for being my guiding light through life's journey.",
    back: "To infinity and beyond, Dad!",
  },
  {
    id: 4,
    title: "Dolphinitely the Best",
    cover: "/images/card-dolphins.webp",
    centerfold:
      "Dad, you're dolphinitely the most amazing father! Thanks for all the fun times and for always making me smile.",
    back: "Swimming in gratitude for you!",
  },
  {
    id: 5,
    title: "World's Greatest Basketball Dad",
    cover: "/images/card-basketball-dad.jpeg",
    centerfold:
      "Dad, thanks for teaching me the game of life and basketball! Every shot you helped me practice, every game you cheered me on - you're truly the world's greatest dad.",
    back: "Game, set, match - you win at being the best dad!",
  },
  {
    id: 6,
    title: "World's Greatest Soccer Dad",
    cover: "/images/card-soccer-dad.jpeg",
    centerfold:
      "Dad, you've always been my biggest fan and best coach! From backyard games to life lessons, you score big in my heart every day.",
    back: "You're a champion dad in every way!",
  },
  // Page 2 cards
  {
    id: 7,
    title: "Eggcellent Dad",
    cover: "/images/card-eggcellent.webp",
    centerfold:
      "Dad, you're absolutely eggcellent! Thanks for always being there to brighten my day and make everything better.",
    back: "You're one eggstraordinary dad!",
  },
  {
    id: 8,
    title: "Your Biggest Fan",
    cover: "/images/card-biggest-fan.webp",
    centerfold:
      "Dad, I'm your biggest fan! You've always been there to cheer me on and keep me cool when things get heated.",
    back: "Thanks for being so cool, Dad!",
  },
  {
    id: 9,
    title: "One in a Melon",
    cover: "/images/card-one-in-melon.webp",
    centerfold:
      "Dad, you're truly one in a melon! Sweet, refreshing, and always the perfect addition to make any day better.",
    back: "You're the sweetest dad ever!",
  },
  {
    id: 10,
    title: "Donut Know What I'd Do",
    cover: "/images/card-donut.webp",
    centerfold:
      "Dad, I donut know what I'd do without you! You make life sweeter and always add that special glaze to every moment.",
    back: "You're the sweetest dad around!",
  },
  {
    id: 11,
    title: "Olive You Dad",
    cover: "/images/card-olive-you.webp",
    centerfold:
      "Dad, olive you so much! You've helped me grow and branch out, always supporting me through thick and thin.",
    back: "Olive you to the moon and back!",
  },
  {
    id: 12,
    title: "Best Dad Ever",
    cover: "/images/card-best-dad-ever.webp",
    centerfold:
      "Dad, you're simply the BEST DAD EVER! Colorful, vibrant, and always bringing joy and excitement to our family.",
    back: "You're our family's masterpiece!",
  },
]

export default function FathersDayApp() {
  const [currentScreen, setCurrentScreen] = useState("loading")
  const [selectedCard, setSelectedCard] = useState(null)
  const [cardView, setCardView] = useState("cover")
  const [showInstructions, setShowInstructions] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [shareableLink, setShareableLink] = useState("")
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    personalNote: "",
  })

  // Check if we're viewing a shared card
  const [isViewingSharedCard, setIsViewingSharedCard] = useState(false)
  const [sharedCardData, setSharedCardData] = useState(null)

  const cardsPerPage = 6
  const totalPages = Math.ceil(greetingCards.length / cardsPerPage)

  useEffect(() => {
    if (currentScreen === "loading") {
      const timer = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer)
            return 100
          }
          return prev + 5
        })
      }, 100)
      return () => clearInterval(timer)
    }

    // Check URL for shared card parameters
    const urlParams = new URLSearchParams(window.location.search)
    const cardId = urlParams.get("card")
    const from = urlParams.get("from")
    const to = urlParams.get("to")
    const note = urlParams.get("note")

    if (cardId && from && to) {
      const card = greetingCards.find((c) => c.id === Number.parseInt(cardId))
      if (card) {
        setIsViewingSharedCard(true)
        setSharedCardData({
          card,
          from: decodeURIComponent(from),
          to: decodeURIComponent(to),
          personalNote: note ? decodeURIComponent(note) : "",
        })
        setCurrentScreen("viewCard")
      }
    }
  }, [currentScreen])

  const handleEnterApp = () => {
    setCurrentScreen("library")
  }

  const handleCardSelect = (card) => {
    setSelectedCard(card)
    setCurrentScreen("customize")
  }

  const generateShareableLink = () => {
    const baseUrl = window.location.origin + window.location.pathname
    const params = new URLSearchParams({
      card: selectedCard.id.toString(),
      from: encodeURIComponent(formData.from),
      to: encodeURIComponent(formData.to),
      ...(formData.personalNote && { note: encodeURIComponent(formData.personalNote) }),
    })

    const link = `${baseUrl}?${params.toString()}`
    setShareableLink(link)
    setCurrentScreen("shareLink")
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink)
      alert("Link copied to clipboard!")
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea")
      textArea.value = shareableLink
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      alert("Link copied to clipboard!")
    }
  }

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Father's Day Card from ${formData.from}`,
          text: `${formData.from} sent you a special Father's Day card!`,
          url: shareableLink,
        })
      } catch (err) {
        console.log("Error sharing:", err)
        copyToClipboard()
      }
    } else {
      copyToClipboard()
    }
  }

  const getCurrentPageCards = () => {
    const startIndex = currentPage * cardsPerPage
    const endIndex = startIndex + cardsPerPage
    return greetingCards.slice(startIndex, endIndex)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const renderCardContent = (cardData = null, viewData = null) => {
    const card = cardData || selectedCard
    const data = viewData || formData

    if (!card) return null

    switch (cardView) {
      case "cover":
        return (
          <div className="aspect-[3/4] bg-white rounded-lg shadow-lg flex items-center justify-center p-4">
            <img
              src={card.cover || "/placeholder.svg"}
              alt={card.title}
              className="w-full h-full object-cover rounded"
            />
          </div>
        )
      case "centerfold":
        return (
          <div className="aspect-[3/4] bg-white rounded-lg shadow-lg flex items-center justify-center p-6">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">Happy Father's Day!</h3>
              <p className="text-gray-700 mb-4">{card.centerfold}</p>
              {data.personalNote && (
                <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border-l-4 border-yellow-400">
                  <p className="text-sm italic text-gray-800 font-medium">"{data.personalNote}"</p>
                  <p className="text-xs text-gray-600 mt-2">- {data.from}</p>
                </div>
              )}
            </div>
          </div>
        )
      case "back":
        return (
          <div
            className="aspect-[3/4] bg-white rounded-lg shadow-lg flex items-center justify-center p-6 relative overflow-hidden"
            style={{
              backgroundImage: `url('/images/card-back-pattern.png')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-white/80 rounded-lg"></div>

            <div className="text-center relative z-10">
              <div className="mb-6 p-4 bg-white/90 rounded-lg shadow-sm border-2 border-yellow-600/20">
                <p className="text-lg text-gray-700 font-medium mb-4">{card.back}</p>

                <div className="space-y-3 text-left">
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-800 mr-2">From:</span>
                    <span className="text-gray-700 font-medium">{data.from || "___________"}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-800 mr-2">To:</span>
                    <span className="text-gray-700 font-medium">{data.to || "___________"}</span>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="text-xs text-gray-500 italic">Happy Father's Day 2024</div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  if (currentScreen === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-yellow-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative clouds */}
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full opacity-80 -mb-16 -ml-16"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full opacity-60 -mb-12 -mr-12"></div>

        <div className="bg-yellow-50 border-4 border-yellow-600 rounded-lg p-6 max-w-sm w-full text-center shadow-lg">
          <h1 className="text-3xl font-bold text-yellow-800 mb-4" style={{ fontFamily: "cursive" }}>
            Happy Father's Day
          </h1>

          <div className="mb-4">
            <Progress value={loadingProgress} className="w-full" />
            <p className="text-sm text-gray-600 mt-2">Loading {loadingProgress}%...</p>
          </div>

          <h2 className="text-xl font-bold text-yellow-800 mb-6" style={{ fontFamily: "cursive" }}>
            The World's Greatest Dads
          </h2>

          <div className="bg-yellow-600 text-white px-4 py-2 rounded inline-block">
            <span className="text-sm font-italic">by Najee Jeremiah</span>
          </div>
        </div>

        {loadingProgress >= 100 && (
          <Button
            onClick={handleEnterApp}
            className="mt-6 bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 text-lg font-bold shadow-lg"
          >
            Enter Here
          </Button>
        )}
      </div>
    )
  }

  if (currentScreen === "viewCard") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-yellow-200">
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-yellow-800 text-white">
          <div className="text-lg font-bold">Father's Day Card</div>
          <div className="text-sm">
            From: {sharedCardData?.from} → To: {sharedCardData?.to}
          </div>
        </div>

        <div className="p-4">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6 text-yellow-800">{sharedCardData?.card.title}</h2>

            {/* Card preview */}
            {renderCardContent(sharedCardData?.card, sharedCardData)}

            {/* Card view tabs */}
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant={cardView === "cover" ? "default" : "outline"}
                onClick={() => setCardView("cover")}
                className="bg-teal-600 hover:bg-teal-700"
              >
                Front
              </Button>
              <Button
                variant={cardView === "centerfold" ? "default" : "outline"}
                onClick={() => setCardView("centerfold")}
              >
                Inside
              </Button>
              <Button variant={cardView === "back" ? "default" : "outline"} onClick={() => setCardView("back")}>
                Back
              </Button>
            </div>

            {/* Create your own card button */}
            <div className="text-center mt-8">
              <Button
                onClick={() => {
                  setIsViewingSharedCard(false)
                  setSharedCardData(null)
                  setCurrentScreen("library")
                  // Clear URL parameters
                  window.history.replaceState({}, document.title, window.location.pathname)
                }}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3"
              >
                Create Your Own Card
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentScreen === "shareLink") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-yellow-200 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-white/95 shadow-xl">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Card Ready to Share!</h2>
              <p className="text-gray-600">Your personalized Father's Day card is ready. Share the link below:</p>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-sm text-gray-600 break-all">{shareableLink}</p>
              </div>

              <div className="flex gap-2">
                <Button onClick={copyToClipboard} className="flex-1" variant="outline">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
                <Button onClick={shareLink} className="flex-1 bg-green-600 hover:bg-green-700">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>

              <div className="text-center pt-4">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setCurrentScreen("library")
                    setSelectedCard(null)
                    setFormData({ from: "", to: "", personalNote: "" })
                    setShareableLink("")
                  }}
                >
                  Create Another Card
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentScreen === "library") {
    const currentCards = getCurrentPageCards()

    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-yellow-200 relative pb-32">
        {/* Wooden bookshelf background */}
        <div
          className="min-h-screen bg-cover bg-center relative"
          style={{
            backgroundImage: `linear-gradient(rgba(139, 69, 19, 0.1), rgba(139, 69, 19, 0.1)), 
                           repeating-linear-gradient(90deg, #8B4513 0px, #A0522D 2px, #8B4513 4px)`,
          }}
        >
          {/* Shelf structure */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-900/10 to-transparent">
            {/* Top shelf */}
            <div className="absolute top-16 left-4 right-4 h-32 bg-yellow-800/20 rounded border-b-2 border-yellow-900/30"></div>
            {/* Middle shelf */}
            <div className="absolute top-56 left-4 right-4 h-32 bg-yellow-800/20 rounded border-b-2 border-yellow-900/30"></div>
            {/* Bottom shelf */}
            <div className="absolute top-96 left-4 right-4 h-32 bg-yellow-800/20 rounded border-b-2 border-yellow-900/30"></div>
          </div>

          {/* Page indicator */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-800/80 text-white px-4 py-2 rounded-full text-sm font-bold z-20">
            Page {currentPage + 1} of {totalPages}
          </div>

          {/* Cards on shelves */}
          <div className="relative z-10 p-4 pt-20">
            {/* Top shelf cards (2 cards) */}
            <div className="flex justify-center gap-3 mb-12">
              {currentCards.slice(0, 2).map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleCardSelect(card)}
                  className="transform hover:scale-105 transition-transform"
                >
                  <img
                    src={card.cover || "/placeholder.svg"}
                    alt={card.title}
                    className="w-20 h-24 object-cover rounded shadow-lg border-2 border-yellow-900/30"
                  />
                </button>
              ))}
            </div>

            {/* Middle shelf cards (2 cards) */}
            <div className="flex justify-center gap-3 mb-12">
              {currentCards.slice(2, 4).map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleCardSelect(card)}
                  className="transform hover:scale-105 transition-transform"
                >
                  <img
                    src={card.cover || "/placeholder.svg"}
                    alt={card.title}
                    className="w-20 h-24 object-cover rounded shadow-lg border-2 border-yellow-900/30"
                  />
                </button>
              ))}
            </div>

            {/* Bottom shelf cards (2 cards) */}
            <div className="flex justify-center gap-3 mb-12">
              {currentCards.slice(4, 6).map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleCardSelect(card)}
                  className="transform hover:scale-105 transition-transform"
                >
                  <img
                    src={card.cover || "/placeholder.svg"}
                    alt={card.title}
                    className="w-20 h-24 object-cover rounded shadow-lg border-2 border-yellow-900/30"
                  />
                </button>
              ))}
            </div>

            {/* Pagination controls - positioned after cards */}
            <div className="flex justify-center gap-4 mt-16 relative z-20">
              <Button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <div className="flex items-center px-4 py-2 bg-white/80 rounded-lg">
                <span className="text-sm font-medium">
                  {currentPage + 1} of {totalPages}
                </span>
              </div>
              <Button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages - 1}
                className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Instructions overlay */}
          {showInstructions && (
            <div className="absolute bottom-4 left-4 right-4 bg-yellow-800/90 text-white p-4 rounded-lg z-30">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold">How it Works:</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInstructions(false)}
                  className="text-white hover:bg-yellow-700"
                >
                  Hide
                </Button>
              </div>
              <ol className="list-decimal list-inside space-y-1">
                <li>Choose a Greeting Card</li>
                <li>Personalize with your message</li>
                <li>Share the link with your dad</li>
              </ol>
            </div>
          )}

          {/* Instructions toggle button */}
          <Button
            onClick={() => setShowInstructions(!showInstructions)}
            className="absolute bottom-4 right-4 bg-yellow-600 hover:bg-yellow-700 z-30"
          >
            {showInstructions ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    )
  }

  if (currentScreen === "customize") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-yellow-200">
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-yellow-800 text-white">
          <div className="text-lg font-bold">Free Card</div>
          <Button
            onClick={generateShareableLink}
            className="bg-teal-600 hover:bg-teal-700 px-6"
            disabled={!formData.from || !formData.to}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Bookshelf background with card preview */}
        <div
          className="min-h-screen bg-cover bg-center relative p-4"
          style={{
            backgroundImage: `linear-gradient(rgba(139, 69, 19, 0.1), rgba(139, 69, 19, 0.1)), 
                             repeating-linear-gradient(90deg, #8B4513 0px, #A0522D 2px, #8B4513 4px)`,
          }}
        >
          {/* Small cards in background */}
          <div className="absolute top-4 left-4 right-4 flex justify-center gap-2 opacity-50">
            {greetingCards.slice(0, 4).map((card) => (
              <img
                key={card.id}
                src={card.cover || "/placeholder.svg"}
                alt={card.title}
                className="w-12 h-16 object-cover rounded shadow"
              />
            ))}
          </div>

          {/* Main form */}
          <div className="relative z-10 mt-20">
            <Card className="max-w-md mx-auto bg-white/95 shadow-xl">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-center mb-6">Happy Father's Day Greeting Card</h2>

                <div className="space-y-4 mb-6">
                  <div>
                    <Label htmlFor="from">From:</Label>
                    <Input
                      id="from"
                      value={formData.from}
                      onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                      className="border-b-2 border-gray-300 rounded-none bg-transparent"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="to">To:</Label>
                    <Input
                      id="to"
                      value={formData.to}
                      onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                      className="border-b-2 border-gray-300 rounded-none bg-transparent"
                      placeholder="Dad's name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="note">Personal Note (Optional):</Label>
                    <Textarea
                      id="note"
                      value={formData.personalNote}
                      onChange={(e) => setFormData({ ...formData, personalNote: e.target.value })}
                      placeholder="Add your personal message here... This will appear inside the card."
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>

                <Button
                  onClick={generateShareableLink}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-bold"
                  disabled={!formData.from || !formData.to}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Generate Share Link
                </Button>
              </CardContent>
            </Card>

            {/* Card preview */}
            <div className="mt-6 max-w-md mx-auto">
              {renderCardContent()}

              {/* Card view tabs */}
              <div className="flex justify-center gap-2 mt-4">
                <Button
                  variant={cardView === "cover" ? "default" : "outline"}
                  onClick={() => setCardView("cover")}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  Front
                </Button>
                <Button
                  variant={cardView === "centerfold" ? "default" : "outline"}
                  onClick={() => setCardView("centerfold")}
                >
                  Inside
                </Button>
                <Button variant={cardView === "back" ? "default" : "outline"} onClick={() => setCardView("back")}>
                  Back
                </Button>
              </div>
            </div>

            {/* Back to library */}
            <div className="text-center mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentScreen("library")
                  setSelectedCard(null)
                }}
              >
                Back to Library
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
