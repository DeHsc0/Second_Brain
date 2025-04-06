import axios from 'axios';
import * as cheerio from 'cheerio';
import { YoutubeTranscript } from 'youtube-transcript';

export const getTranscript = async (YOUTUBE_URL : string) => {

    const url = new URL(YOUTUBE_URL);
    const videoId = url.searchParams.get('v');
    
    if (!videoId) {

        const newVideoId = url.pathname.slice(1)

        if(newVideoId)return 
        const transcript = await YoutubeTranscript.fetchTranscript(newVideoId);
        const transcriptText = transcript.map(item => item.text).join(' ');
        
        const truncatedTranscript = transcriptText.slice(0, 12000);
    
        return truncatedTranscript
    }
    
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    const transcriptText = transcript.map(item => item.text).join(' ');
    
    const truncatedTranscript = transcriptText.slice(0, 12000);

    return truncatedTranscript
}

export async function extractTextFromUrl(url: string): Promise<string> {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      
      $('script, style, nav, footer, header, aside').remove();
      
      const mainContent = $('main, article, .content, #content, .article-body').text() || $('body').text();
      
      return mainContent.replace(/\s+/g, ' ').trim();
    } catch (error) {
      console.error('Error extracting text from URL:', error);
      throw error;
    }
  }