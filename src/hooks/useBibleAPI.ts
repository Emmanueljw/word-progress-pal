
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
      // Create URL with query parameters for the edge function
      const url = `https://ghagchreunwgaahsoecp.supabase.co/functions/v1/bible-api?book=${encodeURIComponent(book.toLowerCase())}&chapter=${chapter}&version=${encodeURIComponent(version.toLowerCase())}`;
      
      console.log('Fetching from URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoYWdjaHJldW53Z2FhaHNvZWNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNzY4MDYsImV4cCI6MjA2NTc1MjgwNn0.tymYrEoiVLVGxE8Wi9_CMEFU-cAKH_CX4JvF-U2_5IE`,
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoYWdjaHJldW53Z2FhaHNvZWNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNzY4MDYsImV4cCI6MjA2NTc1MjgwNn0.tymYrEoiVLVGxE8Wi9_CMEFU-cAKH_CX4JvF-U2_5IE',
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Bible API error response:', errorText);
        setError('Failed to fetch Bible text');
        return null;
      }

      const data = await response.json();
      console.log('Successfully fetched data:', data);

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
