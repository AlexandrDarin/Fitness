import React, { useState } from 'react';

export const KBJUPage = () => {
  const [activeTab, setActiveTab] = useState<'diary' | 'search'>('diary');

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">
        Счётчик КБЖУ 🍎
      </h1>

      {/* Навигация по вкладкам */}
      <div className="flex gap-4 mb-6 border-b border-gray-200 pb-2">
        <button 
          onClick={() => setActiveTab('diary')}
          className={`font-semibold text-lg ${activeTab === 'diary' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          Дневник питания
        </button>
        <button 
          onClick={() => setActiveTab('search')}
          className={`font-semibold text-lg ${activeTab === 'search' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          База продуктов
        </button>
      </div>

      {/* Содержимое вкладок */}
      <div className="bg-white p-6 rounded-lg shadow">
        {activeTab === 'diary' ? (
          <div>
            <h2 className="text-xl font-bold mb-4">Ваш дневник на сегодня</h2>
            <p className="text-gray-500">Записей пока нет. Найдите продукт и добавьте его в дневник.</p>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-4">Поиск продуктов</h2>
            <input 
              type="text" 
              placeholder="Например: Куриная грудка" 
              className="w-full border border-gray-300 p-2 rounded mb-4"
            />
          </div>
        )}
      </div>
    </div>
  );
};
