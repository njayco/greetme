"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Eye, EyeOff, ChevronLeft, ChevronRight, Copy, Share2, ArrowLeft } from "lucide-react"

const cardCategories: Record<string, { name: string; color: string; cards: { id: number; title: string; cover: string; centerfold: string; back: string }[] }> = {
  "fathers-day": {
    name: "Father's Day",
    color: "yellow",
    cards: [
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
    ],
  },
  birthday: {
    name: "Birthday",
    color: "pink",
    cards: [
      {
        id: 13,
        title: "Birthday Cake Celebration",
        cover: "/images/birthday-cake-celebration.png",
        centerfold:
          "Another year of amazing memories and incredible adventures! May this special day be filled with all your favorite things - delicious cake, wonderful surprises, and the warmth of those who love you most. Here's to celebrating YOU and all the joy you bring to the world!",
        back: "Wishing you the happiest of birthdays and a year ahead filled with dreams come true!",
      },
      {
        id: 14,
        title: "Special Gift For You",
        cover: "/images/birthday-gift-box.png",
        centerfold:
          "Today is all about celebrating the amazing person you are! Like the perfect gift, you bring joy, laughter, and happiness wherever you go. May your birthday be wrapped in love, tied with joy, and filled with all the wonderful surprises life has to offer!",
        back: "Hope your special day is as wonderful as the gift of having you in our lives!",
      },
      {
        id: 15,
        title: "Balloons & Cake",
        cover: "/images/birthday-cake-balloons.png",
        centerfold:
          "Let's celebrate with balloons reaching for the sky and cake sweet enough to match your wonderful spirit! Another year means another chapter of your incredible story. May it be filled with new adventures, cherished moments, and all the happiness your heart can hold!",
        back: "Here's to floating through life with joy and sweetness in every moment!",
      },
      {
        id: 16,
        title: "Colorful Birthday Wishes",
        cover: "/images/birthday-balloons.png",
        centerfold:
          "Just like these colorful balloons, may your birthday lift your spirits high and fill your heart with pure joy! You deserve all the celebration, laughter, and love that this special day can bring. Here's to another year of being absolutely wonderful!",
        back: "May your birthday be as bright and colorful as you make everyone else's days!",
      },
    ],
  },
  "get-well": {
    name: "Get Well Soon",
    color: "green",
    cards: [
      {
        id: 17,
        title: "Healing Thoughts",
        cover: "/placeholder.svg?height=300&width=240&text=Get+Well+Flowers",
        centerfold:
          "Sending you healing thoughts and warm wishes for a speedy recovery. Take care of yourself and know that you're in our thoughts.",
        back: "Get well soon!",
      },
      {
        id: 18,
        title: "Feel Better Soon",
        cover: "/placeholder.svg?height=300&width=240&text=Feel+Better+Sun",
        centerfold:
          "Hope you're feeling better with each passing day. Rest up, take it easy, and know that brighter days are ahead.",
        back: "Thinking of you and wishing you well!",
      },
      {
        id: 19,
        title: "Speedy Recovery",
        cover: "/placeholder.svg?height=300&width=240&text=Recovery+Heart",
        centerfold:
          "Wishing you strength, comfort, and a very speedy recovery. You're stronger than you know, and we're all rooting for you!",
        back: "Sending love and healing vibes your way!",
      },
    ],
  },
  graduation: {
    name: "Graduation",
    color: "blue",
    cards: [
      {
        id: 20,
        title: "Congratulations Graduate",
        cover: "/placeholder.svg?height=300&width=240&text=Graduation+Cap",
        centerfold:
          "Congratulations on your graduation! Your hard work, dedication, and perseverance have paid off. The future is bright, and we can't wait to see what you accomplish next!",
        back: "So proud of you, graduate!",
      },
      {
        id: 21,
        title: "Future is Bright",
        cover: "/placeholder.svg?height=300&width=240&text=Bright+Future",
        centerfold:
          "As you graduate and move forward, remember that this is just the beginning of an amazing journey. Your potential is limitless!",
        back: "The world is waiting for your brilliance!",
      },
      {
        id: 22,
        title: "Achievement Unlocked",
        cover: "/placeholder.svg?height=300&width=240&text=Achievement+Trophy",
        centerfold:
          "You did it! This graduation is a testament to your hard work and determination. Celebrate this amazing achievement - you've earned it!",
        back: "Achievement unlocked: Graduate!",
      },
    ],
  },
  juneteenth: {
    name: "Juneteenth",
    color: "red",
    cards: [
      {
        id: 23,
        title: "Celebrating Freedom & Heritage",
        cover: "/images/juneteenth-heritage.png",
        centerfold:
          "Happy Juneteenth! Today we celebrate freedom, honor our ancestors, and embrace the rich heritage that makes us strong. This day reminds us of the resilience, courage, and hope that have carried us through history and continue to inspire our future. Let us remember the past, celebrate the present, and work together for a brighter tomorrow.",
        back: "Freedom, heritage, and unity - celebrating Juneteenth with pride and hope!",
      },
      {
        id: 24,
        title: "Freedom Day Celebration",
        cover: "/images/juneteenth-celebration.jpeg",
        centerfold:
          "On this Juneteenth, we gather to celebrate the end of slavery and the beginning of true freedom for all. This day represents triumph over oppression, the power of community, and the ongoing journey toward equality and justice. May we continue to honor this legacy by building bridges, fostering understanding, and creating a world where freedom truly rings for everyone.",
        back: "Celebrating freedom, remembering history, and building a better future together!",
      },
    ],
  },
  "fourth-of-july": {
    name: "Fourth of July",
    color: "red",
    cards: [
      {
        id: 25,
        title: "Independence Day",
        cover: "/placeholder.svg?height=300&width=240&text=July+4th+Flag",
        centerfold:
          "Happy Fourth of July! Let's celebrate the land of the free and the home of the brave with fireworks, family, and freedom!",
        back: "Happy Independence Day!",
      },
      {
        id: 26,
        title: "Stars and Stripes",
        cover: "/placeholder.svg?height=300&width=240&text=Stars+Stripes",
        centerfold:
          "Celebrating America's independence with pride, patriotism, and gratitude for the freedoms we enjoy. Happy Fourth of July!",
        back: "Proud to be American!",
      },
      {
        id: 27,
        title: "Fireworks Celebration",
        cover: "/placeholder.svg?height=300&width=240&text=Fireworks+USA",
        centerfold:
          "Let freedom ring! Wishing you a spectacular Fourth of July filled with fireworks, fun, and the spirit of independence.",
        back: "Let freedom ring!",
      },
    ],
  },
}

