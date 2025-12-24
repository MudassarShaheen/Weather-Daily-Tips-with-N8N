
import React from 'react';
import { Droplets, Wind as WindIcon, MapPin } from 'lucide-react';
import { WeatherData } from '../types';
import { WeatherIcon } from './WeatherIcon';

interface WeatherCardProps {
  data: WeatherData;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-blue-50 border border-blue-50/50 w-full max-w-md mx-auto fade-in">
      <div className="flex items-center justify-center gap-2 mb-6 text-slate-400">
        <MapPin size={18} />
        <span className="text-lg font-medium">{data.city}</span>
      </div>

      <div className="flex flex-col items-center mb-8">
        <WeatherIcon description={data.description} className="w-24 h-24 mb-4" />
        <div className="text-6xl font-bold text-slate-800 mb-1">
          {Math.round(data.temperature)}°
        </div>
        <div className="text-xl text-slate-500 capitalize font-medium">
          {data.description}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-6">
        <div className="flex items-center gap-3 justify-center bg-slate-50 rounded-2xl p-4">
          <Droplets className="text-blue-500" size={20} />
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase">Humidity</div>
            <div className="text-lg font-bold text-slate-700">{data.humidity}%</div>
          </div>
        </div>
        <div className="flex items-center gap-3 justify-center bg-slate-50 rounded-2xl p-4">
          <WindIcon className="text-teal-500" size={20} />
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase">Wind</div>
            <div className="text-lg font-bold text-slate-700">{data.wind_speed} <span className="text-xs font-normal">m/s</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
