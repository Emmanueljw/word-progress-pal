
export interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface BibleVersion {
  id: string;
  name: string;
  abbreviation: string;
  description: string;
}

export const bibleVersions: BibleVersion[] = [
  {
    id: 'kjv',
    name: 'King James Version',
    abbreviation: 'KJV',
    description: 'Classic English translation from 1611'
  },
  {
    id: 'nkjv',
    name: 'New King James Version',
    abbreviation: 'NKJV',
    description: 'Modern English update of the KJV'
  },
  {
    id: 'niv',
    name: 'New International Version',
    abbreviation: 'NIV',
    description: 'Contemporary English translation'
  }
];

// Sample Bible text data - in a real app, this would come from an API or database
export const sampleBibleText: Record<string, Record<string, BibleVerse[]>> = {
  kjv: {
    'Genesis-1': [
      { book: 'Genesis', chapter: 1, verse: 1, text: 'In the beginning God created the heaven and the earth.' },
      { book: 'Genesis', chapter: 1, verse: 2, text: 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.' },
      { book: 'Genesis', chapter: 1, verse: 3, text: 'And God said, Let there be light: and there was light.' },
      // Add more verses as needed
    ],
    'John-3': [
      { book: 'John', chapter: 3, verse: 16, text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.' },
      { book: 'John', chapter: 3, verse: 17, text: 'For God sent not his Son into the world to condemn the world; but that the world through him might be saved.' },
    ]
  },
  niv: {
    'Genesis-1': [
      { book: 'Genesis', chapter: 1, verse: 1, text: 'In the beginning God created the heavens and the earth.' },
      { book: 'Genesis', chapter: 1, verse: 2, text: 'Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.' },
      { book: 'Genesis', chapter: 1, verse: 3, text: 'And God said, "Let there be light," and there was light.' },
    ],
    'John-3': [
      { book: 'John', chapter: 3, verse: 16, text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.' },
      { book: 'John', chapter: 3, verse: 17, text: 'For God did not send his Son into the world to condemn the world, but to save the world through him.' },
    ]
  },
  nkjv: {
    'Genesis-1': [
      { book: 'Genesis', chapter: 1, verse: 1, text: 'In the beginning God created the heavens and the earth.' },
      { book: 'Genesis', chapter: 1, verse: 2, text: 'The earth was without form, and void; and darkness was on the face of the deep. And the Spirit of God was hovering over the face of the waters.' },
      { book: 'Genesis', chapter: 1, verse: 3, text: 'Then God said, "Let there be light"; and there was light.' },
    ],
    'John-3': [
      { book: 'John', chapter: 3, verse: 16, text: 'For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish but have everlasting life.' },
      { book: 'John', chapter: 3, verse: 17, text: 'For God did not send His Son into the world to condemn the world, but that the world through Him might be saved.' },
    ]
  }
};