function CloudDecoration({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      <div className="relative">
        <div className="w-40 h-20 bg-white rounded-full opacity-90"></div>
        <div className="absolute -top-6 left-8 w-24 h-24 bg-white rounded-full opacity-90"></div>
        <div className="absolute -top-4 left-20 w-20 h-20 bg-white rounded-full opacity-90"></div>
        <div className="absolute -top-2 left-2 w-16 h-16 bg-white rounded-full opacity-90"></div>
      </div>
    </div>
  )
}

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

function WoodenShelf() {
  return (
    <div className="relative w-full h-6">
      <div
        className="absolute inset-x-0 top-0 h-5"
        style={{
          background: 'linear-gradient(180deg, #8B6914 0%, #a07830 40%, #7a5a20 100%)',
          borderRadius: '0 0 4px 4px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.4), inset 0 -2px 4px rgba(0,0,0,0.2)',
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-2"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)',
          borderRadius: '0 0 4px 4px',
        }}
      />
    </div>
  )
}

export default function GreetingCardsApp() {
  const [currentScreen, setCurrentScreen] = useState("loading")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedCard, setSelectedCard] = useState<any>(null)
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
  const [isViewingSharedCard, setIsViewingSharedCard] = useState(false)
  const [sharedCardData, setSharedCardData] = useState<any>(null)

  const cardsPerPage = 8

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

    const urlParams = new URLSearchParams(window.location.search)
    const cardId = urlParams.get("card")
    const from = urlParams.get("from")
    const to = urlParams.get("to")
    const note = urlParams.get("note")

    if (cardId && from && to) {
      let foundCard: any = null
      let foundCategory: string | null = null

      Object.entries(cardCategories).forEach(([categoryKey, category]) => {
        const card = category.cards.find((c) => c.id === Number.parseInt(cardId))
        if (card) {
          foundCard = card
          foundCategory = categoryKey
        }
      })

      if (foundCard) {
        setIsViewingSharedCard(true)
        setSharedCardData({
          card: foundCard,
          category: foundCategory,
          from: decodeURIComponent(from),
          to: decodeURIComponent(to),
          personalNote: note ? decodeURIComponent(note) : "",
        })
        setCurrentScreen("viewCard")
      }
    }
  }, [currentScreen])

  const handleEnterApp = () => {
    setCurrentScreen("categories")
  }

  const handleCategorySelect = (categoryKey: string) => {
    setSelectedCategory(categoryKey)
    setCurrentPage(0)
    setCurrentScreen("library")
  }

  const handleCardSelect = (card: any) => {
    setSelectedCard(card)
    setCardView("cover")
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
          title: `Greeting Card from ${formData.from}`,
          text: `${formData.from} sent you a special greeting card!`,
          url: shareableLink,
        })
      } catch (err) {
        copyToClipboard()
      }
    } else {
      copyToClipboard()
    }
  }

  const getCurrentPageCards = () => {
    if (!selectedCategory || !cardCategories[selectedCategory]) return []
    const cards = cardCategories[selectedCategory].cards
    const startIndex = currentPage * cardsPerPage
    const endIndex = startIndex + cardsPerPage
    return cards.slice(startIndex, endIndex)
  }

  const getTotalPages = () => {
    if (!selectedCategory || !cardCategories[selectedCategory]) return 0
    return Math.ceil(cardCategories[selectedCategory].cards.length / cardsPerPage)
  }

  const handleNextPage = () => {
    const totalPages = getTotalPages()
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const renderCardContent = (cardData: any = null, viewData: any = null) => {
    const card = cardData || selectedCard
    const data = viewData || formData

    if (!card) return null

    switch (cardView) {
      case "cover":
        return (
          <div className="aspect-[3/4] bg-white rounded-lg shadow-2xl flex items-center justify-center p-2 border border-gray-200">
            <img
              src={card.cover || "/placeholder.svg"}
              alt={card.title}
              className="w-full h-full object-cover rounded"
            />
          </div>
        )
      case "centerfold":
        return (
          <div className="aspect-[3/4] bg-gradient-to-b from-gray-50 to-white rounded-lg shadow-2xl overflow-hidden border border-gray-200">
            <div className="h-full p-5 overflow-y-auto">
              <div className="min-h-full flex flex-col">
                <h3 className="text-xl font-bold mb-4 text-center text-gray-800" style={{ fontFamily: "Georgia, serif" }}>Special Greeting!</h3>
                <div className="flex-1 flex flex-col justify-center">
                  <p
                    className={`text-gray-700 mb-4 text-center leading-relaxed ${
                      card.centerfold.length > 200
                        ? "text-sm"
                        : "text-base"
                    }`}
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {card.centerfold}
                  </p>
                  {data.personalNote && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border-l-4 border-amber-500">
                      <p className="text-sm italic text-gray-800 font-medium break-words" style={{ fontFamily: "Georgia, serif" }}>"{data.personalNote}"</p>
                      <p className="text-xs text-gray-600 mt-2">- {data.from}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      case "back":
        return (
          <div className="aspect-[3/4] bg-gradient-to-b from-gray-50 to-white rounded-lg shadow-2xl flex items-center justify-center p-6 border border-gray-200">
            <div className="text-center w-full">
              <div className="mb-6 p-5 bg-white rounded-lg shadow-sm border border-gray-100">
                <p className="text-lg text-gray-700 font-medium mb-5" style={{ fontFamily: "Georgia, serif" }}>{card.back}</p>
                <div className="space-y-4 text-left">
                  <div className="flex items-center border-b border-gray-300 pb-2">
                    <span className="font-bold text-gray-800 mr-3" style={{ fontFamily: "Georgia, serif" }}>From:</span>
                    <span className="text-gray-700">{data.from || "___________"}</span>
                  </div>
                  <div className="flex items-center border-b border-gray-300 pb-2">
                    <span className="font-bold text-gray-800 mr-3" style={{ fontFamily: "Georgia, serif" }}>To:</span>
                    <span className="text-gray-700">{data.to || "___________"}</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 italic" style={{ fontFamily: "Georgia, serif" }}>GreetMe 2024</div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const CardViewTabs = ({ className = "" }: { className?: string }) => (
    <div className={`flex justify-center items-center gap-6 ${className}`}>
      <button
        onClick={() => setCardView("cover")}
        className={`px-6 py-2 rounded font-bold text-sm transition-all ${
          cardView === "cover"
            ? "bg-[#4EAAA2] text-white shadow-md"
            : "bg-transparent text-gray-300 hover:text-white"
        }`}
      >
        Cover
      </button>
      <button
        onClick={() => setCardView("centerfold")}
        className={`px-6 py-2 rounded font-bold text-sm transition-all ${
          cardView === "centerfold"
            ? "bg-[#4EAAA2] text-white shadow-md"
            : "bg-transparent text-gray-300 hover:text-white"
        }`}
      >
        Centerfold
      </button>
      <button
        onClick={() => setCardView("back")}
        className={`px-6 py-2 rounded font-bold text-sm transition-all ${
          cardView === "back"
            ? "bg-[#4EAAA2] text-white shadow-md"
            : "bg-transparent text-gray-300 hover:text-white"
        }`}
      >
        Back
      </button>
    </div>
  )

  if (currentScreen === "loading") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
        style={{
          background: `
            linear-gradient(135deg, #a89060 0%, #9a8050 50%, #8a7040 100%)
          `,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 20px,
                rgba(255,255,255,0.03) 20px,
                rgba(255,255,255,0.03) 40px
              )
            `,
          }}
        />

        <div className="relative z-10 w-full max-w-md">
          <div
            className="rounded-xl p-8 text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #f5ecd0 0%, #ede0b8 60%, #e8d8a8 100%)',
              border: '3px solid #b8a060',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.5)',
            }}
          >
            <h1
              className="text-5xl font-bold text-gray-800 mb-2"
              style={{ fontFamily: "cursive" }}
            >
              GreetMe
            </h1>

            <div className="mb-4 px-4">
              <div className="relative w-full h-6 bg-gray-300 rounded overflow-hidden border border-gray-400">
                <div
                  className="h-full rounded transition-all duration-300"
                  style={{
                    width: `${loadingProgress}%`,
                    background: 'linear-gradient(90deg, #5BA3D9, #4A90C4)',
                  }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                  Loading {loadingProgress}%...
                </span>
              </div>
            </div>

            <h2
              className="text-xl text-gray-700 mb-2"
              style={{ fontFamily: "cursive" }}
            >
              Not Just a Card—An Experience
            </h2>
            <p className="text-sm text-gray-600 mb-4 font-medium">No Sign Up. And It's Free.</p>

            <div
              className="w-full h-3 mb-4"
              style={{
                background: `repeating-linear-gradient(
                  90deg,
                  #b8860b 0px,
                  #b8860b 4px,
                  #c49a3c 4px,
                  #c49a3c 8px
                )`,
                borderRadius: '2px',
              }}
            />

            <div
              className="inline-block px-6 py-2 rounded-md relative"
              style={{
                background: 'linear-gradient(180deg, #d32f2f, #b71c1c)',
                boxShadow: '0 3px 6px rgba(0,0,0,0.3)',
              }}
            >
              <span className="text-white text-sm font-bold italic" style={{ fontFamily: "Georgia, serif" }}>by Najee Jeremiah</span>
            </div>
          </div>
        </div>

        {loadingProgress >= 100 && (
          <button
            onClick={handleEnterApp}
            className="relative z-10 mt-8 text-3xl font-bold text-white/90 hover:text-white transition-colors cursor-pointer"
            style={{ fontFamily: "Georgia, serif", textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
          >
            Enter Here
          </button>
        )}

        <CloudDecoration className="bottom-0 left-0 -mb-4 -ml-8 z-10" />
      </div>
    )
  }

  if (currentScreen === "categories") {
    return (
      <BookshelfBackground>
        <div className="relative z-10 p-6">
          <h1
            className="text-4xl font-bold text-center text-white mb-8 drop-shadow-lg"
            style={{ fontFamily: "cursive", textShadow: '0 2px 6px rgba(0,0,0,0.4)' }}
          >
            GreetMe - Choose a Category
          </h1>

          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(cardCategories).map(([categoryKey, category]) => (
              <button
                key={categoryKey}
                onClick={() => handleCategorySelect(categoryKey)}
                className="group transform hover:scale-105 transition-all duration-300"
              >
                <div
                  className="rounded-lg p-5 text-center"
                  style={{
                    background: 'linear-gradient(180deg, #f5ecd0 0%, #ede0b8 100%)',
                    border: '2px solid #b8a060',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  }}
                >
                  <div className="w-12 h-12 bg-[#4EAAA2] rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white text-lg font-bold">{category.cards.length}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1" style={{ fontFamily: "Georgia, serif" }}>{category.name}</h3>
                  <p className="text-gray-600 text-xs">{category.cards.length} cards</p>
                </div>
              </button>
            ))}
          </div>

          <CloudDecoration className="bottom-0 left-0 -mb-4 -ml-8" />
        </div>
      </BookshelfBackground>
    )
  }

  if (currentScreen === "library") {
    const currentCards = getCurrentPageCards()
    const totalPages = getTotalPages()
    const category = selectedCategory ? cardCategories[selectedCategory] : null

    if (!category) {
      return <div>Category not found</div>
    }

    const topRowCards = currentCards.slice(0, 4)
    const bottomRowCards = currentCards.slice(4, 8)

    return (
      <BookshelfBackground>
        <div className="relative z-10 flex flex-col min-h-screen">
          <div className="flex items-center justify-between p-3 bg-[#4EAAA2] text-white">
            <button
              onClick={() => setCurrentScreen("categories")}
              className="flex items-center gap-1 text-sm font-medium hover:opacity-80 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4" />
              Categories
            </button>
            <h1 className="text-lg font-bold" style={{ fontFamily: "Georgia, serif" }}>
              {category.name} Cards
            </h1>
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="text-sm hover:opacity-80 transition-opacity"
            >
              {showInstructions ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex-1 relative">
            <div className="px-4 pt-6">
              <div className="flex justify-center items-end gap-3 mb-0 min-h-[140px]">
                {topRowCards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => handleCardSelect(card)}
                    className="transform hover:scale-110 hover:-translate-y-2 transition-all duration-200 flex-shrink-0"
                  >
                    <img
                      src={card.cover || "/placeholder.svg"}
                      alt={card.title}
                      className="w-[72px] h-[96px] md:w-[100px] md:h-[130px] object-cover rounded shadow-lg"
                      style={{
                        boxShadow: '2px 4px 8px rgba(0,0,0,0.4)',
                      }}
                    />
                  </button>
                ))}
              </div>
              <WoodenShelf />
            </div>

            {bottomRowCards.length > 0 && (
              <div className="px-4 pt-6">
                <div className="flex justify-center items-end gap-3 mb-0 min-h-[140px]">
                  {bottomRowCards.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => handleCardSelect(card)}
                      className="transform hover:scale-110 hover:-translate-y-2 transition-all duration-200 flex-shrink-0"
                    >
                      <img
                        src={card.cover || "/placeholder.svg"}
                        alt={card.title}
                        className="w-[72px] h-[96px] md:w-[100px] md:h-[130px] object-cover rounded shadow-lg"
                        style={{
                          boxShadow: '2px 4px 8px rgba(0,0,0,0.4)',
                        }}
                      />
                    </button>
                  ))}
                </div>
                <WoodenShelf />
              </div>
            )}

            <div className="px-4 pt-6">
              <div className="min-h-[140px]"></div>
              <WoodenShelf />
            </div>

            <div className="px-4 pt-6">
              <div className="min-h-[100px]"></div>
              <WoodenShelf />
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-4 py-4 relative z-20">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  className="flex items-center gap-1 px-4 py-2 bg-[#4EAAA2] text-white rounded font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#3d8f88] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <div className="flex items-center px-3 py-2 bg-white/80 rounded text-sm font-medium">
                  {currentPage + 1} of {totalPages}
                </div>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages - 1}
                  className="flex items-center gap-1 px-4 py-2 bg-[#4EAAA2] text-white rounded font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#3d8f88] transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {showInstructions && (
            <div className="absolute bottom-16 left-4 right-4 z-30">
              <div
                className="p-4 rounded-lg"
                style={{
                  background: 'rgba(120, 100, 70, 0.92)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-white" style={{ fontFamily: "cursive" }}>How it Works:</h3>
                  <button
                    onClick={() => setShowInstructions(false)}
                    className="px-3 py-1 bg-white/20 text-white text-sm rounded hover:bg-white/30 transition-colors"
                  >
                    Hide
                  </button>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-amber-100" style={{ fontFamily: "cursive" }}>
                  <li>Choose a Greeting Card</li>
                  <li>Personalize with your message</li>
                  <li>Share the link with someone special</li>
                </ol>
              </div>
            </div>
          )}

          <CloudDecoration className="bottom-0 left-0 -mb-4 -ml-8" />
        </div>
      </BookshelfBackground>
    )
  }

  if (currentScreen === "customize") {
    return (
      <BookshelfBackground>
        <div className="relative z-10 flex flex-col min-h-screen">
          <div className="flex justify-between items-center px-4 py-3 bg-[#4EAAA2] text-white">
            <div className="text-lg font-bold" style={{ fontFamily: "Georgia, serif" }}>Price: $0.00</div>
            <button
              onClick={generateShareableLink}
              className="px-6 py-2 rounded font-bold text-lg transition-all"
              style={{
                background: 'linear-gradient(180deg, #f48fb1, #e57399)',
                color: 'white',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              }}
              disabled={!formData.from || !formData.to}
            >
              Send
            </button>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="px-4 pt-2">
              <div className="flex justify-center items-end gap-2 mb-0 min-h-[80px]">
                {selectedCategory && cardCategories[selectedCategory] &&
                  cardCategories[selectedCategory].cards.slice(0, 4).map((card) => (
                    <div key={card.id} className="flex-shrink-0 opacity-60">
                      <img
                        src={card.cover || "/placeholder.svg"}
                        alt={card.title}
                        className="w-[50px] h-[65px] md:w-[70px] md:h-[90px] object-cover rounded shadow-md"
                      />
                    </div>
                  ))
                }
              </div>
              <WoodenShelf />
            </div>

            <div className="flex-1 flex items-start justify-center px-4 -mt-4 relative z-20">
              <div className="w-full max-w-sm">
                {cardView === "cover" || cardView === "centerfold" || cardView === "back" ? (
                  <div>
                    {cardView === "cover" ? (
                      <div
                        className="bg-gradient-to-b from-gray-100 to-gray-50 rounded-lg shadow-2xl p-6"
                        style={{ border: '1px solid #ddd' }}
                      >
                        <h2 className="text-2xl font-bold text-center mb-5 text-gray-800" style={{ fontFamily: "Georgia, serif" }}>
                          {selectedCategory && cardCategories[selectedCategory]
                            ? `${cardCategories[selectedCategory].name} Greeting Card`
                            : "Greeting Card"}
                        </h2>

                        <div className="space-y-4 mb-5">
                          <div>
                            <label className="font-bold text-gray-800 text-lg" style={{ fontFamily: "Georgia, serif" }}>From:</label>
                            <Input
                              value={formData.from}
                              onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                              className="border-0 border-b-2 border-gray-800 rounded-none bg-transparent text-lg focus:ring-0 mt-1"
                              placeholder=""
                            />
                          </div>

                          <div>
                            <label className="font-bold text-gray-800 text-lg" style={{ fontFamily: "Georgia, serif" }}>To:</label>
                            <Input
                              value={formData.to}
                              onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                              className="border-0 border-b-2 border-gray-800 rounded-none bg-transparent text-lg focus:ring-0 mt-1"
                              placeholder=""
                            />
                          </div>

                          <div>
                            <label className="font-bold text-gray-800 text-lg" style={{ fontFamily: "Georgia, serif" }}>Personal Note:</label>
                            <div className="relative">
                              <Textarea
                                value={formData.personalNote}
                                onChange={(e) => {
                                  const text = e.target.value
                                  if (text.length <= 200) {
                                    setFormData({ ...formData, personalNote: text })
                                  }
                                }}
                                placeholder="Add a personal message (optional)"
                                className="mt-1 border-gray-300 text-base"
                                rows={2}
                                maxLength={200}
                              />
                              <div
                                className={`absolute bottom-2 right-2 text-xs font-medium ${
                                  formData.personalNote.length > 180
                                    ? "text-red-500"
                                    : "text-gray-400"
                                }`}
                              >
                                {formData.personalNote.length}/200
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="text-left mb-5">
                          <span className="font-bold text-gray-800 text-lg" style={{ fontFamily: "Georgia, serif" }}>Total: $0.00</span>
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={generateShareableLink}
                            className="px-10 py-3 rounded font-bold text-xl text-white transition-all"
                            style={{
                              background: 'linear-gradient(180deg, #4CD964, #34C759)',
                              boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
                            }}
                            disabled={!formData.from || !formData.to}
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="max-w-sm mx-auto">
                        {renderCardContent()}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-auto pb-2">
              <div className="flex justify-center mb-3">
                <button
                  onClick={() => {
                    setCurrentScreen("library")
                    setSelectedCard(null)
                  }}
                  className="text-white/80 hover:text-white text-sm underline transition-colors"
                >
                  Back to Library
                </button>
              </div>

              <div
                className="py-3"
                style={{
                  background: 'linear-gradient(180deg, #3d3d3d, #2a2a2a)',
                }}
              >
                <CardViewTabs />
              </div>
            </div>
          </div>
        </div>
      </BookshelfBackground>
    )
  }

  if (currentScreen === "shareLink") {
    return (
      <BookshelfBackground>
        <div className="relative z-10 flex flex-col min-h-screen">
          <div className="flex justify-between items-center px-4 py-3 bg-[#4EAAA2] text-white">
            <div className="text-lg font-bold" style={{ fontFamily: "Georgia, serif" }}>Card Ready!</div>
            <div></div>
          </div>

          <div className="flex-1 flex items-center justify-center px-4">
            <div
              className="w-full max-w-sm rounded-lg p-6"
              style={{
                background: 'linear-gradient(180deg, #f5ecd0 0%, #ede0b8 100%)',
                border: '2px solid #b8a060',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              }}
            >
              <div className="text-center mb-5">
                <div className="w-14 h-14 bg-[#4CD964] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Share2 className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: "Georgia, serif" }}>Card Ready to Share!</h2>
                <p className="text-gray-600 text-sm">Share the link below with someone special:</p>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-white rounded-lg border border-gray-300">
                  <p className="text-sm text-gray-600 break-all">{shareableLink}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-300 rounded font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                  <button
                    onClick={shareLink}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded font-bold text-white transition-colors"
                    style={{ background: 'linear-gradient(180deg, #4CD964, #34C759)' }}
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>

                <div className="text-center pt-2">
                  <button
                    onClick={() => {
                      setCurrentScreen("categories")
                      setSelectedCard(null)
                      setSelectedCategory(null)
                      setFormData({ from: "", to: "", personalNote: "" })
                      setShareableLink("")
                    }}
                    className="text-[#4EAAA2] font-medium hover:underline"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    Create Another Card
                  </button>
                </div>
              </div>
            </div>
          </div>

          <CloudDecoration className="bottom-0 left-0 -mb-4 -ml-8" />
        </div>
      </BookshelfBackground>
    )
  }

  if (currentScreen === "viewCard") {
    return (
      <BookshelfBackground>
        <div className="relative z-10 flex flex-col min-h-screen">
          <div className="flex justify-between items-center px-4 py-3 bg-[#4EAAA2] text-white">
            <div className="text-lg font-bold" style={{ fontFamily: "Georgia, serif" }}>Greeting Card</div>
            <div className="text-sm" style={{ fontFamily: "Georgia, serif" }}>
              From: {sharedCardData?.from} → To: {sharedCardData?.to}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="px-4 pt-2">
              <div className="min-h-[60px]"></div>
              <WoodenShelf />
            </div>

            <div className="flex-1 flex items-start justify-center px-4 -mt-2 relative z-20">
              <div className="w-full max-w-sm">
                <h2
                  className="text-xl font-bold text-center mb-3 text-white drop-shadow-lg"
                  style={{ fontFamily: "Georgia, serif", textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}
                >
                  {sharedCardData?.card.title}
                </h2>
                {renderCardContent(sharedCardData?.card, sharedCardData)}

                <div className="text-center mt-6">
                  <button
                    onClick={() => {
                      setIsViewingSharedCard(false)
                      setSharedCardData(null)
                      setCurrentScreen("categories")
                      window.history.replaceState({}, document.title, window.location.pathname)
                    }}
                    className="px-6 py-3 bg-[#4EAAA2] hover:bg-[#3d8f88] text-white rounded font-bold transition-colors"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    Create Your Own Card
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-auto">
              <div
                className="py-3"
                style={{
                  background: 'linear-gradient(180deg, #3d3d3d, #2a2a2a)',
                }}
              >
                <CardViewTabs />
              </div>
            </div>
          </div>

          <CloudDecoration className="bottom-12 left-0 -ml-8" />
        </div>
      </BookshelfBackground>
    )
  }

  return null
}
