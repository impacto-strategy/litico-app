interface ObjofAny {
    [key: string]: any
}

/**
 * Helper function for groupByMultiple that goes through each iteratee and adds resulting calculations
 * to results object.
 * @param obj Object that will contain final results.
 * @param item Individual array item to be added to obj.
 * @param iteratees Array of iteratees to determine how to organize object.
 */
const updateResults = (obj: ObjofAny, item: any, iteratees: (Function | string)[]): void => {
    let val: string;

    // Determines how to handle iteratee.
    switch(typeof iteratees[0]) {
        case 'function':
            val = iteratees[0](item);
            break;
        case 'string':
            iteratees[0] === 'length' ? val = item.length : val = item[iteratees[0]];
            break;
        default:
            throw new Error("Iteratee not valid type");
    }

    // Checks if more than one iteratee remains.
    if (iteratees.length > 1) {
        updateResults(obj.hasOwnProperty(val) ? obj[val] : obj[val] = {}, item, iteratees.slice(1));
    // Pushes to array once we've gone through all iteratees.
    } else {
        obj.hasOwnProperty(val) ? obj[val].push(item) : obj[val] = [item];
    }
}

/**
 * Functional tool that organizes an array of data based on one or more factors.
 * Example:
 * - This: groupBy([1.1, 1.3, 2.8], Math.round, (val: number) => val + 2))
 * - Becomes this: { '1': { '3.1': [ 1.1 ], '3.3': [ 1.3 ] }, '3': { '4.8': [ 2.8 ] } }
 * 
 * @param arr Array of values
 * @param iteratee Array of factors to determine how to group values.
 * @returns Object containing keys and potentially nested keys based on factors provided.
 */
export const groupByMultiple = <T,>(arr: T[], ...iteratee: (Function | string)[]): ObjofAny =>  {

    let result: ObjofAny = {};

    if (iteratee.length > 0) {
        arr.forEach((item: T) => {
            updateResults(result, item, iteratee);
        })
        return result;
    } else {
        throw new Error("Atleast one iteratee is required.");
    }
}