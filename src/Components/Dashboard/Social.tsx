/* IMPORT EXTERNAL MODULES */
import {Divider} from "antd";
import { chunk, filter, sortBy, sumBy } from "lodash";
import moment from 'moment';
import {FC} from "react";

/* IMPORT INTERNAL MODULES */
// Components
import DonationsVolunteerCharts from "../DonationsVolunteerCharts";
import SafetyMetrics from "../SafetyMetrics";
import StackedBarWidget from "../StackedBarWidget";

// Services
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
                {/* <Staff/> */}
                {/*<Donations/>*/}
                {/* <DonationsDrilldown /> */}

                {props.incidentData.length > 0 &&
                    <SafetyMetrics
                        data={getIncidentData(props.incidentData)}
                    />
                }

                {props.gender.length > 0 &&
                    <StackedBarWidget 
                        isGroup={false} 
                        isPercentage={true} 
                        data={getGenderData(props.gender)} 
                        label={'percentage'} 
                        gridColumns="1/3" 
                        title="Employees by Gender" 
                        subTitle="" 
                    />
                }
                {props.ethnicity.length > 0 &&
                    <StackedBarWidget 
                        isGroup={false} 
                        isPercentage={true} 
                        data={getEthnicityData(props.ethnicity)} 
                        label={'percentage'} 
                        gridColumns='3/5' 
                        title='Employee Diversity' 
                        subTitle="" 
                    />
                }

                {props.donation.length > 0 && 
                    <DonationsVolunteerCharts
                        title={"Charitable Contributions"}
                        data={getDonationData(props.donation)}
                        gridCol={"1/3"}
                        type="Donations"
                        tableData={sortBy(props.donation, (o: any) => o.organization)}
                    />
                }
                {props.volunteer.length > 0 &&
                    <DonationsVolunteerCharts
                        title={"Volunteer Hours"}
                        data={getVolunteerHours(props.volunteer)}
                        gridCol={"3/5"}
                        type="Volunter"
                        tableData={sortBy(props.volunteer, (o: any) => o.organization)}
                    />
                }
            </div>
        </div>
    )
}

export default Social;