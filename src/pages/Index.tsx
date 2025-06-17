
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Calendar, PenTool, Sunrise, Moon, Sun, Flame, Star, Heart } from 'lucide-react';
import Dashboard from '../components/Dashboard';
import ReadingCalendar from '../components/ReadingCalendar';
import Journal from '../components/Journal';
import ThemeToggle from '../components/ThemeToggle';
import Confetti from '../components/Confetti';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { bibleBooks } from '../data/bibleData';
import { getCurrentStreak, updateStreak } from '../utils/dateHelpers';

type Theme = 'light' | 'dark' | 'sunrise';
type ActiveTab = 'dashboard' | 'calendar' | 'journal';

const Index = () => {
  const [theme, setTheme] = useLocalStorage<Theme>('bible-tracker-theme', 'light');
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [readChapters, setReadChapters] = useLocalStorage<Record<string, number[]>>('bible-read-chapters', {});
  const [streak, setStreak] = useLocalStorage<number>('bible-reading-streak', 0);
  const [lastReadDate, setLastReadDate] = useLocalStorage<string>('bible-last-read-date', '');
  const [userName, setUserName] = useLocalStorage<string>('bible-user-name', '');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';
  
  const motivationalMessages = [
    "You are growing in the Word! 🌱",
    "Every chapter brings you closer to God! ✨",
    "Your consistency is inspiring! 🙏",
    "Keep building that spiritual muscle! 💪",
    "The Word is transforming you daily! 🦋",
    "You're making God smile today! 😊"
  ];

  const dailyVerses = [
    "\"For I know the plans I have for you,\" declares the Lord, \"plans to prosper you and not to harm you, to give you hope and a future.\" - Jeremiah 29:11",
    "\"Trust in the Lord with all your heart and lean not on your own understanding.\" - Proverbs 3:5",
    "\"I can do all this through him who gives me strength.\" - Philippians 4:13",
    "\"The Lord your God is with you, the Mighty Warrior who saves.\" - Zephaniah 3:17",
    "\"Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.\" - Joshua 1:9"
  ];

  const todayVerse = dailyVerses[new Date().getDay() % dailyVerses.length];
  const showMotivation = Math.random() < 0.2;
  const motivationMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  const totalChapters = bibleBooks.reduce((sum, book) => sum + book.chapters, 0);
  const readChapterCount = Object.values(readChapters).reduce((sum, chapters) => sum + chapters.length, 0);
  const progressPercentage = Math.round((readChapterCount / totalChapters) * 100);

  const toggleChapter = (bookName: string, chapterNumber: number) => {
    setReadChapters(prev => {
      const bookChapters = prev[bookName] || [];
      const isRead = bookChapters.includes(chapterNumber);
      
      let newChapters;
      if (isRead) {
        newChapters = bookChapters.filter(ch => ch !== chapterNumber);
      } else {
        newChapters = [...bookChapters, chapterNumber].sort((a, b) => a - b);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        
        // Update streak
        const newStreak = updateStreak(lastReadDate);
        setStreak(newStreak);
        setLastReadDate(new Date().toISOString().split('T')[0]);
      }
      
      return {
        ...prev,
        [bookName]: newChapters
      };
    });
  };

  const currentStreak = getCurrentStreak(lastReadDate, streak);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    if (!userName) {
      setShowNameInput(true);
    }
  }, [userName]);

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      theme === 'light' ? 'bg-gradient-to-br from-blue-50 to-indigo-100' :
      theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-blue-900' :
      'bg-gradient-to-br from-orange-100 via-pink-50 to-purple-100'
    }`}>
      {showConfetti && <Confetti />}
      
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bible Tracker</h1>
          </div>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </header>

      {/* Name Input Modal */}
      <AnimatePresence>
        {showNameInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Welcome to your Bible journey!</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">What should we call you?</p>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full px-4 py-2 border rounded-lg mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const value = (e.target as HTMLInputElement).value.trim();
                    if (value) {
                      setUserName(value);
                      setShowNameInput(false);
                    }
                  }
                }}
                autoFocus
              />
              <button
                onClick={() => {
                  const input = document.querySelector('input') as HTMLInputElement;
                  const value = input?.value.trim();
                  if (value) {
                    setUserName(value);
                    setShowNameInput(false);
                  }
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Let's Begin! 🙏
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {greeting}{userName ? `, ${userName}` : ''}! 
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-4">
            {todayVerse}
          </p>
          {showMotivation && (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-amber-600 dark:text-amber-400 font-medium"
            >
              {motivationMessage}
            </motion.p>
          )}
          
          {/* Streak Display */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <Flame className="h-6 w-6 text-orange-500" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {currentStreak} day streak
            </span>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-1 flex gap-1 shadow-lg">
            {[
              { key: 'dashboard' as const, icon: Star, label: 'Dashboard' },
              { key: 'calendar' as const, icon: Calendar, label: 'Reading' },
              { key: 'journal' as const, icon: PenTool, label: 'Journal' }
            ].map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                  activeTab === key
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'dashboard' && (
              <Dashboard
                readChapters={readChapters}
                totalChapters={totalChapters}
                readChapterCount={readChapterCount}
                progressPercentage={progressPercentage}
                streak={currentStreak}
                bibleBooks={bibleBooks}
              />
            )}
            {activeTab === 'calendar' && (
              <ReadingCalendar
                readChapters={readChapters}
                toggleChapter={toggleChapter}
                bibleBooks={bibleBooks}
              />
            )}
            {activeTab === 'journal' && <Journal />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
