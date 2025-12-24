
import React, { useState, useCallback, useEffect } from 'react';
import { MapPin, Sparkles, Sun, Cloud, AlertCircle, RefreshCcw, Info, Navigation } from 'lucide-react';
import { AppStatus, WeatherApiResponse } from './types';
import { fetchWeatherAndTips } from './services/api';
import { WeatherCard } from './components/WeatherCard';
import { TipCard } from './components/TipCard';
import { Loading } from './components/Loading';

// Hardcoded location as fallback (Lahore) as requested
const FALLBACK_LOCATION = {
  lat: 31.5204,
  lon: 74.3587,
  name: "Lahore"
};

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>('idle');
  const [data, setData] = useState<WeatherApiResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);
  const [isAutoLoading, setIsAutoLoading] = useState(true);

  const performFetch = useCallback(async (lat: number, lon: number, locationName?: string) => {
    try {
      setStatus('loading');
      setErrorMessage(null);
      const result = await fetchWeatherAndTips(lat, lon);
      
      // If the API didn't return a specific city name, use our fallback name or generic
      if (!result.weather.city || result.weather.city === "Current Location") {
        result.weather.city = locationName || "Your Location";
      }
      
      setData(result);
      setStatus('success');
    } catch (error: any) {
      console.error("Fetch Error:", error);
      setErrorMessage(error.message || "Failed to fetch weather data.");
      setStatus('error');
    } finally {
      setIsAutoLoading(false);
    }
  }, []);

  const getWeatherData = useCallback(async () => {
    setIsFallback(false);
    
    if (!navigator.geolocation) {
      setIsFallback(true);
      await performFetch(FALLBACK_LOCATION.lat, FALLBACK_LOCATION.lon, FALLBACK_LOCATION.name);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await performFetch(latitude, longitude);
      },
      async (error) => {
        console.warn("Location access denied or failed, using Lahore fallback:", error);
        setIsFallback(true);
        await performFetch(FALLBACK_LOCATION.lat, FALLBACK_LOCATION.lon, FALLBACK_LOCATION.name);
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  }, [performFetch]);

  // Automatically attempt to fetch on mount
  useEffect(() => {
    getWeatherData();
  }, [getWeatherData]);

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center min-h-screen">
      <header className="text-center mb-12 fade-in w-full">
        <div className="flex justify-center mb-6 relative">
          <Sun className="text-yellow-400 absolute -top-4 -right-8 opacity-20 w-16 h-16" />
          <Cloud className="text-blue-100 absolute top-0 -left-12 opacity-40 w-12 h-12" />
          <div className="bg-yellow-100/50 p-4 rounded-full">
            <Sun className="text-yellow-500 w-10 h-10 animate-[bounce_3s_infinite]" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2 tracking-tight">
          Weather & Care Tips
        </h1>
        <p className="text-slate-500 text-sm mb-4">Smart daily guidance for every age</p>
        
        {status === 'success' && data && (
          <div className="flex items-center justify-center gap-2 bg-white/50 border border-white px-4 py-2 rounded-full w-fit mx-auto shadow-sm">
            <MapPin size={14} className="text-blue-500" />
            <span className="text-slate-700 font-bold text-sm tracking-wide">
              {data.weather.city}
            </span>
          </div>
        )}
      </header>

      <main className="w-full flex-1">
        {status === 'loading' && <Loading />}

        {status === 'error' && (
          <div className="bg-red-50 rounded-3xl p-8 border border-red-100 text-center max-w-sm mx-auto fade-in">
            <AlertCircle className="text-red-500 w-12 h-12 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">Oops!</h2>
            <p className="text-slate-600 mb-6 text-sm">
              {errorMessage}
            </p>
            <button 
              onClick={getWeatherData}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-100"
            >
              <RefreshCcw size={18} />
              Try Again
            </button>
          </div>
        )}

        {status === 'success' && data && (
          <div className="space-y-12 pb-20">
            {isFallback && (
              <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-100 p-4 rounded-2xl flex items-start gap-3 fade-in max-w-md mx-auto">
                <Info className="text-blue-500 shrink-0 mt-0.5" size={18} />
                <p className="text-blue-700 text-xs">
                  Showing results for <strong>{FALLBACK_LOCATION.name}</strong>. Grant location access for more precise local tips.
                </p>
              </div>
            )}

            <section className="flex flex-col items-center">
              <WeatherCard data={data.weather} />
            </section>

            <section>
              <div className="flex items-center gap-4 mb-8 justify-center">
                <div className="h-px bg-slate-200 flex-1"></div>
                <div className="flex items-center gap-2 px-2">
                  <Sparkles size={18} className="text-blue-500" />
                  <h2 className="text-xl font-bold text-slate-800 whitespace-nowrap">Daily Care Guide</h2>
                </div>
                <div className="h-px bg-slate-200 flex-1"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TipCard index={0} title="Babies" type="babies" tip={data.tips.babies} />
                <TipCard index={1} title="Kids" type="kids" tip={data.tips.kids} />
                <TipCard index={2} title="Young Adults" type="young_adults" tip={data.tips.young_adults} />
                <TipCard index={3} title="Older Adults" type="older_adults" tip={data.tips.older_adults} />
              </div>
            </section>

            <div className="flex justify-center mt-12">
               <button 
                onClick={getWeatherData}
                className="flex items-center gap-2 bg-white/80 hover:bg-white text-slate-500 hover:text-blue-600 transition-all font-semibold px-6 py-3 rounded-2xl shadow-sm border border-slate-100 active:scale-95"
              >
                <RefreshCcw size={16} />
                Update Weather
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="w-full mt-12 pt-8 border-t border-slate-100 text-center text-slate-400 text-xs fade-in">
        <p className="flex items-center justify-center gap-1 font-medium">
          Personalized health & safety tips powered by real-time weather data
        </p>
      </footer>
    </div>
  );
};

export default App;
