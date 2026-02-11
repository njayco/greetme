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

export interface CustomCardBackup {
  id: string;
  cover_image_url: string;
  centerfold_message: string;
  caption: string | null;
  back_message: string;
  category_ids: string[];
  creator_name: string;
  is_public: boolean;
  is_approved: boolean;
  is_paid: boolean;
  stripe_session_id: string | null;
  created_at: string;
}

export async function backupCardToStorage(card: CustomCardBackup): Promise<void> {
  try {
    const privateDir = getPrivateObjectDir();
    const fullPath = `${privateDir}/card-backups/${card.id}.json`;
    const { bucketName, objectName } = parseObjectPath(fullPath);
    const bucket = storageClient.bucket(bucketName);
    const file = bucket.file(objectName);

    await file.save(JSON.stringify(card), {
      contentType: 'application/json',
      resumable: false,
    });
  } catch (error: any) {
    console.error(`Failed to backup card ${card.id} to storage:`, error.message);
  }
}

export async function getAllBackedUpCards(): Promise<CustomCardBackup[]> {
  try {
    const privateDir = getPrivateObjectDir();
    const fullPath = `${privateDir}/card-backups/`;
    const { bucketName, objectName } = parseObjectPath(fullPath);
    const bucket = storageClient.bucket(bucketName);

    const [files] = await bucket.getFiles({ prefix: objectName });
    const cards: CustomCardBackup[] = [];

    for (const file of files) {
      if (!file.name.endsWith('.json')) continue;
      try {
        const [content] = await file.download();
        const card = JSON.parse(content.toString()) as CustomCardBackup;
        cards.push(card);
      } catch (err: any) {
        console.error(`Failed to read backup file ${file.name}:`, err.message);
      }
    }

    return cards;
  } catch (error: any) {
    console.error('Failed to read card backups from storage:', error.message);
    return [];
  }
}
