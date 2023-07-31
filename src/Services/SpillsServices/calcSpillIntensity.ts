import {
    groupBy
} from 'lodash';

import { ArrOfObj } from "../../../global";
import { calcProductionTotal } from '../ProductionServices';
import { calcSpillsTotals } from '../SpillsServices';

/**
 * Takes production and spills data then transforms into a collection of yearly spills
 * intensity data.
 * 
 * @param productionData - Array of Objects representing oil/gas/water production data.
 * @param spillData - Array of Objects representing spill data.
 * @returns An array of objects each representing yearly spill intensity.
 */
const calcSpillIntensity = (productionData: ArrOfObj, spillData: ArrOfObj): ArrOfObj => {
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

export default calcSpillIntensity;