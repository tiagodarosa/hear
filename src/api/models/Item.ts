/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Item = {
    type: Item.type;
    name: string;
    portionType: string;
    portionQuantity: string;
};

export namespace Item {

    export enum type {
        BEVERAGE = 'beverage',
        FOOD = 'food',
        OTHER = 'other',
    }


}

