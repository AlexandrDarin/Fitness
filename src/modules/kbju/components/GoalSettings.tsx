import { useState, useEffect } from 'react';
import { useKBJU } from '../store/kbjuContext';
import { Sparkles } from 'lucide-react';

export function GoalSettings() {
  const { goal, updateGoal } = useKBJU();
  const [form, setForm] = useState({
    calories: goal.calories,
    proteins: goal.proteins,
    fats: goal.fats,
    carbs: goal.carbs,
  });

  useEffect(() => {
    setForm({
      calories: goal.calories,
      proteins: goal.proteins,
      fats: goal.fats,
      carbs: goal.carbs,
    });
  }, [goal]);

  // 👇 ПРЕСЕТЫ ПОД РАЗНЫЕ ЦЕЛИ
  const applyPreset = (preset: 'loss' | 'gain' | 'balance') => {
    const presets = {
      loss: { calories: 1600, proteins: 130, fats: 50, carbs: 160 },
      gain: { calories: 2700, proteins: 160, fats: 80, carbs: 335 },
      balance: { calories: 2000, proteins: 120, fats: 67, carbs: 230 },
    };
    setForm(presets[preset]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateGoal(form);
  };

  return (
    <form onSubmit={handleSave} className="space-y-5 max-w-md mx-auto py-4 animate-in fade-in duration-300">
      <h2 className="text-xl font-bold text-white mb-2">Настройка суточных лимитов</h2>
      <p className="text-sm text-slate-400 mb-6">Укажите ваши целевые нормы или воспользуйтесь быстрыми пресетами</p>

      {/* Быстрые пресеты */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <button type="button" onClick={() => applyPreset('loss')} className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 py-2.5 rounded-xl text-xs font-bold border border-rose-500/20 transition-all flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> Похудение
        </button>
        <button type="button" onClick={() => applyPreset('gain')} className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 py-2.5 rounded-xl text-xs font-bold border border-amber-500/20 transition-all flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> Набор массы
        </button>
        <button type="button" onClick={() => applyPreset('balance')} className="bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 py-2.5 rounded-xl text-xs font-bold border border-sky-500/20 transition-all flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> Баланс
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Калории (ккал)</label>
          <input 
            type="number" 
            value={form.calories} 
            onChange={e => setForm({...form, calories: Number(e.target.value)})}
            className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Белки (г)</label>
            <input 
              type="number" 
              value={form.proteins} 
              onChange={e => setForm({...form, proteins: Number(e.target.value)})}
              className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Жиры (г)</label>
            <input 
              type="number" 
              value={form.fats} 
              onChange={e => setForm({...form, fats: Number(e.target.value)})}
              className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Углеводы (г)</label>
            <input 
              type="number" 
              value={form.carbs} 
              onChange={e => setForm({...form, carbs: Number(e.target.value)})}
              className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono"
              required
            />
          </div>
        </div>
      </div>

      <button 
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 mt-6"
      >
        Сохранить цели КБЖУ
      </button>
    </form>
  );
}
