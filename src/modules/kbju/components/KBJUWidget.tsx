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

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    changeDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    changeDate(d.toISOString().split('T')[0]);
  };

  const handleResetToToday = () => {
    changeDate('2026-05-27');
  };

  const formatShowDate = (dStr: string) => {
    const d = new Date(dStr);
    const today = '2026-05-27';
    const yesterday = '2026-05-26';
    if (dStr === today) return 'Сегодня';
    if (dStr === yesterday) return 'Вчера';
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 font-sans">
      
      <style>{`
        /* Скрываем системную браузерную иконку календаря */
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

      {/* 📅 СБАЛАНСИРОВАННАЯ ШАПКА: Профиль слева, Календарь справа (БЕЗ ДВОЙНЫХ ДАТ!) */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10 pb-4 border-b border-slate-800">
        
        {/* Компактный профиль */}
        <div 
          onClick={() => setProfileModalOpen(true)}
          className="flex items-center gap-3 cursor-pointer hover:text-blue-400 transition-all group"
          title="Параметры здоровья и абонемент"
        >
          <div className="bg-blue-500/10 w-11 h-11 rounded-full flex items-center justify-center border border-blue-500/20 group-hover:scale-105 transition-transform">
            <User className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-md font-bold text-white leading-tight flex items-center gap-1.5">
              {user?.name || 'Гость'}
              <span className="text-[10px] font-normal text-slate-500">• Подробно</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">Клиент Wire Fitness</p>
          </div>
        </div>

        {/* Календарь переключения дней (Клик по дате возвращает на сегодня!) */}
        <div className="flex items-center gap-2 bg-slate-900/60 p-2 rounded-xl border border-slate-700/50 relative">
          <button onClick={handlePrevDay} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition">
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-1.5 hover:text-blue-400 transition font-bold text-white text-xs cursor-pointer px-2">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span onClick={handleResetToToday}>{formatShowDate(selectedDate)}</span>
          </div>

          <div className="relative flex items-center justify-center">
            {/* Скрытый системный выбор даты накладывается поверх текста */}
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => changeDate(e.target.value)}
              className="bg-transparent border-none text-slate-500 focus:outline-none cursor-pointer font-sans w-20 text-xs"
            />
          </div>

          <button onClick={handleNextDay} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 👇 УДОБНАЯ ПЛАШКА СБРОСА ДАТЫ, если выбран не сегодняшний день */}
      {selectedDate !== '2026-05-27' && (
        <div 
          onClick={handleResetToToday}
          className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl text-center text-xs text-blue-400 font-bold cursor-pointer hover:bg-blue-500/20 transition-all mb-6"
        >
          📅 Вы просматриваете историю за прошлый день. Нажмите сюда, чтобы вернуться на Сегодня (27.05.2026)
        </div>
      )}

      {/* 👇 ДВУХКОЛОНОЧНЫЙ МАКЕТ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Левая колонка */}
        <div className="lg:col-span-2 space-y-6">
          {/* Крупный тумблер переключения КБЖУ / Тренировки */}
          <div className="flex bg-slate-900/90 p-2.5 rounded-2xl border border-slate-800 w-full shadow-2xl">
            <button 
              onClick={() => setActiveModule('kbju')}
              className={`flex-1 py-4.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                activeModule === 'kbju' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Счётчик КБЖУ 🍎
            </button>
            <button 
              onClick={() => setActiveModule('workout')}
              className={`flex-1 py-4.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                activeModule === 'workout' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Дневник активности 💪🏻
            </button>
          </div>

          {/* Содержимое вкладок КБЖУ */}
          {activeModule === 'kbju' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Пропорциональные вкладки во всю ширину панели */}
              <nav className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800/80 w-full font-sans">
                {[
                  {id: 'diary',  label: 'Дневник'}, 
                  {id: 'search', label: 'Поиск'}, 
                  {id: 'stats',  label: 'Статистика'}, 
                  {id: 'goals',  label: 'Цели'}
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                      activeTab === tab.id 
                        ? 'bg-blue-500 text-white shadow-lg' 
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
                {activeTab === 'stats' && <NutritionStats />}
                {activeTab === 'goals' && <GoalSettings />}
              </div>
            </div>
          )}

          {/* Содержимое вкладок Тренировок */}
          {activeModule === 'workout' && (
            <div className="bg-slate-800/40 backdrop-blur-xl p-6 rounded-3xl border border-slate-700/50 shadow-2xl min-h-[450px] animate-in fade-in duration-300">
              <WorkoutDiary />
            </div>
          )}
        </div>

        {/* Правая колонка */}
        <div className="lg:col-span-1">
          <DailySummary />
        </div>

      </div>

      {/* Модальное окно редактирования веса и роста */}
      <EditBodyParamsModal 
        isOpen={profileModalOpen} 
        onClose={() => setProfileModalOpen(false)} 
      />
    </div>
  );
}

// Внешняя обертка, предоставляющая провайдер
export function KBJUWidget() {
  return (
    <KBJUProvider>
      <KBJUWidgetInner />
    </KBJUProvider>
  );
}
