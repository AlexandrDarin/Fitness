import { createContext, useContext, useReducer, ReactNode, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../../app/contexts/AuthContext';
import { calculateKBJU, sumKBJU } from '../utils/kbju.calculator';
import { toast } from 'sonner';

const KBJUContext = createContext<any>(null);

const API_URL = 'http://localhost:5005/api/kbju'; 

const initialState = {
  diary: [],
  goal: { calories: 2000, proteins: 120, fats: 67, carbs: 200 },
  totalKBJU: { calories: 0, proteins: 0, fats: 0, carbs: 0 },
  selectedDate: new Date().toISOString().split('T')[0],
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case 'SET_DATA':
      return { 
        ...state, 
        diary: action.payload.diary, 
        goal: action.payload.goal,
        totalKBJU: sumKBJU(action.payload.diary) 
      };
    case 'SET_DATE':
      return { ...state, selectedDate: action.payload };
    default:
      return state;
  }
}

export function KBJUProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadKBJUData = useCallback(async () => {
    if (!user) return;
    try {
      const dRes = await axios.get(`${API_URL}/diary?userId=${user.id}&date=${state.selectedDate}`);
      const formattedDiary = dRes.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        grams: item.grams,
        mealType: item.meal_type,
        kbju: calculateKBJU({
          caloriesPer100g: item.calories_per_100g,
          proteinsPer100g: item.proteins_per_100g,
          fatsPer100g: item.fats_per_100g,
          carbsPer100g: item.carbs_per_100g
        }, item.grams)
      }));

      const gRes = await axios.get(`${API_URL}/goals?userId=${user.id}`);
      const goalData = gRes.data ? {
        calories: Number(gRes.data.calories),
        proteins: Number(gRes.data.proteins),
        fats: Number(gRes.data.fats),
        carbs: Number(gRes.data.carbs),
      } : initialState.goal;

      dispatch({ type: 'SET_DATA', payload: { diary: formattedDiary, goal: goalData } });
    } catch (error) {
      console.error("Ошибка загрузки данных КБЖУ", error);
    }
  }, [user, state.selectedDate]);

  useEffect(() => {
    loadKBJUData();
  }, [user, state.selectedDate, loadKBJUData]);

  const changeDate = (date: string) => {
    dispatch({ type: 'SET_DATE', payload: date });
  };

  const addEntry = async (product: any, grams: number) => {
    if (!user) return;
    try {
      await axios.post(`${API_URL}/diary`, {
        userId: user.id,
        product_id: product.id,
        grams: grams,
        meal_type: product.mealType || 'snack',
        date: state.selectedDate
      });
      loadKBJUData(); 
      toast.success('Добавлено в дневник!');
    } catch (error) {
      console.error("Ошибка сохранения записи КБЖУ", error);
    }
  };

  const removeEntry = async (entryId: number) => {
    try {
      await axios.delete(`${API_URL}/diary/${entryId}`);
      loadKBJUData();
      toast.success('Запись удалена');
    } catch (error) {
      console.error("Ошибка удаления записи КБЖУ", error);
    }
  };

  const updateGoal = async (newGoal: any) => {
    if (!user) return;
    try {
      await axios.put(`${API_URL}/goals`, {
        userId: user.id,
        ...newGoal
      });
      loadKBJUData();
      toast.success('Суточные цели успешно обновлены!');
    } catch (error) {
      console.error("Ошибка обновления целей КБЖУ", error);
    }
  };

  return (
    <KBJUContext.Provider value={{ ...state, addEntry, removeEntry, updateGoal, changeDate }}>
      {children}
    </KBJUContext.Provider>
  );
}

export const useKBJU = () => useContext(KBJUContext);
