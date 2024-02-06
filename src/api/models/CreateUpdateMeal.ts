/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { MealItem } from './MealItem';
import type { Occasion } from './Occasion';

export type CreateUpdateMeal = {
    occasion: Occasion;
    mealTime: string;
    items: MealItem;
    public: boolean;
};

