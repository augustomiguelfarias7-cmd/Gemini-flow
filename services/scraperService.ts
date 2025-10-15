
/**
 * Fetches and parses the text content of a given URL.
 * Note: This function relies on a public CORS proxy (allorigins.win) to bypass browser
 * cross-origin restrictions. This is suitable for demonstration purposes, but for a
 * production application, you should host your own CORS proxy for reliability and security.
 * @param url The URL to scrape.
 * @returns A promise that resolves to the text content of the page.
 */
export const scrapeUrl = async (url: string): Promise<string> => {
  // A simple CORS proxy. In a real-world app, this should be a self-hosted or more robust service.
  const PROXY_URL = 'https://api.allorigins.win/raw?url=';
  
  if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
      return 'Error: Invalid URL provided. It must start with http:// or https://';
  }

  try {
    const response = await fetch(`${PROXY_URL}${encodeURIComponent(url)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL. Status: ${response.status} ${response.statusText}`);
    }
    const html = await response.text();
    
    // Use DOMParser to safely parse the HTML and extract text content.
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // A simple way to extract meaningful text, removing script and style content.
    doc.querySelectorAll('script, style').forEach(el => el.remove());
    
    const bodyText = doc.body.textContent || '';
    
    // Clean up excessive whitespace.
    return bodyText.replace(/\s\s+/g, ' ').trim() || 'Could not extract text content from the page.';

  } catch (error) {
    console.error("Error scraping URL:", error);
    if (error instanceof Error) {
      return `Scraping Error: ${error.message}`;
    }
    return "An unknown error occurred while scraping the URL.";
  }
};
