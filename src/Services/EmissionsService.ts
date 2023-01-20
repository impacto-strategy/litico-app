/* IMPORT EXTERNAL MODULES */
import {
    map,
    sumBy,
    uniq,
} from 'lodash';

/* IMPORT INTERNAL MODULES */
import { getYearlyProductionData } from './ProductionService';
import { groupByMultiple } from '../utils/arrayUtils';
import { getPossibleDates } from '../utils/dateUtils';

/**
 * Creates individual data piece based on what timeframe is available.
 * 
 * @param data - An object representing emission data for a year and specifc basin organized by timeframe.
 */
export const handleDataTimeFrame = (data: any, production: any, date: string) => {
    if (data.hasOwnProperty('yearly')) {
        return {
            basin: data['yearly'][0].basin,
            intensity: (data['yearly'][0].denominator || 0) / (production.water || 0 + (production.gas || 0) / 6) || 0,
            label: `${data['yearly'][0].basin} Emissions Intensity (mt/BoE)`,
            name: "GHG Emissions (CO2e)",
            type: date,
            value: data['yearly'][0].denominator || 0,
        }
    } else if (data.hasOwnProperty('quarterly')) {
        const emissions = sumBy(data['quarterly'], (o: any) => o.denominator) || 0
        return {
            basin: data['quarterly'][0].basin,
            intensity: emissions / (production.water || 0 + (production.gas || 0) / 6) || 0,
            label: `${data['quarterly'][0].basin} Emissions Intensity (mt/BoE)`,
            name: "GHG Emissions (CO2e)",
            type: date,
            value: emissions
        }
    } else {
        const emissions = sumBy(data['quarterly'], (o: any) => o.denominator) || 0
        return {
            basin: data['monthly'][0].basin,
            intensity: emissions / (production.water || 0 + (production.gas || 0) / 6) || 0,
            label: `${data['monthly'][0].basin} Emissions Intensity (mt/BoE)`,
            name: "GHG Emissions (CO2e)",
            type: date,
            value: emissions,
        }
    }
}

/**
 * Transforms a collection of emissions data into yearly data based on basin and calculates
 * intensity for each basin.
 * 
 * @param emissionsData - An array of objects representing unrefined emissions data
 * @param productionData - An array of objects representing unrefined production data.
 * @returns An array of objects representing transformed emissions data.
 */
export const getYearlyEmissionsData = (emissionsData: any, productionData: any) => {
    if (emissionsData.length === 0 || productionData.length === 0) {
        return []
    }

    let result: any = [];
    // Extract dates from data.
    let dates = getPossibleDates(emissionsData);
    let groupedData = groupByMultiple(emissionsData, (obj: any) => new Date(obj.date).getFullYear(), 'basin', 'timeframe');
    // Extract Types of Basin from data
    let basins = uniq(map(emissionsData, 'basin')).sort().filter((i: any) => typeof i === 'string');

    // Transforms production data into yearly data that's grouped by basin and date.
    const productionByBasin = groupByMultiple(productionData, (o: any) => o.basin);
    let totalProductionByBasin: any = {};
    basins.forEach((basin: any) => {
        totalProductionByBasin[basin] = groupByMultiple(getYearlyProductionData(productionByBasin[basin]), (o: any) => o.date);
    })

    dates.forEach((date: any) => {
        if (groupedData.hasOwnProperty(date)) {
            basins.forEach((basin: any) => {
                result.push(handleDataTimeFrame(groupedData[date][basin], totalProductionByBasin[basin][date][0], date));
            })
        } 
        // Handles scenario data for that specific year is missing
        else {
            basins.forEach((basin: any) => {
                result.push({
                    basin: basin,
                    intensity: 0,
                    label: `${basin} Emissions Intensity (mt/BoE)`,
                    name: "GHG Emissions (CO2e)",
                    type: date,
                    value: 0,
                })
            })
        }
    })
    return result;
}