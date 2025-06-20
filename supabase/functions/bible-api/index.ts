
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const book = url.searchParams.get('book');
    const chapter = url.searchParams.get('chapter');
    const version = url.searchParams.get('version') || 'kjv';

    if (!book || !chapter) {
      return new Response(
        JSON.stringify({ error: 'Book and chapter parameters required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Use Bible API (bible-api.com is free and doesn't require API key)
    const apiUrl = `https://bible-api.com/${book}+${chapter}?translation=${version}`;
    console.log(`Fetching from: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Bible-Tracker-App/1.0'
      }
    });

    if (!response.ok) {
      console.error(`Bible API error: ${response.status} ${response.statusText}`);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch Bible text' }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const data = await response.json();
    console.log(`Successfully fetched ${book} ${chapter} in ${version}`);

    // Transform the API response to match our expected format
    const verses = data.verses ? data.verses.map((verse: any) => ({
      book: verse.book_name,
      chapter: verse.chapter,
      verse: verse.verse,
      text: verse.text.trim()
    })) : [];

    return new Response(
      JSON.stringify({
        book: data.reference?.split(' ')[0] || book,
        chapter: parseInt(chapter),
        version: version.toUpperCase(),
        verses
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Bible API function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
