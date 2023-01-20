/* IMPORT EXTERNAL MODULES */
import {
    flatten,
    forOwn,
    map,
    sumBy
} from "lodash";

/* IMPORT INTERNAL MODULES */
import { groupByMultiple } from "../utils/arrayUtils";

export const getEthnicityData = (ethnicity: any) => {
    const result: any = [];
    const organizedData = groupByMultiple(ethnicity, (obj: any) => new Date(obj.date).getFullYear(), 'timeframe');
    forOwn(organizedData, (value: any, key: any) => {
        if (value.hasOwnProperty('yearly')) {
            result.push(flatten(map(value['yearly'], (m: any) => ([
                { label: parseInt(m.date), type: 'White/Caucasian', value: m.num_1 },
                { label: parseInt(m.date), type: 'Black/African American', value: m.num_2 },
                { label: parseInt(m.date), type: 'Asian/Pacific American', value: m.num_3 },
                { label: parseInt(m.date), type: 'Latino/Hispanics', value: m.num_4 },
                { label: parseInt(m.date), type: 'Native American', value: m.num_5 },
                { label: parseInt(m.date), type: 'Other', value: m.num_6 }
            ]))))
        } else if (value.hasOwnProperty('quarterly')) {
            result.push(
                { label: parseInt(value['quarterly'][0].date), type: 'White/Caucasian', value: sumBy(value['quarterly'], (o: any) => o.num_1) },
                { label: parseInt(value['quarterly'][0].date), type: 'Black/African American', value: sumBy(value['quarterly'], (o: any) => o.num_2) },
                { label: parseInt(value['quarterly'][0].date), type: 'Asian/Pacific American', value: sumBy(value['quarterly'], (o: any) => o.num_3) },
                { label: parseInt(value['quarterly'][0].date), type: 'Latino/Hispanics', value: sumBy(value['quarterly'], (o: any) => o.num_4) },
                { label: parseInt(value['quarterly'][0].date), type: 'Native American', value: sumBy(value['quarterly'], (o: any) => o.num_5) },
                { label: parseInt(value['quarterly'][0].date), type: 'Other', value: sumBy(value['quarterly'], (o: any) => o.num_6) }
            )
        } else {
            result.push(
                { label: parseInt(value['monthly'][0].date), type: 'White/Caucasian', value: sumBy(value['monthly'], (o: any) => o.num_1) },
                { label: parseInt(value['monthly'][0].date), type: 'Black/African American', value: sumBy(value['monthly'], (o: any) => o.num_2) },
                { label: parseInt(value['monthly'][0].date), type: 'Asian/Pacific American', value: sumBy(value['monthly'], (o: any) => o.num_3) },
                { label: parseInt(value['monthly'][0].date), type: 'Latino/Hispanics', value: sumBy(value['monthly'], (o: any) => o.num_4) },
                { label: parseInt(value['monthly'][0].date), type: 'Native American', value: sumBy(value['monthly'], (o: any) => o.num_5) },
                { label: parseInt(value['monthly'][0].date), type: 'Other', value: sumBy(value['monthly'], (o: any) => o.num_6) }
            )
        }
    })
    return result;
}