import {useEffect, useState} from "react";
import {Column} from "@ant-design/plots";
import {getQuarter, getYear} from "date-fns";
import {isNil, map, orderBy, snakeCase} from "lodash";
import {ColumnConfig} from "@ant-design/charts";
import {Card, Col, Row} from "antd";

const Complaints = () => {

    const [data, setData] = useState<any>([]);
    const [noavData, setNoavData] = useState<any>([]);
    const [byOperator, setByOperator] = useState<any>([]);

    useEffect(() => {
        asyncNoavFetch()
        asyncFetch();

    }, []);

    const asyncNoavFetch = () => {
        fetch('https://q4yg5ip6re.execute-api.us-west-2.amazonaws.com/default/cogcc?records=noav')
            .then((response) => response.json())
            .then((json) => {
                if (Array.isArray(json)) {


                    let _data: any = {}
                    json.map(row => {
                        row.qy = `Q${getQuarter(new Date(row.NOAVIssueDate))} - ${getYear(new Date(row.NOAVIssueDate))}`

                        const key = snakeCase(`${row.NOAVIssueDate}-${row.qy}`)

                        if (!(key in _data)) {
                            _data[key] = {
                                ...row,
                                notices: 1,
                                qy: row.qy
                            }
                        } else {
                            _data[key] = {
                                ...row,
                                notices: _data[key].notices + 1,
                                qy: row.qy
                            }
                        }

                        return row

                    })
                    setNoavData(orderBy(Object.values(_data), ['NOAVIssueDate', 'notices'], ['asc', 'desc']))

                }
            })
            .catch((error) => {
                console.log('fetch data failed', error);
            });
    }
    const asyncFetch = () => {
        fetch('https://q4yg5ip6re.execute-api.us-west-2.amazonaws.com/default/cogcc?records=complaints')
            .then((response) => response.json())
            .then((json) => {
                if (Array.isArray(json)) {

                    let _data: any = {}
                    json.map(row => {
                        row.qy = `Q${getQuarter(new Date(row.receive_date))} - ${getYear(new Date(row.receive_date))}`
                        //
                        // return row
                        //
                        const key = snakeCase(`${row.operator_number}-${row.qy}`)

                        // console.log(row.operator_number + row.qy)
                        // console.log(isEmpty(_data[row.operator_number + row.qy]))
                        if (!(key in _data)) {
                            _data[key] = {
                                ...row,
                                notices: 1,
                                qy: row.qy
                            }
                        } else {
                            // console.log({n: _data[row.operator_number + row.qy].notices})
                            _data[key] = {
                                ...row,
                                notices: _data[key].notices + 1,
                                issue_category: _data[key].issue_category + ', ' + row.issue_category,
                                qy: row.qy
                            }
                        }

                        return row

                    })


                    setByOperator(orderBy(Object.values(_data), 'receive_date'))


                    // _data = {}
                    //
                    // json
                    //     .filter(row => row.noav === 'Y')
                    //     .map(row => {
                    //         row.qy = `Q${getQuarter(new Date(row.receive_date))} - ${getYear(new Date(row.receive_date))}`
                    //         //
                    //         // return row
                    //         //
                    //         const key = snakeCase(`${row.operator_number}-${row.qy}`)
                    //
                    //         // console.log(row.operator_number + row.qy)
                    //         // console.log(isEmpty(_data[row.operator_number + row.qy]))
                    //         if (!(key in _data)) {
                    //             _data[key] = {
                    //                 ...row,
                    //                 notices: 1,
                    //                 qy: row.qy
                    //             }
                    //         } else {
                    //             // console.log({n: _data[row.operator_number + row.qy].notices})
                    //             _data[key] = {
                    //                 ...row,
                    //                 notices: _data[key].notices + 1,
                    //                 issue_category: _data[key].issue_category + ', ' + row.issue_category,
                    //                 qy: row.qy
                    //             }
                    //         }
                    //
                    //         return row
                    //
                    //     })
                    //
                    // setData(orderBy(Object.values(_data), 'receive_date'))
                    //

                }
            })
            .catch((error) => {
                console.log('fetch data failed', error);
            });
    };

    const config: ColumnConfig = {
        data: noavData,
        xField: 'qy',
        yField: 'notices',
        isGroup: true,
        isStack: false,
        seriesField: 'OperatorName',
        slider: {
            start: 0.7,
            end: 0.9,
        },
        xAxis: {
            label: {
                autoRotate: false,
            },
            title: {
                text: "Period"
            },
        },
        yAxis: {
            title: {
                text: "NOAV Notices"
            },
            position: 'left',

            label: {
                autoRotate: true
            }
        },
        tooltip: {
            formatter: (datum: any) => {
                return {
                    name: `${datum.OperatorName}`,
                    value: `${datum.notices} Notice${datum.notices > 1 ? 's' : ''}`
                }
            },
        },
    };

    const operatorConfig: ColumnConfig = {
        data: byOperator,
        xField: 'qy',
        yField: 'notices',
        xAxis: {
            label: {
                autoRotate: false,
            },
            title: {
                text: "Complaint Intensity Bins (# Complaints / MMbbl produced)"
            },
        },
        yAxis: {
            title: {
                text: "Frequency (# Operators)"
            },
            position: 'left',

            label: {
                autoRotate: true
            }
        },
        slider: {
            start: 0.7,
            end: 0.9,
        },
        isGroup: true,
        seriesField: 'operator',
    };


    let preSelected: any = {}
    map(orderBy(byOperator, 'notices', 'desc'), op => {

        if (Object.keys(preSelected).length > 6 || isNil(op.operator)) {
            if (!preSelected[op.operator]) {
                preSelected[op.operator] = false
            }
        } else {
            preSelected[op.operator] = true
        }

    })

    const competitorConfig: ColumnConfig = {
        data: byOperator,
        xField: 'qy',
        yField: 'notices',
        xAxis: {
            label: {
                autoRotate: false,
            },
            title: {
                text: "Period"
            },
        },
        yAxis: {
            title: {
                text: "# of Complatins"
            },
            position: 'left',

            label: {
                autoRotate: true
            }
        },

        isGroup: true,
        seriesField: 'operator',
        legend: {
            selected: {
                ...preSelected
            },
            layout: "horizontal",
            position: 'bottom',
            flipPage: true,
            maxRow: 3

        }
    };

    return <>
        <Row gutter={[16, 20]}>
            <Col span={20} offset={2}>
                <Card title={<Card.Meta title={"Enforcement - Complaints & Regulator Notices (NOAV)"}
                                        description={"Leverage Litico to stay on the ball with incoming notices, and present notice history easily and professionally"}/>}>
                    <Column {...config} />
                </Card>
            </Col>
            <Col span={20} offset={2}>

                <Card title={<Card.Meta title={"Complaints Intensity Histogram"}
                                        description={"Leverage Litico to stay on the ball with incoming notices, and present notice hist"}/>}>
                    <Column {...operatorConfig} />

                </Card>
            </Col>
            <Col span={20} offset={2}>

                <Card title={<Card.Meta title={"Complaints Surveillance"}
                                        description={"How do we compare to our selected key competitors in complaints performance?"}/>}>
                    <Column {...competitorConfig} />

                </Card>
            </Col>
        </Row>
    </>

}

export default Complaints
