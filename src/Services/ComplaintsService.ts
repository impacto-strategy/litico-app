/* IMPORT EXTERNAL MODULES */
import {
    flatten,
    filter,
    map
} from 'lodash';

/* IMPORT INTERNAL MODULES */
export const getYearlyComplaintsData = (spillsData: any) => {
    return flatten(map([2017, 2018, 2019, 2020, 2021, 2022], (e) => {
        let comps: any[] = filter(spillsData, (c: any) => {
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