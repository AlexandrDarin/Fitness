import { useKBJU } from '../store/kbjuContext';
import { Trash2 } from 'lucide-react';

export function FoodDiary() {
  const { diary, removeEntry } = useKBJU();

  const mealTypes = [
    { id: 'breakfast', label: '🍳 Завтрак' },
    { id: 'lunch',     label: '🍲 Обед' },
    { id: 'dinner',    label: '🥗 Ужин' },
    { id: 'snack',     label: '🍎 Перекус' },
  ];

  if (diary.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-500">
        <span className="text-5xl mb-4">🍽️</span>
        <p className="text-lg italic text-center">Дневник питания пуст.<br />Добавьте продукты через вкладку поиска.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {mealTypes.map((meal) => {
        const mealEntries = diary.filter((entry: any) => entry.mealType === meal.id);
        if (mealEntries.length === 0) return null;

        return (
          <div key={meal.id} className="space-y-3">
            <h3 className="text-lg font-bold text-slate-300 border-b border-slate-700/50 pb-1">{meal.label}</h3>
            <div className="space-y-2">
              {mealEntries.map((entry: any) => (
                <div 
                  key={entry.id} 
                  className="flex justify-between items-center p-4 bg-slate-900/30 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all group"
                >
                  <div className="flex-1">
                    <div className="text-white font-medium">{entry.name}</div>
                    <div className="text-xs text-slate-500 font-mono mt-1">
                      {entry.grams} г • Ккал: {entry.kbju.calories} | Б: {entry.kbju.proteins} | Ж: {entry.kbju.fats} | У: {entry.kbju.carbs}
                    </div>
                  </div>
                  <button 
                    onClick={() => removeEntry(entry.id)}
                    className="p-2 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                    title="Удалить запись"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
