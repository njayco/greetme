import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

type CardGenResult = {
  id: number;
  title: string;
  cover: string;
  centerfold: string;
  back: string;
  tone: string;
  artistInspiration: string;
  tags: string[];
};

type SubcategoryTarget = {
  groupId: string;
  groupName: string;
  categoryId: string;
  categoryName: string;
  subcategoryId: string;
  subcategoryName: string;
};

const styleMap: Record<string, { styles: string[]; styleNotes: string }> = {
  "celebrations-milestones": {
    styles: [
      "vibrant neo-expressionist style with ornate floral backgrounds and bold color fields",
      "contemporary Japanese superflat pop art with repeating colorful patterns and playful motifs",
      "immersive polka-dot infinity style with mesmerizing repeating circles and vivid colors",
    ],
    styleNotes: "vibrant celebration, bold colors, joyful energy, confetti and sparkle",
  },
  "love-relationships-romance": {
    styles: [
      "Art Nouveau romantic illustration with golden ornamental patterns and intertwined figures",
      "dreamy surrealist romance with floating lovers, moonlight, and rich jewel tones",
      "lush botanical art with bold flowers, warm earthy tones, and passionate intensity",
    ],
    styleNotes: "romantic, warm golden tones, intertwined figures, floral motifs, Art Nouveau elegance",
  },
  "family-relationships": {
    styles: [
      "impressionist tender scene with soft light, warm domestic interiors, and gentle brushwork",
      "American folk art illustration with charming quilted patterns and cozy family moments",
      "narrative folk art with colorful patchwork patterns, warm stories, and community gatherings",
    ],
    styleNotes: "warm family scenes, tender moments, cozy interiors, quilted patterns, folk art charm",
  },
  "support-healing-hard-moments": {
    styles: [
      "soft impressionist watercolor with gentle light, peaceful water reflections, and calming pastels",
      "large-scale botanical closeup with luminous petals, desert flowers, and meditative simplicity",
      "abstract spiritual art with concentric organic shapes, soft geometry, and healing color gradients",
    ],
    styleNotes: "soft watercolor washes, gentle flowers, peaceful landscapes, calming pastels, healing light",
  },
  "gratitude-appreciation": {
    styles: [
      "bold paper cut-out style with vibrant flat shapes, sunny colors, and organic forms",
      "California poolside modernism with bright flat colors, clean lines, and joyful sunshine",
      "mid-century modern graphic illustration with clean shapes, cheerful patterns, and retro charm",
    ],
    styleNotes: "bright cut-out shapes, sunny colors, clean graphic style, cheerful patterns",
  },
  "national-civic-holidays": {
    styles: [
      "dynamic cubist narrative with bold geometric shapes, earthy palette, and powerful figures",
      "modernist collage with layered textures, bold patterns, and rich cultural imagery",
      "American regionalist style with rolling landscapes, patriotic palette, and strong composition",
    ],
    styleNotes: "bold geometric shapes, patriotic palette, collage elements, Americana folk style",
  },
  "religious-spiritual-cultural": {
    styles: [
      "abstract expressionist spiritual art with radiating colors, sacred geometry, and luminous energy",
      "color field meditation with large blocks of glowing color, serene depth, and contemplative mood",
      "mosaic-like abstract with radiant concentric circles, stained glass colors, and spiritual warmth",
    ],
    styleNotes: "spiritual luminosity, sacred geometry, radiant colors, meditative abstraction",
  },
  "identity-pride-inclusion": {
    styles: [
      "urban neo-expressionist style with raw energy, layered text elements, and vibrant graffiti colors",
      "bold pop art with thick outlines, dancing figures, and radiant rainbow patterns",
      "maximalist portrait style with ornate patterns, powerful poses, and rich textile backgrounds",
    ],
    styleNotes: "bold street art energy, expressive figures, rainbow palette, unapologetic power, mixed media texture",
  },
  "work-career-life-changes": {
    styles: [
      "geometric abstraction with clean primary color grids, balanced composition, and modern elegance",
      "kinetic art style with dynamic circular forms, rhythmic color patterns, and forward motion",
      "op art with mesmerizing geometric patterns, optical movement, and energizing contrasts",
    ],
    styleNotes: "clean geometric abstraction, dynamic movement, optimistic primary colors, forward momentum",
  },
  "seasonal-fun": {
    styles: [
      "bold pop art with bright flat colors, graphic silkscreen effect, and cultural iconography",
      "comic book pop art with Ben-Day dots, bold outlines, speech bubbles, and saturated colors",
      "playful contemporary pop with oversized smiling flowers, candy colors, and kawaii energy",
    ],
    styleNotes: "pop art boldness, comic book dots, oversized playful objects, bright saturated colors",
  },
};

const tones = ["funny", "heartfelt", "uplifting"] as const;

