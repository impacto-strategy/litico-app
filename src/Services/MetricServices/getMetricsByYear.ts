import {
    filter,
    find
} from 'lodash';

interface metricsByYearParams {
    basin: string,
    metrics: any,
    metricSubtype: string,
    year: number
}

// Finds all ESG metric data that corresponds to the provided year.
const getMetricsByYear = ({year, basin, metrics, metricSubtype}: metricsByYearParams) => {
    let data = filter(metrics.esg_metrics, { 'metric_subtype': metricSubtype })

    let metricByYear = find(data, (em: any) => {
        if (basin) {
            return new Date(em.date).getFullYear() === year && em.basin === basin
        } else {
            return new Date(em.date).getFullYear() === year
        }
    })

    if (!metricByYear?.value) return null
    return metricByYear
}

export default getMetricsByYear;