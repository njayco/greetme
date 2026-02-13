import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
import { randomUUID } from 'crypto';

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
  if (!dir) {
    throw new Error("PRIVATE_OBJECT_DIR not set");
  }
  return dir;
}

function parseObjectPath(path: string): { bucketName: string; objectName: string } {
  if (!path.startsWith("/")) path = `/${path}`;
  const parts = path.split("/");
  if (parts.length < 3) throw new Error("Invalid path");
  return { bucketName: parts[1], objectName: parts.slice(2).join("/") };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('signature') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No signature file provided' }, { status: 400 });
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Max 5MB.' }, { status: 400 });
    }

    const validTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
    const fileType = file.type || 'image/png';
    if (!validTypes.includes(fileType)) {
      return NextResponse.json({ error: 'Invalid file type. Use PNG, JPG, WEBP, or SVG.' }, { status: 400 });
    }

    let ext = '.png';
    if (fileType.includes('jpeg')) ext = '.jpg';
    else if (fileType.includes('webp')) ext = '.webp';
    else if (fileType.includes('svg')) ext = '.svg';

    const objectId = randomUUID() + ext;
    const privateDir = getPrivateObjectDir();
    const fullPath = `${privateDir}/signatures/${objectId}`;

    const { bucketName, objectName } = parseObjectPath(fullPath);
    const bucket = storageClient.bucket(bucketName);
    const gcsFile = bucket.file(objectName);

    const buffer = Buffer.from(await file.arrayBuffer());

    await gcsFile.save(buffer, {
      contentType: fileType,
      resumable: false,
    });

    await gcsFile.setMetadata({
      metadata: {
        'custom:aclPolicy': JSON.stringify({
          owner: 'system',
          visibility: 'public',
        }),
      },
    });

    const objectPath = `/objects/signatures/${objectId}`;

    return NextResponse.json({ url: objectPath });
  } catch (error: any) {
    console.error('Signature upload error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
