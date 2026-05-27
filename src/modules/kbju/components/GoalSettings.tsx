import { useState } from 'react';
import { useKBJU } from '../store/kbjuContext';

export function GoalSettings() {
  const { goal, updateGoal } = useKBJU();
  const [form, setForm] = useState({
    calories: goal.calories,
    proteins: goal.proteins,
    fats: goal.fats,
    carbs: goal.carbs,
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateGoal(form);
  };

  return (
    <form onSubmit={handleSave} className="space-y-5 max-w-md mx-auto py-4 animate-in fade-in duration-300">
      <h2 className="text-xl font-bold text-white mb-2">Настройка суточных лимитов</h2>
      <p className="text-sm text-slate-400 mb-6">Укажите ваши целевые нормы питательных веществ на день</p>

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
