import type { Category } from "./types";

export const categories: Category[] = [
  {
    slug: "greetings-basics",
    name: "Greetings & Basics",
    icon: "\u{1F44B}",
    description: "Hellos, goodbyes, politeness, and the words you'll use in almost every conversation.",
  },
  {
    slug: "numbers-time",
    name: "Numbers & Time",
    icon: "\u{1F550}",
    description: "Counting, dates, clock time, days of the week — the building blocks for scheduling your life.",
  },
  {
    slug: "family",
    name: "Family",
    icon: "\u{1F46A}",
    description: "Talking about parents, siblings, spouses, and relatives — Chinese has a title for everyone.",
  },
  {
    slug: "home",
    name: "At Home",
    icon: "\u{1F3E0}",
    description: "Rooms, furniture, chores, and everyday phrases for apartment and household life.",
  },
  {
    slug: "food-dining",
    name: "Food & Dining",
    icon: "\u{1F962}",
    description: "Ordering food, restaurant etiquette, tastes, and everyday meals.",
  },
  {
    slug: "shopping",
    name: "Shopping & Money",
    icon: "\u{1F6CD}️",
    description: "Bargaining, paying, sizes, and handling money in shops and markets.",
  },
  {
    slug: "workplace",
    name: "At the Workplace",
    icon: "\u{1F4BC}",
    description: "Meetings, emails, colleagues, and office small talk for your new job in China.",
  },
  {
    slug: "school",
    name: "At School",
    icon: "\u{1F3EB}",
    description: "Classrooms, studying, exams, and interacting with teachers and classmates.",
  },
  {
    slug: "travel-transport",
    name: "Travel & Transportation",
    icon: "✈️",
    description: "Airports, trains, taxis, and everything you need to get around China.",
  },
  {
    slug: "directions",
    name: "Directions & Places",
    icon: "\u{1F5FA}️",
    description: "Asking for and giving directions, and naming common places around a city.",
  },
  {
    slug: "health",
    name: "Health & Emergencies",
    icon: "\u{1FA7A}",
    description: "Describing symptoms, seeing a doctor, and asking for help in an emergency.",
  },
  {
    slug: "weather",
    name: "Weather & Seasons",
    icon: "☀️",
    description: "Talking about the weather, temperature, and seasons — great small-talk material.",
  },
  {
    slug: "emotions",
    name: "Feelings & Emotions",
    icon: "\u{1F60A}",
    description: "Expressing how you feel, from happy and tired to nervous and proud.",
  },
  {
    slug: "people-appearance",
    name: "People & Appearance",
    icon: "\u{1F9CD}",
    description: "Describing people's looks, personality, and age.",
  },
  {
    slug: "technology-phone",
    name: "Technology & Phone",
    icon: "\u{1F4F1}",
    description: "Phones, apps, WeChat, the internet, and other everyday tech vocabulary.",
  },
  {
    slug: "social-smalltalk",
    name: "Social & Small Talk",
    icon: "\u{1F4AC}",
    description: "Making friends, invitations, and the everyday chit-chat that builds relationships.",
  },
  {
    slug: "hobbies-leisure",
    name: "Hobbies & Leisure",
    icon: "⚽",
    description: "Sports, music, movies, and talking about what you do for fun.",
  },
  {
    slug: "daily-routine",
    name: "Daily Routine",
    icon: "\u{1F31B}",
    description: "Waking up, commuting, and the everyday actions that make up your day.",
  },
  {
    slug: "money-banking",
    name: "Money & Banking",
    icon: "\u{1F3E6}",
    description: "Opening accounts, transfers, exchange rates, and managing money as a resident.",
  },
  {
    slug: "idioms-proverbs",
    name: "Idioms & Proverbs",
    icon: "\u{1F4DC}",
    description: "Classic chengyu and sayings that make your Chinese sound natural and culturally fluent.",
  },
  {
    slug: "measure-words",
    name: "Measure Words",
    icon: "\u{1F522}",
    description: "The tricky little counting words (个/张/条/杯...) that go with every noun in Chinese.",
  },
  {
    slug: "emergency-safety",
    name: "Emergency & Safety",
    icon: "\u{1F6A8}",
    description: "Police, fire, lost documents, and the phrases you hope to never need but should still know.",
  },
  {
    slug: "clothing-appearance",
    name: "Clothing",
    icon: "\u{1F455}",
    description: "Clothing items, colors, sizes, and fit — everything for shopping and dressing for the season.",
  },
  {
    slug: "relationships-dating",
    name: "Relationships & Dating",
    icon: "\u{1F495}",
    description: "Dating, relationships, marriage, and the ups and downs of romantic life.",
  },
  {
    slug: "essential-basics",
    name: "Essential Basics",
    icon: "\u{1F9F1}",
    description: "Core HSK1 building blocks — question words, common verbs, adjectives, and connectors used in almost every sentence.",
  },
  {
    slug: "common-verbs",
    name: "Common Verbs",
    icon: "\u{1F3C3}",
    description: "40 everyday action verbs (say, go, come, use, help, write...) each put to work in many different sentences, so you see how they actually get used.",
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
