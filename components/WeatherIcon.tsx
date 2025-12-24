
import React from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, CloudFog, CloudSnow, Wind } from 'lucide-react';

interface WeatherIconProps {
  description: string;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ description, className = "w-12 h-12" }) => {
  const desc = description.toLowerCase();
  
  if (desc.includes('sun') || desc.includes('clear')) return <Sun className={`${className} text-yellow-400`} />;
  if (desc.includes('rain') || desc.includes('drizzle')) return <CloudRain className={`${className} text-blue-400`} />;
  if (desc.includes('cloud')) return <Cloud className={`${className} text-gray-400`} />;
  if (desc.includes('storm') || desc.includes('thunder')) return <CloudLightning className={`${className} text-purple-400`} />;
  if (desc.includes('haze') || desc.includes('fog') || desc.includes('mist')) return <CloudFog className={`${className} text-slate-400`} />;
  if (desc.includes('snow')) return <CloudSnow className={`${className} text-blue-200`} />;
  if (desc.includes('wind')) return <Wind className={`${className} text-teal-400`} />;
  
  return <Sun className={`${className} text-yellow-400`} />;
};
