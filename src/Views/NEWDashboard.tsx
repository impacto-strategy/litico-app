/* IMPORT EXTERNAL MODULES */
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import {Divider} from "antd";
import {
    filter, 
    find, 
    flatten, 
    forOwn, 
    groupBy, 
    isEmpty, 
    map, 
    sortBy, 
    sumBy, 
    uniq
} from "lodash";

/* IMPORT INTERNAL MODULES */
// UNUSED COMPONENTS
// import Emissions2020 from "../Components/Emissions2020";
// import Emissions2020CO2 from "../Components/Emissions2020CO2";
// import WhitingAllData from "../Components/WhitingAllData";
// import MethaneEmissions from "../Components/MethaneEmissions";
// import Flaring from "../Components/Flaring";
// import OilSpills from "../Components/OilSpills";
// import Staff from "../Components/Staff";
// import LineWidget from "../Components/LineWidget";
// import PieWidget from "../Components/PieWidget";
// import DonationsDrilldown from "../DonationsDrilldown";
// REACT COMPONENTS
import ColumnWidget from "../Components/ColumnWidget";
import DonationsVolunteerCharts from "../Components/DonationsVolunteerCharts";
import DualAxesLineColWidget from "../Components/DualAxesLineColWidget";
import StackedBarWidget from "../Components/StackedBarWidget";
import GHGChart from "../Components/GHGChart";
import LDAR from "../Components/LDAR";
import SafetyMetrics from "../Components/SafetyMetrics";
import ProductionChart from "../Components/ProductionChart"
import GovernanceCheckList from "../Components/GovernanceCheckList";
// MISC INTERNAL MODULES
import ResourceService, {APICallAndAct} from "../Services/ResourceService";
import useAuth from "../Providers/Auth/useAuth";
import { calcSpillIntensity } from "../Services/ProductionService";
import { ArrOfObj } from "../../global"
import { extractYear } from "../utils/utils";

/**
 * React component that renders out the part of the application that shows various charts,
 * graphs, and other information pertaining to the companie's ESG metrics.
 * 
 * @returns Functional Component that renders out the dashboard.
 */
const NEWDashboard: FC = () => {
    /* React State */
    const [complaints, setComplaints] = useState<ArrOfObj>([])
    const [emissions, setEmissions] = useState<ArrOfObj>([])
    const [metrics, setMetrics] = useState<any>({})
    const [production, setProduction] = useState<ArrOfObj>([])
    const [spills, setSpills] = useState<ArrOfObj>([])

    /* API Function Calls */

    /* UseEffect Calls*/
    useEffect(() => {
        // Get ESG Metric
        APICallAndAct('esg-metrics', (data: any) => {
            setMetrics(data)
            setEmissions(sortBy(filter(data.esg_metrics, { metric_name: 'Greenhouse Gas Emissions', metric_subtype: 'GHG Emissions' }), 'date'))
        })

        // Get Spills
        APICallAndAct('spills', (data: any) => setSpills(data))

        // Get Production
        APICallAndAct('productions', ((data: any) => {
            let sortedData = sortBy(data, 'year')
            setProduction(sortedData)
        }))

        // Get Complaints
        APICallAndAct('complaints', ((data: any) => setComplaints(data)))
    }, [])

    // testing function calls
    console.log("This is emissions: ", emissions)
    console.log("This is spills: ", spills)
    return (
        <div>TESTING</div>
    )
}

export default NEWDashboard