import {
    flatten,
    filter,
    map
} from 'lodash';

const getGenderData = (metrics: any) => {
    return flatten(map(filter(metrics.esg_metrics, { 'metric_subtype': 'Workforce Demographics - Gender' }), (m: any) => ([
        { label: parseInt(m.date), type: 'Female', value: m.num_2 },
        { label: parseInt(m.date), type: 'Male', value: m.num_1 },
        { label: parseInt(m.date), type: 'Non-Binary', value: m.num_3 },
        { label: parseInt(m.date), type: 'No Response', value: m.num_4 }
    ])))
}

export default getGenderData;