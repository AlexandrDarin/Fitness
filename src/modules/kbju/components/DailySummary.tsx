import { useKBJU } from '../store/kbjuContext';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export function DailySummary() {
  const { totalKBJU, goal, selectedDate, changeDate } = useKBJU();

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

  const formatShowDate = (dStr: string) => {
    const d = new Date(dStr);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (dStr === today) return 'Сегодня';
    if (dStr === yesterday) return 'Вчера';
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  };

  const remainingCalories = Math.max(0, goal.calories - totalKBJU.calories);

  const nutrients = [
    { key: 'proteins', label: 'Белки',    unit: 'г',    color: 'bg-emerald-400' },
    { key: 'fats',     label: 'Жиры',     unit: 'г',    color: 'bg-amber-400' },
    { key: 'carbs',    label: 'Углеводы', unit: 'г',    color: 'bg-sky-400' },
  ];

  return (
    <div className="space-y-6">
      {/* 📅 Календарь переключения дат */}
      <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-2xl border border-slate-700/50">
        <button onClick={handlePrevDay} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 font-bold text-white text-sm">
          <Calendar className="w-4 h-4 text-blue-400" />
          <span>{formatShowDate(selectedDate)}</span>
          <span className="text-xs text-slate-500">({selectedDate})</span>
        </div>
        <button onClick={handleNextDay} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* 📊 Сводка лимитов */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700/40 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Осталось</div>
          <div className="text-2xl md:text-3xl font-extrabold text-emerald-400 font-mono">{remainingCalories}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">ккал</div>
        </div>

        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700/40 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Съедено</div>
          <div className="text-2xl md:text-3xl font-extrabold text-sky-400 font-mono">{totalKBJU.calories}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">из {goal.calories}</div>
        </div>

        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700/40 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Процент</div>
          <div className="text-2xl md:text-3xl font-extrabold text-amber-400 font-mono">
            {goal.calories > 0 ? Math.round((totalKBJU.calories / goal.calories) * 100) : 0}%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">выполнено</div>
        </div>
      </div>

      {/* Линейные индикаторы макронутриентов */}
      <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-700/40 space-y-4">
        {nutrients.map(({ key, label, unit, color }) => {
          const actual = totalKBJU[key] ?? 0;
          const target = goal[key] ?? 1;
          const pct = Math.min(Math.round((actual / target) * 100), 100);

          return (
            <div key={key} className="flex flex-col">
              <div className="flex justify-between mb-1 text-sm">
                <span className="text-slate-300 font-medium">{label}</span>
                <span className="text-slate-400 font-mono text-xs">{actual} / {target} {unit} ({Math.round((actual / target) * 100)}%)</span>
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
