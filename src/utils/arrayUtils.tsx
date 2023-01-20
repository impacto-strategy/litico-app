import { groupBy } from "lodash";

/**
 * An extension of Lodash's groupBy function. This method allows you to group collections
 * by more than one category.
 * 
 * @remarks 
 * Would like to explore making function more efficient. Maybe having it only go through
 * the collection once?
 */
export const groupByFactors = (collection: any, iteratee1: any, iteratee2: any): object => {
    const firstObj = groupBy(collection, iteratee1);
    const result: any = {};
    // Iterate through object.
    for (const key of Object.keys(firstObj)) {
        result[key] = groupBy(firstObj[key], iteratee2);
    }
    return result;
}