import moment from 'moment';

import { ArrOfObj } from '../../../global';

/**
 * Transforms an array of spills data into yearly totals.
 * 
 * @param data - Array of Objects representing spill data.
 * @returns An object where each property is yearly spills total.
 */
const calcSpillsTotals = (data: ArrOfObj): {[key: string]: number} => {
    let result: {[key: string]: number} = {};
    for (let entry of data) {
        // Handles possible null entries
        const spillVol = (entry.vol_released_oil || 0) + (entry.vol_released_water || 0)
        if (result.hasOwnProperty(moment(entry.date).format('YYYY'))) {
            result[moment(entry.date).format('YYYY')] += spillVol
        } else {
            result[moment(entry.date).format('YYYY')] = spillVol
        }
    }
    return result;
}

export default calcSpillsTotals;