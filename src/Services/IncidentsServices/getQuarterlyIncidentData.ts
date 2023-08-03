import {
    filter,
    sortBy
} from 'lodash';

/**
 * Takes incident data and revamps to new collection of incident data and TRIR.
 * 
 * @returns - Array of Objects
 */
const getQuarterlyIncidentData = (metrics: any) => {
    let data: any = [];
    let organizedData: any = [];

    organizedData = sortBy(filter(metrics.esg_metrics, { 'metric_subtype': 'TRIR - All Workers' }), (metric) => new Date(metric.date))
    for (let i = 0; i < organizedData.length; i++) {
        let cleanDate = new Date(organizedData[i].date);
        let displayedDate = ''
        if (cleanDate.getMonth() <= 3) {
            displayedDate = `1Q ${cleanDate.getFullYear()}`
        } else if (cleanDate.getMonth() < 7) {
            displayedDate = `2Q ${cleanDate.getFullYear()}`
        } else if (cleanDate.getMonth() < 10) {
            displayedDate = `3Q ${cleanDate.getFullYear()}`
        } else {
            displayedDate = `4Q ${cleanDate.getFullYear()}`
        }
        data.push({
            date: displayedDate,
            incidents: organizedData[i].num_1,
            trir: organizedData[i].value
        })
    }

    return data
}

export default getQuarterlyIncidentData;