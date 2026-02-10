export type CardType = {
  id: number;
  title: string;
  cover: string;
  centerfold: string;
  back: string;
  price?: number;
  tags?: string[];
  tone?: string;
  artistInspiration?: string;
};

export type SubcategoryType = {
  id: string;
  name: string;
  cards: CardType[];
};

export type CategoryType = {
  id: string;
  name: string;
  color: string;
  subcategories: SubcategoryType[];
};

export type CategoryGroupType = {
  id: string;
  name: string;
  emoji: string;
  categories: CategoryType[];
};

export const categoryGroups: CategoryGroupType[] = [
  {
    id: "celebrations-milestones",
    name: "Celebrations & Milestones",
    emoji: "🎉",
    categories: [
      {
        id: "birthday",
        name: "Birthday",
        color: "pink",
        subcategories: [
          {
            id: "for-him",
            name: "For Him",
            cards: [
              {
                id: 100,
                title: "Aging Like Fine Cheese",
                cover: "/images/gen-birthday-for-him-funny.png",
                centerfold:
                  "Congratulations! You're now at the perfect age where 'getting a bit older' sounds like 'maturing like a fine cheese.' Just remember, with age comes wisdom... and a questionable back! Here’s to more adventures and fewer gray hairs!",
                back: "Happy Birthday, you legendary cheese!",
                tone: "funny",
                artistInspiration: "vibrant neo-expressionist style with ornate floral backgrounds and bold color fields",
                tags: ["Birthday", "Humor", "For Him"],
              },
              {
                id: 101,
                title: "Celebrate You Today",
                cover: "/images/gen-birthday-for-him-heartfelt.png",
                centerfold:
                  "On this special day, I want you to know just how much you mean to me. Your strength, kindness, and laughter light up my world. Here's to more adventures together and a year filled with all the joy you bring to others.",
                back: "Happy Birthday with all my love.",
                tone: "heartfelt",
                artistInspiration: "contemporary Japanese superflat pop art with repeating colorful patterns and playful motifs",
                tags: ["Birthday", "For Him", "Celebration"],
              },
              {
                id: 102,
                title: "Cheers to You!",
                cover: "/images/gen-birthday-for-him-uplifting.png",
                centerfold:
                  "Happy Birthday to an incredible guy! Today is a reminder of all the amazing things you’ve accomplished and the adventures yet to come. Embrace this new year with open arms and a heart full of dreams—your best is yet to unfold!",
                back: "Wishing you joy and success, always.",
                tone: "uplifting",
                artistInspiration: "immersive polka-dot infinity style with mesmerizing repeating circles and vivid colors",
                tags: ["Birthday", "Celebration", "Positivity"],
              },
            ],
          },
          {
            id: "for-her",
            name: "For Her",
            cards: [
              {
                id: 118,
                title: "Aging Like Fine Wine",
                cover: "/images/gen-birthday-for-her-funny.png",
                centerfold:
                  "Happy Birthday! They say you're like a fine wine – getting better with age. But let’s be honest, by now you’re basically vinegar with a fun label! Cheers to another year of fermentation, my friend!",
                back: "Stay fabulous and slightly fermented!",
                tone: "funny",
                artistInspiration: "vibrant neo-expressionist style with ornate floral backgrounds and bold color fields",
                tags: ["Birthday", "Funny", "Wine"],
              },
              {
                id: 119,
                title: "Celebrate You Today",
                cover: "/images/gen-birthday-for-her-heartfelt.png",
                centerfold:
                  "On this special day, I celebrate the incredible person you are. Your kindness, strength, and unwavering spirit bring so much joy to the lives of those around you. May this year be filled with love, laughter, and every dream you hold dear.",
                back: "With all my love, always.",
                tone: "heartfelt",
                artistInspiration: "contemporary Japanese superflat pop art with repeating colorful patterns and playful motifs",
                tags: ["birthday", "celebration", "for her"],
              },
              {
                id: 120,
                title: "Shine Bright Today!",
                cover: "/images/gen-birthday-for-her-uplifting.png",
                centerfold:
                  "Happy Birthday! Today is a celebration of you and all the incredible moments yet to come. Embrace this new year with open arms, and remember that the best is always ahead. You are worthy of all the joy and love life has to offer!",
                back: "Wishing you a fabulous year ahead!",
                tone: "uplifting",
                artistInspiration: "immersive polka-dot infinity style with mesmerizing repeating circles and vivid colors",
                tags: ["Birthday", "Celebration", "Uplifting"],
              },
            ],
          },
          {
            id: "for-them",
            name: "For Them",
            cards: [
              {
                id: 121,
                title: "Aging Like Fine Cheese",
                cover: "/images/gen-birthday-for-them-funny.png",
                centerfold:
                  "Happy Birthday! Remember, age is just a number... a really high one in your case! At least you can still party like it's 1999, even if your knees say otherwise!",
                back: "Cheers to more cheesy adventures!",
                tone: "funny",
                artistInspiration: "vibrant neo-expressionist style with ornate floral backgrounds and bold color fields",
                tags: ["Humor", "Birthday", "Celebrations"],
              },
              {
                id: 122,
                title: "A Year of You",
                cover: "/images/gen-birthday-for-them-heartfelt.png",
                centerfold:
                  "On this special day, I celebrate the incredible person you are and all the joy you bring into our lives. May your birthday be filled with laughter, love, and the warmth of cherished memories. Here's to another year of your beautiful journey—one that inspires us all.",
                back: "With all my love, happy birthday!",
                tone: "heartfelt",
                artistInspiration: "contemporary Japanese superflat pop art with repeating colorful patterns and playful motifs",
                tags: ["Birthday", "Heartfelt", "Celebrations"],
              },
              {
                id: 123,
                title: "Celebrate You Today!",
                cover: "/images/gen-birthday-for-them-uplifting.png",
                centerfold:
                  "Happy Birthday! Today is a beautiful reminder of how far you've come and all the incredible journeys ahead. Embrace every moment and let your dreams shine brighter than ever before! You've got this!",
                back: "Wishing you all the joy in the world!",
                tone: "uplifting",
                artistInspiration: "immersive polka-dot infinity style with mesmerizing repeating circles and vivid colors",
                tags: ["Birthday", "Celebration", "Inspiration"],
              },
            ],
          },
          {
            id: "for-son",
            name: "For Son",
            cards: [
              {
                id: 124,
                title: "Son of a Birthday!",
                cover: "/images/gen-birthday-for-son-funny.png",
                centerfold:
                  "Happy Birthday to my favorite human alarm clock! You know, I always thought you’d grow up to be a real ‘up-and-comer,’ but I had no idea it would be ‘up-and-ask-for-snacks’! Keep shining bright and remember, you’re not getting older, just more ‘experienced’ in the art of cake consumption!",
                back: "Love you more than cake!",
                tone: "funny",
                artistInspiration: "vibrant neo-expressionist style with ornate floral backgrounds and bold color fields",
                tags: ["Birthday", "Son", "Funny"],
              },
              {
                id: 125,
                title: "To Our Amazing Son",
                cover: "/images/gen-birthday-for-son-heartfelt.png",
                centerfold:
                  "Happy Birthday to the one who fills our hearts with joy! Watching you grow into the incredible person you are today has been our greatest gift. May this year bring you as much happiness as you have given us. Always remember, you are loved beyond measure.",
                back: "With all our love, always.",
                tone: "heartfelt",
                artistInspiration: "contemporary Japanese superflat pop art with repeating colorful patterns and playful motifs",
                tags: ["Son", "Birthday", "Heartfelt"],
              },
              {
                id: 126,
                title: "Shine Bright, Son!",
                cover: "/images/gen-birthday-for-son-uplifting.png",
                centerfold:
                  "Happy Birthday to a shining star! May this year bring you endless opportunities to chase your dreams and fill your heart with joy. Remember, every day is a chance to grow and shine even brighter. We're so proud of the amazing person you are becoming!",
                back: "With all our love, always.",
                tone: "uplifting",
                artistInspiration: "immersive polka-dot infinity style with mesmerizing repeating circles and vivid colors",
                tags: ["birthday", "son", "celebration"],
              },
            ],
          },
          { id: "for-daughter", name: "For Daughter", cards: [] },
          { id: "for-child", name: "For Child", cards: [] },
          { id: "for-teen", name: "For Teen", cards: [] },
          { id: "for-mom", name: "For Mom", cards: [] },
          { id: "for-dad", name: "For Dad", cards: [] },
          { id: "for-parent", name: "For Parent", cards: [] },
          { id: "for-grandma", name: "For Grandma", cards: [] },
          { id: "for-grandpa", name: "For Grandpa", cards: [] },
          { id: "for-grandparent", name: "For Grandparent", cards: [] },
          { id: "for-partner-spouse", name: "For Partner/Spouse", cards: [] },
          { id: "for-friend", name: "For Friend", cards: [] },
          { id: "for-best-friend", name: "For Best Friend", cards: [] },
          { id: "for-coworker", name: "For Coworker", cards: [] },
          { id: "for-boss", name: "For Boss", cards: [] },
          { id: "funny-birthday", name: "Funny Birthday", cards: [] },
          {
            id: "sentimental-birthday",
            name: "Sentimental Birthday",
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
          { id: "milestone-18", name: "Milestone 18", cards: [] },
          { id: "milestone-21", name: "Milestone 21", cards: [] },
          { id: "milestone-30-40-50-60-70-80-plus", name: "Milestone 30-40-50-60-70-80+", cards: [] },
        ],
      },
      {
        id: "graduation",
        name: "Graduation",
        color: "blue",
        subcategories: [
          {
            id: "high-school",
            name: "High School",
            cards: [
              {
                id: 130,
                title: "Finally Done, Barely Won!",
                cover: "/images/gen-graduation-high-school-funny.png",
                centerfold:
                  "Congratulations on your graduation! You’ve spent four years mastering the art of pretending to read the assigned books and dodging gym class like a pro. Now it’s time to put those skills to good use in the real world—good luck avoiding adulting!",
                back: "Cheers to your next adventure!",
                tone: "funny",
                artistInspiration: "vibrant neo-expressionist style with ornate floral backgrounds and bold color fields",
                tags: ["Graduation", "High School", "Funny"],
              },
              {
                id: 131,
                title: "A New Chapter Begins",
                cover: "/images/gen-graduation-high-school-heartfelt.png",
                centerfold:
                  "Congratulations on your graduation! This moment marks not just the end of high school, but the beginning of all the incredible adventures that await you. Remember to cherish the memories you've made and embrace the opportunities ahead with an open heart. You've worked so hard, and we couldn't be prouder of you!",
                back: "With all our love and support,",
                tone: "heartfelt",
                artistInspiration: "contemporary Japanese superflat pop art with repeating colorful patterns and playful motifs",
                tags: ["graduation", "high school", "new beginnings"],
              },
              {
                id: 132,
                title: "A New Chapter Awaits",
                cover: "/images/gen-graduation-high-school-uplifting.png",
                centerfold:
                  "Congratulations on this incredible achievement! High school is just the beginning of your amazing journey. Embrace the future with open arms and follow your dreams—there's so much waiting for you!",
                back: "Wishing you all the best!",
                tone: "uplifting",
                artistInspiration: "immersive polka-dot infinity style with mesmerizing repeating circles and vivid colors",
                tags: ["high school graduation", "celebration", "new beginnings"],
              },
            ],
          },
          {
            id: "college-university",
            name: "College/University",
            cards: [
              {
                id: 20,
                title: "Congratulations Graduate",
                cover: "/images/graduation-cap.png",
                centerfold:
                  "Congratulations on your graduation! Your hard work, dedication, and perseverance have paid off. The future is bright, and we can't wait to see what you accomplish next!",
                back: "So proud of you, graduate!",
                tags: ["formal", "proud"],
              },
              {
                id: 21,
                title: "Future is Bright",
                cover: "/images/graduation-future.png",
                centerfold:
                  "As you graduate and move forward, remember that this is just the beginning of an amazing journey. Your potential is limitless!",
                back: "The world is waiting for your brilliance!",
                tags: ["inspirational", "hopeful"],
              },
              {
                id: 22,
                title: "Achievement Unlocked",
                cover: "/images/graduation-trophy.png",
                centerfold:
                  "You did it! This graduation is a testament to your hard work and determination. Celebrate this amazing achievement - you've earned it!",
                back: "Achievement unlocked: Graduate!",
                tags: ["casual", "fun"],
              },
            ],
          },
          {
            id: "trade-school",
            name: "Trade School",
            cards: [
              {
                id: 133,
                title: "Degree of Awesome",
                cover: "/images/gen-graduation-trade-school-funny.png",
                centerfold:
                  "Congrats on your trade school graduation! Now you're officially skilled at doing things with tools that most of us are too scared to touch. Remember, in the world of trades, you're a cut above the rest—just don’t screw it up!",
                back: "Wishing you success and laughs in your new journey!",
                tone: "funny",
                artistInspiration: "vibrant neo-expressionist style with ornate floral backgrounds and bold color fields",
                tags: ["Trade School", "Graduation", "Congrats"],
              },
              {
                id: 134,
                title: "Crafting Your Future",
                cover: "/images/gen-graduation-trade-school-heartfelt.png",
                centerfold:
                  "Congratulations on your graduation! Your hard work, dedication, and skill have paved the way for a bright future. As you step into this new chapter, remember that your passion and talent will shape the world around you. Embrace every opportunity that comes your way!",
                back: "With pride and best wishes,",
                tone: "heartfelt",
                artistInspiration: "contemporary Japanese superflat pop art with repeating colorful patterns and playful motifs",
                tags: ["Trade School", "Graduation", "New Beginnings"],
              },
              {
                id: 135,
                title: "Crafting Your Future",
                cover: "/images/gen-graduation-trade-school-uplifting.png",
                centerfold:
                  "Congratulations on your graduation! You've turned your passion into skills and are ready to make your mark. The world is waiting for your talents—go out there and shine with confidence!",
                back: "Wishing you endless success on your journey!",
                tone: "uplifting",
                artistInspiration: "immersive polka-dot infinity style with mesmerizing repeating circles and vivid colors",
                tags: ["Trade School", "Graduation", "New Beginnings"],
              },
            ],
          },
          { id: "grad-school-phd", name: "Grad School/PhD", cards: [] },
          { id: "military", name: "Military", cards: [] },
          { id: "for-son-daughter-child", name: "For Son/Daughter/Child", cards: [] },
          { id: "for-partner", name: "For Partner", cards: [] },
          { id: "for-friend", name: "For Friend", cards: [] },
          { id: "funny", name: "Funny", cards: [] },
          { id: "proud-emotional", name: "Proud/Emotional", cards: [] },
        ],
      },
      {
        id: "congratulations",
        name: "Congratulations",
        color: "gold",
        subcategories: [
          {
            id: "achievement",
            name: "Achievement",
            cards: [
              {
                id: 84,
                title: "You Did It!",
                cover: "/images/congrats-confetti.png",
                centerfold:
                  "Congratulations! Whatever milestone you've reached, you deserve every bit of celebration coming your way. Your hard work, persistence, and passion have led to this amazing moment. Pop the confetti, raise a glass, and take a moment to be proud of everything you've accomplished!",
                back: "So proud of you! Celebrate big!",
                tags: ["celebratory", "bold", "fun"],
              },
            ],
          },
          {
            id: "promotion",
            name: "Promotion",
            cards: [
              {
                id: 199,
                title: "Climbing the Ladder!",
                cover: "/images/gen-congratulations-promotion-funny.png",
                centerfold:
                  "Congratulations on your promotion! Now you can finally afford to buy all the fancy coffee you’ll need to survive the extra responsibilities. Just remember – with great power comes great coffee breaks!",
                back: "Cheers to your success!",
                tone: "funny",
                artistInspiration: "vibrant neo-expressionist style with ornate floral backgrounds and bold color fields",
                tags: ["Promotion", "Congratulations", "Work Humor"],
              },
              {
                id: 200,
                title: "Cheers to Your Success!",
                cover: "/images/gen-congratulations-promotion-heartfelt.png",
                centerfold:
                  "Your hard work and dedication have truly paid off, and this promotion is a testament to your incredible talents. May this next chapter be filled with joy, growth, and endless opportunities. You deserve every ounce of this success and more!",
                back: "With warmest congratulations,",
                tone: "heartfelt",
                artistInspiration: "contemporary Japanese superflat pop art with repeating colorful patterns and playful motifs",
                tags: ["Promotion", "Success", "Milestone"],
              },
              {
                id: 201,
                title: "Cheers to Your Success!",
                cover: "/images/gen-congratulations-promotion-uplifting.png",
                centerfold:
                  "Congratulations on your well-deserved promotion! Your hard work and determination have truly paid off, and this is just the beginning of even greater things to come. Keep shining and inspiring those around you!",
                back: "With warmest wishes for your bright future!",
                tone: "uplifting",
                artistInspiration: "immersive polka-dot infinity style with mesmerizing repeating circles and vivid colors",
                tags: ["Promotion", "Success", "Celebration"],
              },
            ],
          },
          {
            id: "award",
            name: "Award",
            cards: [
              {
                id: 202,
                title: "You Deserve This!",
                cover: "/images/gen-congratulations-award-funny.png",
                centerfold:
                  "Congratulations on winning that award! Now, don't let it go to your head—it's hard to walk with a trophy that big! Just remember, with great awards come great responsibilities—like making us all feel lazy in comparison.",
                back: "Keep shining bright!",
                tone: "funny",
                artistInspiration: "vibrant neo-expressionist style with ornate floral backgrounds and bold color fields",
                tags: ["Celebration", "Achievement", "Humor"],
              },
              {
                id: 203,
                title: "Shine On, Star!",
                cover: "/images/gen-congratulations-award-heartfelt.png",
                centerfold:
                  "Congratulations on your well-deserved award! Your hard work and dedication have inspired everyone around you, and this recognition is a testament to your incredible talent. Keep shining and reaching for the stars—you have so much more to achieve!",
                back: "With heartfelt wishes for your journey ahead.",
                tone: "heartfelt",
                artistInspiration: "contemporary Japanese superflat pop art with repeating colorful patterns and playful motifs",
                tags: ["Award", "Congratulations", "Celebrations"],
              },
              {
                id: 204,
                title: "Cheers to Your Success!",
                cover: "/images/gen-congratulations-award-uplifting.png",
                centerfold:
                  "Congratulations on this incredible achievement! Your hard work and dedication have truly paid off, and you inspire everyone around you. Keep shining bright and reaching for the stars—there's so much more ahead!",
                back: "With warmest wishes, celebrate big!",
                tone: "uplifting",
                artistInspiration: "immersive polka-dot infinity style with mesmerizing repeating circles and vivid colors",
                tags: ["Achievement", "Inspiration", "Celebrate"],
              },
            ],
          },
          { id: "personal-win", name: "Personal Win", cards: [] },
          { id: "big-life-moment", name: "Big Life Moment", cards: [] },
        ],
      },
    ],
  },
  {
    id: "love-relationships-romance",
    name: "Love, Relationships & Romance",
    emoji: "💞",
    categories: [
      {
        id: "love-romance",
        name: "Love & Romance",
        color: "red",
        subcategories: [
          {
            id: "for-him",
            name: "For Him",
            cards: [
              {
                id: 100,
                title: "Aging Like Fine Cheese",
                cover: "/images/gen-birthday-for-him-funny.png",
                centerfold:
                  "Congratulations! You're now at the perfect age where 'getting a bit older' sounds like 'maturing like a fine cheese.' Just remember, with age comes wisdom... and a questionable back! Here’s to more adventures and fewer gray hairs!",
                back: "Happy Birthday, you legendary cheese!",
                tone: "funny",
                artistInspiration: "vibrant neo-expressionist style with ornate floral backgrounds and bold color fields",
                tags: ["Birthday", "Humor", "For Him"],
              },
              {
                id: 101,
                title: "Celebrate You Today",
                cover: "/images/gen-birthday-for-him-heartfelt.png",
                centerfold:
                  "On this special day, I want you to know just how much you mean to me. Your strength, kindness, and laughter light up my world. Here's to more adventures together and a year filled with all the joy you bring to others.",
                back: "Happy Birthday with all my love.",
                tone: "heartfelt",
                artistInspiration: "contemporary Japanese superflat pop art with repeating colorful patterns and playful motifs",
                tags: ["Birthday", "For Him", "Celebration"],
              },
              {
                id: 102,
                title: "Cheers to You!",
                cover: "/images/gen-birthday-for-him-uplifting.png",
                centerfold:
                  "Happy Birthday to an incredible guy! Today is a reminder of all the amazing things you’ve accomplished and the adventures yet to come. Embrace this new year with open arms and a heart full of dreams—your best is yet to unfold!",
                back: "Wishing you joy and success, always.",
                tone: "uplifting",
                artistInspiration: "immersive polka-dot infinity style with mesmerizing repeating circles and vivid colors",
                tags: ["Birthday", "Celebration", "Positivity"],
              },
            ],
          },
          {
            id: "for-her",
            name: "For Her",
            cards: [
              {
                id: 118,
                title: "Aging Like Fine Wine",
                cover: "/images/gen-birthday-for-her-funny.png",
                centerfold:
                  "Happy Birthday! They say you're like a fine wine – getting better with age. But let’s be honest, by now you’re basically vinegar with a fun label! Cheers to another year of fermentation, my friend!",
                back: "Stay fabulous and slightly fermented!",
                tone: "funny",
                artistInspiration: "vibrant neo-expressionist style with ornate floral backgrounds and bold color fields",
                tags: ["Birthday", "Funny", "Wine"],
              },
              {
                id: 119,
                title: "Celebrate You Today",
                cover: "/images/gen-birthday-for-her-heartfelt.png",
                centerfold:
                  "On this special day, I celebrate the incredible person you are. Your kindness, strength, and unwavering spirit bring so much joy to the lives of those around you. May this year be filled with love, laughter, and every dream you hold dear.",
                back: "With all my love, always.",
                tone: "heartfelt",
                artistInspiration: "contemporary Japanese superflat pop art with repeating colorful patterns and playful motifs",
                tags: ["birthday", "celebration", "for her"],
              },
              {
                id: 120,
                title: "Shine Bright Today!",
                cover: "/images/gen-birthday-for-her-uplifting.png",
                centerfold:
                  "Happy Birthday! Today is a celebration of you and all the incredible moments yet to come. Embrace this new year with open arms, and remember that the best is always ahead. You are worthy of all the joy and love life has to offer!",
                back: "Wishing you a fabulous year ahead!",
                tone: "uplifting",
                artistInspiration: "immersive polka-dot infinity style with mesmerizing repeating circles and vivid colors",
                tags: ["Birthday", "Celebration", "Uplifting"],
              },
            ],
          },
          {
            id: "for-them",
            name: "For Them",
            cards: [
              {
                id: 121,
                title: "Aging Like Fine Cheese",
                cover: "/images/gen-birthday-for-them-funny.png",
                centerfold:
                  "Happy Birthday! Remember, age is just a number... a really high one in your case! At least you can still party like it's 1999, even if your knees say otherwise!",
                back: "Cheers to more cheesy adventures!",
                tone: "funny",
                artistInspiration: "vibrant neo-expressionist style with ornate floral backgrounds and bold color fields",
                tags: ["Humor", "Birthday", "Celebrations"],
              },
              {
                id: 122,
                title: "A Year of You",
                cover: "/images/gen-birthday-for-them-heartfelt.png",
                centerfold:
                  "On this special day, I celebrate the incredible person you are and all the joy you bring into our lives. May your birthday be filled with laughter, love, and the warmth of cherished memories. Here's to another year of your beautiful journey—one that inspires us all.",
                back: "With all my love, happy birthday!",
                tone: "heartfelt",
                artistInspiration: "contemporary Japanese superflat pop art with repeating colorful patterns and playful motifs",
                tags: ["Birthday", "Heartfelt", "Celebrations"],
              },
              {
                id: 123,
                title: "Celebrate You Today!",
                cover: "/images/gen-birthday-for-them-uplifting.png",
                centerfold:
                  "Happy Birthday! Today is a beautiful reminder of how far you've come and all the incredible journeys ahead. Embrace every moment and let your dreams shine brighter than ever before! You've got this!",
                back: "Wishing you all the joy in the world!",
                tone: "uplifting",
                artistInspiration: "immersive polka-dot infinity style with mesmerizing repeating circles and vivid colors",
                tags: ["Birthday", "Celebration", "Inspiration"],
              },
            ],
          },
          { id: "new-love", name: "New Love", cards: [] },
          { id: "long-term-love", name: "Long-Term Love", cards: [] },
          { id: "long-distance", name: "Long Distance", cards: [] },
          {
            id: "deeply-romantic",
            name: "Deeply Romantic",
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
                id: 31,
                title: "Roses & Gold",
                cover: "/images/valentine-roses-heart.png",
                centerfold:
                  "Like the finest roses, your beauty and grace take my breath away. Every petal reminds me of another reason I love you. You are the most precious treasure in my life.",
                back: "My love blooms for you eternally!",
                price: 0.99,
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
                id: 44,
                title: "Seas The Day",
                cover: "/images/valentine-seahorses.png",
                centerfold:
                  "In the vast ocean of life, I found my perfect match in you! Like seahorses who swim heart to heart, we're meant to ride the waves together. You're my anchor and my adventure!",
                back: "You're my perfect catch!",
                price: 2.49,
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
                id: 52,
                title: "Key To My Heart",
                cover: "/images/valentine-locket.png",
                centerfold:
                  "You hold the key to my heart, and I never want it back! Like this golden locket, our love is precious, timeless, and always close to my heart. You are my greatest treasure.",
                back: "Forever locked in love!",
                price: 2.49,
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
                id: 60,
                title: "The Raven's Truth",
                cover: "/images/valentine-raven.jpeg",
                centerfold:
                  "I asked the raven what love was—\nIt answered not with sound, but truth.\nIt stayed.",
                back: "Love stays. Always.",
                price: 2.14,
              },
              {
                id: 89,
                title: "Endless Love",
                cover: "/images/love-swans.png",
                centerfold:
                  "My love for you is as deep as the ocean and as endless as the stars. You are the one my heart has been searching for, and every moment with you feels like a dream I never want to wake up from. You are my today, my tomorrow, and my forever.",
                back: "Loving you always and forever!",
                tags: ["romantic", "passionate", "elegant"],
              },
            ],
          },
          {
            id: "playful-flirty",
            name: "Playful/Flirty",
            cards: [
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
                id: 39,
                title: "Sloth Love",
                cover: "/images/valentine-sloth-heart.png",
                centerfold:
                  "I'm not slow to say I love you — I just want to hang onto this feeling forever! You make my heart feel full and my days feel cozy. Let's take life slow and enjoy every beautiful moment together.",
                back: "Hanging onto love forever!",
                price: 0.99,
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
                id: 48,
                title: "Some-Bunny Loves You",
                cover: "/images/valentine-bunnies.png",
                centerfold:
                  "Some-bunny loves you very much! You make my heart hop with joy and my days bloom with happiness. Like these bunnies, I want to share everything with you!",
                back: "Hoppy Valentine's Day!",
                price: 1.49,
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
                id: 53,
                title: "Toadally Yours",
                cover: "/images/valentine-frog-prince.png",
                centerfold:
                  "I'm toadally in love with you! You turned this ordinary life into a fairy tale, and every day with you feels like happily ever after. No kiss needed — you're already my prince/princess!",
                back: "Toadally and completely yours!",
                price: 0.99,
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
          { id: "spicy-18-plus", name: "Spicy 18+", cards: [] },
        ],
      },
      {
        id: "anniversary",
        name: "Anniversary",
        color: "gold",
        subcategories: [
          {
            id: "for-partner-spouse",
            name: "For Partner/Spouse",
            cards: [
              {
                id: 79,
                title: "Years of Love",
                cover: "/images/anniversary-hearts.png",
                centerfold:
                  "Happy Anniversary! Every year together is a testament to a love that's real, strong, and beautiful. You've built something truly special — a partnership filled with trust, laughter, and endless devotion. Here's to celebrating the years behind you and the many more adventures ahead!",
                back: "Cheers to your beautiful love story!",
                tags: ["romantic", "elegant", "warm"],
              },
            ],
          },
          { id: "for-couple", name: "For Couple", cards: [] },
          { id: "milestone-1-5-10-25-50", name: "Milestone 1-5-10-25-50", cards: [] },
          { id: "funny", name: "Funny", cards: [] },
          { id: "romantic", name: "Romantic", cards: [] },
        ],
      },
      {
        id: "wedding",
        name: "Wedding",
        color: "ivory",
        subcategories: [
          { id: "engagement", name: "Engagement", cards: [] },
          {
            id: "wedding-day",
            name: "Wedding Day",
            cards: [
              {
                id: 78,
                title: "Happily Ever After",
                cover: "/images/wedding-bells.png",
                centerfold:
                  "Congratulations on your beautiful wedding! Today marks the beginning of your greatest adventure together. May your love story be written with chapters of laughter, pages of joy, and a bond that only grows stronger with time. Here's to a lifetime of love, partnership, and happily ever after!",
                back: "Wishing you a lifetime of love and happiness!",
                tags: ["elegant", "romantic", "formal"],
              },
            ],
          },
          { id: "for-the-couple", name: "For the Couple", cards: [] },
          { id: "for-bride", name: "For Bride", cards: [] },
          { id: "for-groom", name: "For Groom", cards: [] },
          { id: "for-spouses-gender-neutral", name: "For Spouses Gender-Neutral", cards: [] },
          { id: "lgbtq-plus-weddings", name: "LGBTQ+ Weddings", cards: [] },
        ],
      },
      {
        id: "friendship",
        name: "Friendship",
        color: "teal",
        subcategories: [
          {
            id: "best-friend",
            name: "Best Friend",
            cards: [
              {
                id: 91,
                title: "Best Friends Forever",
                cover: "/images/friendship-bracelets.png",
                centerfold:
                  "To my amazing friend — you're one in a million! Through every adventure, every late-night talk, and every moment of laughter and tears, you've been there. True friendship like ours is rare and precious, and I never take it for granted. Here's to us and all the amazing memories still to come!",
                back: "Grateful for your friendship always!",
                tags: ["fun", "warm", "personal"],
              },
            ],
          },
          { id: "long-distance-friend", name: "Long-Distance Friend", cards: [] },
          { id: "childhood-friend", name: "Childhood Friend", cards: [] },
          { id: "work-friend", name: "Work Friend", cards: [] },
          { id: "chosen-family", name: "Chosen Family", cards: [] },
        ],
      },
    ],
  },
  {
    id: "family-parenting",
    name: "Family & Parenting",
    emoji: "👨‍👩‍👧",
    categories: [
      {
        id: "mothers-day",
        name: "Mother's Day",
        color: "pink",
        subcategories: [
          {
            id: "mom",
            name: "Mom",
            cards: [
              {
                id: 61,
                title: "World's Best Mom",
                cover: "/images/mothers-day-bouquet.png",
                centerfold:
                  "Mom, you are the heart and soul of our family. Your love is the foundation that holds us all together, and your warmth is the light that guides us through every storm. Thank you for every sacrifice, every hug, and every moment of unconditional love. You truly are the world's best mom!",
                back: "With all my love, forever and always!",
                tags: ["family", "warm", "elegant"],
              },
            ],
          },
          { id: "bonus-mom-stepmom", name: "Bonus Mom/Stepmom", cards: [] },
          { id: "mother-figure", name: "Mother Figure", cards: [] },
          { id: "grandma", name: "Grandma", cards: [] },
          { id: "new-mom", name: "New Mom", cards: [] },
          { id: "single-mom", name: "Single Mom", cards: [] },
          { id: "lgbtq-plus-parent", name: "LGBTQ+ Parent", cards: [] },
        ],
      },
      {
        id: "fathers-day",
        name: "Father's Day",
        color: "yellow",
        subcategories: [
          {
            id: "dad",
            name: "Dad",
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
          { id: "bonus-dad-stepdad", name: "Bonus Dad/Stepdad", cards: [] },
          { id: "father-figure", name: "Father Figure", cards: [] },
          { id: "grandpa", name: "Grandpa", cards: [] },
          { id: "new-dad", name: "New Dad", cards: [] },
          { id: "single-dad", name: "Single Dad", cards: [] },
          { id: "lgbtq-plus-parent", name: "LGBTQ+ Parent", cards: [] },
        ],
      },
      {
        id: "new-baby",
        name: "New Baby",
        color: "pastel",
        subcategories: [
          { id: "baby-girl", name: "Baby Girl", cards: [] },
          { id: "baby-boy", name: "Baby Boy", cards: [] },
          {
            id: "baby-gender-neutral",
            name: "Baby Gender-Neutral",
            cards: [
              {
                id: 80,
                title: "Welcome Little One",
                cover: "/images/new-baby-welcome.png",
                centerfold:
                  "Welcome to the world, little one! What an incredible blessing and a beautiful new chapter in your family's story. May this tiny bundle of joy fill your home with laughter, your hearts with love, and your lives with a happiness you never knew was possible. Congratulations to the proud parents!",
                back: "A new star is born! Congratulations!",
                tags: ["cute", "warm", "family"],
              },
            ],
          },
          { id: "twins-multiples", name: "Twins/Multiples", cards: [] },
          { id: "adoption", name: "Adoption", cards: [] },
          { id: "foster-parent", name: "Foster Parent", cards: [] },
          { id: "new-parents", name: "New Parents", cards: [] },
          { id: "baby-shower", name: "Baby Shower", cards: [] },
        ],
      },
      {
        id: "family-love",
        name: "Family Love",
        color: "warm",
        subcategories: [
          { id: "siblings", name: "Siblings", cards: [] },
          { id: "cousins", name: "Cousins", cards: [] },
          { id: "aunts-uncles", name: "Aunts & Uncles", cards: [] },
          { id: "chosen-family", name: "Chosen Family", cards: [] },
        ],
      },
    ],
  },
  {
    id: "support-healing-hard-moments",
    name: "Support, Healing & Hard Moments",
    emoji: "🕊️",
    categories: [
      {
        id: "get-well-soon",
        name: "Get Well Soon",
        color: "green",
        subcategories: [
          {
            id: "physical-illness",
            name: "Physical Illness",
            cards: [
              {
                id: 17,
                title: "Healing Thoughts",
                cover: "/images/get-well-sunflowers.png",
                centerfold:
                  "Sending you healing thoughts and warm wishes for a speedy recovery. Take care of yourself and know that you're in our thoughts.",
                back: "Get well soon!",
                tags: ["warm", "gentle"],
              },
            ],
          },
          {
            id: "surgery-recovery",
            name: "Surgery Recovery",
            cards: [
              {
                id: 139,
                title: "Operation: Recovery Humor",
                cover: "/images/gen-get-well-soon-surgery-recovery-funny.png",
                centerfold:
                  "I hear laughter is the best medicine, so get ready for some giggle therapy! Remember, they didn’t just take out your appendix; they also took your ability to lift anything heavier than a remote! Keep that sense of humor handy—it’s the only thing you can lift right now!",
                back: "Wishing you a speedy recovery with lots of laughs!",
                tone: "funny",
                artistInspiration: "soft impressionist watercolor with gentle light, peaceful water reflections, and calming pastels",
                tags: ["Surgery Recovery", "Get Well Soon", "Humor"],
              },
              {
                id: 140,
                title: "Healing Hearts Together",
                cover: "/images/gen-get-well-soon-surgery-recovery-heartfelt.png",
                centerfold:
                  "As you embark on this journey of recovery, remember that every day is a step closer to renewed strength and joy. We're holding you in our thoughts, sending you warmth and love to mend both body and spirit. Your courage inspires us all, and we can't wait to see you back on your feet, shining brighter than ever.",
                back: "Wishing you a smooth and speedy recovery.",
                tone: "heartfelt",
                artistInspiration: "large-scale botanical closeup with luminous petals, desert flowers, and meditative simplicity",
                tags: ["surgery recovery", "get well soon", "support and healing"],
              },
              {
                id: 141,
                title: "Stronger Every Day!",
                cover: "/images/gen-get-well-soon-surgery-recovery-uplifting.png",
                centerfold:
                  "May each day of your recovery bring you closer to renewed strength and brighter moments. You've faced this challenge with courage, and brighter days are just around the corner. Remember, healing takes time, but you’re on the right path to a wonderful comeback!",
                back: "Sending you warm wishes for a smooth recovery!",
                tone: "uplifting",
                artistInspiration: "abstract spiritual art with concentric organic shapes, soft geometry, and healing color gradients",
                tags: ["Surgery Recovery", "Get Well Soon", "Support"],
              },
            ],
          },
          {
            id: "mental-health-support",
            name: "Mental Health Support",
            cards: [
              {
                id: 142,
                title: "Mind Over Matter!",
                cover: "/images/gen-get-well-soon-mental-health-support-funny.png",
                centerfold:
                  "Feeling a little down? Just remember, even the best Wi-Fi signal has its off days! Let your brain buffer for a bit—it's just doing a system update! Hang in there, you're rebooting into greatness!",
                back: "Sending you virtual hugs and good vibes!",
                tone: "funny",
                artistInspiration: "soft impressionist watercolor with gentle light, peaceful water reflections, and calming pastels",
                tags: ["MentalHealth", "Support", "GetWellSoon"],
              },
              {
                id: 143,
                title: "You're Not Alone",
                cover: "/images/gen-get-well-soon-mental-health-support-heartfelt.png",
                centerfold:
                  "In moments of struggle, remember that it’s okay to seek help and take a breath. You are loved, and brighter days are ahead. Lean on those who care for you, and know that healing is a journey we can walk together.",
                back: "With all my love, take care.",
                tone: "heartfelt",
                artistInspiration: "large-scale botanical closeup with luminous petals, desert flowers, and meditative simplicity",
                tags: ["Mental Health", "Support", "Healing"],
              },
              {
                id: 144,
                title: "You Are Not Alone",
                cover: "/images/gen-get-well-soon-mental-health-support-uplifting.png",
                centerfold:
                  "Every step you take is a step towards healing. Embrace the journey, and remember that brighter days are ahead. You are stronger than you think, and support is all around you!",
                back: "With you every step of the way.",
                tone: "uplifting",
                artistInspiration: "abstract spiritual art with concentric organic shapes, soft geometry, and healing color gradients",
                tags: ["Mental Health", "Support", "Healing"],
              },
            ],
          },
          { id: "chronic-illness", name: "Chronic Illness", cards: [] },
          {
            id: "short-sweet",
            name: "Short & Sweet",
            cards: [
              {
                id: 18,
                title: "Feel Better Soon",
                cover: "/images/get-well-teddy.png",
                centerfold:
                  "Hope you're feeling better with each passing day. Rest up, take it easy, and know that brighter days are ahead.",
                back: "Thinking of you and wishing you well!",
                tags: ["cute", "comforting"],
              },
            ],
          },
          {
            id: "encouraging-hopeful",
            name: "Encouraging & Hopeful",
            cards: [
              {
                id: 19,
                title: "Speedy Recovery",
                cover: "/images/get-well-rainbow.png",
                centerfold:
                  "Wishing you strength, comfort, and a very speedy recovery. You're stronger than you know, and we're all rooting for you!",
                back: "Sending love and healing vibes your way!",
                tags: ["hopeful", "encouraging"],
              },
            ],
          },
        ],
      },
      {
        id: "sympathy",
        name: "Sympathy",
        color: "lavender",
        subcategories: [
          { id: "loss-of-parent", name: "Loss of Parent", cards: [] },
          { id: "loss-of-child", name: "Loss of Child", cards: [] },
          { id: "loss-of-partner", name: "Loss of Partner", cards: [] },
          { id: "loss-of-friend", name: "Loss of Friend", cards: [] },
          { id: "loss-of-pet", name: "Loss of Pet", cards: [] },
          { id: "celebration-of-life", name: "Celebration of Life", cards: [] },
          {
            id: "religious-sympathy",
            name: "Religious Sympathy",
            cards: [
              {
                id: 86,
                title: "With Deepest Sympathy",
                cover: "/images/sympathy-lilies.png",
                centerfold:
                  "During this difficult time, please know that you are not alone. Words can never fully express the sorrow we feel for your loss, but please know that our hearts are with you. May you find comfort in the beautiful memories shared and strength in the love that surrounds you. We are here for you, today and always.",
                back: "Holding you close in our thoughts and prayers.",
                tags: ["gentle", "respectful", "poetic"],
              },
            ],
          },
          { id: "non-religious-sympathy", name: "Non-Religious Sympathy", cards: [] },
        ],
      },
      {
        id: "thinking-of-you",
        name: "Thinking of You",
        color: "amber",
        subcategories: [
          {
            id: "just-because",
            name: "Just Because",
            cards: [
              {
                id: 87,
                title: "You're On My Mind",
                cover: "/images/thinking-of-you-tea.png",
                centerfold:
                  "Just wanted you to know that you've been on my mind today. Sometimes life gets busy and we forget to say it, but you matter to me more than you know. Whether things are going great or you're going through a rough patch, I'm here. Always. Consider this a warm hug from afar.",
                back: "Sending warmth and love your way!",
                tags: ["warm", "personal", "gentle"],
              },
            ],
          },
          { id: "long-distance", name: "Long Distance", cards: [] },
          {
            id: "miss-you",
            name: "Miss You",
            cards: [
              {
                id: 90,
                title: "Wish You Were Here",
                cover: "/images/miss-you-airplane.png",
                centerfold:
                  "Distance may separate us, but you're never far from my heart. Every time I see something beautiful, hear a song we love, or share a laugh, I think of you. I'm counting down the moments until we're together again. Until then, know that I miss you more than words can say.",
                back: "Missing you every single day!",
                tags: ["emotional", "warm", "personal"],
              },
            ],
          },
          { id: "checking-in", name: "Checking In", cards: [] },
        ],
      },
      {
        id: "encouragement",
        name: "Encouragement",
        color: "orange",
        subcategories: [
          {
            id: "youve-got-this",
            name: "You've Got This",
            cards: [
              {
                id: 88,
                title: "You've Got This",
                cover: "/images/encouragement-sunrise.png",
                centerfold:
                  "Hey, I just want you to know — you've got this. Whatever mountain you're climbing right now, you have the strength, the courage, and the heart to make it to the top. Every step forward counts, no matter how small. Keep going. The sunrise is coming, and it's going to be beautiful.",
                back: "Believe in yourself — I believe in you!",
                tags: ["motivational", "warm", "bold"],
              },
            ],
          },
          { id: "hard-times", name: "Hard Times", cards: [] },
          { id: "new-beginnings", name: "New Beginnings", cards: [] },
          { id: "self-love", name: "Self-Love", cards: [] },
          { id: "recovery-growth", name: "Recovery & Growth", cards: [] },
        ],
      },
      {
        id: "im-sorry",
        name: "I'm Sorry",
        color: "blue",
        subcategories: [
          { id: "apology-to-partner", name: "Apology to Partner", cards: [] },
          { id: "apology-to-friend", name: "Apology to Friend", cards: [] },
          { id: "apology-to-family", name: "Apology to Family", cards: [] },
          {
            id: "deep-serious",
            name: "Deep/Serious",
            cards: [
              {
                id: 92,
                title: "From the Heart",
                cover: "/images/apology-hearts.png",
                centerfold:
                  "I'm truly sorry. I know my words or actions may have hurt you, and that's the last thing I ever wanted. You mean the world to me, and I take responsibility for what happened. I hope you can find it in your heart to forgive me, because I want to make things right. You deserve better, and I promise to do better.",
                back: "Hoping for your forgiveness and a fresh start.",
                tags: ["sincere", "emotional", "gentle"],
              },
            ],
          },
          { id: "light-playful", name: "Light/Playful", cards: [] },
        ],
      },
    ],
  },
  {
    id: "appreciation-gratitude",
    name: "Appreciation & Gratitude",
    emoji: "🙏",
    categories: [
      {
        id: "thank-you",
        name: "Thank You",
        color: "teal",
        subcategories: [
          { id: "for-friend", name: "For Friend", cards: [] },
          { id: "for-family", name: "For Family", cards: [] },
          { id: "for-teacher", name: "For Teacher", cards: [] },
          { id: "for-mentor", name: "For Mentor", cards: [] },
          { id: "for-boss", name: "For Boss", cards: [] },
          { id: "for-coworker", name: "For Coworker", cards: [] },
          { id: "for-healthcare-worker", name: "For Healthcare Worker", cards: [] },
          { id: "for-essential-worker", name: "For Essential Worker", cards: [] },
          {
            id: "deep-gratitude",
            name: "Deep Gratitude",
            cards: [
              {
                id: 85,
                title: "Heartfelt Thanks",
                cover: "/images/thank-you-flowers.png",
                centerfold:
                  "Thank you from the bottom of my heart! Your kindness, generosity, and thoughtfulness mean more than words can express. You didn't have to go out of your way, but you did — and it made all the difference. I am truly grateful for you and everything you do.",
                back: "With deepest gratitude and appreciation!",
                tags: ["warm", "elegant", "sincere"],
              },
            ],
          },
          { id: "short-sweet", name: "Short & Sweet", cards: [] },
        ],
      },
      {
        id: "recognition",
        name: "Recognition",
        color: "gold",
        subcategories: [
          { id: "employee-appreciation", name: "Employee Appreciation", cards: [] },
          { id: "volunteer-appreciation", name: "Volunteer Appreciation", cards: [] },
          { id: "community-leader", name: "Community Leader", cards: [] },
          { id: "coach", name: "Coach", cards: [] },
          { id: "educator", name: "Educator", cards: [] },
        ],
      },
    ],
  },
  {
    id: "national-civic-holidays",
    name: "National & Civic Holidays",
    emoji: "🇺🇸",
    categories: [
      {
        id: "us-holidays",
        name: "U.S. Holidays",
        color: "red",
        subcategories: [
          {
            id: "new-years-day",
            name: "New Year's Day",
            cards: [
              {
                id: 67,
                title: "Cheers to a New Year",
                cover: "/images/new-years-cheers.png",
                centerfold:
                  "Here's to new beginnings, fresh starts, and a year filled with endless possibilities! May this New Year bring you joy, success, and all the happiness your heart can hold. Cheers to leaving the old behind and embracing the beautiful journey ahead!",
                back: "Happy New Year! Make it amazing!",
                tags: ["festive", "elegant", "celebratory"],
              },
            ],
          },
          {
            id: "mlk-day",
            name: "MLK Day",
            cards: [
              {
                id: 68,
                title: "The Dream Lives On",
                cover: "/images/mlk-dream.png",
                centerfold:
                  "On this day, we honor the life and legacy of Dr. Martin Luther King Jr. His dream of equality, justice, and unity continues to guide and inspire us. Let us recommit to building a world where every person is judged by the content of their character. The dream lives on in each of us.",
                back: "Keep the dream alive!",
                tags: ["inspirational", "educational", "formal"],
              },
            ],
          },
          {
            id: "presidents-day",
            name: "Presidents' Day",
            cards: [
              {
                id: 190,
                title: "Presidential Puns Ahead!",
                cover: "/images/gen-us-holidays-presidents-day-funny.png",
                centerfold:
                  "Why did the president bring a ladder to the White House? Because he wanted to reach new heights in his approval ratings! On this Presidents' Day, let's salute our leaders, past and present—after all, they only have to be less popular than the last guy! ",
                back: "Keep smiling and keeping it presidential!",
                tone: "funny",
                artistInspiration: "dynamic cubist narrative with bold geometric shapes, earthy palette, and powerful figures",
                tags: ["Presidents' Day", "Humor", "U.S. Holidays"],
              },
              {
                id: 191,
                title: "Honoring Our Leaders",
                cover: "/images/gen-us-holidays-presidents-day-heartfelt.png",
                centerfold:
                  "On this Presidents' Day, let us reflect on the courage and vision of those who have shaped our nation. May we be inspired by their unwavering dedication to liberty and justice for all. Together, let's carry their legacy forward with kindness and unity in our hearts.",
                back: "With gratitude and hope, always.",
                tone: "heartfelt",
                artistInspiration: "modernist collage with layered textures, bold patterns, and rich cultural imagery",
                tags: ["Presidents' Day", "National Holidays", "Civic Pride"],
              },
              {
                id: 192,
                title: "Honoring Leadership Today",
                cover: "/images/gen-us-holidays-presidents-day-uplifting.png",
                centerfold:
                  "On this Presidents' Day, let’s celebrate the spirit of unity and progress that our leaders have inspired. Together, we can carry their legacy forward, embracing hope and change for a brighter tomorrow. Remember, your voice matters and your actions can make a difference!",
                back: "Warm wishes to you this Presidents' Day!",
                tone: "uplifting",
                artistInspiration: "American regionalist style with rolling landscapes, patriotic palette, and strong composition",
                tags: ["Presidents' Day", "U.S. Holidays", "celebration"],
              },
            ],
          },
          {
            id: "memorial-day",
            name: "Memorial Day",
            cards: [
              {
                id: 69,
                title: "In Honor & Remembrance",
                cover: "/images/memorial-day-tribute.png",
                centerfold:
                  "Today we pause to honor and remember those who made the ultimate sacrifice for our freedom. Their bravery, courage, and selflessness will never be forgotten. We are forever grateful for the men and women who gave everything so that we may live in liberty.",
                back: "Forever grateful for their sacrifice!",
                tags: ["patriotic", "formal", "solemn"],
              },
            ],
          },
          {
            id: "fourth-of-july",
            name: "Fourth of July",
            cards: [
              {
                id: 25,
                title: "Independence Day",
                cover: "/images/fourth-july-liberty.png",
                centerfold:
                  "Happy Fourth of July! Let's celebrate the land of the free and the home of the brave with fireworks, family, and freedom!",
                back: "Happy Independence Day!",
                tags: ["patriotic", "festive"],
              },
              {
                id: 26,
                title: "Stars and Stripes",
                cover: "/images/fourth-july-fireworks.png",
                centerfold:
                  "Celebrating America's independence with pride, patriotism, and gratitude for the freedoms we enjoy. Happy Fourth of July!",
                back: "Proud to be American!",
                tags: ["patriotic", "formal"],
              },
              {
                id: 27,
                title: "Fireworks Celebration",
                cover: "/images/fourth-july-fireworks.png",
                centerfold:
                  "Let freedom ring! Wishing you a spectacular Fourth of July filled with fireworks, fun, and the spirit of independence.",
                back: "Let freedom ring!",
                tags: ["festive", "casual"],
              },
            ],
          },
          {
            id: "labor-day",
            name: "Labor Day",
            cards: [
              {
                id: 70,
                title: "Celebrating Hard Work",
                cover: "/images/labor-day-workers.png",
                centerfold:
                  "Happy Labor Day! Today we celebrate the hardworking men and women who build, create, and sustain our communities. Your dedication and perseverance are the backbone of our nation. Take this day to rest, recharge, and know that your contributions make a real difference.",
                back: "Here's to the workers who keep the world turning!",
                tags: ["patriotic", "appreciative", "casual"],
              },
            ],
          },
          {
            id: "veterans-day",
            name: "Veterans Day",
            cards: [
              {
                id: 71,
                title: "Honoring Our Heroes",
                cover: "/images/veterans-day-honor.png",
                centerfold:
                  "Thank you for your service! On this Veterans Day, we honor the brave men and women who have served and continue to serve our country. Your courage, sacrifice, and unwavering dedication to protecting our freedom are deeply appreciated. We owe you a debt of gratitude that can never be fully repaid.",
                back: "With gratitude and respect for your service!",
                tags: ["patriotic", "formal", "respectful"],
              },
            ],
          },
          {
            id: "thanksgiving",
            name: "Thanksgiving",
            cards: [
              {
                id: 72,
                title: "Grateful Heart",
                cover: "/images/thanksgiving-harvest.png",
                centerfold:
                  "Happy Thanksgiving! In this season of gratitude, I want you to know how thankful I am to have you in my life. Like a bountiful harvest, our blessings overflow when shared with the ones we love. May your table be full, your heart be warm, and your day be filled with the laughter of loved ones.",
                back: "Grateful for you today and every day!",
                tags: ["warm", "family", "traditional"],
              },
            ],
          },
        ],
      },
      {
        id: "black-american-cultural",
        name: "Black American & Cultural",
        color: "red",
        subcategories: [
          {
            id: "juneteenth",
            name: "Juneteenth",
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
          {
            id: "black-history-month",
            name: "Black History Month",
            cards: [
              {
                id: 64,
                title: "Heritage & Power",
                cover: "/images/black-history-power.png",
                centerfold:
                  "This Black History Month, we celebrate the resilience, brilliance, and beauty of Black culture and heritage. From trailblazers who changed the world to everyday heroes in our communities, we honor the legacy of strength and perseverance that continues to inspire generations. Our history is rich, our future is bright.",
                back: "Celebrating excellence, honoring legacy!",
                tags: ["empowering", "educational", "inspirational"],
              },
            ],
          },
          {
            id: "kwanzaa",
            name: "Kwanzaa",
            cards: [
              {
                id: 75,
                title: "Joyous Kwanzaa",
                cover: "/images/kwanzaa-kinara.png",
                centerfold:
                  "Habari Gani! Wishing you a joyous Kwanzaa filled with unity, self-determination, and purpose. As we light each candle of the kinara, may we be reminded of the values that strengthen our community and celebrate the rich cultural heritage that binds us together. May this season bring you peace and prosperity.",
                back: "Happy Kwanzaa! Harambee!",
                tags: ["cultural", "traditional", "community"],
              },
            ],
          },
          {
            id: "emancipation-freedom-themes",
            name: "Emancipation/Freedom Themes",
            cards: [
              {
                id: 193,
                title: "Freedom's Just Desserts!",
                cover: "/images/gen-black-american-cultural-emancipation-freedom-themes-funny.png",
                centerfold:
                  "Time to celebrate with the sweetest freedom! Who knew emancipation could be this tasty? Let’s have a slice of freedom pie—just don’t forget the whipped cream of joy on top! Get ready to party like it’s 1865—without the balloons that float away!",
                back: "Wishing you a day full of joyful freedom!",
                tone: "funny",
                artistInspiration: "dynamic cubist narrative with bold geometric shapes, earthy palette, and powerful figures",
                tags: ["Emancipation", "Freedom", "Humor"],
              },
              {
                id: 194,
                title: "Celebrating Our Freedom",
                cover: "/images/gen-black-american-cultural-emancipation-freedom-themes-heartfelt.png",
                centerfold:
                  "Today, we honor the triumph of the human spirit and the relentless journey towards equality. May we cherish our past, embrace our present, and strive for a future where every voice is heard and every dream can flourish. Together, we stand tall in the legacy of those who fought for our freedom.",
                back: "With love and unity, we rise.",
                tone: "heartfelt",
                artistInspiration: "modernist collage with layered textures, bold patterns, and rich cultural imagery",
                tags: ["Emancipation", "Freedom", "Cultural Heritage"],
              },
              {
                id: 195,
                title: "Celebrate Freedom Today!",
                cover: "/images/gen-black-american-cultural-emancipation-freedom-themes-uplifting.png",
                centerfold:
                  "On this special day, we honor the strength and resilience that paved the way for brighter tomorrows. Let’s unite in gratitude and joy, celebrating the power of freedom and the vibrant culture that enriches our lives. Together, we rise and inspire one another to dream bigger and achieve greater!",
                back: "With love and hope, embrace your freedom!",
                tone: "uplifting",
                artistInspiration: "American regionalist style with rolling landscapes, patriotic palette, and strong composition",
                tags: ["Emancipation", "Cultural Celebration", "Unity"],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "religious-spiritual-cultural",
    name: "Religious, Spiritual & Cultural",
    emoji: "🌍",
    categories: [
      {
        id: "christian-holidays",
        name: "Christian Holidays",
        color: "red",
        subcategories: [
          {
            id: "christmas",
            name: "Christmas",
            cards: [
              {
                id: 73,
                title: "Season's Greetings",
                cover: "/images/christmas-tree.png",
                centerfold:
                  "Merry Christmas! May the magic of the season fill your home with warmth, your heart with love, and your days with joy. Like the lights on a Christmas tree, may your life sparkle with happiness and wonder. Wishing you and yours a blessed and beautiful holiday season.",
                back: "Merry Christmas and Happy New Year!",
                tags: ["traditional", "family", "festive"],
              },
            ],
          },
          {
            id: "easter",
            name: "Easter",
            cards: [
              {
                id: 76,
                title: "Easter Blessings",
                cover: "/images/easter-spring.png",
                centerfold:
                  "Happy Easter! May this beautiful season of renewal fill your heart with hope and your life with new beginnings. Like the flowers that bloom in spring, may your days be bright and colorful. Wishing you a day of joy, faith, and the sweetest celebrations with those you love.",
                back: "He is risen! Happy Easter!",
                tags: ["faith-based", "spring", "family"],
              },
            ],
          },
        ],
      },
      {
        id: "jewish-holidays",
        name: "Jewish Holidays",
        color: "blue",
        subcategories: [
          {
            id: "hanukkah",
            name: "Hanukkah",
            cards: [
              {
                id: 74,
                title: "Festival of Lights",
                cover: "/images/hanukkah-menorah.png",
                centerfold:
                  "Happy Hanukkah! May the glow of the menorah light up your home and your heart for all eight nights. This Festival of Lights reminds us of the miracle of perseverance and the power of faith. Wishing you and your family a season filled with joy, love, and delicious latkes!",
                back: "Chag Sameach! Happy Hanukkah!",
                tags: ["traditional", "faith-based", "warm"],
              },
            ],
          },
          {
            id: "rosh-hashanah",
            name: "Rosh Hashanah",
            cards: [
              {
                id: 169,
                title: "Shana Tova-licious!",
                cover: "/images/gen-jewish-holidays-rosh-hashanah-funny.png",
                centerfold:
                  "As we dip apples in honey, let’s remember: it's not just for the sweetness! It’s also to prevent the brisket from being too dry! Wishing you a year filled with plenty of sweet surprises and no sour notes – unless it’s a really good pickle!",
                back: "Wishing you a year as bright as your challah!",
                tone: "funny",
                artistInspiration: "abstract expressionist spiritual art with radiating colors, sacred geometry, and luminous energy",
                tags: ["Rosh Hashanah", "Humor", "Jewish Holidays"],
              },
              {
                id: 170,
                title: "A Sweet New Year",
                cover: "/images/gen-jewish-holidays-rosh-hashanah-heartfelt.png",
                centerfold:
                  "As the shofar sounds, may your heart awaken to the beauty of new beginnings. This Rosh Hashanah, may your life be filled with sweetness, joy, and cherished moments with loved ones. Here’s to a year of health, happiness, and peace for you and your family.",
                back: "Wishing you a year full of blessings.",
                tone: "heartfelt",
                artistInspiration: "color field meditation with large blocks of glowing color, serene depth, and contemplative mood",
                tags: ["Rosh Hashanah", "New Year", "Jewish Holidays"],
              },
              {
                id: 171,
                title: "New Beginnings Ahead",
                cover: "/images/gen-jewish-holidays-rosh-hashanah-uplifting.png",
                centerfold:
                  "As we gather to welcome a fresh year, may your heart be filled with hope and your days shine with joy. Embrace the blessings that come your way and let this year be a canvas for new adventures. L’shana tovah – here’s to a sweet and fulfilling year ahead!",
                back: "Wishing you peace and happiness this year.",
                tone: "uplifting",
                artistInspiration: "mosaic-like abstract with radiant concentric circles, stained glass colors, and spiritual warmth",
                tags: ["Rosh Hashanah", "New Year", "Jewish Holidays"],
              },
            ],
          },
          {
            id: "yom-kippur",
            name: "Yom Kippur",
            cards: [
              {
                id: 172,
                title: "Fast Times at Yom Kippur",
                cover: "/images/gen-jewish-holidays-yom-kippur-funny.png",
                centerfold:
                  "Why did the rabbi bring a ladder to Yom Kippur? Because he wanted to reach new heights of repentance! Remember, it's all about the 'fast' track to forgiveness—just don’t speed too much on the way to the break fast!",
                back: "Wishing you an easy fast and a joyous break!",
                tone: "funny",
                artistInspiration: "abstract expressionist spiritual art with radiating colors, sacred geometry, and luminous energy",
                tags: ["Yom Kippur", "Jewish Holidays", "Humor"],
              },
              {
                id: 173,
                title: "A Day of Reflection",
                cover: "/images/gen-jewish-holidays-yom-kippur-heartfelt.png",
                centerfold:
                  "On this sacred day of Yom Kippur, may your heart find peace and your spirit embrace forgiveness. As we come together to reflect, let us release our burdens and seek reconciliation with ourselves and others. May the promise of a new beginning fill you with hope and strength.",
                back: "Wishing you a meaningful fast and a year of blessings.",
                tone: "heartfelt",
                artistInspiration: "color field meditation with large blocks of glowing color, serene depth, and contemplative mood",
                tags: ["Yom Kippur", "Forgiveness", "Reflection"],
              },
              {
                id: 174,
                title: "A Day of Reflection",
                cover: "/images/gen-jewish-holidays-yom-kippur-uplifting.png",
                centerfold:
                  "As we gather to reflect and renew, may this Yom Kippur bring you peace and clarity. Embrace the opportunity to forgive and be forgiven, lifting your spirit towards new beginnings. Let your heart be filled with hope and your soul with light as you embark on this sacred journey.",
                back: "Wishing you a meaningful Yom Kippur.",
                tone: "uplifting",
                artistInspiration: "mosaic-like abstract with radiant concentric circles, stained glass colors, and spiritual warmth",
                tags: ["Yom Kippur", "Reflection", "Forgiveness"],
              },
            ],
          },
          { id: "passover", name: "Passover", cards: [] },
        ],
      },
      {
        id: "muslim-holidays",
        name: "Muslim Holidays",
        color: "green",
        subcategories: [
          { id: "ramadan", name: "Ramadan", cards: [] },
          { id: "eid-al-fitr", name: "Eid al-Fitr", cards: [] },
          { id: "eid-al-adha", name: "Eid al-Adha", cards: [] },
        ],
      },
      {
        id: "hindu-south-asian",
        name: "Hindu & South Asian",
        color: "gold",
        subcategories: [
          {
            id: "diwali",
            name: "Diwali",
            cards: [
              {
                id: 77,
                title: "Festival of Lights",
                cover: "/images/diwali-lights.png",
                centerfold:
                  "Happy Diwali! May the festival of lights illuminate your path and fill your life with prosperity, happiness, and love. As the diyas glow and the rangoli brightens your home, may every corner of your world be filled with the warmth of family, the sweetness of mithai, and the joy of celebration.",
                back: "Shubh Diwali! May your light shine bright!",
                tags: ["cultural", "festive", "elegant"],
              },
            ],
          },
          { id: "holi", name: "Holi", cards: [] },
          { id: "navratri", name: "Navratri", cards: [] },
        ],
      },
      {
        id: "asian-cultural",
        name: "Asian Cultural",
        color: "red",
        subcategories: [
          { id: "lunar-new-year", name: "Lunar New Year", cards: [] },
          { id: "mid-autumn-festival", name: "Mid-Autumn Festival", cards: [] },
        ],
      },
      {
        id: "spiritual-non-religious",
        name: "Spiritual Non-Religious",
        color: "purple",
        subcategories: [
          { id: "blessings", name: "Blessings", cards: [] },
          { id: "gratitude", name: "Gratitude", cards: [] },
          { id: "mindfulness", name: "Mindfulness", cards: [] },
          { id: "new-beginnings", name: "New Beginnings", cards: [] },
        ],
      },
    ],
  },
  {
    id: "identity-pride-inclusion",
    name: "Identity, Pride & Inclusion",
    emoji: "🏳️‍🌈",
    categories: [
      {
        id: "pride-lgbtq",
        name: "Pride & LGBTQ+",
        color: "rainbow",
        subcategories: [
          {
            id: "pride-month",
            name: "Pride Month",
            cards: [
              {
                id: 66,
                title: "Love is Love",
                cover: "/images/pride-love.png",
                centerfold:
                  "Happy Pride! Love is love, and every color of the rainbow deserves to shine bright. This month and every month, we celebrate authenticity, acceptance, and the beautiful diversity of the human heart. Be proud of who you are — the world is better because you're in it.",
                back: "Proud, loud, and full of love!",
                tags: ["bold", "inclusive", "celebratory"],
              },
            ],
          },
          {
            id: "coming-out",
            name: "Coming Out",
            cards: [
              {
                id: 148,
                title: "Unicorns and Rainbows Unite!",
                cover: "/images/gen-pride-lgbtq-coming-out-funny.png",
                centerfold:
                  "Congratulations on finally coming out! Just remember, it’s not just a phase—unless you’re talking about fashion choices. Now you can officially blame all your glittery shoes on your fabulous self!",
                back: "Shine on, you beautiful star!",
                tone: "funny",
                artistInspiration: "urban neo-expressionist style with raw energy, layered text elements, and vibrant graffiti colors",
                tags: ["Coming Out", "Pride", "LGBTQ+"],
              },
              {
                id: 149,
                title: "Embrace Your Truth",
                cover: "/images/gen-pride-lgbtq-coming-out-heartfelt.png",
                centerfold:
                  "Your journey is a beautiful testament to courage and authenticity. Coming out is not just a moment; it’s a celebration of who you truly are. May you find love and acceptance, both from yourself and those around you, as you step into the light with pride.",
                back: "With love and support always.",
                tone: "heartfelt",
                artistInspiration: "bold pop art with thick outlines, dancing figures, and radiant rainbow patterns",
                tags: ["Coming Out", "Pride", "Self-Acceptance"],
              },
              {
                id: 150,
                title: "Be You, Shine Bright",
                cover: "/images/gen-pride-lgbtq-coming-out-uplifting.png",
                centerfold:
                  "Your truth is a gift to the world! Embrace who you are with pride and let your authentic self shine. Remember, you are loved just as you are, and the journey of self-acceptance is a beautiful one.",
                back: "With love and pride, always.",
                tone: "uplifting",
                artistInspiration: "maximalist portrait style with ornate patterns, powerful poses, and rich textile backgrounds",
                tags: ["Coming Out", "Pride", "Self-Acceptance"],
              },
            ],
          },
          {
            id: "lgbtq-plus-love",
            name: "LGBTQ+ Love",
            cards: [
              {
                id: 151,
                title: "Love is a Rainbow",
                cover: "/images/gen-pride-lgbtq-lgbtq-plus-love-funny.png",
                centerfold:
                  "You stole my heart like a drag queen steals the show! Let’s celebrate our love that’s more colorful than a Pride parade and sweeter than a unicorn on a sugar rush. Here’s to being fabulously ourselves and loving fiercely—because normal is so last season!",
                back: "Keep shining bright, fabulous one!",
                tone: "funny",
                artistInspiration: "urban neo-expressionist style with raw energy, layered text elements, and vibrant graffiti colors",
                tags: ["LGBTQ+", "Pride", "Love"],
              },
              {
                id: 152,
                title: "Love Knows No Bounds",
                cover: "/images/gen-pride-lgbtq-lgbtq-plus-love-heartfelt.png",
                centerfold:
                  "In a world that shines with colors as vibrant as your heart, your love is a beautiful testament to the strength of authenticity. Celebrate every moment of your journey together, knowing that your love inspires others to embrace who they are. Let your hearts shine boldly, reminding the world that love is love, and it's meant to be cherished.",
                back: "With love always, embrace your truth.",
                tone: "heartfelt",
                artistInspiration: "bold pop art with thick outlines, dancing figures, and radiant rainbow patterns",
                tags: ["Love", "Pride", "Inclusion"],
              },
              {
                id: 153,
                title: "Love Always Wins",
                cover: "/images/gen-pride-lgbtq-lgbtq-plus-love-uplifting.png",
                centerfold:
                  "Your love is a beautiful tapestry woven with courage and authenticity. Celebrate who you are and embrace the vibrant colors of your identity. Together, we create a world where love knows no bounds!",
                back: "Keep shining your unique light.",
                tone: "uplifting",
                artistInspiration: "maximalist portrait style with ornate patterns, powerful poses, and rich textile backgrounds",
                tags: ["LGBTQ+", "Pride", "Inclusion"],
              },
            ],
          },
          { id: "trans-joy", name: "Trans Joy", cards: [] },
          { id: "nonbinary-gender-expansive", name: "Nonbinary/Gender-Expansive", cards: [] },
          { id: "chosen-family", name: "Chosen Family", cards: [] },
        ],
      },
      {
        id: "womens-history",
        name: "Women's History",
        color: "purple",
        subcategories: [
          {
            id: "womens-history-month",
            name: "Women's History Month",
            cards: [
              {
                id: 65,
                title: "Women Who Lead",
                cover: "/images/womens-history.png",
                centerfold:
                  "This Women's History Month, we honor the trailblazing women who shattered ceilings, broke barriers, and paved the way for future generations. From scientists to activists, artists to leaders, women have shaped every corner of our world. Here's to celebrating the strength, courage, and brilliance of women everywhere.",
                back: "Empowered women empower the world!",
                tags: ["empowering", "inspirational", "bold"],
              },
            ],
          },
          { id: "empowerment", name: "Empowerment", cards: [] },
          { id: "sisterhood", name: "Sisterhood", cards: [] },
          { id: "black-women", name: "Black Women", cards: [] },
          { id: "mothers-caregivers", name: "Mothers & Caregivers", cards: [] },
        ],
      },
      {
        id: "cultural-identity",
        name: "Cultural Identity",
        color: "brown",
        subcategories: [
          { id: "african-american", name: "African American", cards: [] },
          { id: "caribbean", name: "Caribbean", cards: [] },
          { id: "latino-hispanic", name: "Latino/Hispanic", cards: [] },
          { id: "asian-american", name: "Asian American", cards: [] },
          { id: "indigenous", name: "Indigenous", cards: [] },
          { id: "immigrant-experience", name: "Immigrant Experience", cards: [] },
        ],
      },
    ],
  },
  {
    id: "work-career-life-changes",
    name: "Work, Career & Life Changes",
    emoji: "💼",
    categories: [
      {
        id: "new-job",
        name: "New Job",
        color: "teal",
        subcategories: [
          {
            id: "first-job",
            name: "First Job",
            cards: [
              {
                id: 181,
                title: "Welcome to the Grind!",
                cover: "/images/gen-new-job-first-job-funny.png",
                centerfold:
                  "Congratulations on your first job! Remember, coffee is your new best friend and deadlines are just suggestions. Don’t worry if you feel a little lost; it's just part of the fun of adulting! You’ve got this – just don’t forget to pretend to look busy!",
                back: "Cheers to a fantastic start!",
                tone: "funny",
                artistInspiration: "geometric abstraction with clean primary color grids, balanced composition, and modern elegance",
                tags: ["First Job", "New Beginnings", "Work Humor"],
              },
              {
                id: 182,
                title: "A Dream Begins Here",
                cover: "/images/gen-new-job-first-job-heartfelt.png",
                centerfold:
                  "Congratulations on landing your first job! This is the beginning of an exciting journey full of growth, challenges, and opportunities to shine. Embrace each moment and remember, you're capable of achieving amazing things.",
                back: "Wishing you all the best on this new adventure!",
                tone: "heartfelt",
                artistInspiration: "kinetic art style with dynamic circular forms, rhythmic color patterns, and forward motion",
                tags: ["First Job", "Congratulations", "New Beginnings"],
              },
              {
                id: 183,
                title: "Cheers to New Beginnings!",
                cover: "/images/gen-new-job-first-job-uplifting.png",
                centerfold:
                  "Congratulations on landing your first job! This is just the beginning of an incredible journey filled with growth, learning, and endless opportunities. Embrace every challenge, and remember, your potential is limitless!",
                back: "Wishing you all the success ahead!",
                tone: "uplifting",
                artistInspiration: "op art with mesmerizing geometric patterns, optical movement, and energizing contrasts",
                tags: ["First Job", "New Beginnings", "Career Growth"],
              },
            ],
          },
          {
            id: "promotion",
            name: "Promotion",
            cards: [
              {
                id: 82,
                title: "Congratulations on Your New Role",
                cover: "/images/new-job-key.png",
                centerfold:
                  "Congratulations on your exciting new opportunity! This is a reflection of your talent, determination, and all the hard work you've put in. The future is yours to shape, and I know you'll bring your unique brilliance to everything you do. Go out there and show them what you're made of!",
                back: "Onward and upward! You've got this!",
                tags: ["professional", "inspirational", "formal"],
              },
            ],
          },
          {
            id: "career-change",
            name: "Career Change",
            cards: [
              {
                id: 184,
                title: "From Cubicle to Adventure!",
                cover: "/images/gen-new-job-career-change-funny.png",
                centerfold:
                  "Congratulations on your career change! Remember, it’s not about finding the right job, it’s about finding the one that doesn’t have a dress code! Here’s to trading in spreadsheets for daydreams and coffee breaks for spontaneous dance parties!",
                back: "Cheers to new beginnings!",
                tone: "funny",
                artistInspiration: "geometric abstraction with clean primary color grids, balanced composition, and modern elegance",
                tags: ["Career Change", "Funny", "New Job"],
              },
              {
                id: 185,
                title: "A New Path Awaits",
                cover: "/images/gen-new-job-career-change-heartfelt.png",
                centerfold:
                  "Embracing change takes courage, and today you take a bold step toward a brighter future. May this new adventure bring you joy, fulfillment, and the chance to shine in ways you've always dreamed. Remember, every ending is a new beginning, and I believe in you wholeheartedly.",
                back: "With all my love and support.",
                tone: "heartfelt",
                artistInspiration: "kinetic art style with dynamic circular forms, rhythmic color patterns, and forward motion",
                tags: ["Career Change", "New Beginnings", "Support"],
              },
              {
                id: 186,
                title: "New Horizons Await",
                cover: "/images/gen-new-job-career-change-uplifting.png",
                centerfold:
                  "Embracing change is the first step toward new adventures! Your courage to pursue a fresh career path is inspiring. Remember, every twist and turn leads to growth and new opportunities. Keep shining bright and follow your dreams!",
                back: "Wishing you endless success!",
                tone: "uplifting",
                artistInspiration: "op art with mesmerizing geometric patterns, optical movement, and energizing contrasts",
                tags: ["Career Change", "New Beginnings", "Inspiration"],
              },
            ],
          },
          { id: "freelance-entrepreneur", name: "Freelance/Entrepreneur", cards: [] },
        ],
      },
      {
        id: "retirement",
        name: "Retirement",
        color: "gold",
        subcategories: [
          { id: "funny-retirement", name: "Funny Retirement", cards: [] },
          {
            id: "emotional-retirement",
            name: "Emotional Retirement",
            cards: [
              {
                id: 81,
                title: "Happy Retirement",
                cover: "/images/retirement-sunset.png",
                centerfold:
                  "Congratulations on your retirement! After years of hard work, dedication, and countless achievements, it's time to kick back and enjoy the good life. You've earned every sunset, every lazy morning, and every adventure that awaits. Here's to the next chapter — may it be your best one yet!",
                back: "Enjoy every moment of your well-earned retirement!",
                tags: ["celebratory", "warm", "professional"],
              },
            ],
          },
          { id: "new-chapter", name: "New Chapter", cards: [] },
        ],
      },
      {
        id: "new-home",
        name: "New Home",
        color: "brown",
        subcategories: [
          {
            id: "first-home",
            name: "First Home",
            cards: [
              {
                id: 83,
                title: "Home Sweet Home",
                cover: "/images/new-home-key.png",
                centerfold:
                  "Congratulations on your new home! May every room be filled with love, every wall hold beautiful memories, and every corner bring you comfort and joy. A home is where the heart is, and yours is about to overflow with happiness. Welcome home!",
                back: "Wishing you warmth and happiness in your new home!",
                tags: ["warm", "celebratory", "casual"],
              },
            ],
          },
          { id: "apartment", name: "Apartment", cards: [] },
          { id: "family-move", name: "Family Move", cards: [] },
          { id: "housewarming", name: "Housewarming", cards: [] },
        ],
      },
    ],
  },
  {
    id: "seasonal-fun",
    name: "Seasonal & Fun",
    emoji: "🎃",
    categories: [
      {
        id: "seasonal",
        name: "Seasonal",
        color: "orange",
        subcategories: [
          {
            id: "halloween",
            name: "Halloween",
            cards: [
              {
                id: 62,
                title: "Spooky Greetings",
                cover: "/images/halloween-spooky.png",
                centerfold:
                  "Have a fang-tastic Halloween! May your night be filled with just the right amount of spookiness, tons of treats, and zero tricks. Whether you're trick-or-treating, carving pumpkins, or watching scary movies, have a hauntingly good time!",
                back: "Have a boo-tiful Halloween!",
                tags: ["playful", "funny", "seasonal"],
              },
            ],
          },
          {
            id: "fall-vibes",
            name: "Fall Vibes",
            cards: [
              {
                id: 160,
                title: "Falling for You",
                cover: "/images/gen-seasonal-fall-vibes-funny.png",
                centerfold:
                  "Why did the leaf break up with the tree? It just couldn't handle the pressure of all those branches! Let's fall into sweater weather and pumpkin spice everything together. Hope your season is un-leaf-ably cozy!",
                back: "Stay warm and enjoy the crunch!",
                tone: "funny",
                artistInspiration: "bold pop art with bright flat colors, graphic silkscreen effect, and cultural iconography",
                tags: ["Fall", "Pumpkin Spice", "Humor"],
              },
              {
                id: 161,
                title: "Autumn Embrace",
                cover: "/images/gen-seasonal-fall-vibes-heartfelt.png",
                centerfold:
                  "As the leaves turn golden and the air grows crisp, may you find warmth in the simple joys of this beautiful season. Let the vibrant colors of fall remind you of the love and gratitude that surrounds you. Cherish each moment, for it's the little things that weave the fabric of our memories.",
                back: "Wishing you a cozy fall filled with love.",
                tone: "heartfelt",
                artistInspiration: "comic book pop art with Ben-Day dots, bold outlines, speech bubbles, and saturated colors",
                tags: ["Fall Vibes", "Heartfelt", "Seasonal"],
              },
              {
                id: 162,
                title: "Embrace the Autumn Glow",
                cover: "/images/gen-seasonal-fall-vibes-uplifting.png",
                centerfold:
                  "As the leaves turn golden and the air grows crisp, let the beauty of fall inspire you. This season is a reminder to let go of the past and embrace new beginnings. Take a moment to savor the warmth of cozy gatherings and the joy of nature’s transformation. You are surrounded by magic—soak it all in!",
                back: "Wishing you a season full of warmth and wonder,",
                tone: "uplifting",
                artistInspiration: "playful contemporary pop with oversized smiling flowers, candy colors, and kawaii energy",
                tags: ["Fall", "Autumn", "Inspiration"],
              },
            ],
          },
          {
            id: "winter-cheer",
            name: "Winter Cheer",
            cards: [
              {
                id: 163,
                title: "Ice to Meet You!",
                cover: "/images/gen-seasonal-winter-cheer-funny.png",
                centerfold:
                  "Winter is snow joke! As the temperatures drop, remember to chill out and let the frost bite. May your hot cocoa be strong, your socks be warm, and your snowman-building skills be legend—wait for it—dairy! Stay frosty!",
                back: "Warm wishes and snowy snuggles!",
                tone: "funny",
                artistInspiration: "bold pop art with bright flat colors, graphic silkscreen effect, and cultural iconography",
                tags: ["Winter", "Humor", "Seasonal"],
              },
              {
                id: 164,
                title: "Warmth in the Cold",
                cover: "/images/gen-seasonal-winter-cheer-heartfelt.png",
                centerfold:
                  "As the winter chill wraps around us, may the warmth of love and joy fill your heart. Let every snowfall remind you of the beauty in life's simple moments, and may laughter ring through your home like a melody. Together, we can create memories that shine brighter than the stars on a frosty night.",
                back: "Sending you cozy hugs and warm wishes,",
                tone: "heartfelt",
                artistInspiration: "comic book pop art with Ben-Day dots, bold outlines, speech bubbles, and saturated colors",
                tags: ["Winter", "Cheer", "Heartfelt"],
              },
              {
                id: 165,
                title: "Embrace the Season",
                cover: "/images/gen-seasonal-winter-cheer-uplifting.png",
                centerfold:
                  "As the snow blankets the world in shimmering white, let your heart be filled with warmth and joy. This winter, take a moment to reflect on the beauty around you and the love that surrounds you. Every flake is a reminder that magic is everywhere, just waiting for you to embrace it!",
                back: "Wishing you endless winter cheer!",
                tone: "uplifting",
                artistInspiration: "playful contemporary pop with oversized smiling flowers, candy colors, and kawaii energy",
                tags: ["Winter", "Joy", "Magic"],
              },
            ],
          },
          {
            id: "spring-renewal",
            name: "Spring Renewal",
            cards: [
              {
                id: 63,
                title: "Feelin' Lucky",
                cover: "/images/st-patricks-lucky.png",
                centerfold:
                  "May the luck of the Irish be with you today and always! Wishing you a pot of gold at the end of every rainbow, a four-leaf clover in every field, and a heart full of joy on this St. Patrick's Day. Slainte!",
                back: "Lucky to have you in my life!",
                tags: ["cheerful", "festive", "casual"],
              },
            ],
          },
          { id: "summer-fun", name: "Summer Fun", cards: [] },
        ],
      },
      {
        id: "just-because",
        name: "Just Because",
        color: "teal",
        subcategories: [
          { id: "random-love", name: "Random Love", cards: [] },
          { id: "funny", name: "Funny", cards: [] },
          { id: "sweet-surprise", name: "Sweet Surprise", cards: [] },
          { id: "no-reason-needed", name: "No Reason Needed", cards: [] },
        ],
      },
    ],
  },
];

function getAllCardsFromCategory(category: CategoryType): CardType[] {
  const cards: CardType[] = [];
  for (const sub of category.subcategories) {
    cards.push(...sub.cards);
  }
  return cards;
}

function getSubcategoryCardsByIds(categoryId: string, subcategoryId: string): CardType[] {
  for (const group of categoryGroups) {
    for (const cat of group.categories) {
      if (cat.id === categoryId) {
        const sub = cat.subcategories.find(s => s.id === subcategoryId);
        return sub?.cards || [];
      }
    }
  }
  return [];
}

export const cardCategories: Record<string, { name: string; color: string; group: string; cards: CardType[] }> = {};

for (const group of categoryGroups) {
  for (const category of group.categories) {
    cardCategories[category.id] = {
      name: category.name,
      color: category.color,
      group: group.name,
      cards: getAllCardsFromCategory(category),
    };
  }
}

cardCategories["valentines-day"] = cardCategories["love-romance"];
cardCategories["love"] = cardCategories["love-romance"];
cardCategories["get-well"] = cardCategories["get-well-soon"];
cardCategories["apology"] = cardCategories["im-sorry"];

cardCategories["miss-you"] = {
  name: "Miss You",
  color: "blue",
  group: "Support, Healing & Hard Moments",
  cards: getSubcategoryCardsByIds("thinking-of-you", "miss-you"),
};

cardCategories["halloween"] = {
  name: "Halloween",
  color: "orange",
  group: "Seasonal & Fun",
  cards: getSubcategoryCardsByIds("seasonal", "halloween"),
};

cardCategories["st-patricks-day"] = {
  name: "St. Patrick's Day",
  color: "green",
  group: "Seasonal & Fun",
  cards: getSubcategoryCardsByIds("seasonal", "spring-renewal"),
};

cardCategories["black-history-month"] = {
  name: "Black History Month",
  color: "red",
  group: "National & Civic Holidays",
  cards: getSubcategoryCardsByIds("black-american-cultural", "black-history-month"),
};

cardCategories["womens-history-month"] = {
  name: "Women's History Month",
  color: "purple",
  group: "Identity, Pride & Inclusion",
  cards: getSubcategoryCardsByIds("womens-history", "womens-history-month"),
};

cardCategories["pride-month"] = {
  name: "Pride Month",
  color: "rainbow",
  group: "Identity, Pride & Inclusion",
  cards: getSubcategoryCardsByIds("pride-lgbtq", "pride-month"),
};

cardCategories["new-years"] = {
  name: "New Year's Day",
  color: "gold",
  group: "National & Civic Holidays",
  cards: getSubcategoryCardsByIds("us-holidays", "new-years-day"),
};

cardCategories["mlk-day"] = {
  name: "Martin Luther King Jr. Day",
  color: "gold",
  group: "National & Civic Holidays",
  cards: getSubcategoryCardsByIds("us-holidays", "mlk-day"),
};

cardCategories["memorial-day"] = {
  name: "Memorial Day",
  color: "red",
  group: "National & Civic Holidays",
  cards: getSubcategoryCardsByIds("us-holidays", "memorial-day"),
};

cardCategories["fourth-of-july"] = {
  name: "Fourth of July",
  color: "red",
  group: "National & Civic Holidays",
  cards: getSubcategoryCardsByIds("us-holidays", "fourth-of-july"),
};

cardCategories["labor-day"] = {
  name: "Labor Day",
  color: "blue",
  group: "National & Civic Holidays",
  cards: getSubcategoryCardsByIds("us-holidays", "labor-day"),
};

cardCategories["veterans-day"] = {
  name: "Veterans Day",
  color: "navy",
  group: "National & Civic Holidays",
  cards: getSubcategoryCardsByIds("us-holidays", "veterans-day"),
};

cardCategories["thanksgiving"] = {
  name: "Thanksgiving",
  color: "orange",
  group: "National & Civic Holidays",
  cards: getSubcategoryCardsByIds("us-holidays", "thanksgiving"),
};

cardCategories["juneteenth"] = {
  name: "Juneteenth",
  color: "red",
  group: "National & Civic Holidays",
  cards: getSubcategoryCardsByIds("black-american-cultural", "juneteenth"),
};

cardCategories["christmas"] = {
  name: "Christmas",
  color: "red",
  group: "Religious, Spiritual & Cultural",
  cards: getSubcategoryCardsByIds("christian-holidays", "christmas"),
};

cardCategories["hanukkah"] = {
  name: "Hanukkah",
  color: "blue",
  group: "Religious, Spiritual & Cultural",
  cards: getSubcategoryCardsByIds("jewish-holidays", "hanukkah"),
};

cardCategories["kwanzaa"] = {
  name: "Kwanzaa",
  color: "green",
  group: "Religious, Spiritual & Cultural",
  cards: getSubcategoryCardsByIds("black-american-cultural", "kwanzaa"),
};

cardCategories["easter"] = {
  name: "Easter",
  color: "pastel",
  group: "Religious, Spiritual & Cultural",
  cards: getSubcategoryCardsByIds("christian-holidays", "easter"),
};

cardCategories["diwali"] = {
  name: "Diwali",
  color: "gold",
  group: "Religious, Spiritual & Cultural",
  cards: getSubcategoryCardsByIds("hindu-south-asian", "diwali"),
};

export function findCardById(cardId: number): { card: CardType; category: string; categoryName: string } | null {
  for (const group of categoryGroups) {
    for (const category of group.categories) {
      for (const subcategory of category.subcategories) {
        const card = subcategory.cards.find((c) => c.id === cardId);
        if (card) {
          return { card, category: category.id, categoryName: category.name };
        }
      }
    }
  }
  return null;
}

export function findSubcategoryById(subcategoryId: string): { subcategory: SubcategoryType; category: CategoryType; group: CategoryGroupType } | null {
  for (const group of categoryGroups) {
    for (const category of group.categories) {
      const subcategory = category.subcategories.find((s) => s.id === subcategoryId);
      if (subcategory) {
        return { subcategory, category, group };
      }
    }
  }
  return null;
}
