"use client";

import { useState } from 'react';

type GiftCardInfo = {
  shareId: string;
  senderName: string;
  recipientName: string;
  brand: string;
  amountCents: number;
  status: string;
  link: string | null;
  recipientEmail: string | null;
};

export default function RedeemClient({ giftCard }: { giftCard: GiftCardInfo }) {
  const [redeeming, setRedeeming] = useState(false);
  const [error, setError] = useState('');
  const [redeemed, setRedeemed] = useState(giftCard.status === 'redeemed');
  const [giftCardLink, setGiftCardLink] = useState(giftCard.link);
  const [recipientEmail, setRecipientEmail] = useState(giftCard.recipientEmail);

  const amountDollars = (giftCard.amountCents / 100).toFixed(0);

  const handleRedeem = async () => {
    setRedeeming(true);
    setError('');

    try {
      const response = await fetch(`/api/redeem/${giftCard.shareId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.alreadyRedeemed) {
          setRedeemed(true);
          return;
        }
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setRedeemed(true);
      if (data.recipientEmail) {
        setRecipientEmail(data.recipientEmail);
      }
      if (data.giftCardLink) {
        setGiftCardLink(data.giftCardLink);
        setTimeout(() => {
          window.open(data.giftCardLink, '_blank');
        }, 1500);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: 'linear-gradient(135deg, #c49a6c 0%, #b8860b 25%, #c49a6c 50%, #d4a574 75%, #c49a6c 100%)',
      }}
    >
      <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-sm w-full">
        {redeemed ? (
          <>
            <div className="text-5xl mb-4">🎉</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              Your Gift Card is Ready!
            </h1>
            <p className="text-gray-600 mb-2">
              {giftCard.senderName} sent you a <strong>${amountDollars}</strong> gift card.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Choose from available retailers and add to Apple Wallet if supported.
            </p>
            {recipientEmail && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  Your gift card details will also be sent to <strong>{recipientEmail}</strong>
                </p>
              </div>
            )}
            {giftCardLink ? (
              <a
                href={giftCardLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full px-6 py-3 rounded-lg font-bold text-lg text-white transition-all hover:opacity-90"
                style={{
                  background: 'linear-gradient(180deg, #34C759, #28a745)',
                  boxShadow: '0 3px 8px rgba(40,167,69,0.4)',
                }}
              >
                Open Gift Card
              </a>
            ) : (
              <div>
                <p className="text-sm text-green-700 font-medium mb-2">
                  Your gift card has been created successfully!
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Your gift card link is being prepared. Refresh this page in a moment to access it.
                </p>
                {recipientEmail && (
                  <p className="text-sm text-gray-500">
                    Once ready, it will also be sent to <strong>{recipientEmail}</strong>
                  </p>
                )}
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-gray-100">
              <a
                href={`/c/${giftCard.shareId}`}
                className="text-sm text-[#4EAAA2] hover:underline"
              >
                View Your Greeting Card
              </a>
            </div>
          </>
        ) : (
          <>
            <div className="text-5xl mb-4">🎁</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              You Have a Gift Card!
            </h1>
            <p className="text-gray-600 mb-1">
              <strong>{giftCard.senderName}</strong> sent you a
            </p>
            <p className="text-3xl font-bold text-green-600 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
              ${amountDollars}
            </p>
            <p className="text-gray-600 mb-4">gift card with your greeting card</p>

            {recipientEmail && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  Your gift card will be sent to <strong>{recipientEmail}</strong>
                </p>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              onClick={handleRedeem}
              disabled={redeeming}
              className="w-full px-6 py-3 rounded-lg font-bold text-lg text-white transition-all hover:opacity-90 disabled:opacity-60"
              style={{
                background: redeeming
                  ? 'linear-gradient(180deg, #9CA3AF, #6B7280)'
                  : 'linear-gradient(180deg, #34C759, #28a745)',
                boxShadow: redeeming ? 'none' : '0 3px 8px rgba(40,167,69,0.4)',
              }}
            >
              {redeeming ? 'Redeeming...' : `Redeem $${amountDollars} Gift Card Here`}
            </button>

            <p className="text-xs text-gray-400 mt-3">
              The sender will only be charged when you click redeem
            </p>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <a
                href={`/c/${giftCard.shareId}`}
                className="text-sm text-[#4EAAA2] hover:underline"
              >
                View Your Greeting Card
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
