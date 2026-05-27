import { useState } from 'react';

export function AddEntryModal({ product, onClose, onSave }: any) {
  const [grams, setGrams] = useState(100);
  const [mealType, setMealType] = useState('snack');

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200 p-4">
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <h2 className="text-2xl font-bold text-white mb-2">{product.name}</h2>
        <p className="text-slate-400 mb-6 text-sm">Укажите вес порции и прием пищи</p>

        <div className="space-y-5 mb-8">
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
