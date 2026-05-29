import { useState } from 'react';
import { useKBJU } from '../store/kbjuContext';

export function CustomProductForm({ onCancel }: { onCancel: () => void }) {
  const { addEntry } = useKBJU();
  const [form, setForm] = useState({ name: '', kcal: '', p: '', f: '', c: '' });

  const handleSave = () => {
    if (!form.name || !form.kcal) return alert('Заполните Название и Калории!');
    
    const newProduct = {
      name: form.name,
      caloriesPer100g: Number(form.kcal),
      proteinsPer100g: Number(form.p || 0),
      fatsPer100g: Number(form.f || 0),
      carbsPer100g: Number(form.c || 0),
      mealType: 'snack'
    };
    
    // Сразу добавляем 100г этого продукта в дневник
    addEntry(newProduct, 100);
    alert('Продукт сохранен и 100г добавлено в дневник!');
    onCancel();
  };

  return (
    <div className="space-y-4 animate-in fade-in zoom-in duration-300">
      <h2 className="text-xl font-bold text-white mb-6">Создание своего продукта</h2>
      
      <div>
        <label className="text-xs text-slate-400 uppercase">Название продукта</label>
        <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white mt-1" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate-400 uppercase">Калории (на 100г)</label>
          <input type="number" value={form.kcal} onChange={e => setForm({...form, kcal: e.target.value})} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white mt-1" />
        </div>
        <div>
          <label className="text-xs text-slate-400 uppercase">Белки</label>
          <input type="number" value={form.p} onChange={e => setForm({...form, p: e.target.value})} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white mt-1" />
        </div>
        <div>
          <label className="text-xs text-slate-400 uppercase">Жиры</label>
          <input type="number" value={form.f} onChange={e => setForm({...form, f: e.target.value})} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white mt-1" />
        </div>
        <div>
          <label className="text-xs text-slate-400 uppercase">Углеводы</label>
          <input type="number" value={form.c} onChange={e => setForm({...form, c: e.target.value})} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white mt-1" />
        </div>
      </div>

      <div className="flex gap-3 pt-6">
        <button onClick={onCancel} className="flex-1 px-4 py-3 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors font-bold">
          Отмена
        </button>
        <button onClick={handleSave} className="flex-[2] bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-900/30 transition-all">
          Сохранить и съесть
        </button>
      </div>
    </div>
  );
}
