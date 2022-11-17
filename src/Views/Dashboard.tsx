/* IMPORT EXTERNAL MODULES */
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import {Divider} from "antd";
import {filter, find, flatten, forOwn, groupBy, isEmpty, map, sortBy, sumBy} from "lodash";

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
import ResourceService from "../Services/ResourceService";
import useAuth from "../Providers/Auth/useAuth";
import {ArrOfObj} from "../../global"
import { extractYear } from "../utils";

const Dashboard: FC = () => {
    // React State
    const [complaints, setComplaints] = useState<ArrOfObj>([])
    const [emissions, setEmissions] = useState<ArrOfObj>([])
    const [emissionsIntensity, setEmissionsIntensity] = useState<ArrOfObj>([])
    const [metrics, setMetrics] = useState<any>({})
    const [production, setProductionData] = useState<ArrOfObj>([])
    const [spills, setSpills] = useState<ArrOfObj>([])

    // React Context
    const {user} = useAuth();

    /* API Function Calls */
    const getAllMetrics = useCallback(() => {
        ResourceService.index({
            resourceName: 'esg-metrics'
        }).then(({ data }) => {
            setMetrics(data)
        }).catch((err) =>{
            console.log(err)
        })
    }, [setMetrics])

    const getAllSpills = useCallback(() => {
        ResourceService.index({
            resourceName: 'spills'
        }).then(({ data }) => {
            setSpills(data)
        }).catch((err) => {
            console.log(err)
        })
    }, [setSpills])

    /**
     * Generates collection of company incidents and total hours worked.
     * Utilized for TRIR chart.
     * 
     * @params - None
     * 
     * @returns - Undefined
     */
    const spillsIntensity = useMemo(() => {
        let data = filter(metrics.esg_metrics, { 'metric_subtype': 'Spill Intensity - Liquids' })

        return sortBy(flatten(map(data, (m: any) => ([
            { date: m.date, value: m.value }
        ]))), ['year'])
    }, [metrics])

    const getIntensityByDate = useCallback((date: string, basin: string, intensityType: string) => {
        let data = []
        if (intensityType === 'ghg') {
            data = emissionsIntensity
        } else {
            data = spillsIntensity
        }

        if (data.length < 1) return 0
        let year = new Date(date).getFullYear()
        let intensityByYear = find(data, (em) => {
            if (intensityType === 'ghg') {
                return new Date(em.date).getFullYear() === year && em.basin === basin
            } else {
                return new Date(em.date).getFullYear() === year
            }
        })

        if (!intensityByYear?.value) return 0
        return intensityByYear.value
    }, [emissionsIntensity, spillsIntensity])

    const getGhgEmissions = useCallback(async () => {
        await ResourceService.index({
            resourceName: 'esg-metrics',
            params: {metric_name: 'Greenhouse Gas Emissions', metric_subtype: 'GHG Emissions'}
        }).then(res => {
            if (res.data && res.data.esg_metrics) {
                setEmissions(sortBy(res.data.esg_metrics, 'date'))
            }
        }).catch((err) =>{
            console.log(err)
        })
        await ResourceService.index({
            resourceName: 'esg-metrics',
            params: {metric_name: 'Greenhouse Gas Emissions', metric_subtype: 'GHG Intensity - BOE'}
        }).then(res => {
            if (res.data && res.data.esg_metrics) {
                setEmissionsIntensity(sortBy(res.data.esg_metrics, 'date'))
            }
        }).catch((err) =>{
            console.log(err)
        })
    }, [])

    const getOilProduction = useCallback(() => {
        ResourceService.index({
            resourceName: 'productions'
        }).then(({ data }) => {
            let sortedData = sortBy(data, 'year')
            setProductionData(sortedData)
        }).catch((err) =>{
            console.log(err)
        })
    }, [])

    const getComplaints = useCallback(() => {
        ResourceService.index({
            resourceName: 'complaints'
        }).then(({ data }) => {
            setComplaints(data)
        }).catch((err) =>{
            console.log(err)
        })
    }, [])

    const getDonationData = useMemo(() => {
        return flatten(map(groupBy(filter(metrics.esg_metrics, { 'metric_subtype': 'Social Investment' }), (o: any) => extractYear(o.date)), (year: any) => ([
            {label: extractYear(year[0].date), value: sumBy(year, (obj: any) => obj.value)}
        ]))).reverse()
    }, [metrics])

    const getVolunteerHoursData = useMemo(() => {
        return flatten(map(groupBy(filter(metrics.esg_metrics, (o: any) => {
             return o['metric_subtype'] === 'Volunteer Hours' || o['metric_subtype'] === 'Volunteering - Community'
        }), (o: any) => extractYear(o.date)), (year: any) => ([
            {label: extractYear(year[0].date), value: sumBy(year, (obj: any) => obj.value)}
        ]))).reverse()
    }, [metrics.esg_metrics])

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
        return flatten(map(sortBy(groupBy(emissions, 'date'), 'date'), (e: ArrOfObj) => {
            let data = []
            for (let i = 0; i < e.length; i++) {
                let intensity = getIntensityByDate(e[i].date, e[i].basin, 'ghg')
                data.push({ 
                    name: "GHG Emissions (CO2e)", 
                    type: parseInt(e[i].date), 
                    value: e[i].value, 
                    intensity: intensity,
                    basin: e[i].basin, 
                    // Utilized to avoid bugs in GHG Chart
                    label: `${e[i].basin} Emissions Intensity (mt/BoE)` 
                })
            }
            return data
        }))
    }, [emissions, getIntensityByDate])

    const getYearlyComplaintsData = useMemo(() => {
        return flatten(map([2017, 2018, 2019, 2020, 2021, 2022], (e) => {
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
            { name: "Spills Count", type: key, value: e.length, intensity: getIntensityByDate(e[0]?.date, '', ''), items: e }
        ])))
    }, [spills, getIntensityByDate])

    /**
     * Sums total production for Gas, Water, and Oil by year.
     * Data is organized by product to interact properly with Ant Design's daul axes widget.
     * 
     * @returns - Array of objects
     */
    const getYearlyProductionData = useMemo(() => {
        let yearlyData: ArrOfObj = [];
        // Outerloop iterates based on year
        forOwn(groupBy(production, 'year'), (value: any, key: any) => {
            const tmp: {[key: string]: any} = {
                date: key
            }
            // Inner loop iterates based on product
            for (const product of ['gas', 'oil', 'water']) {
                const tempGroup = groupBy(filter(value, (o: any) => {
                    return o.product === product
                }), "timeframe")
                if (tempGroup.hasOwnProperty('yearly')) {
                    if (isEmpty(tempGroup)) {
                        continue;
                    }
                    if (tempGroup['yearly'][0].product === "gas") {
                        tmp[product] = sumBy(tempGroup['yearly'], 'amount') / 1000
                    } else {
                        tmp[product] = sumBy(tempGroup['yearly'], 'amount')
                    }
                } else {
                    if (isEmpty(tempGroup)) {
                        continue;
                    }
                    if (tempGroup['monthly'][0].product === "gas") {
                        tmp[product] = sumBy(tempGroup['monthly'], 'amount') / 1000
                    } else {
                        tmp[product] = sumBy(tempGroup['monthly'], 'amount')
                    }
                }
            }
            yearlyData.push(tmp)
        })
        return yearlyData
    }, [production])

    /**
     * Takes incident data and revamps to new collection of incident data and TRIR.
     * 
     * @returns - Array of Objects
     */
    const getQuarterlyIncidentData = useMemo(() => {
        let data: any = [];
        let organizedData: any = [];

        organizedData = sortBy(filter(metrics.esg_metrics, { 'metric_subtype': 'TRIR - All Workers' }), 'date')
        for (let i = 0; i < organizedData.length; i++) {
            let cleanDate = organizedData[i].date.substring(0, 4);
            if (parseInt(organizedData[i].date.substring(5,7)) <= 3) {
                cleanDate = `1Q ${cleanDate}`
            } else if (parseInt(organizedData[i].date.substring(5,7)) < 7) {
                cleanDate = `2Q ${cleanDate}`
            } else if (parseInt(organizedData[i].date.substring(5,7)) < 10) {
                cleanDate = `3Q ${cleanDate}`
            } else {
                cleanDate = `4Q ${cleanDate}`
            }
            data.push({
                date: cleanDate,
                incidents: organizedData[i].num_1,
                trir:  organizedData[i].value
            })
        }

        return data
    }, [metrics])

    useEffect(() => {
        getAllMetrics()
        getOilProduction()
        getAllSpills()
        getComplaints()
        getGhgEmissions()
    }, [getAllMetrics, getOilProduction, getAllSpills, getComplaints, getGhgEmissions])

    return (
        <div className="site-layout-background">
            {/* ENVIRONMENT CHARTS AND GRAPHS SECTION */}
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
                    <GHGChart
                        data={getYearlyEmissionData}
                    />
                }

                {/* <WhitingAllData /> */}

                {spills.length > 0 &&
                  <DualAxesLineColWidget
                      data={getYearlySpillsData}
                      colLabel="Spill Incident Count"
                      lineLabel="Spills Intensity (bbl spill/kbbl produced)"
                      title="Spill Incident Count & Intensity"
                      gridColumns="1 / 3"
                      y1Lablel="Spill Incident Count"
                      y2Lablel="Spill Intensity (bbl spill/kbbl produced)"
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
                    <ProductionChart
                        data={getYearlyProductionData}
                        gridColumns={'1/5'}
                        title={'Total Oil & Gas Production'}
                    />
                }

                {user.selectedCompany.name === 'Demo Energy' &&
                    <LDAR />
                }
            </div>
            {/* SOCIAL CHARTS AND GRAPHS SECTION */}
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

                {getQuarterlyIncidentData.length > 0 &&
                    <SafetyMetrics
                        data={getQuarterlyIncidentData}
                    />
                }

                {getGenderData.length > 0 &&
                    <StackedBarWidget isGroup={false} isPercentage={true} data={getGenderData} label={'percentage'} gridColumns="1/3" title="Employees by Gender" subTitle="" />
                }
                {getEthnicityData.length > 0 &&
                    <StackedBarWidget isGroup={false} isPercentage={true} data={getEthnicityData} label={'percentage'} gridColumns='3/5' title='Employee Diversity' subTitle="" />
                }
                {getDonationData.length > 0 && 
                    <DonationsVolunteerCharts
                        title={"Charitable Contributions"}
                        data={getDonationData}
                        gridCol={"1/3"}
                        type="Donations"
                        tableData={sortBy(filter(metrics.esg_metrics, { 'metric_subtype': 'Social Investment' }), (o: any) => o.organization)}
                    />
                }
                {getVolunteerHoursData.length > 0 &&
                    <DonationsVolunteerCharts
                        title={"Volunteer Hours"}
                        data={getVolunteerHoursData}
                        gridCol={"3/5"}
                        type="Volunter"
                        tableData={sortBy(filter(metrics.esg_metrics, (o: any) => {
                            return o['metric_subtype'] === 'Volunteer Hours' || o['metric_subtype'] === 'Volunteering - Community'
                       }), (o: any) => o.organization)}
                    />
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