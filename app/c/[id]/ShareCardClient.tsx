"use client";

import { useState } from 'react';

type CardData = {
  id: number;
  title: string;
  cover: string;
  centerfold: string;
  back: string;
};

type Props = {
  cardData: CardData;
  senderName: string;
  recipientName: string;
  personalNote: string;
  categoryName: string;
};

export default function ShareCardClient({ cardData, senderName, recipientName, personalNote, categoryName }: Props) {
  const [cardView, setCardView] = useState<'cover' | 'centerfold' | 'back'>('cover');

  const renderCard = () => {
    switch (cardView) {
      case 'cover':
        return (
          <div className="aspect-[3/4] bg-white rounded-lg shadow-2xl flex items-center justify-center p-2 border border-gray-200">
            <img
              src={cardData.cover || "/placeholder.svg"}
              alt={cardData.title}
              className="w-full h-full object-cover rounded"
            />
          </div>
        );
      case 'centerfold':
        return (
          <div className="aspect-[3/4] bg-gradient-to-b from-gray-50 to-white rounded-lg shadow-2xl overflow-hidden border border-gray-200">
            <div className="h-full p-5 overflow-y-auto">
              <div className="min-h-full flex flex-col">
                <h3 className="text-xl font-bold mb-4 text-center text-gray-800" style={{ fontFamily: "Georgia, serif" }}>Special Greeting!</h3>
                <div className="flex-1 flex flex-col justify-center">
                  <p
                    className={`text-gray-700 mb-4 text-center leading-relaxed ${
                      cardData.centerfold.length > 200 ? "text-sm" : "text-base"
                    }`}
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {cardData.centerfold}
                  </p>
                  {personalNote && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border-l-4 border-amber-500">
                      <p className="text-sm italic text-gray-800 font-medium break-words" style={{ fontFamily: "Georgia, serif" }}>"{personalNote}"</p>
                      <p className="text-xs text-gray-600 mt-2">- {senderName}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case 'back':
        return (
          <div className="aspect-[3/4] bg-gradient-to-b from-gray-50 to-white rounded-lg shadow-2xl flex items-center justify-center p-6 border border-gray-200">
            <div className="text-center w-full">
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
          </div>
        );
    }
  };

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
      <div
        className="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(90deg, transparent 0px, transparent 48px, rgba(139, 90, 43, 0.3) 48px, rgba(139, 90, 43, 0.3) 50px)`,
          opacity: 0.5,
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="flex justify-between items-center px-4 py-3 bg-[#4EAAA2] text-white">
          <div className="text-lg font-bold" style={{ fontFamily: "Georgia, serif" }}>Greeting Card</div>
          <div className="text-sm" style={{ fontFamily: "Georgia, serif" }}>
            From: {senderName} &rarr; To: {recipientName}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
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

          <div className="flex-1 flex items-start justify-center px-4 -mt-2 relative z-20">
            <div className="w-full max-w-sm">
              <h2
                className="text-xl font-bold text-center mb-3 text-white drop-shadow-lg"
                style={{ fontFamily: "Georgia, serif", textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}
              >
                {cardData.title}
              </h2>
              {renderCard()}

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
