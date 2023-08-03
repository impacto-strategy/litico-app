import { ArrOfObj } from "../../../global";

/**
 * Gets only data with the specified subtype. Since this is frequently done in the application, creating a separate function made sense.
 */
const filterBySubtype = (metrics: ArrOfObj, subtype: string): any => {
    return metrics.filter((metric: any) => {
        return metric['subtype'] === subtype;
    })
};

export default filterBySubtype;