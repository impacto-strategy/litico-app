/* IMPORT EXTERNAL MODULES */

/* IMPORT INTERNAL MODULES */
import { groupByMultiple } from '../utils/arrayUtils';
import { getPossibleDates } from '../utils/dateUtils';

export const getYearlyEmissionsData = (emissionsData: any) => {
    // Extract dates from data.
    let dates = getPossibleDates(emissionsData);
    let groupedData = groupByMultiple(emissionsData, 'basin', (obj: any) => new Date(obj.date).getFullYear(), 'timeframe');
    // Extract Types of Basin from data
    // let basins = uniq(map(emissionsData, 'basin')).sort().filter(i => typeof i === 'string');
    // console.log("What about Basins?", basins);

    /*
        Some notes on tackling this challenge:
        - Let's collect dates then add those missing in between.
        - We'll also need to groupBy basin as well.
        - Iterate, add data, and leave those missing with 0.
    */
}

const sampleData = [
    {
        basin: "DJ Basin",
        date: "2021",
        timeframe: "Monthly",
        value: 20000
    }
]