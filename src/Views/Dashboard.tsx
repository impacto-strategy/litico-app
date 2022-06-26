import {FC, useCallback, useEffect, useMemo, useState} from "react";
import Emissions2020 from "../Components/Emissions2020";
import Emissions2020CO2 from "../Components/Emissions2020CO2";
import ColumnWidget from "../Components/ColumnWidget";
import LineWidget from "../Components/LineWidget";
// import DualAxesLineColWidget from "../Components/DualAxesLineColWidget";
import StackedBarWidget from "../Components/StackedBarWidget";
import PieWidget from "../Components/PieWidget";
// import DonationsDrilldown from "../DonationsDrilldown";
import LDAR from "../Components/LDAR";
import Productions from "../Components/Productions";
import {Divider} from "antd";
import ResourceService from "../Services/ResourceService";

// import WhitingAllData from "../Components/WhitingAllData";
import MethaneEmissions from "../Components/MethaneEmissions";
import Flaring from "../Components/Flaring";
import OilSpills from "../Components/OilSpills";
// import Staff from "../Components/Staff";
import {filter, flatten, groupBy, map, sortBy, sumBy} from "lodash";

const Dashboard: FC = () => {
    const [metrics, setMetrics] = useState({ esg_metrics: [] })
    const [emissions, setEmissions] = useState<any>([])
    const [n20Emission, setN2oEmissions] = useState<any>([])
    const [co2Emission, setC02Emissions] = useState<any>([])
    const [ch4Emission, setCh4Emissions] = useState<any>([])
    const [production, setProductionData] = useState<any>([])

    const getAllMetrics = useCallback(() => {
        ResourceService.index({
            resourceName: 'esg-metrics'
        }).then(({ data }) => { setMetrics(data); console.log(data)})
    }, [setMetrics])

    const getTotalEmissions = (data: any) => {
        let co2 = sumBy(filter(data, { units: 'mt CO2' }), 'value')
        let ch4 = sumBy(filter(data, { units: 'mt CH4' }), 'value')
        let n20 = sumBy(filter(data, { units: 'mt N2O' }), 'value')
        return co2 + (ch4 * 25) + (n20 * 298)
    }

    const getTotalProduction = useCallback((year: string) => {
        return sumBy(filter(production, 'year'), 'amount')
    }, [production])

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

    const getEthnicityData = useMemo(() => {
        return flatten(map(filter(metrics.esg_metrics, { 'type_a': 'Ethnicity', date: '2021' }), (m: any) => ([
            { label: m.date, type: m.type_b, value: m.value }
        ])))
    }, [metrics])

    const getYearlyEmissionData = useMemo(() => {
        return flatten(map(groupBy(filter(emissions, { period: 'yearly' }), 'date'), (e: any) => ([
            { name: "GHG Emissions (CO2e)", type: e[0].date, value: getTotalEmissions(e), intensity: getTotalEmissions(e) / getTotalProduction(e[0].date) }
        ])))
    }, [emissions, getTotalProduction])

    const getIntensityData = useMemo(() => {
        return flatten(map(getYearlyEmissionData, (data) => ([
            { name: 'intensity', type: data.type, value: data.intensity }
        ])))
    }, [getYearlyEmissionData])

    const getOilProduction = useCallback(() => {
            ResourceService.index({
                resourceName: 'productions'
            }).then(({ data }) => {
                setProductionData(data)
            })
    }, [])

    const getEmissions = useCallback(() => {
            ResourceService.index({
                resourceName: 'emissions'
            }).then(({ data }) => {
                setEmissions(data)
                setC02Emissions(filter(data, (em) => { return em.units === 'mt CO2' && em.value > 0 }))
                setCh4Emissions(filter(data, (em) => { return  em.units === 'mt CH4' && em.value > 0 }))
                setN2oEmissions(filter(data, (em) => { return  em.units === 'mt N2O' && em.value > 0 }))
            })
    }, [setC02Emissions, setCh4Emissions, setN2oEmissions])

    useEffect(() => {
        getAllMetrics()
        getOilProduction()
        getEmissions()
    }, [getAllMetrics, getOilProduction, getEmissions])

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
                <LineWidget data={getYearlyEmissionData} label="Year" title="Greenhouse Gas Emissions"/>
                {/* <WhitingAllData /> */}
                {/* <DualAxesLineColWidget data={getYearlyEmissionData} /> */}
                <ColumnWidget data={getIntensityData} title="Greenhouse Gas Intensity" />
                <MethaneEmissions/>
                <Flaring/>
                <OilSpills/>
                <Emissions2020/>
                <Emissions2020CO2 data={co2Emission} units="mt CO2" title="Carbon Dioxide Emissions for Production" />
                <Emissions2020CO2 data={ch4Emission} units="mt CH4" title="Methane Emissions for Production" />
                <Emissions2020CO2 data={n20Emission} units="mt N2O" title="Nitrous Oxide Emissions for Production" />
                <Productions data={filter(production, { 'product': 'oil' })} productType="oil" title="Oil Production by Month" />
                <Productions data={filter(production, { 'product': 'gas' })}productType="gas" title="Gas Production by Month" />
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
                {/*<Donations/>*/}
                {/* <DonationsDrilldown /> */}
                {getDonationData.length > 0 &&
                    <StackedBarWidget isGroup={false} isPercentage={false} data={getDonationData} label={'currency'} width={'62%'} title="Annual Charitable Contributions" subTitle="" />
                }
                {getGenderData.length > 0 &&
                    <StackedBarWidget isGroup={false} isPercentage={true} data={getGenderData} label={'percentage'} width={'32%'} title="Employees by Gender" subTitle="" />
                }
                {getEthnicityData.length > 0 &&
                    <PieWidget width={'32%'} data={getEthnicityData} label="ethnicity" title="Employee Diversity" subTitle="2021" />
                }
            </div>
            <div style={{paddingBottom: 40}}/>
        </div>
    )
}

export default Dashboard