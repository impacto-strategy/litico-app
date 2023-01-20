/* IMPORT EXTERNAL MODULES */
import {
    flatten,
    forOwn,
    map,
    sumBy
} from "lodash";

/* IMPORT INTERNAL MODULES */
import { groupByMultiple } from "../utils/arrayUtils";

export const getGenderData = (gender: any) => {
    let result: any = [];
    const organizedData = groupByMultiple(gender, (obj: any) => new Date(obj.date).getFullYear(), 'timeframe');
    forOwn(organizedData, (value: any, key: any) => {
        if (value.hasOwnProperty('yearly')) {
            result.push(flatten(map(value['yearly'], (m: any) => ([
                { label: parseInt(m.date), type: 'Female', value: m.num_2 },
                { label: parseInt(m.date), type: 'Male', value: m.num_1 },
                { label: parseInt(m.date), type: 'Non-Binary', value: m.num_3 },
                { label: parseInt(m.date), type: 'No Response', value: m.num_4 }
            ]))))
        } else if (value.hasOwnProperty('quarterly')) {
            result.push(
                { label: parseInt(value['quarterly'][0].date), type: 'Female', value: sumBy(value['quarterly'], (o: any) => o.num_2) },
                { label: parseInt(value['quarterly'][0].date), type: 'Male', value: sumBy(value['quarterly'], (o: any) => o.num_1) },
                { label: parseInt(value['quarterly'][0].date), type: 'Non-Binary', value: sumBy(value['quarterly'], (o: any) => o.num_3) },
                { label: parseInt(value['quarterly'][0].date), type: 'No Response', value: sumBy(value['quarterly'], (o: any) => o.num_4) }
            )
        } else {
            result.push(
                { label: parseInt(value['monthly'][0].date), type: 'Female', value: sumBy(value['monthly'], (o: any) => o.num_2) },
                { label: parseInt(value['monthly'][0].date), type: 'Male', value: sumBy(value['monthly'], (o: any) => o.num_1) },
                { label: parseInt(value['monthly'][0].date), type: 'Non-Binary', value: sumBy(value['monthly'], (o: any) => o.num_3) },
                { label: parseInt(value['monthly'][0].date), type: 'No Response', value: sumBy(value['monthly'], (o: any) => o.num_4) }
            )
        }
    })
    return result;
}