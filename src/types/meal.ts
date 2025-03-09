export interface Meal {
    id: number;
    name: string;
    calories: number;
    consumed: number;
    progress: number;
  }

export interface MealData {
    calories: {
      consumed: number;
      remaining: number;
      target: number;
    };
    nutrients: {
      carbs: { current: number; target: number };
      protein: { current: number; target: number };
      fat: { current: number; target: number };
    };
    meals: Meal[];
  }
