import {
    sumBy
} from 'lodash';

import { groupByMultiple } from "../../utils/arrayUtils";
import { ArrOfObj } from "../../../global";

/**
 * Transforms an array of production data into an object of yearly totals.
 * 
 * @param data - Array of Objects representing oil/gas/water production data.
 * @returns An object where each property is a year's production total.
 */
const calcProductionTotal = (data: ArrOfObj): {[key: string]: number} => {
    // Helps handle timeframe and year.
    const sortedData: any = groupByMultiple(data, "year", "timeframe")
    let result: {[key: string]: number} = {}
    for (const key of Object.keys(sortedData)) {
        // Handles only yearly data scenarios.
        if (sortedData[key].hasOwnProperty("yearly")) {
            result[key] = sumBy(sortedData[key].yearly, (o: any) => o.amount)
        }
    }
    return result
}

export default calcProductionTotal;