import { FC, useCallback, useEffect, useMemo, useState } from "react";
// import Emissions2020 from "../Components/Emissions2020";
// import Emissions2020CO2 from "../Components/Emissions2020CO2";
import ColumnWidget from "../Components/ColumnWidget";
// import LineWidget from "../Components/LineWidget";
import DualAxesLineColWidget from "../Components/DualAxesLineColWidget";
import StackedBarWidget from "../Components/StackedBarWidget";
import PieWidget from "../Components/PieWidget";
// import DonationsDrilldown from "../DonationsDrilldown";
import LDAR from "../Components/LDAR";
import Productions from "../Components/Productions";
import GovernanceCheckList from "../Components/GovernanceCheckList";
import {Divider} from "antd";
import ResourceService from "../Services/ResourceService";
import useAuth from "../Providers/Auth/useAuth";

// import WhitingAllData from "../Components/WhitingAllData";
// import MethaneEmissions from "../Components/MethaneEmissions";
// import Flaring from "../Components/Flaring";
// import OilSpills from "../Components/OilSpills";
// import Staff from "../Components/Staff";
import {filter, flatten, groupBy, map, sortBy, sumBy} from "lodash";

const Dashboard: FC = () => {
    const [metrics, setMetrics] = useState({ esg_metrics: [] })
    const [emissions, setEmissions] = useState<any>([])
    const [spills, setSpills] = useState<any>([])
    const [complaints, setComplaints] = useState<any>([])
    const [production, setProductionData] = useState<any>([])

    const {user} = useAuth();
    const getAllMetrics = useCallback(() => {
        ResourceService.index({
            resourceName: 'esg-metrics'
        }).then(({ data }) => {setMetrics(data)})
    }, [setMetrics])

    const getAllSpills = useCallback(() => {
        ResourceService.index({
            resourceName: 'spills'
        }).then(({ data }) => {setSpills(data)})
    }, [setSpills])

    const getTotalProduction = useCallback((year: string) => {
        return sumBy(filter(production, 'year'), 'amount')
    }, [production])

    const getSpillIntensity = useCallback((num: number, date: string) => {
        let yearlyProduction = getTotalProduction(date)
        if (yearlyProduction > 0) {
            return num / yearlyProduction
        } else {
            return 0
        }
    }, [getTotalProduction])

    const getDonationData = useMemo(() => {
        return sortBy(flatten(map(filter(metrics.esg_metrics, { 'metric_subtype': 'Social investment' }), (m: any) => ([
            { label: m.organization, type: parseInt(m.date), value: m.value }
        ]))), ['label'])
    }, [metrics])

    const getGenderData = useMemo(() => {
        return flatten(map(filter(metrics.esg_metrics, { 'metric_subtype': 'Workforce Demographics - Gender' }), (m: any) => ([
            { label: parseInt(m.date), type: 'Female', value: m.num_2 },
            { label: parseInt(m.date), type: 'Male', value: m.num_1 },
            { label: parseInt(m.date), type: 'Non-Binary', value: m.num_3 },
            { label: parseInt(m.date), type: 'No Response', value: m.num_4 }
        ])))
    }, [metrics])

    const getEthnicityData = useMemo(() => {
        return flatten(map(filter(metrics.esg_metrics, { 'metric_subtype': 'Workforce Demographics - Ethnicity' }), (m: any) => ([
            { label: parseInt(m.date), type: 'White/Caucasian', value: m.num_1 },
            { label: parseInt(m.date), type: 'Black/African American', value: m.num_2 },
            { label: parseInt(m.date), type: 'Asian/Pacific American', value: m.num_3 },
            { label: parseInt(m.date), type: 'Latino/Hispanics', value: m.num_4 },
            { label: parseInt(m.date), type: 'Native American', value: m.num_5 },
            { label: parseInt(m.date), type: 'Other', value: m.num_6 }
        ])))
    }, [metrics])

    const getYearlyEmissionData = useMemo(() => {
        return flatten(map(groupBy(emissions, 'date'), (e: any) => ([
            { name: "GHG Emissions (CO2e)", type: parseInt(e[0].date), value: e[0].value, intensity: e[0].value / getTotalProduction(e[0].date) }
        ])))
    }, [emissions, getTotalProduction])

    const getOilProduction = useCallback(() => {
        ResourceService.index({
            resourceName: 'productions'
        }).then(({ data }) => {
            setProductionData(data)
        })
    }, [])

    const getComplaints = useCallback(() => {
        ResourceService.index({
            resourceName: 'complaints'
        }).then(({ data }) => {
            setComplaints(data)
        })
    }, [])

    const getYearlyComplaintsData = useMemo(() => {
        return flatten(map([2017, 2018, 2019, 2020, 2021], (e) => {
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
    }, [complaints])

    const getYearlySpillsData = useMemo(() => {
        let spillsCountByYear = groupBy(spills, (e: any) => {
            let date = new Date(e['date'])
            let year = date.getFullYear();
            return year
        });
        return flatten(map(spillsCountByYear, (e, key) => ([
            { name: "Spills Count", type: key, value: e.length, intensity: getSpillIntensity(e.length, key), items: e }
        ])))
    }, [spills, getSpillIntensity])

    const getGhgEmissions = useCallback(async () => {
        ResourceService.index({
            resourceName: 'esg-metrics',
            params: {metric_name: 'Greenhouse Gas Emissions', metric_subtype: 'GHG Emissions'}
        }).then(res => {
            setEmissions(sortBy(res.data.esg_metrics, 'date'))
        })
    }, [])

    useEffect(() => {
        getAllMetrics()
        getOilProduction()
        getAllSpills()
        getComplaints()
        getGhgEmissions()
    }, [getAllMetrics, getOilProduction, getAllSpills, getComplaints, getGhgEmissions])

    return (
        <div className="site-layout-background"
        >
            <div>
                <Divider>
                    Environment
                </Divider>
            </div>

            <div style={{
                display: 'grid',
                textAlign: 'center',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '2em'
            }}>

                {emissions.length > 0 &&
                    <DualAxesLineColWidget
                        data={getYearlyEmissionData}
                        colLabel="Greenhouse Gas Emissions (mt)"
                        lineLabel="GHG Emission Intensity (mt/BoE)"
                        title="Greenhouse Gas Emissions Mass & Intensity"
                        gridColumns="1 / 5"
                        y1Lablel="GHG Emissions (mt)"
                        y2Lablel="GHG Emission Intensity (mt/BoE)"
                        includeModal={false}
                    />
                }

                {/* <WhitingAllData /> */}

                {spills.length > 0 &&
                <DualAxesLineColWidget
                    data={getYearlySpillsData}
                    colLabel="Spill Count"
                    lineLabel="Spills Intensity (spills/bbls prod)"
                    title="Spills Quantity & Intensity"
                    gridColumns="1 / 3"
                    y1Lablel="Spill Count"
                    y2Lablel="Spill Intensity (spills/bbls prod)"
                    includeModal={true}
                />
                }
                {complaints.length > 0 &&
                    <ColumnWidget data={getYearlyComplaintsData} title="Complaints" modalTitle="Complaints" includeModal={true} gridColumns="3 / 5" />
                }
                {/* Charts/Graphs that are currently beyond MVP. */}
                {/* {user.selectedCompany.name === 'Demo Energy' &&
                    <MethaneEmissions/>
                }
                { user.selectedCompany.name === 'Demo Energy' &&
                    <Flaring/>
                } */}
                {/* { user.selectedCompany.name === 'Demo Energy' &&
                    <OilSpills/>
                } */}
                {/* { user.selectedCompany.name === 'Demo Energy' &&
                    <Emissions2020/>
                } */}
                {/* <Emissions2020CO2 data={co2Emission} units="mt CO2" title="Carbon Dioxide Emissions for Production" />
                <Emissions2020CO2 data={ch4Emission} units="mt CH4" title="Methane Emissions for Production" />
                <Emissions2020CO2 data={n20Emission} units="mt N2O" title="Nitrous Oxide Emissions for Production" /> */}
                {production.length > 0 &&
                    <Productions
                        data={filter(production, { 'product': 'oil' })}
                        productType="oil"
                        title="Oil Production"
                        y1Lablel="Oil Production (bbls)"
                        gridColumns="1/5"
                    />
                }
                {production.length > 0 &&
                    <Productions
                        data={filter(production, { 'product': 'gas' })}
                        productType="gas"
                        title="Gas Production"
                        y1Lablel="Natural Gas Production (mmscf)"
                        gridColumns ="1/5"
                    />
                }

                {user.selectedCompany.name === 'Demo Energy' &&
                    <LDAR />
                }
            </div>
            <div>
                <Divider>
                    Social
                </Divider>
            </div>
            <div style={{
                display: 'grid',
                textAlign: 'center',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '2em'
            }}>
                {/* <Staff/> */}
                {/*<Donations/>*/}
                {/* <DonationsDrilldown /> */}

                {getGenderData.length > 0 &&
                    <StackedBarWidget isGroup={false} isPercentage={true} data={getGenderData} label={'percentage'} gridColumns="1/3" title="Employees by Gender" subTitle="" />
                }
                {getEthnicityData.length > 0 &&
                    <PieWidget gridColumns="3/5" data={getEthnicityData} label="ethnicity" title="Employee Diversity" subTitle="2021" />
                }
                {getDonationData.length > 0 &&
                    <StackedBarWidget isGroup={false} isPercentage={false} data={getDonationData} label={'currency'} gridColumns="1/5" title="Annual Charitable Contributions" subTitle="" />
                }
            </div>
            <div>
                <Divider>
                    Governance
                </Divider>
            </div>
            <div style={{
                display: 'grid',
                textAlign: 'center',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '2em'
            }}>
                {metrics?.esg_metrics && metrics?.esg_metrics.length > 0 &&
                    <GovernanceCheckList esgMetrics={metrics.esg_metrics} />
                }
            </div>
            <div style={{paddingBottom: 40}}/>
        </div>
    )
}

export default Dashboard