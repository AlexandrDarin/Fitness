import { useState } from 'react';
import { KBJUProvider, useKBJU } from '../store/kbjuContext';
import { useAuth } from '../../../app/contexts/AuthContext';
import { useApp } from '../../../app/contexts/AppContext'; 
import { DailySummary } from './DailySummary';
import { FoodSearch } from './FoodSearch';
import { FoodDiary } from './FoodDiary';
import { WorkoutDiary } from './WorkoutDiary'; 
import { GoalSettings } from './GoalSettings';
import { NutritionStats } from './NutritionStats';
import { EditBodyParamsModal } from './EditBodyParamsModal'; 
import { User, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

function KBJUWidgetInner() {
  const { user } = useAuth();
  const { getUserMembership } = useApp();
  const { selectedDate, changeDate } = useKBJU(); 
  const [activeModule, setActiveModule] = useState<'kbju' | 'workout'>('kbju');
  const [activeTab, setActiveTab] = useState('diary');
  const [profileModalOpen, setProfileModalOpen] = useState(false); 

  const membership = user ? getUserMembership(user.id) : undefined;
  const membershipName = membership 
    ? (membership.type === 'premium' ? '★ Премиум' : '🎫 Базовый') 
    : 'Нет абонемента';

  // Получаем сегодня в формате YYYY-MM-DD
  const today = new Date();
  const todayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
  
  const handlePrevDay = () => {
    const d = new Date(selectedDate + 'T12:00:00Z');
    d.setUTCDate(d.getUTCDate() - 1);
    changeDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate + 'T12:00:00Z');
    d.setUTCDate(d.getUTCDate() + 1);
    changeDate(d.toISOString().split('T')[0]);
  };

  const handleResetToToday = () => changeDate(todayStr);

  const formatShowDate = (dStr: string) => {
    const d = new Date(dStr + 'T12:00:00Z');
    const numericDate = d.toLocaleDateString('ru-RU'); // Это даст 29.05.2026
    if (dStr === todayStr) return `Сегодня (${numericDate})`;
    return numericDate;
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 font-sans">
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          background: transparent;
          bottom: 0;
          color: transparent;
          cursor: pointer;
          height: auto;
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
          width: auto;
        }
      `}</style>

      {/* 📅 ШАПКА */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10 pb-4 border-b border-slate-800">
        
        {/* ПРОФИЛЬ СЛЕВА */}
        <div onClick={() => setProfileModalOpen(true)} className="flex items-center gap-3 cursor-pointer hover:text-blue-400 transition-all group">
          <div className="bg-blue-500/10 w-10 h-10 rounded-full flex items-center justify-center border border-blue-500/20 group-hover:scale-105 transition-transform">
            <User className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-1">
              {user?.name || 'Гость'}
              <span className="text-[10px] font-normal text-slate-500">• Подробно</span>
            </h2>
            <p className="text-[11px] text-slate-400">{membershipName}</p>
          </div>
        </div>

        {/* КАЛЕНДАРЬ СПРАВА */}
        <div className="flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-700/50 relative">
          <button onClick={handlePrevDay} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 transition"><ChevronLeft className="w-4 h-4" /></button>
          
          <div className="flex items-center gap-2 px-3 min-w-[160px] justify-center relative hover:bg-slate-800/50 rounded-lg py-1 transition cursor-pointer">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-white whitespace-nowrap">
              {formatShowDate(selectedDate)}
            </span>
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => changeDate(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          <button onClick={handleNextDay} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 transition"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>

      {/* ПЛАШКА СБРОСА (появляется только если не сегодня) */}
      {selectedDate !== todayStr && (
        <div onClick={handleResetToToday} className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl text-center text-xs text-blue-400 font-bold cursor-pointer hover:bg-blue-500/20 transition-all mb-6 animate-in fade-in slide-in-from-top-2">
          📅 Вернуться на Сегодня ({today.toLocaleDateString('ru-RU')})
        </div>
      )}

      {/* ОСНОВНОЙ КОНТЕНТ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          {/* МОДУЛИ */}
          <div className="flex bg-slate-900/90 p-2 rounded-2xl border border-slate-800 w-full shadow-2xl">
            <button onClick={() => setActiveModule('kbju')} className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all ${activeModule === 'kbju' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Счётчик КБЖУ 🍎</button>
            <button onClick={() => setActiveModule('workout')} className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all ${activeModule === 'workout' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Активность 💪🏻</button>
          </div>

          {activeModule === 'kbju' ? (
            <div className="space-y-6">
              <nav className="flex bg-slate-900 p-1 rounded-xl border border-slate-800/50 w-full">
                {[{id:'diary', label:'Дневник'}, {id:'search', label:'Поиск'}, {id:'stats', label:'Статистика'}, {id:'goals', label:'Цели'}].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500'}`}>{tab.label}</button>
                ))}
              </nav>
              <div className="bg-slate-800/40 backdrop-blur-xl p-6 rounded-3xl border border-slate-700/50 shadow-2xl min-h-[450px]">
                {activeTab === 'diary' && <FoodDiary />}
                {activeTab === 'search' && <FoodSearch />}
                {activeTab === 'stats' && <NutritionStats />}
                {activeTab === 'goals' && <GoalSettings />}
              </div>
            </div>
          ) : (
            <div className="bg-slate-800/40 backdrop-blur-xl p-6 rounded-3xl border border-slate-700/50 shadow-2xl min-h-[450px]">
              <WorkoutDiary />
            </div>
          )}
        </div>

        {/* СВОДКА СПРАВА */}
        <div className="lg:col-span-1">
          <DailySummary />
        </div>
      </div>

      <EditBodyParamsModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
    </div>
  );
}

export function KBJUWidget() {
  return (
    <KBJUProvider>
      <KBJUWidgetInner />
    </KBJUProvider>
  );
}
