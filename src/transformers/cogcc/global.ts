import {sortBy} from "lodash";
import {differenceInBusinessDays} from "date-fns";

export const inspectionsTransformer = (data: any) => {
    if (Array.isArray(data)) {
        return sortBy(data, 'my')
    }
}


export const permitSurveillanceTransformer = (data: any) => {
    if (Array.isArray(data)) {
        return data
            .map(row => {
                row.lat = parseFloat(row.lat)
                row.lng = parseFloat(row.lng)
                row.approvalTime = differenceInBusinessDays(new Date(row['approved_date']), new Date(row['2a_date']))
                return {
                    ...row,
                    lng: row.lng,
                    lat: row.lat,
                    approvalTime: row.approvalTime
                }
            })
    }
}
