/* IMPORT EXTERNAL MODULES */
import {Divider} from "antd";
import { chunk, sortBy } from "lodash";
import moment from 'moment';
import React, {FC} from "react";

/* IMPORT INTERNAL MODULES */
import SafetyMetrics from "../SafetyMetrics";
import { groupByMultiple } from "../../utils/arrayUtils";

interface SectionProps {
    incidentData: any
}

const Social: FC<SectionProps> = (props): JSX.Element => {
    // QUARTERLY INCIDENT FUNCTION
    const getIncidentDataOLD = () => {
        let data: any = [];
        let organizedData: any = [];

        organizedData = sortBy(props.incidentData, (metric: any) => new Date(metric.date))
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
                trir:  organizedData[i].value
            })
        }

        return data
    }

    const getIncidentDataNEW = (data: any): any[] => {
        let result: any = [];
        const groupedData: any = groupByMultiple(data, (metric: any) => moment(metric.date).format('YYYY'), 'timeframe');
        for (const key of Object.keys(groupedData)) {
            if (groupedData[key].hasOwnProperty('quarterly')) {
                sortBy(groupedData[key]['quarterly'], (metric: any) => new Date(metric.date)).forEach((element: any) => {
                    result.push({
                        date: `${Math.ceil(parseInt(moment(element.date).format('MM')) / 3)}Q ${moment(element.date).format('YYYY')}`,
                        incidents: element.num_1,
                        trir: (200000 * element.num_1) / element.denominator
                    })  
                });
            } else if (groupedData[key].hasOwnProperty('monthly')) {
                console.log(chunk(sortBy(groupedData[key]['quarterly'], (metric: any) => new Date(metric.date)), 3))
                chunk(sortBy(groupedData[key]['quarterly'], (metric: any) => new Date(metric.date)), 3).forEach(element => {
                    console.log("Here's our element: ")
                });
            } else if (groupedData[key].hasOwnProperty('yearly')) {
                sortBy(groupedData[key]['yearly'], (metric: any) => new Date(metric.date)).forEach((element: any) => {
                    const incidents = element.num_1 / 4;
                    const trir = 200000 * incidents / (element.denominator / 4);
                    [1, 2 ,3, 4].forEach(num => {
                        result.push({
                            date: `${num}Q ${moment(element.date).format('YYYY')}`,
                            incidents,
                            trir
                        })
                    });
                });
            }
        }
        return result;
        /*
            We'll also need to look into how incident data is calculated.
            Equation: 200,000 * Incidents / Manhours
        */
    }

    // GENDER DATA FUNCTION

    // ETHNICITY DATA FUNCTION

    // DONATION DATA FUNCITON

    // VOLUNTEER DATA FUNCTION

    const testData = [
        {
            date: '2019-01',
            denominator: 100000,
            num_1: 1,
            timeframe: 'monthly'
        },
        {
            date: '2019-02',
            denominator: 100000,
            num_1: 2,
            timeframe: 'monthly'
        },
        {
            date: '2019-03',
            denominator: 100000,
            num_1: 3,
            timeframe: 'monthly'
        },
        {
            date: '2019-04',
            denominator: 100000,
            num_1: 1,
            timeframe: 'monthly'
        },
        {
            date: '2019-05',
            denominator: 100000,
            num_1: 2,
            timeframe: 'monthly'
        },
        {
            date: '2019-06',
            denominator: 100000,
            num_1: 3,
            timeframe: 'monthly'
        },
        {
            date: '2020-01',
            denominator: 100000,
            num_1: 1,
            timeframe: 'monthly'
        },
        {
            date: '2020-02',
            denominator: 100000,
            num_1: 2,
            timeframe: 'monthly'
        },
        {
            date: '2020-03',
            denominator: 100000,
            num_1: 3,
            timeframe: 'monthly'
        }
    ]
    console.log(getIncidentDataNEW(testData));

    return (
        <div>
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
                {/* ALL CHARTS WILL GO HERE. */}
                {/* <Staff/> */}
                {/*<Donations/>*/}
                {/* <DonationsDrilldown /> */}
                {/* {getIncidentDataNEW(props.incidentData).length > 0 &&
                    <SafetyMetrics
                        data={getIncidentDataNEW(props.incidentData)}
                    />
                } */}
            </div>
        </div>
    )
}

export default Social;