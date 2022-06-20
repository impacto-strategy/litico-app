import {FC, useCallback, useEffect, useMemo, useState} from "react";
import GenderWidget from "../Components/GenderWidget";
import Emissions2020 from "../Components/Emissions2020";
import Emissions2020CO2 from "../Components/Emissions2020CO2";
import StackedBarWidget from "../Components/StackedBarWidget";
import DonationsDrilldown from "../DonationsDrilldown";
import LDAR from "../Components/LDAR";
import Productions from "../Components/Productions";
import {Divider} from "antd";
import ResourceService from "../Services/ResourceService";

import WhitingAllData from "../Components/WhitingAllData";
import MethaneEmissions from "../Components/MethaneEmissions";
import Flaring from "../Components/Flaring";
import OilSpills from "../Components/OilSpills";
import Staff from "../Components/Staff";
import {filter, flatten, map, sortBy} from "lodash";

const Dashboard: FC = () => {
    const [metrics, setMetrics] = useState({esg_metrics: []})

    const getAllMetrics = useCallback(() => {
        ResourceService.index({
            resourceName: 'esg-metrics'
        }).then(({ data }) => { setMetrics(data); console.log(data)})
    }, [setMetrics])

    const getDonationData = useMemo(() => {
        return sortBy(flatten(map(filter(metrics.esg_metrics, { 'type_a': 'Community Investment' }), (m: any) => ([
            { label: m.organization, type: m.date, value: m.value }
        ]))), ['label'])
    }, [metrics])

    const getGenderData = useMemo(() => {
        return flatten(map(filter(metrics.esg_metrics, { 'type_a': 'Women Employees' }), (m: any) => ([
            { label: m.date, type: 'Female', value: m.num_1 },
            { label: m.date, type: 'Male', value: m.denominator - m.num_1 }
        ])))
    }, [metrics])


    useEffect(() => {
        getAllMetrics()
    }, [getAllMetrics])

    return (
        <div className="site-layout-background"
        >
            <div>
                <Divider>
                    Environment
                </Divider>
            </div>

            <div style={{
                padding: '0 24p 90px 24px',
                textAlign: 'center',
                display: 'flex',
                gap: '2rem',
                flexWrap: 'wrap'
            }}>
                <WhitingAllData/>
                <MethaneEmissions/>
                <Flaring/>
                <OilSpills/>
                <Emissions2020/>
                <Emissions2020CO2 units="mt CO2" title="Carbon Dioxide Emissions for Production" />
                <Emissions2020CO2 units="mt CH4" title="Methane Emissions for Production" />
                <Emissions2020CO2 units="mt N2O" title="Nitrous Oxide Emissions for Production" />
                <Productions productType="oil" title="Oil Production by Month" />
                <Productions productType="gas" title="Gas Production by Month" />
                <LDAR/>
            </div>
            <div>
                <Divider>
                    Social
                </Divider>
            </div>
            <div style={{
                padding: '0 24p 90px 24px',
                textAlign: 'center',
                display: 'flex',
                gap: '2rem',
                flexWrap: 'wrap'
            }}>
                {/* <Staff/> */}
                {/* <GenderWidget/> */}
                {/*<Donations/>*/}
                {/* <DonationsDrilldown /> */}
                {getDonationData.length > 0 &&
                    <StackedBarWidget isGroup={false} isPercentage={false} data={getDonationData} label={'currency'} width={'62%'} title="Donations by Organization" subTitle="$ Organization Donations by Year" />
                }
                {getGenderData.length > 0 &&
                    <StackedBarWidget isGroup={false} isPercentage={true} data={getGenderData} label={'percentage'} width={'32%'} title="Roster by Gender" subTitle="% Women Employees by Year" />
                }
            </div>
            <div style={{paddingBottom: 40}}/>
        </div>
    )
}

export default Dashboard