import { db } from "../server";
import { CreateUpdateMeal, Item, Meal, Occasion } from "../api";
import { randomUUID } from "crypto";
import {
  BusinessLogicError,
  NotFoundError,
  UnauthorizedError,
} from "../util/Exceptions";
import { MealDto } from "../interfaces/MealDto";

export interface IMealsService {
  logMealEntry(user: string, meal: CreateUpdateMeal): Promise<void>;
  viewMealEntries(user: string, skip: number, top: number): Promise<Meal[]>;
  viewPublicMealEntries(skip: number, top: number): Promise<Meal[]>;
  updateMealEntry(
    user: string,
    mealId: string,
    meal: CreateUpdateMeal
  ): Promise<void>;
}

export class MealsService implements IMealsService {
  private UPDATE_LIMIT_MINUTES: number = 0;

  constructor(updateLimitMinutes?: number) {
    this.UPDATE_LIMIT_MINUTES = updateLimitMinutes || 1;
  }

  async logMealEntry(user: string, meal: CreateUpdateMeal): Promise<void> {
    // TODO: Middleware to handle authentication and authorization
    if (!user) {
      throw new UnauthorizedError("Unauthorized");
    }
    // TODO: Create a service to handle database calls
    const mealsCollection = db.collection("meals");
    const newMeal: MealDto = {
      ...meal,
      user,
      mealId: randomUUID(),
      registrationDate: new Date().toISOString(),
    };
    await mealsCollection.insertOne(newMeal);
    return;
  }

  async viewMealEntries(user: string, skip = 0, top = 100): Promise<Meal[]> {
    // TODO: Middleware to handle authentication and authorization
    if (!user) {
      throw new UnauthorizedError("Unauthorized");
    }
    // TODO: Create a service to handle database calls
    const mealsCollection = db.collection<MealDto>("meals");
    const existingMeals = await mealsCollection
      .find({ user }, { skip, limit: top })
      .toArray();
    return this.parseDtoToMeal(existingMeals);
  }

  async viewPublicMealEntries(skip = 0, top = 100): Promise<Meal[]> {
    const mealsCollection = db.collection<MealDto>("meals");
    const existingMeals = await mealsCollection
      .find({ public: true }, { skip, limit: top })
      .toArray();
    return this.parseDtoToMeal(existingMeals);
  }

  async updateMealEntry(
    user: string,
    mealId: string,
    meal: CreateUpdateMeal
  ): Promise<void> {
    // TODO: Middleware to handle authentication and authorization
    if (!user) {
      throw new UnauthorizedError("Unauthorized");
    }
    // TODO: Create a service to handle database calls
    const mealsCollection = db.collection<MealDto>("meals");
    const existingMeal = await mealsCollection.findOne({ mealId, user });
    if (!existingMeal) {
      throw new NotFoundError("Not found");
    }
    const limitDate = new Date(existingMeal.registrationDate);
    limitDate.setMinutes(limitDate.getMinutes() + this.UPDATE_LIMIT_MINUTES);
    const currentDate = new Date();
    if (currentDate > limitDate) {
      throw new BusinessLogicError(
        `It's not possible to update the meal after ${this.UPDATE_LIMIT_MINUTES} minutes its creation`
      );
    }
    // TODO: Question: is it an issue to provide multiple updates or should we add an ETAG to handle concurrency?
    await mealsCollection.updateOne(
      { mealId },
      {
        $set: {
          occasion: meal.occasion,
          mealTime: meal.mealTime,
          items: meal.items,
          public: meal.public,
        },
      }
    );
    return;
  }

  private parseDtoToMeal(existingMeals: MealDto[]): Meal[] {
    const meals = existingMeals.map((m) => {
      const meal: Meal = {
        mealId: m.mealId,
        user: m.user,
        occasion: m.occasion as Occasion,
        mealTime: m.mealTime,
        items: m.items as Item[],
        public: m.public,
      };
      return meal;
    });
    return meals;
  }
}
