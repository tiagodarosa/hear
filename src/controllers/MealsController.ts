import { Request, Response, NextFunction } from "express";
import { AsyncRequestMethod, BaseController } from "./BaseController";
import { CreateUpdateMeal, Meal } from "../api";
import { IMealsService, MealsService } from "../services/MealsService";

export const logMealEntry = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  void controller.logMealEntry(req, res, next);
};

export const viewMealEntries = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  void controller.viewMealEntries(req, res, next);
};

export const viewPublicMealEntries = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  void controller.viewPublicMealEntries(req, res, next);
};

export const updateMealEntry = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  void controller.updateMealEntry(req, res, next);
};

class MealsController extends BaseController {
  constructor(private readonly mealsService: IMealsService) {
    super();
  }

  logMealEntry(req: Request, res: Response, next: NextFunction): void {
    this.processAsyncRequestMethod(
      req,
      res,
      next,
      (async (req: Request): Promise<void> => {
        const user = getToken(req);
        const meal = req.body as CreateUpdateMeal;
        return await this.mealsService.logMealEntry(user, meal);
      }).bind(this) as AsyncRequestMethod
    );
  }

  viewMealEntries(req: Request, res: Response, next: NextFunction): void {
    this.processAsyncRequestMethod(
      req,
      res,
      next,
      (async (req: Request): Promise<Meal[]> => {
        const { skip, top } = req.query;
        const user = getToken(req);
        return await this.mealsService.viewMealEntries(
          user,
          parseInt(skip as string),
          parseInt(top as string)
        );
      }).bind(this) as AsyncRequestMethod
    );
  }

  viewPublicMealEntries(req: Request, res: Response, next: NextFunction): void {
    this.processAsyncRequestMethod(
      req,
      res,
      next,
      (async (req: Request): Promise<Meal[]> => {
        const user = getToken(req);
        const { skip, top } = req.query;
        return await this.mealsService.viewPublicMealEntries(
          parseInt(skip as string),
          parseInt(top as string)
        );
      }).bind(this) as AsyncRequestMethod
    );
  }

  updateMealEntry(req: Request, res: Response, next: NextFunction): void {
    this.processAsyncRequestMethod(
      req,
      res,
      next,
      (async (req: Request): Promise<void> => {
        const user = getToken(req);
        const { mealId } = req.params;
        const meal = req.body as CreateUpdateMeal;
        return await this.mealsService.updateMealEntry(user, mealId, meal);
      }).bind(this) as AsyncRequestMethod
    );
  }
}

function getToken(request: Request): string | undefined {
  const authHeader = request.headers["authorization"] as string;
  const tokenParts = authHeader ? authHeader.split(" ") : undefined;
  if (tokenParts?.length === 2 && tokenParts[0] === "Bearer") {
    const token = tokenParts[1];
    return token;
  }
}

//TODO: Use an environment variable to update this information when necessary
const minutesToEditMeal = 1;
const mealsService = new MealsService(minutesToEditMeal);
const controller = new MealsController(mealsService);
