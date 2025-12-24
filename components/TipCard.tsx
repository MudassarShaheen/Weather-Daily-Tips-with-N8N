
import React from 'react';
import { Baby, FerrisWheel, GraduationCap, HeartPulse } from 'lucide-react';

interface TipCardProps {
  title: string;
  tip: string;
  type: 'babies' | 'kids' | 'young_adults' | 'older_adults';
  index: number;
}

const config = {
  babies: {
    icon: Baby,
    color: 'bg-pink-50',
    iconColor: 'text-pink-500',
    borderColor: 'border-pink-100',
    label: 'Babies'
  },
  kids: {
    icon: FerrisWheel,
    color: 'bg-orange-50',
    iconColor: 'text-orange-500',
    borderColor: 'border-orange-100',
    label: 'Kids'
  },
  young_adults: {
    icon: GraduationCap,
    color: 'bg-indigo-50',
    iconColor: 'text-indigo-500',
    borderColor: 'border-indigo-100',
    label: 'Young Adults'
  },
  older_adults: {
    icon: HeartPulse,
    color: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    borderColor: 'border-emerald-100',
    label: 'Older Adults'
  }
};

export const TipCard: React.FC<TipCardProps> = ({ title, tip, type, index }) => {
  const { icon: Icon, color, iconColor, borderColor, label } = config[type];

  return (
    <div 
      className={`bg-white rounded-3xl p-6 shadow-md border ${borderColor} transition-all hover:shadow-lg fade-in`}
      style={{ animationDelay: `${(index + 2) * 100}ms` }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`${color} p-3 rounded-2xl`}>
          <Icon className={iconColor} size={24} />
        </div>
        <h3 className="font-bold text-slate-700 text-lg">{label}</h3>
      </div>
      <p className="text-slate-600 leading-relaxed text-sm">
        {tip}
      </p>
    </div>
  );
};
