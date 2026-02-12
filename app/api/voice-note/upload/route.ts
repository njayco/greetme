/**
 * Voice Note Upload API Route — POST /api/voice-note/upload
 *
 * Accepts an audio file via multipart form data, validates its type and size,
 * then uploads it to Replit Object Storage (GCS-backed) in the private
 * voice-notes directory. Returns a JSON response with the object path URL
 * that can be used to serve the audio later.
 */
import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
import { randomUUID } from 'crypto';

// Replit sidecar provides short-lived GCS credentials via a local HTTP endpoint
const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

// Initialise the GCS client using Replit's external-account credential flow
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

/** Returns the base directory path for private object storage (set by Replit) */
function getPrivateObjectDir(): string {
  const dir = process.env.PRIVATE_OBJECT_DIR || "";
  if (!dir) {
    throw new Error("PRIVATE_OBJECT_DIR not set");
  }
  return dir;
}

/** Splits a full object path (e.g. /bucket/some/object) into bucket name and object key */
function parseObjectPath(path: string): { bucketName: string; objectName: string } {
  if (!path.startsWith("/")) path = `/${path}`;
  const parts = path.split("/");
  if (parts.length < 3) throw new Error("Invalid path");
  return { bucketName: parts[1], objectName: parts.slice(2).join("/") };
}

export async function POST(request: NextRequest) {
  try {
    // Extract the uploaded audio file from the multipart form data
    const formData = await request.formData();
    const file = formData.get('audio') as File | null;

    // Validate that a file was provided
    if (!file) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Enforce a 10 MB file size limit
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Max 10MB.' }, { status: 400 });
    }

    // Validate MIME type against allowed audio formats
    const validTypes = ['audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/x-m4a', 'audio/mp3'];
    const fileType = file.type || 'audio/webm';
    if (!validTypes.some(t => fileType.startsWith(t.split('/')[0]))) {
      return NextResponse.json({ error: 'Invalid file type. Use WebM, MP4, MP3, or WAV.' }, { status: 400 });
    }

    // Map the MIME type to an appropriate file extension
    let ext = '.webm';
    if (fileType.includes('mp4') || fileType.includes('m4a')) ext = '.m4a';
    else if (fileType.includes('mpeg') || fileType.includes('mp3')) ext = '.mp3';
    else if (fileType.includes('wav')) ext = '.wav';
    else if (fileType.includes('ogg')) ext = '.ogg';

    // Generate a unique filename using UUID + extension
    const objectId = randomUUID() + ext;
    const privateDir = getPrivateObjectDir();
    const fullPath = `${privateDir}/voice-notes/${objectId}`;

    const { bucketName, objectName } = parseObjectPath(fullPath);
    const bucket = storageClient.bucket(bucketName);
    const gcsFile = bucket.file(objectName);

    // Read the file into a buffer and upload to GCS
    const buffer = Buffer.from(await file.arrayBuffer());

    await gcsFile.save(buffer, {
      contentType: fileType,
      resumable: false,
    });

    // Mark the object as publicly visible via custom ACL metadata
    await gcsFile.setMetadata({
      metadata: {
        'custom:aclPolicy': JSON.stringify({
          owner: 'system',
          visibility: 'public',
        }),
      },
    });

    // Return the serving path that can be used to fetch the voice note
    const objectPath = `/objects/voice-notes/${objectId}`;

    return NextResponse.json({ url: objectPath });
  } catch (error: any) {
    console.error('Voice note upload error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
