import { NextRequest, NextResponse } from 'next/server';
import { getUncachableStripeClient } from '@/lib/stripeClient';
import { getUncachableResendClient } from '@/lib/resendClient';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, shareId } = await request.json();

    if (!sessionId || !shareId) {
      return NextResponse.json({ error: 'sessionId and shareId are required' }, { status: 400 });
    }

    const stripe = await getUncachableStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const email = session.customer_details?.email;
    if (!email) {
      return NextResponse.json({ error: 'No email found for this session' }, { status: 400 });
    }

    const senderName = session.metadata?.senderName || '';
    const cardTitle = session.metadata?.cardTitle || 'greeting card';

    const domain = process.env.REPLIT_DOMAINS?.split(',')[0] || request.headers.get('host') || '';
    const shareUrl = `https://${domain}/c/${shareId}`;

    const htmlContent = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: linear-gradient(180deg, #f5ecd0 0%, #ede0b8 100%);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #8B6914; font-size: 28px; margin: 0;">GreetMe</h1>
          <p style="color: #a07830; font-size: 14px; margin-top: 4px;">Digital Greeting Cards</p>
        </div>
        
        <div style="background: white; border-radius: 12px; padding: 30px; border: 1px solid #d4b896; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h2 style="color: #2d5016; font-size: 22px; margin-top: 0; text-align: center;">Thank You for Your Purchase!</h2>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Hi${senderName ? ` ${senderName}` : ''},
          </p>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Thank you for purchasing your ${cardTitle} from GreetMe! Your card is ready to be shared.
          </p>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Share the following link with your desired recipient via text or email:
          </p>
          
          <div style="text-align: center; margin: 24px 0;">
            <a href="${shareUrl}" 
               style="display: inline-block; background: linear-gradient(180deg, #4EAAA2, #3d9990); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: bold;">
              View Your Card
            </a>
          </div>
          
          <div style="background: #f5f0e8; border-radius: 8px; padding: 16px; margin: 20px 0; border: 1px solid #e0d5c0;">
            <p style="color: #666; font-size: 13px; margin: 0 0 6px 0;">Your card link:</p>
            <a href="${shareUrl}" style="color: #4EAAA2; font-size: 14px; word-break: break-all;">${shareUrl}</a>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 0;">
            Simply copy the link above and send it to your recipient. They'll be able to view your personalized greeting card right away!
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 24px;">
          <p style="color: #a07830; font-size: 12px;">&copy; GreetMe - Spread joy, one card at a time.</p>
        </div>
      </div>
    `;

    const { client: resend, fromEmail } = await getUncachableResendClient();

    const result = await resend.emails.send({
      from: fromEmail || 'GreetMe <onboarding@resend.dev>',
      to: [email],
      subject: 'Your GreetMe Card is Ready to Share!',
      html: htmlContent,
    });

    if (result.error) {
      console.error('Resend error:', result.error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true, messageId: result.data?.id });
  } catch (error: any) {
    console.error('Email send error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
