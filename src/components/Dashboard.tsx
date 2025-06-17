
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Target, Calendar, Trophy, Flame, Star } from 'lucide-react';
import { BibleBook } from '../data/bibleData';

interface DashboardProps {
  readChapters: Record<string, number[]>;
  totalChapters: number;
  readChapterCount: number;
  progressPercentage: number;
  streak: number;
  bibleBooks: BibleBook[];
}

const Dashboard: React.FC<DashboardProps> = ({
  readChapters,
  totalChapters,
  readChapterCount,
  progressPercentage,
  streak,
  bibleBooks
}) => {
  const oldTestamentBooks = bibleBooks.filter(book => book.testament === 'Old');
  const newTestamentBooks = bibleBooks.filter(book => book.testament === 'New');
  
  const oldTestamentTotal = oldTestamentBooks.reduce((sum, book) => sum + book.chapters, 0);
  const newTestamentTotal = newTestamentBooks.reduce((sum, book) => sum + book.chapters, 0);
  
  const oldTestamentRead = oldTestamentBooks.reduce((sum, book) => {
    return sum + (readChapters[book.name]?.length || 0);
  }, 0);
  
  const newTestamentRead = newTestamentBooks.reduce((sum, book) => {
    return sum + (readChapters[book.name]?.length || 0);
  }, 0);
  
  const oldTestamentProgress = Math.round((oldTestamentRead / oldTestamentTotal) * 100);
  const newTestamentProgress = Math.round((newTestamentRead / newTestamentTotal) * 100);
  
  const completedBooks = bibleBooks.filter(book => {
    const bookChapters = readChapters[book.name] || [];
    return bookChapters.length === book.chapters;
  }).length;

  const getStreakIcon = (streakDays: number) => {
    if (streakDays >= 100) return '🔥';
    if (streakDays >= 30) return '⭐';
    if (streakDays >= 7) return '💫';
    return '🌟';
  };

  const getStreakMessage = (streakDays: number) => {
    if (streakDays >= 100) return 'Incredible dedication!';
    if (streakDays >= 30) return 'Amazing consistency!';
    if (streakDays >= 7) return 'Great habit building!';
    if (streakDays >= 1) return 'Keep it up!';
    return 'Start your journey today!';
  };

  const stats = [
    {
      title: 'Chapters Read',
      value: readChapterCount,
      total: totalChapters,
      icon: BookOpen,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      title: 'Books Completed',
      value: completedBooks,
      total: 66,
      icon: Trophy,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30'
    },
    {
      title: 'Current Streak',
      value: streak,
      total: null,
      icon: Flame,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30'
    },
    {
      title: 'Overall Progress',
      value: progressPercentage,
      total: null,
      suffix: '%',
      icon: Target,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Main Progress Circle */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center"
      >
        <div className="relative w-64 h-64">
          <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke="url(#gradient)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - progressPercentage / 100) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 dark:text-white">
                {progressPercentage}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Complete
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600 dark:text-gray-300">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}{stat.suffix || ''}
                {stat.total && (
                  <span className="text-lg text-gray-500 dark:text-gray-400">
                    /{stat.total}
                  </span>
                )}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Streak Celebration */}
      {streak > 0 && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-r from-orange-400 to-red-500 rounded-xl p-6 text-white text-center"
        >
          <div className="text-4xl mb-2">{getStreakIcon(streak)}</div>
          <h3 className="text-xl font-bold mb-1">{streak} Day Streak!</h3>
          <p className="opacity-90">{getStreakMessage(streak)}</p>
        </motion.div>
      )}

      {/* Testament Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Old Testament */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Old Testament
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Progress</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {oldTestamentRead}/{oldTestamentTotal} chapters
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${oldTestamentProgress}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <div className="text-right text-sm font-medium text-blue-600 dark:text-blue-400">
              {oldTestamentProgress}%
            </div>
          </div>
        </motion.div>

        {/* New Testament */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            New Testament
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Progress</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {newTestamentRead}/{newTestamentTotal} chapters
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-green-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${newTestamentProgress}%` }}
                transition={{ duration: 1, delay: 0.6 }}
              />
            </div>
            <div className="text-right text-sm font-medium text-green-600 dark:text-green-400">
              {newTestamentProgress}%
            </div>
          </div>
        </motion.div>
      </div>

      {/* Milestones */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Milestones
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[25, 50, 75, 100].map((milestone) => (
            <div
              key={milestone}
              className={`text-center p-4 rounded-lg border-2 transition-all ${
                progressPercentage >= milestone
                  ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
                  : 'border-gray-200 dark:border-gray-600'
              }`}
            >
              <div className={`text-2xl mb-1 ${
                progressPercentage >= milestone ? 'text-yellow-500' : 'text-gray-400'
              }`}>
                {progressPercentage >= milestone ? '🏆' : '⚪'}
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {milestone}%
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
