/* EXTERNAL MODULES */
import { 
    filter,
    forOwn,
    groupBy,
    isEmpty,
    sumBy 
} from "lodash";
import moment from 'moment';

/* INTERNAL MODULES */
// Utilities
import { groupByMultiple } from "../utils/arrayUtils";

// Interfaces and Types
import { ArrOfObj } from "../../global";
interface productionData {
    date: any,
    gas?: any,
    oil?: any,
    water?: any
}


/**
 * Transforms an array of spills data into yearly totals.
 * 
 * @param data - Array of Objects representing spill data.
 * @returns An object where each property is yearly spills total.
 */
export const calcSpillsTotals = (data: ArrOfObj): {[key: string]: number} => {
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

/**
 * Transforms an array of production data into an object of yearly totals.
 * 
 * @param data - Array of Objects representing oil/gas/water production data.
 * @returns An object where each property is a year's production total.
 */
export const calcProductionTotal = (data: ArrOfObj): {[key: string]: number} => {
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

/**
 * Takes production and spills data then transforms into a collection of yearly spills
 * intensity data.
 * 
 * @param productionData - Array of Objects representing oil/gas/water production data.
 * @param spillData - Array of Objects representing spill data.
 * @returns An array of objects each representing yearly spill intensity.
 */
export const calcSpillIntensity = (productionData: ArrOfObj, spillData: ArrOfObj): ArrOfObj => {
    let totals: any = {}
    let result: any = {}
    // We need to calculate totals for oil, gas, water, and spills
    const dataByProduct = groupBy(productionData, o => o.product);
    for (const key of Object.keys(dataByProduct)) {
            totals[key] = calcProductionTotal(dataByProduct[key].filter((obj: any) => obj.basin === "DJ Basin"))
    }
    totals["spills"] = calcSpillsTotals(spillData.filter((obj: any) => obj.basin === "DJ Basin"))
    // Might move into own function.
    for (const key of Object.keys(totals.spills)) {
        let liquidProduced = 0;
        if (totals?.water?.[key]) {
            liquidProduced += totals.water[key];
        }
        if (totals?.oil?.[key]) {
            liquidProduced += totals.oil[key];
        }
        if (liquidProduced <= 0) {
            continue;
        } else {
            result[key] = totals.spills[key] / (liquidProduced / 1000);
        }
    }
    return result;
}