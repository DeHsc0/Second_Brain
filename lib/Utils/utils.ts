import axios from 'axios';
import * as cheerio from 'cheerio';
import { YoutubeTranscript } from 'youtube-transcript';

export function extractYouTubeVideoId(content: string): string | null {
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = content.match(regExp);
  return match ? match[1] : null;
}

export async function getYouTubeTranscript(content: string): Promise<string | null> {
  const videoId = extractYouTubeVideoId(content);
  if (!videoId) return null;

  try {
    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    return transcriptItems.map(item => item.text).join(' ');
  } catch (error) {
    return error as string
  }
}

function extractUrlFromString(input: string): string | null {
  const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/i;
  const match = input.match(urlRegex);
  return match ? match[0] : null;
}

export async function extractTextFromUrl(input : string): Promise<string> {
    try {
      const url = extractUrlFromString(input)
      if(!url)return "Unable to get the Content from the url" 
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      
      $('script, style, nav, footer, header, aside').remove();
      
      const mainContent = $('main, article, .content, #content, .article-body').text() || $('body').text();
      
      return mainContent.replace(/\s+/g, ' ').trim();
    } catch (error) {
      return error as string
    }
  }

  export async function extractAdditionalContent(
    contentType: ("WEBPAGE" | "YOUTUBE" | "CODE" | "NOTE")[],
    mainContent: string
): Promise<string | null> {
    
  if (contentType.includes("YOUTUBE")) {
      const transcript = await getYouTubeTranscript(mainContent);
      return transcript
    } 

    if (contentType.includes("WEBPAGE")) {
      const webContent = await extractTextFromUrl(mainContent);
      return webContent;
    }
    
    return null;
  }