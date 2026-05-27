import { useState } from 'react';
import { KBJUProvider } from '../store/kbjuContext';
import { DailySummary } from './DailySummary';
import { FoodSearch } from './FoodSearch';
import { FoodDiary } from './FoodDiary';
import { GoalSettings } from './GoalSettings';

export function KBJUWidget() {
  const [activeTab, setActiveTab] = useState('diary');

  return (
    <KBJUProvider>
      <div className="max-w-4xl mx-auto p-4 md:p-8 font-sans">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Счётчик КБЖУ 🍎</h1>
          <div className="text-slate-400 text-xs bg-slate-800 px-4 py-2 rounded-full border border-slate-700 font-mono">
            {new Date().toLocaleDateString('ru-RU')}
          </div>
        </header>
        
        <DailySummary />

        {/* Навигация */}
        <nav className="flex gap-4 p-1 bg-slate-900/80 rounded-2xl mb-8 border border-slate-800 w-fit">
          {[
            {id: 'diary',  label: 'Дневник'}, 
            {id: 'search', label: 'Поиск'}, 
            {id: 'goals',  label: 'Цели'}
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="bg-slate-800/40 backdrop-blur-xl p-6 rounded-3xl border border-slate-700/50 shadow-2xl min-h-[450px]">
          {activeTab === 'diary' && <FoodDiary />}
          {activeTab === 'search' && <FoodSearch />}
          {activeTab === 'goals' && <GoalSettings />}
        </div>
      </div>
    </KBJUProvider>
  );
}
