import React, {useState, useMemo, useCallback, useEffect} from "react";
import ResourceService from "../Services/ResourceService";
import {filter, find, flatten, forOwn, groupBy, map, sortBy, sumBy} from "lodash";
import DonationsVolunteer from "./DonationsVolunteer";

const Blank = () => {
    const [metrics, setMetrics] = useState<any>({})

    const getAllMetrics = useCallback(() => {
        ResourceService.index({
            resourceName: 'esg-metrics'
        }).then(({ data }) => {
            setMetrics(data)
        }).catch((err) =>{
            console.log(err)
        })
    }, [setMetrics])

    const getDonationData = useMemo(() => {
        // Current Code Revamping
        console.log("Filter: ", filter(metrics.esg_metrics, { 'metric_subtype': 'Social Investment' }))
        console.log("Group By: ", groupBy(filter(metrics.esg_metrics, { 'metric_subtype': 'Social Investment' }), (o: any) => {
            // Split into parts than get date
            return o.date.split('-')[0]
        }))
        // Current Function
        return flatten(map(groupBy(filter(metrics.esg_metrics, { 'metric_subtype': 'Social Investment' }), (o: any) => o.date.split('-')[0]), (year: any) => ([
            {label: year[0].date.split('-')[0], value: sumBy(year, (obj: any) => obj.value)}
        ])))
    }, [metrics])

    useEffect(() => {
        getAllMetrics()
    }, [getAllMetrics])

    return (
        <>
            <div>Testing</div>
            <DonationsVolunteer 
                title={"Charitable Contributions"}
                data={getDonationData}
                gridCol={"1/3"}
                type="Donations"
                tableData={filter(metrics.esg_metrics, { 'metric_subtype': 'Social Investment' })}
            />
        </>
    )
}

export default Blank;