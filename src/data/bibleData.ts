
export interface BibleBook {
  name: string;
  chapters: number;
  testament: 'Old' | 'New';
  abbreviation: string;
}

export const bibleBooks: BibleBook[] = [
  // Old Testament
  { name: 'Genesis', chapters: 50, testament: 'Old', abbreviation: 'Gen' },
  { name: 'Exodus', chapters: 40, testament: 'Old', abbreviation: 'Exo' },
  { name: 'Leviticus', chapters: 27, testament: 'Old', abbreviation: 'Lev' },
  { name: 'Numbers', chapters: 36, testament: 'Old', abbreviation: 'Num' },
  { name: 'Deuteronomy', chapters: 34, testament: 'Old', abbreviation: 'Deu' },
  { name: 'Joshua', chapters: 24, testament: 'Old', abbreviation: 'Jos' },
  { name: 'Judges', chapters: 21, testament: 'Old', abbreviation: 'Jdg' },
  { name: 'Ruth', chapters: 4, testament: 'Old', abbreviation: 'Rut' },
  { name: '1 Samuel', chapters: 31, testament: 'Old', abbreviation: '1Sa' },
  { name: '2 Samuel', chapters: 24, testament: 'Old', abbreviation: '2Sa' },
  { name: '1 Kings', chapters: 22, testament: 'Old', abbreviation: '1Ki' },
  { name: '2 Kings', chapters: 25, testament: 'Old', abbreviation: '2Ki' },
  { name: '1 Chronicles', chapters: 29, testament: 'Old', abbreviation: '1Ch' },
  { name: '2 Chronicles', chapters: 36, testament: 'Old', abbreviation: '2Ch' },
  { name: 'Ezra', chapters: 10, testament: 'Old', abbreviation: 'Ezr' },
  { name: 'Nehemiah', chapters: 13, testament: 'Old', abbreviation: 'Neh' },
  { name: 'Esther', chapters: 10, testament: 'Old', abbreviation: 'Est' },
  { name: 'Job', chapters: 42, testament: 'Old', abbreviation: 'Job' },
  { name: 'Psalms', chapters: 150, testament: 'Old', abbreviation: 'Psa' },
  { name: 'Proverbs', chapters: 31, testament: 'Old', abbreviation: 'Pro' },
  { name: 'Ecclesiastes', chapters: 12, testament: 'Old', abbreviation: 'Ecc' },
  { name: 'Song of Solomon', chapters: 8, testament: 'Old', abbreviation: 'Son' },
  { name: 'Isaiah', chapters: 66, testament: 'Old', abbreviation: 'Isa' },
  { name: 'Jeremiah', chapters: 52, testament: 'Old', abbreviation: 'Jer' },
  { name: 'Lamentations', chapters: 5, testament: 'Old', abbreviation: 'Lam' },
  { name: 'Ezekiel', chapters: 48, testament: 'Old', abbreviation: 'Eze' },
  { name: 'Daniel', chapters: 12, testament: 'Old', abbreviation: 'Dan' },
  { name: 'Hosea', chapters: 14, testament: 'Old', abbreviation: 'Hos' },
  { name: 'Joel', chapters: 3, testament: 'Old', abbreviation: 'Joe' },
  { name: 'Amos', chapters: 9, testament: 'Old', abbreviation: 'Amo' },
  { name: 'Obadiah', chapters: 1, testament: 'Old', abbreviation: 'Oba' },
  { name: 'Jonah', chapters: 4, testament: 'Old', abbreviation: 'Jon' },
  { name: 'Micah', chapters: 7, testament: 'Old', abbreviation: 'Mic' },
  { name: 'Nahum', chapters: 3, testament: 'Old', abbreviation: 'Nah' },
  { name: 'Habakkuk', chapters: 3, testament: 'Old', abbreviation: 'Hab' },
  { name: 'Zephaniah', chapters: 3, testament: 'Old', abbreviation: 'Zep' },
  { name: 'Haggai', chapters: 2, testament: 'Old', abbreviation: 'Hag' },
  { name: 'Zechariah', chapters: 14, testament: 'Old', abbreviation: 'Zec' },
  { name: 'Malachi', chapters: 4, testament: 'Old', abbreviation: 'Mal' },

  // New Testament
  { name: 'Matthew', chapters: 28, testament: 'New', abbreviation: 'Mat' },
  { name: 'Mark', chapters: 16, testament: 'New', abbreviation: 'Mar' },
  { name: 'Luke', chapters: 24, testament: 'New', abbreviation: 'Luk' },
  { name: 'John', chapters: 21, testament: 'New', abbreviation: 'Joh' },
  { name: 'Acts', chapters: 28, testament: 'New', abbreviation: 'Act' },
  { name: 'Romans', chapters: 16, testament: 'New', abbreviation: 'Rom' },
  { name: '1 Corinthians', chapters: 16, testament: 'New', abbreviation: '1Co' },
  { name: '2 Corinthians', chapters: 13, testament: 'New', abbreviation: '2Co' },
  { name: 'Galatians', chapters: 6, testament: 'New', abbreviation: 'Gal' },
  { name: 'Ephesians', chapters: 6, testament: 'New', abbreviation: 'Eph' },
  { name: 'Philippians', chapters: 4, testament: 'New', abbreviation: 'Phi' },
  { name: 'Colossians', chapters: 4, testament: 'New', abbreviation: 'Col' },
  { name: '1 Thessalonians', chapters: 5, testament: 'New', abbreviation: '1Th' },
  { name: '2 Thessalonians', chapters: 3, testament: 'New', abbreviation: '2Th' },
  { name: '1 Timothy', chapters: 6, testament: 'New', abbreviation: '1Ti' },
  { name: '2 Timothy', chapters: 4, testament: 'New', abbreviation: '2Ti' },
  { name: 'Titus', chapters: 3, testament: 'New', abbreviation: 'Tit' },
  { name: 'Philemon', chapters: 1, testament: 'New', abbreviation: 'Phm' },
  { name: 'Hebrews', chapters: 13, testament: 'New', abbreviation: 'Heb' },
  { name: 'James', chapters: 5, testament: 'New', abbreviation: 'Jam' },
  { name: '1 Peter', chapters: 5, testament: 'New', abbreviation: '1Pe' },
  { name: '2 Peter', chapters: 3, testament: 'New', abbreviation: '2Pe' },
  { name: '1 John', chapters: 5, testament: 'New', abbreviation: '1Jo' },
  { name: '2 John', chapters: 1, testament: 'New', abbreviation: '2Jo' },
  { name: '3 John', chapters: 1, testament: 'New', abbreviation: '3Jo' },
  { name: 'Jude', chapters: 1, testament: 'New', abbreviation: 'Jud' },
  { name: 'Revelation', chapters: 22, testament: 'New', abbreviation: 'Rev' }
];

export const getTotalChapters = () => {
  return bibleBooks.reduce((sum, book) => sum + book.chapters, 0);
};

export const getTestamentBooks = (testament: 'Old' | 'New') => {
  return bibleBooks.filter(book => book.testament === testament);
};

export const getBookByName = (name: string) => {
  return bibleBooks.find(book => book.name === name);
};
