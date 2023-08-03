import {
    flatten,
    filter,
    map
} from 'lodash';

const getEthnicityData = (metrics: any) => {
    return flatten(map(filter(metrics.esg_metrics, { 'metric_subtype': 'Workforce Demographics - Ethnicity' }), (m: any) => ([
        { label: parseInt(m.date), type: 'White/Caucasian', value: m.num_1 },
        { label: parseInt(m.date), type: 'Black/African American', value: m.num_2 },
        { label: parseInt(m.date), type: 'Asian/Pacific American', value: m.num_3 },
        { label: parseInt(m.date), type: 'Latino/Hispanics', value: m.num_4 },
        { label: parseInt(m.date), type: 'Native American', value: m.num_5 },
        { label: parseInt(m.date), type: 'Other', value: m.num_6 }
    ])))
}

export default getEthnicityData;