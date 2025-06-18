import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, PenTool, Save, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../integrations/supabase/client';
import { useLocalStorage } from '../hooks/useLocalStorage';

const Journal = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [entry, setEntry] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Local storage for guest users
  const [localEntries, setLocalEntries] = useLocalStorage<Record<string, string>>('bible-journal-entries', {});

  useEffect(() => {
    if (user) {
      loadEntry();
    } else {
      // Load from local storage for guest users
      setEntry(localEntries[selectedDate] || '');
    }
  }, [selectedDate, user, localEntries]);

  const loadEntry = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('content')
        .eq('user_id', user.id)
        .eq('entry_date', selectedDate)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading journal entry:', error);
        return;
      }

      setEntry(data?.content || '');
    } catch (error) {
      console.error('Error loading journal entry:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveEntry = async () => {
    if (!entry.trim()) return;

    if (user) {
      // Save to database for authenticated users
      setLoading(true);
      try {
        const { error } = await supabase
          .from('journal_entries')
          .upsert({
            user_id: user.id,
            entry_date: selectedDate,
            content: entry,
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
        setIsEditing(false);
      } catch (error) {
        console.error('Error saving journal entry:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // Save to local storage for guest users
      setLocalEntries((prev: Record<string, string>) => ({
        ...prev,
        [selectedDate]: entry
      }));
      setIsEditing(false);
    }
  };

  const deleteEntry = async () => {
    if (user) {
      // Delete from database for authenticated users
      setLoading(true);
      try {
        const { error } = await supabase
          .from('journal_entries')
          .delete()
          .eq('user_id', user.id)
          .eq('entry_date', selectedDate);

        if (error) throw error;
        setEntry('');
        setIsEditing(false);
      } catch (error) {
        console.error('Error deleting journal entry:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // Delete from local storage for guest users
      setLocalEntries((prev: Record<string, string>) => {
        const newEntries = { ...prev };
        delete newEntries[selectedDate];
        return newEntries;
      });
      setEntry('');
      setIsEditing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <PenTool className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Prayer Journal
          </h2>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Journal Entry for {format(new Date(selectedDate), 'MMMM d, yyyy')}
            </h3>
            <div className="flex gap-2">
              {!isEditing && entry && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={deleteEntry}
                    disabled={loading}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>

          {isEditing || !entry ? (
            <div className="space-y-4">
              <textarea
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                placeholder="Write your thoughts, prayers, or reflections here..."
                className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <div className="flex gap-2">
                <button
                  onClick={saveEntry}
                  disabled={loading || !entry.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  <Save className="h-4 w-4" />
                  {loading ? 'Saving...' : 'Save Entry'}
                </button>
                {isEditing && (
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      loadEntry();
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                {entry}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Journal;
