import {
    flatten,
    map,
    uniq
} from 'lodash'

import { getMetricsByYear } from '../MetricServices';

const getYearlyEmissionData = (emissions: any, metrics: any) => {
    let dates = uniq(map(emissions, ((metric) => new Date(metric.date).getFullYear()))).sort()
    let basins = uniq(map(emissions, 'basin')).sort().filter(i => typeof i === 'string');
    return flatten(map(dates, ((date: number) => {
        return flatten(map(basins, ((basin: string) => {
            let data = []
            let ghg = getMetricsByYear({year: date, basin, metrics, metricSubtype: 'GHG Emissions'})
            let intensity = getMetricsByYear({year: date, basin, metrics, metricSubtype: 'GHG Intensity - BOE'})
            data.push({
                name: "GHG Emissions (CO2e)",
                type: date,
                value: ghg?.value || 0,
                intensity: intensity?.value || 0,
                basin: basin,
                // Utilized to avoid bugs in GHG Chart
                label: `${basin} Emissions Intensity (mt/BoE)`
            })
            return data
        })))
    })))
}

export default getYearlyEmissionData;