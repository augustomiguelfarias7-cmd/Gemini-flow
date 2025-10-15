interface PlaywrightInput {
  url: string;
  selectors: Record<string, string>;
}

interface MicrolinkResponse {
  status: string;
  data: Record<string, any>;
  [key: string]: any;
}

/**
 * Executes a browser automation task using a remote service (microlink.io)
 * to extract structured data from a web page.
 * @param jsonInput A string containing a JSON object with 'url' and 'selectors'.
 * @returns A promise that resolves to a stringified JSON of the extracted data.
 */
export const runPlaywright = async (jsonInput: string): Promise<string> => {
  let input: PlaywrightInput;

  try {
    input = JSON.parse(jsonInput);
  } catch (e) {
    return 'Error: Invalid JSON input for Playwright node.';
  }

  if (!input.url || !input.selectors) {
    return 'Error: JSON must contain "url" and "selectors" properties.';
  }
  
  if (typeof input.selectors !== 'object' || Object.keys(input.selectors).length === 0) {
      return 'Error: "selectors" must be a non-empty object of CSS selectors.';
  }
  
  if (!input.url.startsWith('http://') && !input.url.startsWith('https://')) {
    return 'Error: Invalid URL provided. It must start with http:// or https://';
  }

  const microlinkApi = new URL('https://api.microlink.io');
  microlinkApi.searchParams.set('url', input.url);

  // Add the selectors to the API query parameters
  for (const key in input.selectors) {
    microlinkApi.searchParams.set(`data.${key}.selector`, input.selectors[key]);
    microlinkApi.searchParams.set(`data.${key}.type`, 'string'); // a reasonable default
  }
  
  microlinkApi.searchParams.set('palette', 'false');
  microlinkApi.searchParams.set('audio', 'false');
  microlinkApi.searchParams.set('video', 'false');


  try {
    const response = await fetch(microlinkApi.toString());
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API failed with status ${response.status}: ${errorData.message || 'Unknown error'}`);
    }
    const result: MicrolinkResponse = await response.json();

    if (result.status === 'success') {
      return JSON.stringify(result.data, null, 2);
    } else {
        const errorMessage = `Automation failed. Status: ${result.status}. ${result.message || ''}`;
        console.error("Microlink API error details:", result);
        return `Error: ${errorMessage}`;
    }
  } catch (error) {
    console.error("Error calling browser automation API:", error);
    if (error instanceof Error) {
      return `Automation Error: ${error.message}`;
    }
    return "An unknown error occurred during browser automation.";
  }
};
