/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { MealItem } from './MealItem';
import type { Occasion } from './Occasion';

export type Meal = {
    mealId?: string;
    user?: string;
    registrationDate?: string;
    occasion: Occasion;
    mealTime: string;
    items: MealItem;
    public?: boolean;
};

