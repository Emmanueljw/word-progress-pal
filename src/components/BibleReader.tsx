
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { bibleVersions } from '../data/bibleVersions';
import { bibleBooks } from '../data/bibleData';
import { useBibleAPI } from '../hooks/useBibleAPI';

const BibleReader = () => {
  const [selectedVersion, setSelectedVersion] = useState('kjv');
  const [selectedBook, setSelectedBook] = useState('Genesis');
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [fontSize, setFontSize] = useState('text-base');
  const [chapterData, setChapterData] = useState<any>(null);

  const { fetchChapter, loading, error } = useBibleAPI();

  const currentBookData = bibleBooks.find(book => book.name === selectedBook);

  // Load chapter data when book, chapter, or version changes
  useEffect(() => {
    loadChapter();
  }, [selectedBook, selectedChapter, selectedVersion]);

  const loadChapter = async () => {
    const data = await fetchChapter(selectedBook, selectedChapter, selectedVersion);
    setChapterData(data);
  };

  const handlePreviousChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(selectedChapter - 1);
    } else {
      // Go to previous book's last chapter
      const currentBookIndex = bibleBooks.findIndex(book => book.name === selectedBook);
      if (currentBookIndex > 0) {
        const previousBook = bibleBooks[currentBookIndex - 1];
        setSelectedBook(previousBook.name);
        setSelectedChapter(previousBook.chapters);
      }
    }
  };

  const handleNextChapter = () => {
    if (currentBookData && selectedChapter < currentBookData.chapters) {
      setSelectedChapter(selectedChapter + 1);
    } else {
      // Go to next book's first chapter
      const currentBookIndex = bibleBooks.findIndex(book => book.name === selectedBook);
      if (currentBookIndex < bibleBooks.length - 1) {
        const nextBook = bibleBooks[currentBookIndex + 1];
        setSelectedBook(nextBook.name);
        setSelectedChapter(1);
      }
    }
  };

  const generateChapterOptions = () => {
    if (!currentBookData) return [];
    return Array.from({ length: currentBookData.chapters }, (_, i) => i + 1);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Bible Reader
          </h2>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Version Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Version
            </label>
            <Select value={selectedVersion} onValueChange={setSelectedVersion}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {bibleVersions.map((version) => (
                  <SelectItem key={version.id} value={version.id}>
                    {version.abbreviation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Book Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Book
            </label>
            <Select value={selectedBook} onValueChange={(value) => {
              setSelectedBook(value);
              setSelectedChapter(1);
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {bibleBooks.map((book) => (
                  <SelectItem key={book.name} value={book.name}>
                    {book.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Chapter Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Chapter
            </label>
            <Select value={selectedChapter.toString()} onValueChange={(value) => setSelectedChapter(parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {generateChapterOptions().map((chapter) => (
                  <SelectItem key={chapter} value={chapter.toString()}>
                    {chapter}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Font Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Font Size
            </label>
            <Select value={fontSize} onValueChange={setFontSize}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text-sm">Small</SelectItem>
                <SelectItem value="text-base">Medium</SelectItem>
                <SelectItem value="text-lg">Large</SelectItem>
                <SelectItem value="text-xl">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Chapter Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handlePreviousChapter}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors disabled:opacity-50"
            disabled={selectedBook === bibleBooks[0].name && selectedChapter === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {selectedBook} {selectedChapter}
          </h3>

          <button
            onClick={handleNextChapter}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors disabled:opacity-50"
            disabled={selectedBook === bibleBooks[bibleBooks.length - 1].name && currentBookData && selectedChapter === currentBookData.chapters}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Bible Text */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600 dark:text-gray-300">Loading chapter...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8 text-red-600 dark:text-red-400">
              <AlertCircle className="h-6 w-6 mr-2" />
              <span>{error}</span>
            </div>
          ) : chapterData?.verses?.length > 0 ? (
            <div className={`space-y-4 ${fontSize} leading-relaxed text-gray-900 dark:text-white`}>
              {chapterData.verses.map((verse: any) => (
                <p key={verse.verse} className="flex gap-3">
                  <span className="font-bold text-blue-600 dark:text-blue-400 min-w-[2rem]">
                    {verse.verse}
                  </span>
                  <span>{verse.text}</span>
                </p>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No content available for this chapter.
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                The Bible API may not have this chapter available in the selected version.
              </p>
            </div>
          )}
        </div>

        {/* Version Info */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>{bibleVersions.find(v => v.id === selectedVersion)?.name}:</strong>{' '}
            {bibleVersions.find(v => v.id === selectedVersion)?.description}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default BibleReader;
