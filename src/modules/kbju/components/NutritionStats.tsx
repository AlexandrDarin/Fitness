import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../app/contexts/AuthContext';
import { TrendingUp, Award, Calendar } from 'lucide-react';

export function NutritionStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    if (!user) return;
    try {
      const response = await axios.get(`http://localhost:5005/api/kbju/stats/weekly?userId=${user.id}`);
      setStats(response.data);
    } catch (e) {
      console.error("Ошибка загрузки статистики", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Загрузка статистики...</div>;
  }

  if (stats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <span className="text-5xl mb-4">📈</span>
        <p className="text-lg italic text-center">Недостаточно данных для графиков.<br />Добавьте продукты в дневник питания.</p>
      </div>
    );
  }

  // Находим максимальное значение калорий для правильного масштаба столбиков
  const maxCalories = Math.max(...stats.map(s => Number(s.calories)), 2000);
  const averageCalories = Math.round(stats.reduce((acc, s) => acc + Number(s.calories), 0) / stats.length);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Статистика за неделю</h2>
        <p className="text-sm text-slate-400">Калорийность рациона за последние 7 дней</p>
      </div>

      {/* 📊 Столбиковая диаграмма на Tailwind */}
      <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-700/50">
        <div className="flex justify-between items-end h-48 gap-3 pt-6 pb-2">
          {stats.map((s, idx) => {
            const heightPct = (Number(s.calories) / maxCalories) * 100;
            const d = new Date(s.date);
            const dayLabel = d.toLocaleDateString('ru-RU', { weekday: 'short' });
            
            return (
              <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                {/* Всплывающий Тултип при наведении */}
                <div className="absolute -top-6 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 font-mono shadow-md">
                  {s.calories} ккал
                </div>
                {/* Столбик */}
                <div 
                  className="w-full bg-blue-500/80 hover:bg-blue-400 rounded-t-lg transition-all duration-500 shadow-lg shadow-blue-500/10 cursor-pointer"
                  style={{ height: `${Math.max(5, heightPct)}%` }}
                />
                {/* Название дня недели */}
                <span className="text-[10px] text-slate-400 mt-2 capitalize">{dayLabel}</span>
                <span className="text-[8px] text-slate-600 font-mono">{s.date.split('-')[2]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🎯 Сводные карточки аналитики */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700/40 flex items-center gap-4">
          <div className="bg-blue-500/20 p-3 rounded-xl">
            <TrendingUp className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-0.5">Среднее за неделю</div>
            <div className="text-xl font-extrabold text-white font-mono">{averageCalories} <span className="text-xs font-normal text-slate-500">ккал/день</span></div>
          </div>
        </div>

        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700/40 flex items-center gap-4">
          <div className="bg-emerald-500/20 p-3 rounded-xl">
            <Award className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-0.5">Всего дней заполнено</div>
            <div className="text-xl font-extrabold text-white font-mono">{stats.length} <span className="text-xs font-normal text-slate-500">из 7</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
