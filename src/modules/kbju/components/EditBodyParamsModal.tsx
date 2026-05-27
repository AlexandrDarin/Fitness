import { useState, useEffect } from 'react';
import { useAuth } from '../../../app/contexts/AuthContext';
import { useApp } from '../../../app/contexts/AppContext';
import { X, Loader2, Dumbbell, ShieldAlert, Award } from 'lucide-react';

export function EditBodyParamsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, updateProfile } = useAuth();
  const { getUserMembership } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    weight: user?.weight || 75,
    height: user?.height || 180,
  });

  // Синхронизируем поля при изменении данных юзера
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        weight: user.weight || 75,
        height: user.height || 180,
      });
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  // Получаем абонемент из базы данных
  const membership = getUserMembership(user.id);
  const membershipName = membership 
    ? (membership.type === 'premium' ? '★ Премиум' : membership.type === 'vip' ? '👑 VIP' : '🎫 Базовый') 
    : 'Нет абонемента';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await updateProfile(form);
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-800 rounded-3xl border border-slate-700 max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-blue-600/10 to-blue-600/5 px-6 py-4 flex justify-between items-center border-b border-slate-700">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-blue-400" />
            Параметры здоровья
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-700 rounded-lg transition">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          {/* Статус Абонемента */}
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 flex justify-between items-center mb-4">
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Мой Абонемент</span>
            <span className="text-sm font-extrabold text-blue-400 flex items-center gap-1">
              <Award className="w-4 h-4 text-blue-400" />
              {membershipName}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Вес тела (кг)</label>
            <input 
              type="number" 
              step="0.1"
              value={form.weight} 
              onChange={e => setForm({...form, weight: parseFloat(e.target.value) || 0})}
              className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono"
              required 
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Рост (см)</label>
            <input 
              type="number" 
              value={form.height} 
              onChange={e => setForm({...form, height: parseInt(e.target.value) || 0})}
              className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono"
              required 
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3 pt-6 border-t border-slate-700/50">
            <button 
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-slate-700 text-slate-300 rounded-xl hover:bg-slate-600 transition font-bold"
            >
              Отмена
            </button>
            <button 
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-950"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
