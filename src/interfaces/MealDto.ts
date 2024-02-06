export interface MealDto {
  mealId: string;
  user: string;
  registrationDate: string;
  occasion: string;
  mealTime: string;
  items: MealItem[];
  public: boolean;
}

interface MealItem {
  type: string;
  name: string;
  portionType: string;
  portionQuantity: string;
}
