import fs from "fs";
import path from "path";

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

function main() {
  const generatedDir = path.join(process.cwd(), "scripts", "generated");
  if (!fs.existsSync(generatedDir)) {
    console.error("No generated directory found. Run generate-cards.ts first.");
    process.exit(1);
  }

  const files = fs.readdirSync(generatedDir).filter((f) => f.endsWith(".json"));
  if (files.length === 0) {
    console.error("No generated card files found.");
    process.exit(1);
  }

  console.log(`Found ${files.length} generated card files.`);

  let cardDataContent = fs.readFileSync(
    path.join(process.cwd(), "lib", "cardData.ts"),
    "utf-8",
  );

  let mergeCount = 0;

  for (const file of files) {
    const data = JSON.parse(
      fs.readFileSync(path.join(generatedDir, file), "utf-8"),
    );
    const target: SubcategoryTarget = data.target;
    const cards: CardGenResult[] = data.cards;

    if (!cards || cards.length === 0) continue;

    const emptyPattern = `{ id: "${target.subcategoryId}", name: "${target.subcategoryName}", cards: [] }`;

    if (!cardDataContent.includes(emptyPattern)) {
      console.log(
        `  Skipping ${target.subcategoryName} - already has cards or pattern not found`,
      );
      continue;
    }

    const cardsCode = cards
      .map(
        (card) => `              {
                id: ${card.id},
                title: "${card.title.replace(/"/g, '\\"')}",
                cover: "${card.cover}",
                centerfold:
                  "${card.centerfold.replace(/"/g, '\\"').replace(/\n/g, "\\n")}",
                back: "${card.back.replace(/"/g, '\\"')}",
                tone: "${card.tone}",
                artistInspiration: "${card.artistInspiration.replace(/"/g, '\\"')}",
                tags: [${card.tags.map((t) => `"${t}"`).join(", ")}],
              }`,
      )
      .join(",\n");

    const replacement = `{
            id: "${target.subcategoryId}",
            name: "${target.subcategoryName}",
            cards: [
${cardsCode},
            ],
          }`;

    cardDataContent = cardDataContent.replace(emptyPattern, replacement);
    mergeCount++;
    console.log(
      `  Merged ${cards.length} cards into ${target.categoryName} > ${target.subcategoryName}`,
    );
  }

  if (mergeCount > 0) {
    fs.writeFileSync(
      path.join(process.cwd(), "lib", "cardData.ts"),
      cardDataContent,
    );
    console.log(`\nMerged ${mergeCount} subcategories into cardData.ts`);
  } else {
    console.log("\nNo new cards to merge.");
  }
}

main();
