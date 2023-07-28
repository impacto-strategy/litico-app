import {
    flatten,
    filter,
    groupBy,
    map,
    sumBy
} from 'lodash';
import { extractYear } from '../../utils/utils';

const getDonationData = (metrics: any) => {
    return flatten(map(groupBy(filter(metrics.esg_metrics, { 'metric_subtype': 'Social Investment' }), (o: any) => extractYear(o.date)), (year: any) => ([
        { label: extractYear(year[0].date), value: sumBy(year, (obj: any) => obj.value) }
    ]))).reverse()
}

export default getDonationData;