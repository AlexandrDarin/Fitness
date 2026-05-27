import { useState, useEffect } from 'react';
import { useKBJU } from '../store/kbjuContext';
import { AddEntryModal } from './AddEntryModal';
import { CustomProductForm } from './CustomProductForm';

export function FoodSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  const { addEntry } = useKBJU();

  const mockProducts = [
    { id: 1, name: 'Куриная грудка', calories_per_100g: 137, proteins_per_100g: 29.8, fats_per_100g: 1.8, carbs_per_100g: 0 },
    { id: 2, name: 'Яйцо куриное', calories_per_100g: 157, proteins_per_100g: 12.7, fats_per_100g: 11.5, carbs_per_100g: 0.7 },
    { id: 3, name: 'Банан', calories_per_100g: 95, proteins_per_100g: 1.5, fats_per_100g: 0.2, carbs_per_100g: 21.8 },
    { id: 4, name: 'Овсянка', calories_per_100g: 88, proteins_per_100g: 3, fats_per_100g: 1.7, carbs_per_100g: 15 },
  ];

  useEffect(() => {
    if (query.length > 1) {
      setResults(mockProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase())));
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSaveEntry = (product: any, grams: number, mealType: string) => {
    const normalizedProduct = {
      id: product.id, // 👈 ИСПРАВИЛИ БАГ! Теперь ID продукта передается на сервер!
      caloriesPer100g: product.calories_per_100g,
      proteinsPer100g: product.proteins_per_100g,
      fatsPer100g: product.fats_per_100g,
      carbsPer100g: product.carbs_per_100g,
      name: product.name,
      mealType
    };
    addEntry(normalizedProduct, grams); 
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
        placeholder="Начните вводить: Курица, Банан..."
        className="w-full bg-slate-900 border border-slate-700 text-white p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none mb-6"
      />

      <div className="space-y-3">
        {results.map(product => (
          <div key={product.id} className="flex justify-between items-center p-4 bg-slate-900/40 rounded-xl border border-slate-700 hover:border-slate-500 transition-colors">
            <div>
              <div className="text-white font-medium">{product.name}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">
                Ккал: {product.calories_per_100g} | Б: {product.proteins_per_100g} | Ж: {product.fats_per_100g} | У: {product.carbs_per_100g}
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
