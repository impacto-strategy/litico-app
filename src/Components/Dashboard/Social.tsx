/* IMPORT EXTERNAL MODULES */
import {Divider} from "antd";
import { chunk, flatten, map, filter, sortBy, sumBy } from "lodash";
import moment from 'moment';
import React, {FC} from "react";

/* IMPORT INTERNAL MODULES */
import SafetyMetrics from "../SafetyMetrics";
import { getDonationData, getVolunteerHours } from "../../Services/DonationVolunteerService";
import { getEthnicityData } from "../../Services/EthnicityService";
import { getGenderData } from "../../Services/GenderService";
import { groupByMultiple } from "../../utils/arrayUtils";

interface SectionProps {
    donation: any,
    ethnicity: any,
    gender: any,
    incidentData: any,
    volunteer: any
}

const Social: FC<SectionProps> = (props): JSX.Element => {
    // QUARTERLY INCIDENT FUNCTION
    const getIncidentData = (data: any): any[] => {
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
                chunk(sortBy(groupedData[key]['monthly'], (metric: any) => new Date(metric.date)), 3).forEach((item: any, index) => {
                    const incidents = sumBy(item, (o: any) => o.num_1)
                    const manHours = sumBy(item, (o: any) => o.denominator)
                    result.push({
                        date: `${index + 1}Q ${key}`,
                        incidents: incidents,
                        trir: (200000 * incidents) / manHours
                    })
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
    }

    // GENDER DATA FUNCTION
    // getGenderData(props.gender);

    // ETHNICITY DATA FUNCTION
    // getEthnicityData(props.ethnicity);

    // DONATION DATA FUNCITON
    // getDonationData(props.donation);

    // VOLUNTEER DATA FUNCTION
    // getVolunteerHours(props.volunteer);

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