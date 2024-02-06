/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateUpdateMeal } from '../models/CreateUpdateMeal';
import type { Meal } from '../models/Meal';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class MealsService {

    /**
     * Logs a new meal
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static logMealEntry(
        requestBody?: CreateUpdateMeal,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/meals',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The request was malformed.  Sending the same request will generally fail again.`,
                401: `The request requires authentication and either you are not authenticated or the provided authentication is not valid.`,
                403: `The authenticated user of the API doesn't have permission.`,
                404: `The requested entity is not found or you do not have authorization to see it.`,
            },
        });
    }

    /**
     * View all meal entries of a user
     * @param skip Number of items to skip during pagination
     * @param top Number of items to return in pagination
     * @returns Meal OK
     * @throws ApiError
     */
    public static viewMealEntries(
        skip: number,
        top: number = 100,
    ): CancelablePromise<Array<Meal>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/meals',
            query: {
                'skip': skip,
                'top': top,
            },
            errors: {
                400: `The request was malformed.  Sending the same request will generally fail again.`,
                401: `The request requires authentication and either you are not authenticated or the provided authentication is not valid.`,
                403: `The authenticated user of the API doesn't have permission.`,
                404: `The requested entity is not found or you do not have authorization to see it.`,
            },
        });
    }

    /**
     * View all public meal entries
     * @param skip Number of items to skip during pagination
     * @param top Number of items to return in pagination
     * @returns Meal OK
     * @throws ApiError
     */
    public static viewPublicMealEntries(
        skip: number,
        top: number = 100,
    ): CancelablePromise<Array<Meal>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/meals/public',
            query: {
                'skip': skip,
                'top': top,
            },
            errors: {
                400: `The request was malformed.  Sending the same request will generally fail again.`,
                401: `The request requires authentication and either you are not authenticated or the provided authentication is not valid.`,
                403: `The authenticated user of the API doesn't have permission.`,
                404: `The requested entity is not found or you do not have authorization to see it.`,
            },
        });
    }

    /**
     * Updates a meal entry
     * @param mealId
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static updateMealEntry(
        mealId: string,
        requestBody?: CreateUpdateMeal,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/meals/{mealId}',
            path: {
                'mealId': mealId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The request was malformed.  Sending the same request will generally fail again.`,
                401: `The request requires authentication and either you are not authenticated or the provided authentication is not valid.`,
                403: `The authenticated user of the API doesn't have permission.`,
                404: `The requested entity is not found or you do not have authorization to see it.`,
            },
        });
    }

}
