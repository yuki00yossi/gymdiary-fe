export interface FoodItem {
    id: number;
    name: string;
    calories: number;
    base_quantity: number;
    unit: string;
  }

export interface FoodItemPost {
    name: string;
    base_quantity: number;
    calories: number;
    carbs: number;
    fat: number;
    protein: number;
    unit: string;
}
