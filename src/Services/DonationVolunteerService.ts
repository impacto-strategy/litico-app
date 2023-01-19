/* IMPORT EXTERNAL MODULES */
import {
    flatten,
    groupBy,
    map,
    sumBy
} from 'lodash';

/* IMPORT INTERNAL MODULES */
import { extractYear } from '../utils/utils';

/**
 * Tranforms data regarding donations from organizations into data that can be displayed
 * visually.
 * @param data - An array of objects representing donation data from various organizations.
 * @returns An array of objects representing transformed data.
 */
export const getDonationData = (data: any) => {
    return flatten(map(groupBy(data, (o: any) => extractYear(o.date)), (year: any) => ([
        {label: extractYear(year[0].date), value: sumBy(year, (obj: any) => obj.value)}
    ]))).reverse()
}

/**
 * Tranforms data regarding volunteer hours from organizations into data that can be displayed
 * visually.
 * @param data - An array of objects representing volunteer data from various organizations.
 * @returns An array of objects representing transformed data.
 */
export const getVolunteerHours = (data: any) => {
    return flatten(map(groupBy(data, (o: any) => extractYear(o.date)), (year: any) => ([
       {label: extractYear(year[0].date), value: sumBy(year, (obj: any) => obj.value)}
   ]))).reverse()
}