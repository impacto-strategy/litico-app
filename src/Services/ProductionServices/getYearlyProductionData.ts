import {
    filter,
    forOwn,
    groupBy,
    isEmpty,
    sumBy
} from "lodash";

import { ArrOfObj } from "../../../global";

/**
 * Sums total production for Gas, Water, and Oil by year.
 * Data is organized by product to interact properly with Ant Design's daul axes widget.
 * 
 * @returns - Array of objects
 */
const getYearlyProductionData = (production: any) => {
    let yearlyData: ArrOfObj = [];
    // Outerloop iterates based on year
    forOwn(groupBy(production, 'year'), (value: any, key: any) => {
        const tmp: { [key: string]: any } = {
            date: key
        }
        // Inner loop iterates based on product
        for (const product of ['gas', 'oil', 'water']) {
            const tempGroup = groupBy(filter(value, (o: any) => {
                return o.product === product
            }), "timeframe")
            if (tempGroup.hasOwnProperty('yearly')) {
                if (isEmpty(tempGroup)) {
                    continue;
                }
                if (tempGroup['yearly'][0].product === "gas") {
                    tmp[product] = sumBy(tempGroup['yearly'], 'amount') / 1000
                } else {
                    tmp[product] = sumBy(tempGroup['yearly'], 'amount')
                }
            } else {
                if (isEmpty(tempGroup)) {
                    continue;
                }
                if (tempGroup['monthly'][0].product === "gas") {
                    tmp[product] = sumBy(tempGroup['monthly'], 'amount') / 1000
                } else {
                    tmp[product] = sumBy(tempGroup['monthly'], 'amount')
                }
            }
        }
        yearlyData.push(tmp)
    })
    return yearlyData
}

export default getYearlyProductionData;