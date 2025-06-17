
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Edit3, Save, Search, Download } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface JournalEntry {
  date: string;
  content: string;
}

const Journal: React.FC = () => {
  const [entries, setEntries] = useLocalStorage<Record<string, string>>('bible-journal-entries', {});
  const [currentEntry, setCurrentEntry] = useState('');
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    setCurrentEntry(entries[selectedDate] || '');
  }, [selectedDate, entries]);

  const saveEntry = () => {
    if (currentEntry.trim()) {
      setEntries(prev => ({
        ...prev,
        [selectedDate]: currentEntry
      }));
      setEditingDate(null);
    }
  };

  const deleteEntry = (date: string) => {
    setEntries(prev => {
      const newEntries = { ...prev };
      delete newEntries[date];
      return newEntries;
    });
  };

  const filteredEntries = Object.entries(entries)
    .filter(([date, content]) => 
      content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(date).toLocaleDateString().includes(searchTerm)
    )
    .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime());

  const exportEntries = () => {
    const exportData = Object.entries(entries)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([date, content]) => `## ${new Date(date).toLocaleDateString()}\n\n${content}\n\n`)
      .join('---\n\n');

    const blob = new Blob([exportData], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bible-journal-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isToday = selectedDate === today;
  const hasUnsavedChanges = currentEntry !== (entries[selectedDate] || '');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Edit3 className="h-6 w-6" />
          Reading Journal
        </h2>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportEntries}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Writing Area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Date Selector */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {isToday && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                  Today
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatDate(selectedDate)}
            </h3>
          </div>

          {/* Entry Editor */}
          <motion.div
            layout
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                {isToday ? "Today's Reflection" : "Entry"}
              </h4>
              {hasUnsavedChanges && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={saveEntry}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  Save
                </motion.button>
              )}
            </div>
            
            <textarea
              value={currentEntry}
              onChange={(e) => setCurrentEntry(e.target.value)}
              onBlur={saveEntry}
              placeholder={isToday ? 
                "What did God teach you today? How did the reading impact your heart? Write your thoughts and reflections here..." :
                "Write your thoughts and reflections for this day..."
              }
              className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              autoFocus={isToday}
            />
            
            <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              {currentEntry.length} characters
              {hasUnsavedChanges && (
                <span className="ml-2 text-amber-600 dark:text-amber-400">
                  • Unsaved changes
                </span>
              )}
            </div>
          </motion.div>
        </div>

        {/* Previous Entries */}
        <div className="space-y-4">
          {/* Search */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Entries List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-900 dark:text-white">
                Previous Entries ({filteredEntries.length})
              </h4>
            </div>
            
            <AnimatePresence>
              {filteredEntries.length === 0 ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  {searchTerm ? 'No entries match your search.' : 'No entries yet. Start writing your first reflection!'}
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredEntries.map(([date, content]) => (
                    <motion.div
                      key={date}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedDate === date
                          ? 'bg-blue-50 dark:bg-blue-900/20'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                      onClick={() => setSelectedDate(date)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(date).toLocaleDateString()}
                        </span>
                        {date === today && (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                            Today
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {content.substring(0, 100)}
                        {content.length > 100 && '...'}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journal;
