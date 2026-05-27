import { useState } from 'react';
import { useKBJU } from '../store/kbjuContext';
import { Trash2, Plus, Flame, Clock } from 'lucide-react';

export function WorkoutDiary() {
  const { workouts, addWorkout, removeWorkout } = useKBJU();
  const [category, setCategory] = useState('Кардио');
  const [activityName, setActivityName] = useState('Бег на беговой дорожке');
  const [minutes, setMinutes] = useState(30);
  const [calories, setCalories] = useState(300);

  const categories = ['Кардио', 'Силовая', 'Йога', 'Бассейн', 'Единоборства'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addWorkout(category, activityName, minutes, calories);
    setActivityName('');
    setMinutes(30);
    setCalories(300);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
      <form onSubmit={handleSubmit} className="bg-slate-900/30 p-5 rounded-2xl border border-slate-700/50 space-y-4">
        <h3 className="font-bold text-white text-base">Добавить тренировку:</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1.5">Категория</label>
            <select 
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1.5">Название активности</label>
            <input 
              type="text" 
              value={activityName}
              onChange={e => setActivityName(e.target.value)}
              placeholder="Например: Функционально-силовая"
              className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-xl outline-none"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1.5">Время (в минутах)</label>
            <input 
              type="number" 
              value={minutes} 
              onChange={e => setMinutes(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-xl outline-none font-mono"
              required 
            />
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1.5">Активные калории (ккал)</label>
            <input 
              type="number" 
              value={calories} 
              onChange={e => setCalories(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-xl outline-none font-mono"
              required 
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" /> Добавить активность
        </button>
      </form>

      {/* Список выполненных подходов */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-300 text-sm border-b border-slate-700/50 pb-1">Зафиксированные тренировки:</h3>
        {workouts.length === 0 ? (
          <p className="text-slate-500 text-center py-10 italic">Активности за сегодня не найдено</p>
        ) : (
          workouts.map((w: any) => (
            <div key={w.id} className="flex justify-between items-center p-4 bg-slate-900/20 rounded-xl border border-slate-800 group hover:border-slate-700 transition-all">
              <div className="flex items-center gap-3">
                <div className="bg-orange-500/10 p-2.5 rounded-lg">
                  <Flame className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <div className="text-white font-medium">{w.activityName}</div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full text-[10px] uppercase font-bold">{w.category}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-600" /> {w.durationMinutes} мин</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs text-orange-400 font-bold font-mono">+{w.burnedCalories} ккал</span>
                </div>
                <button 
                  onClick={() => removeWorkout(w.id)}
                  className="p-2 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
