import { useState } from 'react';
import { calculateKBJU } from '../utils/kbju.calculator';

export function AddEntryModal({ product, onClose, onSave }: any) {
  const [grams, setGrams] = useState(100);
  const [mealType, setMealType] = useState('snack');

  if (!product) return null;

  // 👇 РАСЧЕТ ИНТЕРАКТИВНОГО ПРЕДПРОСМОТРА КБЖУ НА ЛЕТУ ПРИ СМЕНЕ ВЕСА!
  const preview = calculateKBJU({
    caloriesPer100g: parseFloat(product.calories_per_100g || product.caloriesPer100g || 0),
    proteinsPer100g: parseFloat(product.proteins_per_100g || product.proteinsPer100g || 0),
    fatsPer100g: parseFloat(product.fats_per_100g || product.fatsPer100g || 0),
    carbsPer100g: parseFloat(product.carbs_per_100g || product.carbsPer100g || 0)
  }, grams);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200 p-4">
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <h2 className="text-2xl font-bold text-white mb-2">{product.name}</h2>
        <p className="text-slate-400 mb-6 text-sm">Укажите вес порции и прием пищи</p>

        <div className="space-y-5 mb-6">
          <div>
            <label className="block text-slate-400 text-sm font-semibold mb-2">Масса (в граммах)</label>
            <input 
              type="number" 
              value={grams} 
              onChange={(e) => setGrams(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-sm font-semibold mb-2">Прием пищи</label>
            <select 
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
            >
              <option value="breakfast">🍳 Завтрак</option>
              <option value="lunch">🍲 Обед</option>
              <option value="dinner">🥗 Ужин</option>
              <option value="snack">🍎 Перекус</option>
            </select>
          </div>
        </div>

        {/* 👇 КРАСИВЫЙ БЛОК ПРЕДПРОСМОТРА КБЖУ В РЕАЛЬНОМ ВРЕМЕНИ */}
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 grid grid-cols-4 gap-2 text-center mb-8">
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Ккал</div>
            <div className="text-base font-extrabold text-white font-mono mt-0.5">{preview.calories}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Белки</div>
            <div className="text-base font-extrabold text-emerald-400 font-mono mt-0.5">{preview.proteins}г</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Жиры</div>
            <div className="text-base font-extrabold text-amber-400 font-mono mt-0.5">{preview.fats}г</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Углев.</div>
            <div className="text-base font-extrabold text-sky-400 font-mono mt-0.5">{preview.carbs}г</div>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-300 bg-slate-700/50 hover:bg-slate-700 transition-colors"
          >
            Отмена
          </button>
          <button 
            onClick={() => onSave(product, grams, mealType)}
            className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/30 transition-colors"
          >
            Добавить
          </button>
        </div>
      </div>
    </div>
  );
}
