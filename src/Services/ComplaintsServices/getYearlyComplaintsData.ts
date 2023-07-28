import {
    flatten,
    filter,
    map
} from 'lodash';

/**
 * Transforms a collection of complaint data so that it can displayed visually.
 * 
 * @param complaints An array of objects representing complaints.
 * @returns New array of objects with transformed complaints data by year.
 */
const getYearlyComplaintsData = (complaints: any) => {
    return flatten(map([2017, 2018, 2019, 2020, 2021, 2022], (e) => {
        let comps: any[] = filter(complaints, (c: any) => {
            const date = new Date(c['date'])
            const year = date.getFullYear()

            return year === e
        })
        return [
            {name: "Complaints Count", type: e, value: comps.length, items: comps }
        ]
    }
    ))
}

export default getYearlyComplaintsData;