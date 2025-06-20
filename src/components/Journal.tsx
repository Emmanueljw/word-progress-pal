import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PenTool, Save, Calendar, Heart, Search, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../integrations/supabase/client';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface JournalEntry {
  id: string;
  date: string;
  content: string;
  title?: string;
}

const Journal = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Local storage for guest users
  const [localEntries, setLocalEntries] = useLocalStorage<JournalEntry[]>('bible-journal-entries', []);

  // Load entries on component mount
  useEffect(() => {
    if (user) {
      loadEntriesFromDB();
    } else {
      setEntries(localEntries);
    }
  }, [user, localEntries]);

  const loadEntriesFromDB = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('entry_date', { ascending: false });

      if (error) throw error;

      const formattedEntries = data?.map(entry => ({
        id: entry.id,
        date: entry.entry_date,
        content: entry.content,
        title: entry.content.split('\n')[0].substring(0, 50) || 'Untitled'
      })) || [];

      setEntries(formattedEntries);
    } catch (error) {
      console.error('Error loading journal entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveEntry = async () => {
    if (!currentEntry.trim()) return;

    const newEntry: JournalEntry = {
      id: editingId || Date.now().toString(),
      date: selectedDate,
      content: currentEntry,
      title: currentTitle || currentEntry.split('\n')[0].substring(0, 50) || 'Untitled'
    };

    if (user) {
      // Save to database
      try {
        if (editingId) {
          await supabase
            .from('journal_entries')
            .update({
              content: currentEntry,
              entry_date: selectedDate,
              updated_at: new Date().toISOString()
            })
            .eq('id', editingId)
            .eq('user_id', user.id);
        } else {
          await supabase
            .from('journal_entries')
            .insert({
              user_id: user.id,
              content: currentEntry,
              entry_date: selectedDate
            });
        }
        loadEntriesFromDB();
      } catch (error) {
        console.error('Error saving journal entry:', error);
      }
    } else {
      // Save to local storage
      if (editingId) {
        const updatedEntries = localEntries.map(entry => 
          entry.id === editingId ? newEntry : entry
        );
        setLocalEntries(updatedEntries);
      } else {
        const updatedEntries = [newEntry, ...localEntries];
        setLocalEntries(updatedEntries);
      }
    }

    // Reset form
    setCurrentEntry('');
    setCurrentTitle('');
    setEditingId(null);
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const editEntry = (entry: JournalEntry) => {
    setCurrentEntry(entry.content);
    setCurrentTitle(entry.title || '');
    setSelectedDate(entry.date);
    setEditingId(entry.id);
  };

  const deleteEntry = async (id: string) => {
    if (user) {
      try {
        await supabase
          .from('journal_entries')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);
        loadEntriesFromDB();
      } catch (error) {
        console.error('Error deleting journal entry:', error);
      }
    } else {
      const updatedEntries = localEntries.filter(entry => entry.id !== id);
      setLocalEntries(updatedEntries);
    }
  };

  const filteredEntries = entries.filter(entry =>
    entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <PenTool className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Spiritual Journal
          </h2>
        </div>

        {!user && (
          <div className="mb-4 p-3 bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded-lg">
            <p className="text-amber-800 dark:text-amber-200 text-sm">
              You're in guest mode. Your journal entries are saved locally and won't sync across devices.
            </p>
          </div>
        )}

        <div className="space-y-4 mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Entry Title (Optional)
              </label>
              <input
                type="text"
                value={currentTitle}
                onChange={(e) => setCurrentTitle(e.target.value)}
                placeholder="Give your entry a title..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Thoughts & Reflections
            </label>
            <textarea
              value={currentEntry}
              onChange={(e) => setCurrentEntry(e.target.value)}
              placeholder="What did you learn today? How did God speak to you through His Word? Record your thoughts, prayers, and reflections..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={saveEntry}
              disabled={!currentEntry.trim() || loading}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            >
              <Save className="h-4 w-4" />
              {editingId ? 'Update Entry' : 'Save Entry'}
            </button>
            {editingId && (
              <button
                onClick={() => {
                  setCurrentEntry('');
                  setCurrentTitle('');
                  setEditingId(null);
                  setSelectedDate(new Date().toISOString().split('T')[0]);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search your journal entries..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Loading entries...</p>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchTerm ? 'No matching entries found' : 'No journal entries yet'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ? 'Try a different search term' : 'Start writing your first spiritual reflection!'}
              </p>
            </div>
          ) : (
            filteredEntries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editEntry(entry)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <PenTool className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {entry.title && (
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    {entry.title}
                  </h4>
                )}
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {entry.content}
                </p>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Journal;
