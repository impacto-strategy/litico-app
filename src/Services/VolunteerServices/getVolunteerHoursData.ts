import {
    flatten,
    filter, 
    groupBy,
    map,
    sumBy
} from 'lodash';

import { extractYear } from '../../utils/utils';

const getVolunteerHoursData = (metrics: any) => {
    return flatten(map(groupBy(filter(metrics.esg_metrics, (o: any) => {
        return o['metric_subtype'] === 'Volunteer Hours' || o['metric_subtype'] === 'Employee Volunteering Match'
    }), (o: any) => extractYear(o.date)), (year: any) => ([
        { label: extractYear(year[0].date), value: sumBy(year, (obj: any) => obj.value) }
    ]))).reverse()
}

export default getVolunteerHoursData;