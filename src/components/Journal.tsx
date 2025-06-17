import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PenTool, Search, Download, Calendar } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const Journal = () => {
  const [entries, setEntries] = useLocalStorage<Record<string, string>>('bible-journal-entries', {});
  const [currentEntry, setCurrentEntry] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingDate, setEditingDate] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    setCurrentEntry(entries[today] || '');
  }, [entries, today]);

  const saveEntry = (date: string, content: string) => {
    setEntries(prev => ({
      ...prev,
      [date]: content
    }));
  };

  const handleSave = () => {
    if (currentEntry.trim()) {
      saveEntry(today, currentEntry);
    }
  };

  const handleEditEntry = (date: string, content: string) => {
    setEntries(prev => ({
      ...prev,
      [date]: content
    }));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentEntry.trim() && currentEntry !== (entries[today] || '')) {
        handleSave();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentEntry]);

  const exportEntries = () => {
    const exportData = Object.entries(entries)
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
      .map(([date, entry]) => `# ${new Date(date).toLocaleDateString()}\n\n${entry}\n\n---\n`)
      .join('\n');

    const blob = new Blob([exportData], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bible-journal.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredEntries = Object.entries(entries)
    .filter(([date, entry]) => 
      entry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(date).toLocaleDateString().toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <PenTool className="h-6 w-6" />
          Reading Journal
        </h2>
        <button
          onClick={exportEntries}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      {/* Today's Entry */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Today's Reflection - {new Date().toLocaleDateString()}
        </h3>
        <textarea
          value={currentEntry}
          onChange={(e) => setCurrentEntry(e.target.value)}
          placeholder="Write your thoughts, prayers, and reflections from today's reading..."
          className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Auto-saves as you type
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search your entries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      {/* Previous Entries */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Previous Entries</h3>
        {filteredEntries.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            {searchTerm ? 'No entries match your search.' : 'No previous entries yet. Start writing!'}
          </p>
        ) : (
          filteredEntries.map(([date, entry]) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {new Date(date).toLocaleDateString()}
                </h4>
                {editingDate === date ? (
                  <button
                    onClick={() => setEditingDate(null)}
                    className="text-green-600 hover:text-green-700 text-sm"
                  >
                    Done
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingDate(date)}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Edit
                  </button>
                )}
              </div>
              {editingDate === date ? (
                <textarea
                  value={entry}
                  onChange={(e) => handleEditEntry(date, e.target.value)}
                  className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              ) : (
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{entry}</p>
              )}
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default Journal;
