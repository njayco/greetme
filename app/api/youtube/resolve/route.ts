import { NextRequest, NextResponse } from 'next/server';

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.+&v=)([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const trimmedUrl = url.trim();

    if (!trimmedUrl.includes('youtube.com') && !trimmedUrl.includes('youtu.be')) {
      return NextResponse.json({ error: 'Only YouTube links are accepted' }, { status: 400 });
    }

    const videoId = extractVideoId(trimmedUrl);
    if (!videoId) {
      return NextResponse.json({ error: 'Could not extract video ID from URL' }, { status: 400 });
    }

    const canonicalUrl = `https://www.youtube.com/watch?v=${videoId}`;

    let title = 'YouTube Video';
    try {
      const oembedRes = await fetch(
        `https://www.youtube.com/oembed?url=${encodeURIComponent(canonicalUrl)}&format=json`,
        { signal: AbortSignal.timeout(5000) }
      );
      if (oembedRes.ok) {
        const data = await oembedRes.json();
        title = data.title || title;
      }
    } catch {
      // oEmbed failed, use fallback title
    }

    return NextResponse.json({ videoId, title, canonicalUrl });
  } catch (error: any) {
    console.error('YouTube resolve error:', error.message);
    return NextResponse.json({ error: 'Failed to resolve YouTube URL' }, { status: 500 });
  }
}
