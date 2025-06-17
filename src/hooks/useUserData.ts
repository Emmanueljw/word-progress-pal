
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { useLocalStorage } from './useLocalStorage';

export const useUserReadingProgress = () => {
  const { user } = useAuth();
  const [localProgress, setLocalProgress] = useLocalStorage<Record<string, number[]>>('bible-read-chapters', {});
  const [dbProgress, setDbProgress] = useState<Record<string, number[]>>({});
  const [loading, setLoading] = useState(false);

  // Load user's reading progress from database
  useEffect(() => {
    if (user) {
      loadUserProgress();
    }
  }, [user]);

  const loadUserProgress = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reading_progress')
        .select('book_name, chapter_number')
        .eq('user_id', user.id);

      if (error) throw error;

      const progress: Record<string, number[]> = {};
      data?.forEach(({ book_name, chapter_number }) => {
        if (!progress[book_name]) progress[book_name] = [];
        progress[book_name].push(chapter_number);
      });

      setDbProgress(progress);
    } catch (error) {
      console.error('Error loading user progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleChapter = async (bookName: string, chapterNumber: number) => {
    if (user) {
      // Authenticated user - save to database
      const currentChapters = dbProgress[bookName] || [];
      const isRead = currentChapters.includes(chapterNumber);

      try {
        if (isRead) {
          // Remove chapter
          await supabase
            .from('reading_progress')
            .delete()
            .eq('user_id', user.id)
            .eq('book_name', bookName)
            .eq('chapter_number', chapterNumber);
        } else {
          // Add chapter
          await supabase
            .from('reading_progress')
            .insert({
              user_id: user.id,
              book_name: bookName,
              chapter_number: chapterNumber
            });
        }

        // Update local state
        setDbProgress(prev => {
          const bookChapters = prev[bookName] || [];
          const newChapters = isRead
            ? bookChapters.filter(ch => ch !== chapterNumber)
            : [...bookChapters, chapterNumber].sort((a, b) => a - b);
          
          return {
            ...prev,
            [bookName]: newChapters
          };
        });

        return !isRead;
      } catch (error) {
        console.error('Error updating reading progress:', error);
        return isRead;
      }
    } else {
      // Guest user - save to local storage
      const currentChapters = localProgress[bookName] || [];
      const isRead = currentChapters.includes(chapterNumber);
      
      const newChapters = isRead
        ? currentChapters.filter(ch => ch !== chapterNumber)
        : [...currentChapters, chapterNumber].sort((a, b) => a - b);
      
      setLocalProgress(prev => ({
        ...prev,
        [bookName]: newChapters
      }));

      return !isRead;
    }
  };

  const readChapters = user ? dbProgress : localProgress;

  return {
    readChapters,
    toggleChapter,
    loading
  };
};

export const useUserStreak = () => {
  const { user } = useAuth();
  const [localStreak, setLocalStreak] = useLocalStorage<number>('bible-reading-streak', 0);
  const [localLastRead, setLocalLastRead] = useLocalStorage<string>('bible-last-read-date', '');
  const [dbStreak, setDbStreak] = useState<number>(0);
  const [dbLastRead, setDbLastRead] = useState<string>('');

  useEffect(() => {
    if (user) {
      loadUserStreak();
    }
  }, [user]);

  const loadUserStreak = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_streaks')
        .select('current_streak, last_read_date')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setDbStreak(data.current_streak || 0);
        setDbLastRead(data.last_read_date || '');
      }
    } catch (error) {
      console.error('Error loading user streak:', error);
    }
  };

  const updateStreak = async (newStreak: number) => {
    const today = new Date().toISOString().split('T')[0];

    if (user) {
      try {
        await supabase
          .from('user_streaks')
          .upsert({
            user_id: user.id,
            current_streak: newStreak,
            last_read_date: today
          });

        setDbStreak(newStreak);
        setDbLastRead(today);
      } catch (error) {
        console.error('Error updating streak:', error);
      }
    } else {
      setLocalStreak(newStreak);
      setLocalLastRead(today);
    }
  };

  const streak = user ? dbStreak : localStreak;
  const lastReadDate = user ? dbLastRead : localLastRead;

  return {
    streak,
    lastReadDate,
    updateStreak
  };
};
