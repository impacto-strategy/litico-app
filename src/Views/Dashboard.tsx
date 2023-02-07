/* IMPORT EXTERNAL MODULES */
import { FC, useCallback, useEffect, useState } from "react";
import {
    filter, 
    sortBy,
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
import Environment from "../Components/Dashboard/Environment";
import Governance from "../Components/Dashboard/Governance";
import Social from "../Components/Dashboard/Social";
// MISC INTERNAL MODULES
import ResourceService from "../Services/ResourceService";
import { ArrOfObj } from "../../global"

/**
 * React component that renders out the part of the application that shows various charts,
 * graphs, and other information pertaining to the companie's ESG metrics.
 * 
 * @returns Functional Component that renders out the dashboard.
 */
const Dashboard: FC = () => {
    /* React State */
    const [complaints, setComplaints] = useState<ArrOfObj>([])
    const [emissions, setEmissions] = useState<ArrOfObj>([])
    const [metrics, setMetrics] = useState<any>({})
    const [production, setProduction] = useState<ArrOfObj>([])
    const [spills, setSpills] = useState<ArrOfObj>([])
    const [hasLoaded, setLoader] = useState<Boolean>(false)

    /**
     * Retrieves all data from the database. Utilized to prevent graphs from generating
     * before all data has been successfully retrieved.
     */
    const getDashboardData = useCallback(() => {
        Promise.all([
            ResourceService.index({ resourceName: 'esg-metrics' }),
            ResourceService.index({ resourceName: 'spills' }),
            ResourceService.index({ resourceName: 'productions' }),
            ResourceService.index({ resourceName: 'complaints' }),
        ]).then((res: any) => {
            setMetrics(res[0].data)
            setEmissions(sortBy(filter(res[0].data.esg_metrics, { metric_name: 'Greenhouse Gas Emissions', metric_subtype: 'GHG Emissions' }), 'date'))
            setSpills(res[1].data)
            setProduction(sortBy(res[2].data, 'year'))
            setComplaints(res[3].data)
            setLoader(true)
        });
    }, [])

    /* UseEffect Calls*/
    useEffect(() => {
        getDashboardData()
    }, [getDashboardData])

    return (
        <div className="site-layout-background">
            {hasLoaded &&
                <>
                    <Environment
                        complaints={complaints}
                        emissions={emissions}
                        production={production}
                        spills={spills}    
                    />
                    <Social
                        donation={filter(metrics.esg_metrics, { 'metric_subtype': 'Social Investment' })}
                        ethnicity={filter(metrics.esg_metrics, { 'metric_subtype': 'Workforce Demographics - Ethnicity' })}
                        gender={filter(metrics.esg_metrics, { 'metric_subtype': 'Workforce Demographics - Gender' })}
                        incidentData={filter(metrics.esg_metrics, { 'metric_subtype': 'TRIR - All Workers' })}
                        volunteer={filter(metrics.esg_metrics, (o: any) => {
                            return o['metric_subtype'] === 'Volunteer Hours' || o['metric_subtype'] === 'Volunteering - Community'
                        })}
                    />
                    <Governance 
                        esgMetrics={metrics.esg_metrics}
                    />
                </>
            }
        </div>
    )
}

export default Dashboard