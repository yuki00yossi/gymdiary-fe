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

export interface MealItem {
  id: number;
  name: string;
  quantity: number;
  base_quantity?: number;
  unit: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface MealDetail {
  id: string;
  date: string;
  timeOfDay: string;
  photo: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  items: MealItem[];
}

export interface AddMealItem {
  meal_item_id: number;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
}

export interface AddMealData {
  date: string;
  time_of_day: string;
  meal_items: AddMealItem[];
  photo_key?: string|null;
}
