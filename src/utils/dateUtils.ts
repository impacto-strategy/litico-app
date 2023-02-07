/* IMPORT EXTERNAL MODULES */

/**
 * creates an array of dates in the timeframe provided in the data.
 */
export const getPossibleDates = (data: any): number[] => {
    const sortedData = data.sort()
    let years: number[] = []
    for (let i = new Date(sortedData[0]?.date).getFullYear(); i <= new Date(sortedData[sortedData.length - 1]?.date).getFullYear(); i++) {
        years.push(i);
    }
    return years;
}