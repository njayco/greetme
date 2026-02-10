#!/bin/bash
GROUP=$1
LIMIT=${2:-2}
ROUNDS=${3:-20}

echo "Generating $LIMIT subcategories per round, $ROUNDS rounds for group: ${GROUP:-all}"

for i in $(seq 1 $ROUNDS); do
  echo ""
  echo "========== Round $i of $ROUNDS =========="
  
  if [ -n "$GROUP" ]; then
    npx tsx scripts/generate-cards.ts --group=$GROUP --count=1 --limit=$LIMIT 2>&1
  else
    npx tsx scripts/generate-cards.ts --count=1 --limit=$LIMIT 2>&1
  fi
  
  RESULT=$?
  if [ $RESULT -ne 0 ]; then
    echo "Generation failed, continuing..."
  fi
  
  npx tsx scripts/merge-generated-cards.ts 2>&1
  
  EMPTY=$(npx tsx scripts/generate-cards.ts --dry-run --limit=999 2>&1 | head -3 | grep -oP 'Found \K\d+')
  echo "Remaining empty subcategories: $EMPTY"
  
  if [ "$EMPTY" = "0" ]; then
    echo "All subcategories filled!"
    break
  fi
done
