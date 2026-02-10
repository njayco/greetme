import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

const storageClient = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: {
        type: "json",
        subject_token_field_name: "access_token",
      },
    },
    universe_domain: "googleapis.com",
  },
  projectId: "",
});

function getPrivateObjectDir(): string {
  const dir = process.env.PRIVATE_OBJECT_DIR || "";
  if (!dir) throw new Error("PRIVATE_OBJECT_DIR not set");
  return dir;
}

function parseObjectPath(path: string): { bucketName: string; objectName: string } {
  if (!path.startsWith("/")) path = `/${path}`;
  const parts = path.split("/");
  if (parts.length < 3) throw new Error("Invalid path");
  return { bucketName: parts[1], objectName: parts.slice(2).join("/") };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const objectPath = searchParams.get('path');

    if (!objectPath || !objectPath.startsWith('/objects/')) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    const entityId = objectPath.replace('/objects/', '');
    let entityDir = getPrivateObjectDir();
    if (!entityDir.endsWith("/")) entityDir = `${entityDir}/`;
    const fullPath = `${entityDir}${entityId}`;

    const { bucketName, objectName } = parseObjectPath(fullPath);
    const bucket = storageClient.bucket(bucketName);
    const file = bucket.file(objectName);

    const [exists] = await file.exists();
    if (!exists) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const [metadata] = await file.getMetadata();
    const [buffer] = await file.download();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': (metadata.contentType as string) || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400',
        'Content-Length': String(buffer.length),
      },
    });
  } catch (error: any) {
    console.error('Serve error:', error.message);
    return NextResponse.json({ error: 'Failed to serve file' }, { status: 500 });
  }
}
