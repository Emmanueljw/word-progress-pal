
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
      // Create URL with query parameters for GET request
      const url = new URL(`${supabase.supabaseUrl}/functions/v1/bible-api`);
      url.searchParams.append('book', book.toLowerCase());
      url.searchParams.append('chapter', chapter.toString());
      url.searchParams.append('version', version.toLowerCase());

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${supabase.supabaseKey}`,
          'apikey': supabase.supabaseKey,
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Bible API error response:', errorText);
        setError('Failed to fetch Bible text');
        return null;
      }

      const data = await response.json();

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
