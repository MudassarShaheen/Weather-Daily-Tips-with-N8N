
import { WeatherApiResponse } from '../types';

const WEBHOOK_URL = 'https://muhammadahmadme085-n8n.hf.space/webhook/weather-ai';

export async function fetchWeatherAndTips(lat: number, lon: number): Promise<WeatherApiResponse> {
  const payload = { lat, lon };

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook Error: Status ${response.status}`);
    }

    const rawData = await response.json();
    console.log("Raw API Response:", rawData);

    // 1. Handle n8n array wrapper [ { ... } ]
    const firstItem = Array.isArray(rawData) ? rawData[0] : rawData;
    
    if (!firstItem) {
      throw new Error("Empty response received from the service.");
    }

    // 2. Extract and parse the "output" string if it exists
    let finalData: any = {};
    if (typeof firstItem.output === 'string') {
      try {
        finalData = JSON.parse(firstItem.output);
        console.log("Parsed Output String Content:", finalData);
      } catch (e) {
        console.error("Failed to parse 'output' string as JSON:", e);
        // Fallback: maybe the output isn't JSON but just text, or malformed
      }
    } else {
      finalData = firstItem;
    }

    /** 
     * 3. Construct the response object.
     * We merge data from the top level and the parsed 'output' level.
     */
    const weather = finalData.weather || firstItem.weather || {
      city: finalData.city || "Current Location",
      temperature: finalData.temperature || 24,
      description: finalData.description || "Clear skies",
      humidity: finalData.humidity || 45,
      wind_speed: finalData.wind_speed || 3.5
    };

    // Extract tips from various possible structures (nested in 'tips' or flat in 'finalData')
    const tipsSource = finalData.tips || finalData;
    
    const tips = {
      babies: tipsSource.babies || "Keep babies hydrated and in light clothing.",
      kids: tipsSource.kids || "Perfect weather for outdoor activities with sunscreen.",
      young_adults: tipsSource.young_adults || "Great day for a run or outdoor study session.",
      older_adults: tipsSource.older_adults || "Enjoy a pleasant walk, but stay in the shade."
    };

    return {
      weather,
      tips
    };
  } catch (error: any) {
    console.error("API Fetch Error Detail:", error);
    throw error;
  }
}
