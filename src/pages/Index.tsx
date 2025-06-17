
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Calendar, PenTool, Sunrise, Moon, Sun, Flame, Star, Heart, Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import ReadingCalendar from '../components/ReadingCalendar';
import Journal from '../components/Journal';
import ThemeToggle from '../components/ThemeToggle';
import Confetti from '../components/Confetti';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAuth } from '../contexts/AuthContext';
import { useUserReadingProgress, useUserStreak } from '../hooks/useUserData';
import { bibleBooks } from '../data/bibleData';
import { getCurrentStreak, updateStreak } from '../utils/dateHelpers';

type Theme = 'light' | 'dark' | 'sunrise';
type ActiveTab = 'dashboard' | 'calendar' | 'journal';

const Index = () => {
  const { user, signOut } = useAuth();
  const [theme, setTheme] = useLocalStorage<Theme>('bible-tracker-theme', 'light');
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [userName, setUserName] = useLocalStorage<string>('bible-user-name', '');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { readChapters, toggleChapter, loading } = useUserReadingProgress();
  const { streak, lastReadDate, updateStreak: updateUserStreak } = useUserStreak();

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

  const handleToggleChapter = async (bookName: string, chapterNumber: number) => {
    const wasRead = await toggleChapter(bookName, chapterNumber);
    
    if (wasRead) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      
      // Update streak
      const newStreak = updateStreak(lastReadDate);
      updateUserStreak(newStreak);
    }
  };

  const currentStreak = getCurrentStreak(lastReadDate, streak);

  const displayName = user?.user_metadata?.full_name || user?.email || userName;

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    if (!user && !userName) {
      setShowNameInput(true);
    }
  }, [user, userName]);

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const navItems = [
    { key: 'dashboard' as const, icon: Star, label: 'Dashboard' },
    { key: 'calendar' as const, icon: Calendar, label: 'Reading' },
    { key: 'journal' as const, icon: PenTool, label: 'Journal' }
  ];

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
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
          
          <div className="flex items-center gap-4">
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <UserIcon className="h-4 w-4" />
                  {displayName}
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
              >
                <UserIcon className="h-4 w-4" />
                Sign In
              </Link>
            )}
            
            <ThemeToggle theme={theme} setTheme={setTheme} />
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-900 dark:text-white" />
              ) : (
                <Menu className="h-6 w-6 text-gray-900 dark:text-white" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 space-y-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Navigation</h2>
                
                {/* User info / Auth in mobile menu */}
                {user ? (
                  <div className="mb-6 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-2">
                      <UserIcon className="h-4 w-4" />
                      {displayName}
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-3 bg-blue-600 text-white rounded-lg mb-6"
                  >
                    <UserIcon className="h-4 w-4" />
                    Sign In to Save Progress
                  </Link>
                )}
                
                {navItems.map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => handleTabChange(key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === key
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Name Input Modal */}
      <AnimatePresence>
        {showNameInput && !user && (
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
              <p className="text-gray-600 dark:text-gray-300 mb-4">What should we call you? (Your progress won't be saved unless you sign in)</p>
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
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const input = document.querySelector('input') as HTMLInputElement;
                    const value = input?.value.trim();
                    if (value) {
                      setUserName(value);
                      setShowNameInput(false);
                    }
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Continue as Guest
                </button>
                <Link
                  to="/auth"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors text-center"
                  onClick={() => setShowNameInput(false)}
                >
                  Sign Up
                </Link>
              </div>
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
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {greeting}{displayName ? `, ${displayName}` : ''}! 
          </h2>
          
          {!user && (
            <div className="mb-4 p-3 bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded-lg">
              <p className="text-amber-800 dark:text-amber-200 text-sm">
                You're in guest mode. <Link to="/auth" className="font-medium underline hover:no-underline">Sign in</Link> to save your progress across devices.
              </p>
            </div>
          )}
          
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-4 px-4">
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

        {/* Navigation Tabs - Desktop */}
        <div className="hidden md:flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-1 flex gap-1 shadow-lg">
            {navItems.map(({ key, icon: Icon, label }) => (
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
                toggleChapter={handleToggleChapter}
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
