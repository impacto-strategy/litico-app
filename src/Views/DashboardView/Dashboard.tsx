import { Divider } from "antd";
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
import { 
    FC,
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import ColumnWidget from "../../Components/ColumnWidget";
import DonationsVolunteerCharts from "../../Components/DonationsVolunteerCharts";
import DualAxesLineColWidget from "../../Components/DualAxesLineColWidget";
import StackedBarWidget from "../../Components/StackedBarWidget";
import GHGChart from "../../Components/GHGChart";
import LDAR from "../../Components/LDAR";
import SafetyMetrics from "../../Components/SafetyMetrics";
import ProductionChart from "../../Components/ProductionChart"
import GovernanceCheckList from "../../Components/GovernanceCheckList";

import { getMetricsByYear } from "../../Services/MetricServices/index";
import { calcSpillIntensity } from "../../Services/ProductionService";
import ResourceService from "../../Services/ResourceService";
import useAuth from "../../Providers/Auth/useAuth";
import { ArrOfObj } from "../../../global"
import { extractYear } from "../../utils/utils";

const Dashboard: FC = () => {
    // React State
    const [complaints, setComplaints] = useState<ArrOfObj>([])
    const [emissions, setEmissions] = useState<ArrOfObj>([])
    const [metrics, setMetrics] = useState<any>({})
    const [production, setProductionData] = useState<ArrOfObj>([])
    const [spills, setSpills] = useState<ArrOfObj>([])
    const [hasLoaded, setLoader] = useState<Boolean>(false)

    // React Context
    const { user } = useAuth();

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
            setProductionData(sortBy(res[2].data, 'year'))
            setComplaints(res[3].data)
            setLoader(true)
        });
    }, [])

    const getDonationData = useMemo(() => {
        return flatten(map(groupBy(filter(metrics.esg_metrics, { 'metric_subtype': 'Social Investment' }), (o: any) => extractYear(o.date)), (year: any) => ([
            { label: extractYear(year[0].date), value: sumBy(year, (obj: any) => obj.value) }
        ]))).reverse()
    }, [metrics])

    const getVolunteerHoursData = useMemo(() => {
        return flatten(map(groupBy(filter(metrics.esg_metrics, (o: any) => {
            return o['metric_subtype'] === 'Volunteer Hours' || o['metric_subtype'] === 'Employee Volunteering Match'
        }), (o: any) => extractYear(o.date)), (year: any) => ([
            { label: extractYear(year[0].date), value: sumBy(year, (obj: any) => obj.value) }
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
        let dates = uniq(map(emissions, ((metric) => new Date(metric.date).getFullYear()))).sort()
        let basins = uniq(map(emissions, 'basin')).sort().filter(i => typeof i === 'string');
        return flatten(map(dates, ((date) => {
            return flatten(map(basins, ((basin) => {
                let data = []
                let ghg = getMetricsByYear({year: date, basin, metrics, metricSubtype: 'GHG Emissions'})
                let intensity = getMetricsByYear({year: date, basin, metrics, metricSubtype: 'GHG Intensity - BOE'})
                data.push({
                    name: "GHG Emissions (CO2e)",
                    type: date,
                    value: ghg?.value || 0,
                    intensity: intensity?.value || 0,
                    basin: basin,
                    // Utilized to avoid bugs in GHG Chart
                    label: `${basin} Emissions Intensity (mt/BoE)`
                })
                return data
            })))
        })))
    }, [emissions, getMetricsByYear])

    const getYearlyComplaintsData = useMemo(() => {
        return flatten(map([2017, 2018, 2019, 2020, 2021, 2022], (e) => {
            let comps: any[] = filter(complaints, (c: any) => {
                const date = new Date(c['date'])
                const year = date.getFullYear()

                return year === e
            })
            return [
                { name: "Complaints Count", type: e, value: comps.length, items: comps }
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
        const intensityCalc: any = calcSpillIntensity(production, spills);
        return flatten(map(spillsCountByYear, (e, key) => ([
            { name: "Spills Count", type: key, value: e.length, intensity: intensityCalc[key], items: e }
        ])))
    }, [production, spills])

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
            const tmp: { [key: string]: any } = {
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

        organizedData = sortBy(filter(metrics.esg_metrics, { 'metric_subtype': 'TRIR - All Workers' }), (metric) => new Date(metric.date))
        for (let i = 0; i < organizedData.length; i++) {
            let cleanDate = new Date(organizedData[i].date);
            let displayedDate = ''
            if (cleanDate.getMonth() <= 3) {
                displayedDate = `1Q ${cleanDate.getFullYear()}`
            } else if (cleanDate.getMonth() < 7) {
                displayedDate = `2Q ${cleanDate.getFullYear()}`
            } else if (cleanDate.getMonth() < 10) {
                displayedDate = `3Q ${cleanDate.getFullYear()}`
            } else {
                displayedDate = `4Q ${cleanDate.getFullYear()}`
            }
            data.push({
                date: displayedDate,
                incidents: organizedData[i].num_1,
                trir: organizedData[i].value
            })
        }

        return data
    }, [metrics])

    useEffect(() => {
        getDashboardData()
    }, [getDashboardData])

    return (
        <div className="site-layout-background">
            {hasLoaded &&
                <div>
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
                                    return o['metric_subtype'] === 'Volunteer Hours' || o['metric_subtype'] === 'Employee Volunteering Match'
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
                    <div style={{ paddingBottom: 40 }} />
                </div>
            }            
        </div>
    )
}

export default Dashboard