async function generateCenterfoldAndTitle(
  subcategoryName: string,
  categoryName: string,
  groupName: string,
  tone: string,
): Promise<{ title: string; centerfold: string; back: string; tags: string[] }> {
  const prompt = `You are a world-class greeting card writer. Generate a greeting card for the "${subcategoryName}" subcategory under "${categoryName}" (group: "${groupName}").

Tone: ${tone}

Requirements:
- Title: 2-5 words, catchy and memorable
- Centerfold message: 2-4 sentences, ${tone} tone. ${tone === "funny" ? "Include wordplay, puns, or light humor." : tone === "heartfelt" ? "Be sincere, warm, and emotionally touching." : "Be encouraging, positive, and motivating."}
- Back message: 1 short sentence, a warm sign-off
- Tags: 3 relevant tags

Return ONLY valid JSON (no markdown):
{"title": "...", "centerfold": "...", "back": "...", "tags": ["...", "...", "..."]}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 500,
    temperature: 0.9,
  });

  const text = response.choices[0]?.message?.content?.trim() || "";
  const jsonStr = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  try {
    return JSON.parse(jsonStr);
  } catch {
    console.error("Failed to parse centerfold response:", text);
    return {
      title: `${subcategoryName} Card`,
      centerfold: `Sending you warm ${subcategoryName.toLowerCase()} wishes!`,
      back: `With love and care!`,
      tags: [tone, categoryName.toLowerCase()],
    };
  }
}

async function generateCoverImage(
  title: string,
  subcategoryName: string,
  categoryName: string,
  groupId: string,
  tone: string,
): Promise<Buffer> {
  const styleInfo = styleMap[groupId] || styleMap["celebrations-milestones"];
  const toneIndex = tone === "funny" ? 0 : tone === "heartfelt" ? 1 : 2;
  const artStyle = styleInfo.styles[toneIndex % styleInfo.styles.length];

  const prompt = `Create a beautiful greeting card cover illustration for a "${subcategoryName}" card in the "${categoryName}" category.

Art style: ${artStyle}. ${styleInfo.styleNotes}.
Mood: ${tone === "funny" ? "playful, whimsical, lighthearted" : tone === "heartfelt" ? "warm, tender, emotionally rich" : "bright, optimistic, energizing"}.

Requirements:
- Greeting card cover format (portrait orientation)
- NO text or words on the image
- Rich, detailed illustration with depth
- Cohesive color palette matching the mood
- Professional quality suitable for a premium greeting card
- Bold, eye-catching composition`;

  const response = await openai.images.generate({
    model: "gpt-image-1",
    prompt,
    size: "1024x1024",
  });

  const base64 = response.data?.[0]?.b64_json ?? "";
  if (!base64) throw new Error("No image data returned");
  return Buffer.from(base64, "base64");
}

function getEmptySubcategories(): SubcategoryTarget[] {
  const cardDataPath = path.join(process.cwd(), "lib", "cardData.ts");
  const content = fs.readFileSync(cardDataPath, "utf-8");

  const targets: SubcategoryTarget[] = [];
  const groupRegex =
    /{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*emoji:\s*"[^"]*",\s*categories:\s*\[/g;
  const categoryRegex =
    /{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*color:\s*"[^"]*",\s*subcategories:\s*\[/g;
  const emptySubRegex =
    /{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*cards:\s*\[\]\s*}/g;

  let currentGroupId = "";
  let currentGroupName = "";
  let currentCatId = "";
  let currentCatName = "";

  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const groupMatch = line.match(/id:\s*"([^"]+)"/);
    if (line.includes("emoji:")) {
      const nameMatch = lines[i - 1]?.match(/name:\s*"([^"]+)"/) || line.match(/name:\s*"([^"]+)"/);
      const idMatch = lines[i - 2]?.match(/id:\s*"([^"]+)"/) || line.match(/id:\s*"([^"]+)"/);
      if (idMatch) currentGroupId = idMatch[1];
      if (nameMatch) currentGroupName = nameMatch[1];
    }

    if (line.includes("color:") && line.includes('"')) {
      const catNameMatch = lines[i - 1]?.match(/name:\s*"([^"]+)"/);
      const catIdMatch = lines[i - 2]?.match(/id:\s*"([^"]+)"/);
      if (catIdMatch) currentCatId = catIdMatch[1];
      if (catNameMatch) currentCatName = catNameMatch[1];
    }

    const emptyMatch = line.match(
      /{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*cards:\s*\[\]\s*}/,
    );
    if (emptyMatch) {
      targets.push({
        groupId: currentGroupId,
        groupName: currentGroupName,
        categoryId: currentCatId,
        categoryName: currentCatName,
        subcategoryId: emptyMatch[1],
        subcategoryName: emptyMatch[2],
      });
    }
  }

  return targets;
}

function getNextCardId(): number {
  const outputDir = path.join(process.cwd(), "scripts", "generated");
  if (!fs.existsSync(outputDir)) return 100;

  const files = fs.readdirSync(outputDir).filter((f) => f.endsWith(".json"));
  let maxId = 99;
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(outputDir, file), "utf-8"));
    for (const card of data.cards || []) {
      if (card.id > maxId) maxId = card.id;
    }
  }
  return maxId + 1;
}

async function generateCardsForSubcategory(
  target: SubcategoryTarget,
  startId: number,
): Promise<CardGenResult[]> {
  const cards: CardGenResult[] = [];
  const styleInfo = styleMap[target.groupId] || styleMap["celebrations-milestones"];

  for (let i = 0; i < 3; i++) {
    const tone = tones[i];
    const cardId = startId + i;
    const artStyle = styleInfo.styles[i % styleInfo.styles.length];

    console.log(
      `  Generating card ${i + 1}/3 (${tone}) for ${target.subcategoryName}...`,
    );

    const textData = await generateCenterfoldAndTitle(
      target.subcategoryName,
      target.categoryName,
      target.groupName,
      tone,
    );

    console.log(`    Title: "${textData.title}"`);

    const imgFilename = `gen-${target.categoryId}-${target.subcategoryId}-${tone}.png`;
    const imgPath = path.join(process.cwd(), "public", "images", imgFilename);

    if (!fs.existsSync(imgPath)) {
      console.log(`    Generating cover image (style: ${artStyle.slice(0, 50)}...)...`);
      try {
        const imgBuffer = await generateCoverImage(
          textData.title,
          target.subcategoryName,
          target.categoryName,
          target.groupId,
          tone,
        );
        fs.writeFileSync(imgPath, imgBuffer);
        console.log(`    Saved: ${imgFilename}`);
      } catch (err: any) {
        console.error(`    Image generation failed: ${err.message}`);
        cards.push({
          id: cardId,
          title: textData.title,
          cover: "/images/placeholder-card.png",
          centerfold: textData.centerfold,
          back: textData.back,
          tone,
          artistInspiration: artStyle,
          tags: textData.tags,
        });
        continue;
      }
    } else {
      console.log(`    Image already exists: ${imgFilename}`);
    }

    cards.push({
      id: cardId,
      title: textData.title,
      cover: `/images/${imgFilename}`,
      centerfold: textData.centerfold,
      back: textData.back,
      tone,
      artistInspiration: artStyle,
      tags: textData.tags,
    });
  }

  return cards;
}

async function main() {
  const args = process.argv.slice(2);
  const groupFilter = args.find((a) => a.startsWith("--group="))?.split("=")[1];
  const categoryFilter = args.find((a) => a.startsWith("--category="))?.split("=")[1];
  const limitArg = args.find((a) => a.startsWith("--limit="))?.split("=")[1];
  const limit = limitArg ? parseInt(limitArg) : 3;
  const dryRun = args.includes("--dry-run");
  const textOnly = args.includes("--text-only");

  console.log("=== GreetMe AI Card Generator ===\n");

  const allTargets = getEmptySubcategories();
  console.log(`Found ${allTargets.length} empty subcategories total.\n`);

  let targets = allTargets;
  if (groupFilter) {
    targets = targets.filter((t) => t.groupId === groupFilter);
    console.log(`Filtered to group "${groupFilter}": ${targets.length} subcategories`);
  }
  if (categoryFilter) {
    targets = targets.filter((t) => t.categoryId === categoryFilter);
    console.log(`Filtered to category "${categoryFilter}": ${targets.length} subcategories`);
  }

  targets = targets.slice(0, limit);
  console.log(`Processing ${targets.length} subcategories (limit: ${limit}):\n`);

  for (const t of targets) {
    console.log(`  - ${t.groupName} > ${t.categoryName} > ${t.subcategoryName}`);
  }
  console.log("");

  if (dryRun) {
    console.log("DRY RUN - no cards will be generated.");
    return;
  }

  const outputDir = path.join(process.cwd(), "scripts", "generated");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let nextId = getNextCardId();
  const allGenerated: Array<{
    target: SubcategoryTarget;
    cards: CardGenResult[];
  }> = [];

  for (const target of targets) {
    console.log(
      `\n--- Generating for: ${target.categoryName} > ${target.subcategoryName} ---`,
    );

    const cards = await generateCardsForSubcategory(target, nextId);
    nextId += 3;

    allGenerated.push({ target, cards });

    const outFile = path.join(
      outputDir,
      `${target.categoryId}_${target.subcategoryId}.json`,
    );
    fs.writeFileSync(
      outFile,
      JSON.stringify({ target, cards }, null, 2),
    );
    console.log(`  Saved to: ${outFile}`);
  }

  console.log(`\n=== Generation Complete ===`);
  console.log(`Generated ${allGenerated.length * 3} cards across ${allGenerated.length} subcategories.`);
  console.log(`\nRun 'npx tsx scripts/merge-generated-cards.ts' to merge into cardData.ts`);
}

main().catch(console.error);
