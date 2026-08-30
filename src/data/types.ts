export interface WordExample {
  hanzi: string;
  pinyin: string;
  meaning: string;
}

export interface Word {
  id: string;
  hanzi: string;
  pinyin: string;
  partOfSpeech: string;
  meaning: string;
  hsk: number;
  category: string;
  pronunciationTip: string;
  usageNote: string;
  example: WordExample;
}

export interface Sentence {
  id: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  hsk: number;
  category: string;
  usageNote: string;
}

export interface Category {
  slug: string;
  name: string;
  icon: string;
  description: string;
}
