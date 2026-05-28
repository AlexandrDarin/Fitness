import { useKBJU } from '../store/kbjuContext';
import { useApp } from '../../../app/contexts/AppContext'; 
import { useAuth } from '../../../app/contexts/AuthContext';
import { Flame } from 'lucide-react';

export function DailySummary() {
  const { totalKBJU, goal, selectedDate } = useKBJU();
  const { getUserVisits } = useApp();
  const { user } = useAuth();

  // Вычисляем сожженные калории из истории тренировок друга
  const userVisits = user ? getUserVisits(user.id) : [];
  
  const getBurnedCalories = (activity: string) => {
    const act = activity.toLowerCase();
    if (act.includes('йога')) return 250;
    if (act.includes('hiit') || act.includes('интенсив')) return 500;
    if (act.includes('силов')) return 400;
    if (act.includes('бокс') || act.includes('единоборств')) return 450;
    if (act.includes('бассейн')) return 300;
    return 300; 
  };

  const todaysVisits = userVisits.filter(v => v.date === selectedDate);
  const visitsBurned = todaysVisits.reduce((sum, v) => sum + getBurnedCalories(v.activity), 0);

  const { workouts } = useKBJU();
  const workoutsBurned = workouts ? workouts.reduce((sum: number, w: any) => sum + w.burnedCalories, 0) : 0;

  const totalBurned = visitsBurned + workoutsBurned;
  
  // 👇 ИСПРАВЛЕНО: Осталось = Цель - Съедено (потраченные калории выводятся отдельно и не добавляются к лимиту пищи!)
  const remainingCalories = Math.max(0, goal.calories - totalKBJU.calories);

  const nutrients = [
    { key: 'proteins', label: 'Белки',    unit: 'г',    color: 'bg-emerald-400' },
    { key: 'fats',     label: 'Жиры',     unit: 'г',    color: 'bg-amber-400' },
    { key: 'carbs',    label: 'Углеводы', unit: 'г',    color: 'bg-sky-400' },
  ];

  return (
    <div className="bg-slate-800 p-5 rounded-3xl border border-slate-700/50 space-y-6 shadow-2xl h-fit w-full">
      <style>{`
        /* Возвращаем твою любимую мягкую анимацию пульсации пламени */
        @keyframes flame-pulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 2px rgba(249, 115, 22, 0.4)); }
          50% { transform: scale(1.15); filter: drop-shadow(0 0 8px rgba(249, 115, 22, 0.8)); }
        }
        .flame-active {
          animation: flame-pulse 2s infinite ease-in-out;
        }
      `}</style>

      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-700/50 pb-2">Сводка КБЖУ</h3>

      {/* 📊 Сводка лимитов (3 НЕ-избыточных пропорциональных бокса!) */}
      <div className="space-y-3">
        <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 text-center">
          <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-1">Осталось</div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">{remainingCalories}</div>
          <div className="text-[9px] text-slate-500 mt-0.5">ккал</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-900/50 p-3 rounded-2xl border border-slate-800 text-center">
            <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-1">Съедено</div>
            <div className="text-lg font-bold text-sky-400 font-mono">{totalKBJU.calories}</div>
            <div className="text-[9px] text-slate-600 font-mono">из {goal.calories}</div>
          </div>

          <div className="bg-slate-900/50 p-3 rounded-2xl border border-slate-700/30 text-center">
            <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-1 flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-500 flame-active" />
              Сожжено
            </div>
            <div className="text-base font-bold text-orange-400 font-mono">+{totalBurned}</div>
            <div className="text-[9px] text-slate-600 font-mono">Активность</div>
          </div>
        </div>
      </div>

      {/* Линейные индикаторы макронутриентов */}
      <div className="space-y-4 pt-4 border-t border-slate-700/50">
        {nutrients.map(({ key, label, unit, color }) => {
          const actual = totalKBJU[key] ?? 0;
          const target = goal[key] ?? 1;
          const pct = Math.min(Math.round((actual / target) * 100), 100);

          return (
            <div key={key} className="flex flex-col">
              <div className="flex justify-between mb-1 text-xs">
                <span className="text-slate-300 font-medium">{label}</span>
                <span className="text-slate-500 font-mono text-[10px]">{actual} / {target} {unit} ({Math.round((actual / target) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-700/60 rounded-full h-1.5">
                <div className={`${color} h-1.5 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
