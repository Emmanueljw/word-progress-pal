
import { useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { BibleVerse } from '../data/bibleVersions';

export interface BibleChapter {
  book: string;
  chapter: number;
  version: string;
  verses: BibleVerse[];
}

export const useBibleAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChapter = async (book: string, chapter: number, version: string): Promise<BibleChapter | null> => {
    setLoading(true);
    setError(null);

    try {
      // Use supabase.functions.invoke with query parameters
      const { data, error: functionError } = await supabase.functions.invoke('bible-api', {
        method: 'GET',
        body: new URLSearchParams({
          book: book.toLowerCase(),
          chapter: chapter.toString(),
          version: version.toLowerCase()
        })
      });

      if (functionError) {
        console.error('Supabase function error:', functionError);
        setError('Failed to fetch Bible text');
        return null;
      }

      if (data?.error) {
        console.error('Bible API error:', data.error);
        setError(data.error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error fetching Bible chapter:', err);
      setError('Failed to fetch Bible text');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchChapter,
    loading,
    error
  };
};
