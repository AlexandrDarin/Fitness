import { createContext, useContext, useReducer, ReactNode, useEffect, useCallback, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../../app/contexts/AuthContext';
import { calculateKBJU, sumKBJU } from '../utils/kbju.calculator';
import { toast } from 'sonner';

const KBJUContext = createContext<any>(null);

const API_URL = 'http://localhost:5005/api/kbju'; 
const API_FITNESS_URL = 'http://localhost:5005/api/fitness';

const initialState = {
  diary: [],
  workouts: [], 
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
        workouts: action.payload.workouts, 
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
  const [refresh, setRefresh] = useState(0); 

  const loadKBJUData = useCallback(async () => {
    if (!user) return;
    try {
<<<<<<< HEAD
=======
      // 1. Дневник питания
>>>>>>> 76ad5ad406f60de07e05bda58a7f824a44f50e14
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
        }, Number(item.grams))
      }));

<<<<<<< HEAD
=======
      // 2. Силовые тренировки за день
>>>>>>> 76ad5ad406f60de07e05bda58a7f824a44f50e14
      const wRes = await axios.get(`${API_FITNESS_URL}/user-workouts?userId=${user.id}&date=${state.selectedDate}`);
      const formattedWorkouts = wRes.data.map((w: any) => ({
        id: w.id,
        category: w.category,
        activityName: w.activity_name,
        durationMinutes: Number(w.duration_minutes),
        burnedCalories: Number(w.burned_calories)
      }));

<<<<<<< HEAD
=======
      // 3. Суточные цели
>>>>>>> 76ad5ad406f60de07e05bda58a7f824a44f50e14
      const gRes = await axios.get(`${API_URL}/goals?userId=${user.id}`);
      const goalData = gRes.data ? {
        calories: Number(gRes.data.calories ?? 2000),
        proteins: Number(gRes.data.proteins ?? 120),
        fats: Number(gRes.data.fats ?? 67),
        carbs: Number(gRes.data.carbs ?? 200),
      } : initialState.goal;

      dispatch({ type: 'SET_DATA', payload: { diary: formattedDiary, workouts: formattedWorkouts, goal: goalData } });
    } catch (error) {
      console.error("Ошибка загрузки данных КБЖУ", error);
    }
  }, [user, state.selectedDate]);

  useEffect(() => {
    loadKBJUData();
  }, [user, state.selectedDate, refresh, loadKBJUData]);

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
      setRefresh(prev => prev + 1); 
<<<<<<< HEAD
=======
      toast.success('Добавлено в дневник!');
>>>>>>> 76ad5ad406f60de07e05bda58a7f824a44f50e14
    } catch (error) {
      console.error("Ошибка сохранения записи КБЖУ", error);
    }
  };

  const removeEntry = async (entryId: number) => {
    try {
      await axios.delete(`${API_URL}/diary/${entryId}`);
<<<<<<< HEAD
      setRefresh(prev => prev + 1);
=======
      loadKBJUData();
      toast.success('Запись удалена');
>>>>>>> 76ad5ad406f60de07e05bda58a7f824a44f50e14
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
      setRefresh(prev => prev + 1); 
<<<<<<< HEAD
=======
      toast.success('Суточные цели успешно обновлены!');
>>>>>>> 76ad5ad406f60de07e05bda58a7f824a44f50e14
    } catch (error) {
      console.error("Ошибка обновления целей КБЖУ", error);
    }
  };

<<<<<<< HEAD
=======
  // 👇 ДОБАВИТЬ ТРЕНИРОВКУ КБЖУ В БД (С КАТЕГОРИЯМИ И МИНУТАМИ)
>>>>>>> 76ad5ad406f60de07e05bda58a7f824a44f50e14
  const addWorkout = async (category: string, activityName: string, durationMinutes: number, burnedCalories: number) => {
    if (!user) return;
    try {
      await axios.post(`${API_FITNESS_URL}/user-workouts`, {
        userId: user.id,
        category,
        activityName,
        durationMinutes,
        burnedCalories,
        date: state.selectedDate
      });
      setRefresh(prev => prev + 1);
<<<<<<< HEAD
=======
      toast.success('Тренировка записана!');
>>>>>>> 76ad5ad406f60de07e05bda58a7f824a44f50e14
    } catch (error) {
      console.error("Ошибка сохранения тренировки КБЖУ", error);
    }
  };

  const removeWorkout = async (id: number) => {
    try {
      await axios.delete(`${API_FITNESS_URL}/user-workouts/${id}`);
      setRefresh(prev => prev + 1);
<<<<<<< HEAD
=======
      toast.success('Тренировка удалена');
>>>>>>> 76ad5ad406f60de07e05bda58a7f824a44f50e14
    } catch (error) {
      console.error("Ошибка удаления тренировки КБЖУ", error);
    }
  };

  return (
<<<<<<< HEAD
    <KBJUProvider>
      <KBJUContext.Provider value={{ ...state, addEntry, removeEntry, updateGoal, changeDate, addWorkout, removeWorkout }}>
        {children}
      </KBJUContext.Provider>
    </KBJUProvider>
=======
    <KBJUContext.Provider value={{ ...state, addEntry, removeEntry, updateGoal, changeDate, addWorkout, removeWorkout }}>
      {children}
    </KBJUContext.Provider>
>>>>>>> 76ad5ad406f60de07e05bda58a7f824a44f50e14
  );
}

export const useKBJU = () => useContext(KBJUContext);
