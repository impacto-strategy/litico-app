/* IMPORT EXTERNAL MODULES */
import {
    flatten,
    groupBy,
    map,
    sumBy
} from 'lodash';

/* IMPORT INTERNAL MODULES */
import { extractYear } from '../utils/utils';

export const getDonationData = (data: any) => {
    return flatten(map(groupBy(data, (o: any) => extractYear(o.date)), (year: any) => ([
        {label: extractYear(year[0].date), value: sumBy(year, (obj: any) => obj.value)}
    ]))).reverse()
}

export const getVolunteerHours = (data: any) => {
    return flatten(map(groupBy(data, (o: any) => extractYear(o.date)), (year: any) => ([
       {label: extractYear(year[0].date), value: sumBy(year, (obj: any) => obj.value)}
   ]))).reverse()
}