import {
    flatten,
    groupBy,
    map
} from 'lodash';

import { calcSpillIntensity } from '../ProductionService';

const getYearlySpillsData = (spills: any, production: any) => {
    let spillsCountByYear = groupBy(spills, (e: any) => {
        let date = new Date(e['date'])
        let year = date.getFullYear();
        return year
    });
    const intensityCalc: any = calcSpillIntensity(production, spills);
    return flatten(map(spillsCountByYear, (e, key) => ([
        { name: "Spills Count", type: key, value: e.length, intensity: intensityCalc[key], items: e }
    ])))
}

export default getYearlySpillsData;