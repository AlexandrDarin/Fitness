import { useState, useEffect } from 'react';
import axios from 'axios';
import { useKBJU } from '../store/kbjuContext';
import { AddEntryModal } from './AddEntryModal';
import { CustomProductForm } from './CustomProductForm';
import { Clock } from 'lucide-react';

export function FoodSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  const [recentFoods, setRecentFoods] = useState<any[]>([]); 
  const { addEntry } = useKBJU();

  // Загружаем недавно съеденные продукты (лимит расширен до 15!)
  useEffect(() => {
    const saved = localStorage.getItem('recent_foods');
    if (saved) {
      setRecentFoods(JSON.parse(saved).slice(0, 15)); // 👈 Расширили лимит!
    }
  }, []);

  useEffect(() => {
    if (query.length > 1) {
      axios.get(`http://localhost:5005/api/kbju/products?q=${encodeURIComponent(query)}`)
        .then(res => setResults(res.data))
        .catch(e => console.error("Ошибка поиска продуктов", e));
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSaveEntry = (product: any, grams: number, mealType: string) => {
    const normalizedProduct = {
      id: product.id, 
      caloriesPer100g: parseFloat(product.calories_per_100g || product.caloriesPer100g),
      proteinsPer100g: parseFloat(product.proteins_per_100g || product.proteinsPer100g),
      fatsPer100g: parseFloat(product.fats_per_100g || product.fatsPer100g),
      carbsPer100g: parseFloat(product.carbs_per_100g || product.carbsPer100g),
      name: product.name,
      mealType
    };
    addEntry(normalizedProduct, grams); 

    // Сохраняем в список недавно употребленных (до 15 позиций)
    const updatedRecents = [product, ...recentFoods.filter(p => p.id !== product.id)].slice(0, 15);
    setRecentFoods(updatedRecents);
    localStorage.setItem('recent_foods', JSON.stringify(updatedRecents));

    setSelectedProduct(null); 
    setQuery(''); 
  };

  if (isCreatingCustom) {
    return <CustomProductForm onCancel={() => setIsCreatingCustom(false)} />;
  }

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-300">
      <h2 className="text-xl font-bold mb-4 text-white">Поиск продуктов</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Начните вводить: Курица, Банан, Кола..."
        className="w-full bg-slate-900 border border-slate-700 text-white p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none mb-6"
      />

      {/* Список недавно съеденных продуктов */}
      {query.length === 0 && recentFoods.length > 0 && (
        <div className="space-y-3 mb-6 animate-in fade-in duration-300">
          <h3 className="text-sm font-bold text-slate-400 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-500" />
            Недавно употребленные (до 15 позиций):
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {recentFoods.map(product => (
              <div key={`recent_${product.id}`} className="flex justify-between items-center p-4 bg-slate-900/20 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                <div>
                  <div className="text-white font-medium">{product.name}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mt-1 font-mono">
                    Ккал: {parseFloat(product.calories_per_100g || product.caloriesPer100g)}
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedProduct(product)}
                  className="bg-slate-700/60 hover:bg-blue-600 hover:text-white text-slate-300 px-4 py-2 rounded-lg font-bold text-sm transition-all"
                >
                  +
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {results.map(product => (
          <div key={product.id} className="flex justify-between items-center p-4 bg-slate-900/40 rounded-xl border border-slate-700 hover:border-slate-500 transition-colors">
            <div>
              <div className="text-white font-medium">{product.name}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mt-1 font-mono">
                Ккал: {parseFloat(product.calories_per_100g)} | Б: {parseFloat(product.proteins_per_100g)} | Ж: {parseFloat(product.fats_per_100g)} | У: {parseFloat(product.carbs_per_100g)}
              </div>
            </div>
            <button 
              onClick={() => setSelectedProduct(product)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all"
            >
              +
            </button>
          </div>
        ))}
      </div>

      {query.length > 1 && results.length === 0 && (
        <div className="text-center py-10">
          <p className="text-slate-400 mb-4">В нашей базе нет такого продукта 😔</p>
          <button 
            onClick={() => setIsCreatingCustom(true)}
            className="px-6 py-3 border border-blue-500 text-blue-400 rounded-xl hover:bg-blue-600 hover:text-white transition-colors"
          >
            Создать свой продукт +
          </button>
        </div>
      )}

      {selectedProduct && (
        <AddEntryModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onSave={handleSaveEntry} 
        />
      )}
    </div>
  );
}
