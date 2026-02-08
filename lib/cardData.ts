export type CardType = {
  id: number;
  title: string;
  cover: string;
  centerfold: string;
  back: string;
  price?: number;
};

export type CategoryType = {
  name: string;
  color: string;
  cards: CardType[];
};

export const cardCategories: Record<string, CategoryType> = {
  "valentines-day": {
    name: "Valentine's Day",
    color: "red",
    cards: [
      {
        id: 28,
        title: "Cupid's Arrow",
        cover: "/images/valentine-cupid-heart.png",
        centerfold:
          "You've shot your arrow straight into my heart! Every moment with you feels like a fairy tale, and I wouldn't trade it for the world. You make my heart skip a beat every single day.",
        back: "Struck by love, forever yours!",
        price: 0.99,
      },
      {
        id: 29,
        title: "Pizza My Heart",
        cover: "/images/valentine-pizza-heart.png",
        centerfold:
          "You've got a pizza my heart, and I never want it back! Just like the perfect slice, you're cheesy, warm, and absolutely irresistible. Life with you is always a party!",
        back: "You're the topping to my pizza!",
        price: 0.99,
      },
      {
        id: 30,
        title: "Bee Mine",
        cover: "/images/valentine-bee-mine.png",
        centerfold:
          "Will you BEE mine? You make my heart buzz with joy! Like honey, you sweeten every moment of my life. I'm completely smitten and buzzing with love for you!",
        back: "Buzzing with love for you!",
      },
      {
        id: 31,
        title: "Roses & Gold",
        cover: "/images/valentine-roses-heart.png",
        centerfold:
          "Like the finest roses, your beauty and grace take my breath away. Every petal reminds me of another reason I love you. You are the most precious treasure in my life.",
        back: "My love blooms for you eternally!",
        price: 0.99,
      },
      {
        id: 32,
        title: "Purrfect Love",
        cover: "/images/valentine-cat-balloon.png",
        centerfold:
          "You're absolutely purrfect and I'm not kitten around! My heart floats like a balloon whenever you're near. You've got me feline so in love!",
        back: "You're the cat's meow!",
        price: 0.99,
      },
      {
        id: 33,
        title: "Cup of Love",
        cover: "/images/valentine-coffee-love.png",
        centerfold:
          "You're my favorite cup of love! Like the perfect brew, you warm my soul and give me energy to face anything. I love you a latte, and that's no mocha-ry!",
        back: "You keep me brewing with happiness!",
        price: 0.99,
      },
      {
        id: 34,
        title: "Bear Hug",
        cover: "/images/valentine-panda-hug.png",
        centerfold:
          "Sending you the biggest bear hug! You make my heart as full as a panda eating bamboo. I'm so grateful to have you, and I just want to hold you close forever!",
        back: "Bear hugs and all my love!",
      },
      {
        id: 35,
        title: "Lovebirds",
        cover: "/images/valentine-lovebirds.png",
        centerfold:
          "Just like these lovebirds, we were made to be together! Every song you sing makes my heart soar. You are my favorite melody, my sweetest harmony, and the love of my life.",
        back: "Two hearts, one love song!",
        price: 0.99,
      },
      {
        id: 36,
        title: "Foxy Valentine",
        cover: "/images/valentine-fox-roses.png",
        centerfold:
          "You're the foxiest valentine I know! These roses can't even compare to how beautiful you are, inside and out. You make every day brighter just by being you.",
        back: "For my foxy valentine!",
        price: 1.49,
      },
      {
        id: 37,
        title: "Penguin Love",
        cover: "/images/valentine-penguins.png",
        centerfold:
          "Like penguins who mate for life, I choose you every single day! Through every storm and every season, you're the one I want to waddle through life with. You keep my heart warm!",
        back: "Waddling through life together!",
        price: 1.99,
      },
      {
        id: 38,
        title: "Love Potion",
        cover: "/images/valentine-love-potion.png",
        centerfold:
          "No magic potion needed — I'm already completely enchanted by you! Your smile is the most powerful spell, and your love is the sweetest magic I've ever known. You've bewitched my heart forever!",
        back: "Enchanted by your love!",
        price: 2.49,
      },
      {
        id: 39,
        title: "Sloth Love",
        cover: "/images/valentine-sloth-heart.png",
        centerfold:
          "I'm not slow to say I love you — I just want to hang onto this feeling forever! You make my heart feel full and my days feel cozy. Let's take life slow and enjoy every beautiful moment together.",
        back: "Hanging onto love forever!",
        price: 0.99,
      },
      {
        id: 40,
        title: "Owl Always Love You",
        cover: "/images/valentine-owls-moon.png",
        centerfold:
          "Owl always love you, no matter what! Under the stars and moonlight, my love for you shines brighter than any constellation. You are the magic in my night sky.",
        back: "Owl always love you!",
        price: 1.99,
      },
      {
        id: 41,
        title: "Love Letters",
        cover: "/images/valentine-love-letters.png",
        centerfold:
          "If I wrote you a love letter every day, my mailbox would overflow — just like my heart does for you! Every word I write is a tiny piece of my love, and I have an endless supply.",
        back: "Sealed with a kiss!",
        price: 1.49,
      },
      {
        id: 42,
        title: "Butterfly Kisses",
        cover: "/images/valentine-butterflies.png",
        centerfold:
          "You give me butterflies every single day! Like these beautiful wings, our love is colorful, free, and absolutely magical. Thank you for making my heart flutter!",
        back: "Flutter by, my love!",
        price: 2.99,
      },
      {
        id: 43,
        title: "Hedge-Hug",
        cover: "/images/valentine-hedgehog.png",
        centerfold:
          "You make my prickly days feel smooth and my cloudy skies feel bright! Even though I might be a little prickly sometimes, you love me anyway. That's what makes you so special!",
        back: "Sending you a hedge-hug!",
        price: 0.99,
      },
      {
        id: 44,
        title: "Seas The Day",
        cover: "/images/valentine-seahorses.png",
        centerfold:
          "In the vast ocean of life, I found my perfect match in you! Like seahorses who swim heart to heart, we're meant to ride the waves together. You're my anchor and my adventure!",
        back: "You're my perfect catch!",
        price: 2.49,
      },
      {
        id: 45,
        title: "Puppy Love",
        cover: "/images/valentine-puppy-heart.png",
        centerfold:
          "You had me at 'woof'! My tail wags with joy every time I see you. You're the treat that makes every day sweeter, and I'm pawsitively crazy about you!",
        back: "Pawsitively in love with you!",
        price: 1.49,
      },
      {
        id: 46,
        title: "Sweetheart",
        cover: "/images/valentine-candy-hearts.png",
        centerfold:
          "You're sweeter than a whole jar of candy hearts! Every moment with you is like unwrapping the perfect treat. You fill my life with sweetness, color, and endless joy.",
        back: "You're my favorite sweet!",
        price: 0.99,
      },
      {
        id: 47,
        title: "Magical Love",
        cover: "/images/valentine-unicorn.png",
        centerfold:
          "Our love is as magical as a unicorn and as bright as a rainbow! You make the impossible feel possible and every ordinary day feel extraordinary. You are my fairy tale come true!",
        back: "Believe in magical love!",
        price: 2.99,
      },
      {
        id: 48,
        title: "Some-Bunny Loves You",
        cover: "/images/valentine-bunnies.png",
        centerfold:
          "Some-bunny loves you very much! You make my heart hop with joy and my days bloom with happiness. Like these bunnies, I want to share everything with you!",
        back: "Hoppy Valentine's Day!",
        price: 1.49,
      },
      {
        id: 49,
        title: "You're My Jam",
        cover: "/images/valentine-music.png",
        centerfold:
          "You're the song that plays on repeat in my heart! Every beat, every melody reminds me of you. Our love is like a classic vinyl — timeless, beautiful, and always worth playing again.",
        back: "You're my favorite song!",
        price: 1.99,
      },
      {
        id: 50,
        title: "Love Takes Flight",
        cover: "/images/valentine-balloon-ride.png",
        centerfold:
          "Our love lifts me higher than any balloon could! Every adventure with you is breathtaking, and I can't wait to see where our hearts take us next. You make life an incredible journey!",
        back: "Soaring on love with you!",
        price: 2.99,
      },
      {
        id: 51,
        title: "Otterly In Love",
        cover: "/images/valentine-otters.png",
        centerfold:
          "You're my significant otter! I love holding your hand and floating through life together. You make even the calmest waters feel exciting and every moment feel meaningful.",
        back: "You're otterly amazing!",
        price: 1.99,
      },
      {
        id: 52,
        title: "Key To My Heart",
        cover: "/images/valentine-locket.png",
        centerfold:
          "You hold the key to my heart, and I never want it back! Like this golden locket, our love is precious, timeless, and always close to my heart. You are my greatest treasure.",
        back: "Forever locked in love!",
        price: 2.49,
      },
      {
        id: 53,
        title: "Toadally Yours",
        cover: "/images/valentine-frog-prince.png",
        centerfold:
          "I'm toadally in love with you! You turned this ordinary life into a fairy tale, and every day with you feels like happily ever after. No kiss needed — you're already my prince/princess!",
        back: "Toadally and completely yours!",
        price: 0.99,
      },
      {
        id: 54,
        title: "Warmth of Love",
        cover: "/images/valentine-cozy-fire.png",
        centerfold:
          "Like a cozy fire on a cold winter night, your love warms my soul from the inside out. Curled up next to you is my favorite place in the world. You are my comfort and my home.",
        back: "You warm my heart always!",
        price: 2.49,
      },
      {
        id: 55,
        title: "Rose Garden",
        cover: "/images/valentine-rose-gate.png",
        centerfold:
          "Walking through life with you is like strolling through the most beautiful garden — every moment blooms with love and wonder. You make my world more beautiful just by being in it.",
        back: "Our love garden blooms forever!",
        price: 2.99,
      },
      {
        id: 56,
        title: "Tons of Love",
        cover: "/images/valentine-elephant.png",
        centerfold:
          "I love you a ton — an elephant ton! My love for you is as big as the biggest heart and as strong as the mightiest trunk. You fill my life with an enormous amount of happiness!",
        back: "Sending you tons of love!",
        price: 1.49,
      },
      {
        id: 57,
        title: "Lucky In Love",
        cover: "/images/valentine-ladybugs.png",
        centerfold:
          "I'm the luckiest person alive because I found you! Like ladybugs bring good fortune, you've brought so much joy, laughter, and love into my life. Every day with you is a lucky day!",
        back: "Lucky to have your love!",
        price: 1.99,
      },
      {
        id: 58,
        title: "Stained Glass Heart",
        cover: "/images/valentine-stained-glass.png",
        centerfold:
          "Our love is a masterpiece — colorful, radiant, and absolutely stunning! Like light shining through stained glass, you illuminate my life with beauty I never knew existed. You are my work of art.",
        back: "Our love shines bright!",
        price: 2.99,
      },
      {
        id: 59,
        title: "Koala-ty Love",
        cover: "/images/valentine-koala.png",
        centerfold:
          "You're a koala-ty catch, and I'm never letting go! Clinging to you is my favorite thing to do. You make my heart feel as warm and fuzzy as a koala hug. I'm eucalyptus over you!",
        back: "Koala-fied for your love!",
        price: 1.49,
      },
    ],
  },
  "fathers-day": {
    name: "Father's Day",
    color: "yellow",
    cards: [
      {
        id: 1,
        title: "Incredi-Bull Dad",
        cover: "/images/card-bull.webp",
        centerfold:
          "Dad, you're absolutely incredible in every way! Your strength, wisdom, and love make you the best father anyone could ask for.",
        back: "You're simply the best, Dad!",
      },
      {
        id: 2,
        title: "Hero Dad",
        cover: "/images/card-hero-dad.webp",
        centerfold:
          "To my hero - thank you for always being there, for your guidance, and for showing me what it means to be strong and kind.",
        back: "My hero, always and forever",
      },
      {
        id: 3,
        title: "Love You to the Moon",
        cover: "/images/card-moon.webp",
        centerfold:
          "Dad, my love for you reaches beyond the stars and back again. Thank you for being my guiding light through life's journey.",
        back: "To infinity and beyond, Dad!",
      },
      {
        id: 4,
        title: "Dolphinitely the Best",
        cover: "/images/card-dolphins.webp",
        centerfold:
          "Dad, you're dolphinitely the most amazing father! Thanks for all the fun times and for always making me smile.",
        back: "Swimming in gratitude for you!",
      },
      {
        id: 5,
        title: "World's Greatest Basketball Dad",
        cover: "/images/card-basketball-dad.jpeg",
        centerfold:
          "Dad, thanks for teaching me the game of life and basketball! Every shot you helped me practice, every game you cheered me on - you're truly the world's greatest dad.",
        back: "Game, set, match - you win at being the best dad!",
      },
      {
        id: 6,
        title: "World's Greatest Soccer Dad",
        cover: "/images/card-soccer-dad.jpeg",
        centerfold:
          "Dad, you've always been my biggest fan and best coach! From backyard games to life lessons, you score big in my heart every day.",
        back: "You're a champion dad in every way!",
      },
      {
        id: 7,
        title: "Eggcellent Dad",
        cover: "/images/card-eggcellent.webp",
        centerfold:
          "Dad, you're absolutely eggcellent! Thanks for always being there to brighten my day and make everything better.",
        back: "You're one eggstraordinary dad!",
      },
      {
        id: 8,
        title: "Your Biggest Fan",
        cover: "/images/card-biggest-fan.webp",
        centerfold:
          "Dad, I'm your biggest fan! You've always been there to cheer me on and keep me cool when things get heated.",
        back: "Thanks for being so cool, Dad!",
      },
      {
        id: 9,
        title: "One in a Melon",
        cover: "/images/card-one-in-melon.webp",
        centerfold:
          "Dad, you're truly one in a melon! Sweet, refreshing, and always the perfect addition to make any day better.",
        back: "You're the sweetest dad ever!",
      },
      {
        id: 10,
        title: "Donut Know What I'd Do",
        cover: "/images/card-donut.webp",
        centerfold:
          "Dad, I donut know what I'd do without you! You make life sweeter and always add that special glaze to every moment.",
        back: "You're the sweetest dad around!",
      },
      {
        id: 11,
        title: "Olive You Dad",
        cover: "/images/card-olive-you.webp",
        centerfold:
          "Dad, olive you so much! You've helped me grow and branch out, always supporting me through thick and thin.",
        back: "Olive you to the moon and back!",
      },
      {
        id: 12,
        title: "Best Dad Ever",
        cover: "/images/card-best-dad-ever.webp",
        centerfold:
          "Dad, you're simply the BEST DAD EVER! Colorful, vibrant, and always bringing joy and excitement to our family.",
        back: "You're our family's masterpiece!",
      },
    ],
  },
  birthday: {
    name: "Birthday",
    color: "pink",
    cards: [
      {
        id: 13,
        title: "Birthday Cake Celebration",
        cover: "/images/birthday-cake-celebration.png",
        centerfold:
          "Another year of amazing memories and incredible adventures! May this special day be filled with all your favorite things - delicious cake, wonderful surprises, and the warmth of those who love you most. Here's to celebrating YOU and all the joy you bring to the world!",
        back: "Wishing you the happiest of birthdays and a year ahead filled with dreams come true!",
      },
      {
        id: 14,
        title: "Special Gift For You",
        cover: "/images/birthday-gift-box.png",
        centerfold:
          "Today is all about celebrating the amazing person you are! Like the perfect gift, you bring joy, laughter, and happiness wherever you go. May your birthday be wrapped in love, tied with joy, and filled with all the wonderful surprises life has to offer!",
        back: "Hope your special day is as wonderful as the gift of having you in our lives!",
      },
      {
        id: 15,
        title: "Balloons & Cake",
        cover: "/images/birthday-cake-balloons.png",
        centerfold:
          "Let's celebrate with balloons reaching for the sky and cake sweet enough to match your wonderful spirit! Another year means another chapter of your incredible story. May it be filled with new adventures, cherished moments, and all the happiness your heart can hold!",
        back: "Here's to floating through life with joy and sweetness in every moment!",
      },
      {
        id: 16,
        title: "Colorful Birthday Wishes",
        cover: "/images/birthday-balloons.png",
        centerfold:
          "Just like these colorful balloons, may your birthday lift your spirits high and fill your heart with pure joy! You deserve all the celebration, laughter, and love that this special day can bring. Here's to another year of being absolutely wonderful!",
        back: "May your birthday be as bright and colorful as you make everyone else's days!",
      },
    ],
  },
  "get-well": {
    name: "Get Well Soon",
    color: "green",
    cards: [
      {
        id: 17,
        title: "Healing Thoughts",
        cover: "/placeholder.svg?height=300&width=240&text=Get+Well+Flowers",
        centerfold:
          "Sending you healing thoughts and warm wishes for a speedy recovery. Take care of yourself and know that you're in our thoughts.",
        back: "Get well soon!",
      },
      {
        id: 18,
        title: "Feel Better Soon",
        cover: "/placeholder.svg?height=300&width=240&text=Feel+Better+Sun",
        centerfold:
          "Hope you're feeling better with each passing day. Rest up, take it easy, and know that brighter days are ahead.",
        back: "Thinking of you and wishing you well!",
      },
      {
        id: 19,
        title: "Speedy Recovery",
        cover: "/placeholder.svg?height=300&width=240&text=Recovery+Heart",
        centerfold:
          "Wishing you strength, comfort, and a very speedy recovery. You're stronger than you know, and we're all rooting for you!",
        back: "Sending love and healing vibes your way!",
      },
    ],
  },
  graduation: {
    name: "Graduation",
    color: "blue",
    cards: [
      {
        id: 20,
        title: "Congratulations Graduate",
        cover: "/placeholder.svg?height=300&width=240&text=Graduation+Cap",
        centerfold:
          "Congratulations on your graduation! Your hard work, dedication, and perseverance have paid off. The future is bright, and we can't wait to see what you accomplish next!",
        back: "So proud of you, graduate!",
      },
      {
        id: 21,
        title: "Future is Bright",
        cover: "/placeholder.svg?height=300&width=240&text=Bright+Future",
        centerfold:
          "As you graduate and move forward, remember that this is just the beginning of an amazing journey. Your potential is limitless!",
        back: "The world is waiting for your brilliance!",
      },
      {
        id: 22,
        title: "Achievement Unlocked",
        cover: "/placeholder.svg?height=300&width=240&text=Achievement+Trophy",
        centerfold:
          "You did it! This graduation is a testament to your hard work and determination. Celebrate this amazing achievement - you've earned it!",
        back: "Achievement unlocked: Graduate!",
      },
    ],
  },
  juneteenth: {
    name: "Juneteenth",
    color: "red",
    cards: [
      {
        id: 23,
        title: "Celebrating Freedom & Heritage",
        cover: "/images/juneteenth-heritage.png",
        centerfold:
          "Happy Juneteenth! Today we celebrate freedom, honor our ancestors, and embrace the rich heritage that makes us strong. This day reminds us of the resilience, courage, and hope that have carried us through history and continue to inspire our future. Let us remember the past, celebrate the present, and work together for a brighter tomorrow.",
        back: "Freedom, heritage, and unity - celebrating Juneteenth with pride and hope!",
      },
      {
        id: 24,
        title: "Freedom Day Celebration",
        cover: "/images/juneteenth-celebration.jpeg",
        centerfold:
          "On this Juneteenth, we gather to celebrate the end of slavery and the beginning of true freedom for all. This day represents triumph over oppression, the power of community, and the ongoing journey toward equality and justice. May we continue to honor this legacy by building bridges, fostering understanding, and creating a world where freedom truly rings for everyone.",
        back: "Celebrating freedom, remembering history, and building a better future together!",
      },
    ],
  },
  "fourth-of-july": {
    name: "Fourth of July",
    color: "red",
    cards: [
      {
        id: 25,
        title: "Independence Day",
        cover: "/placeholder.svg?height=300&width=240&text=July+4th+Flag",
        centerfold:
          "Happy Fourth of July! Let's celebrate the land of the free and the home of the brave with fireworks, family, and freedom!",
        back: "Happy Independence Day!",
      },
      {
        id: 26,
        title: "Stars and Stripes",
        cover: "/placeholder.svg?height=300&width=240&text=Stars+Stripes",
        centerfold:
          "Celebrating America's independence with pride, patriotism, and gratitude for the freedoms we enjoy. Happy Fourth of July!",
        back: "Proud to be American!",
      },
      {
        id: 27,
        title: "Fireworks Celebration",
        cover: "/placeholder.svg?height=300&width=240&text=Fireworks+USA",
        centerfold:
          "Let freedom ring! Wishing you a spectacular Fourth of July filled with fireworks, fun, and the spirit of independence.",
        back: "Let freedom ring!",
      },
    ],
  },
};

export function findCardById(cardId: number): { card: CardType; category: string; categoryName: string } | null {
  for (const [categoryKey, category] of Object.entries(cardCategories)) {
    const card = category.cards.find((c) => c.id === cardId);
    if (card) {
      return { card, category: categoryKey, categoryName: category.name };
    }
  }
  return null;
}
