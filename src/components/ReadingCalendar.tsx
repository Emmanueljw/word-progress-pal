
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, BookOpen, Filter } from 'lucide-react';
import { BibleBook } from '../data/bibleData';

interface ReadingCalendarProps {
  readChapters: Record<string, number[]>;
  toggleChapter: (bookName: string, chapterNumber: number) => void;
  bibleBooks: BibleBook[];
}

const ReadingCalendar: React.FC<ReadingCalendarProps> = ({
  readChapters,
  toggleChapter,
  bibleBooks
}) => {
  const [selectedBook, setSelectedBook] = useState<string>(bibleBooks[0].name);
  const [testamentFilter, setTestamentFilter] = useState<'All' | 'Old' | 'New'>('All');
  const [showCompleted, setShowCompleted] = useState(true);

  const filteredBooks = bibleBooks.filter(book => {
    if (testamentFilter === 'All') return true;
    return book.testament === testamentFilter;
  });

  const selectedBookData = bibleBooks.find(book => book.name === selectedBook);
  const bookChapters = readChapters[selectedBook] || [];
  const bookProgress = selectedBookData ? Math.round((bookChapters.length / selectedBookData.chapters) * 100) : 0;

  const generateChapterGrid = () => {
    if (!selectedBookData) return [];
    
    const chapters = [];
    for (let i = 1; i <= selectedBookData.chapters; i++) {
      chapters.push(i);
    }
    return chapters;
  };

  const getBookProgress = (bookName: string) => {
    const book = bibleBooks.find(b => b.name === bookName);
    if (!book) return 0;
    const chapters = readChapters[bookName] || [];
    return Math.round((chapters.length / book.chapters) * 100);
  };

  const isBookCompleted = (bookName: string) => {
    const book = bibleBooks.find(b => b.name === bookName);
    if (!book) return false;
    const chapters = readChapters[bookName] || [];
    return chapters.length === book.chapters;
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          Reading Calendar
        </h2>
        
        <div className="flex flex-wrap gap-3">
          {/* Testament Filter */}
          <div className="relative">
            <select
              value={testamentFilter}
              onChange={(e) => setTestamentFilter(e.target.value as 'All' | 'Old' | 'New')}
              className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Books</option>
              <option value="Old">Old Testament</option>
              <option value="New">New Testament</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Show Completed Toggle */}
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              showCompleted 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            <Filter className="h-4 w-4" />
            Show Completed
          </button>
        </div>
      </div>

      {/* Book Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
          <div className="relative flex-1 max-w-md">
            <select
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
              className="appearance-none w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 pr-8 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {filteredBooks.map((book) => (
                <option key={book.name} value={book.name}>
                  {book.name} ({readChapters[book.name]?.length || 0}/{book.chapters})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Book Progress */}
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-300">Progress</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {bookProgress}%
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-6">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${bookProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Chapter Grid */}
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
          {generateChapterGrid().map((chapterNumber) => {
            const isRead = bookChapters.includes(chapterNumber);
            return (
              <motion.button
                key={chapterNumber}
                onClick={() => toggleChapter(selectedBook, chapterNumber)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative aspect-square rounded-lg border-2 transition-all duration-200 ${
                  isRead
                    ? 'bg-green-500 border-green-500 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}
              >
                <span className="text-sm font-medium">{chapterNumber}</span>
                {isRead && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Check className="h-4 w-4" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Books Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Books Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredBooks
            .filter(book => showCompleted || !isBookCompleted(book.name))
            .map((book) => {
              const progress = getBookProgress(book.name);
              const completed = isBookCompleted(book.name);
              
              return (
                <motion.button
                  key={book.name}
                  onClick={() => setSelectedBook(book.name)}
                  whileHover={{ scale: 1.02 }}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedBook === book.name
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : completed
                      ? 'border-green-300 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-medium text-sm ${
                      selectedBook === book.name
                        ? 'text-blue-700 dark:text-blue-300'
                        : completed
                        ? 'text-green-700 dark:text-green-300'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {book.name}
                    </span>
                    {completed && <Check className="h-4 w-4 text-green-500" />}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                    {readChapters[book.name]?.length || 0}/{book.chapters} chapters
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        completed ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </motion.button>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default ReadingCalendar;
