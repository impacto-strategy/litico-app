import {useEffect, useState} from "react";
import {Column} from "@ant-design/plots";
import {getQuarter, getYear} from "date-fns";
import {orderBy, snakeCase} from "lodash";
import {ColumnConfig} from "@ant-design/charts";

const Complaints = () => {

    const [data, setData] = useState<any>([]);
    const [byOperator, setByOperator] = useState<any>([]);

    useEffect(() => {
        asyncFetch();
    }, []);

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


                    _data = {}

                    json
                        .filter(row => row.noav === 'Y')
                        .map(row => {
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

                    setData(orderBy(Object.values(_data), 'receive_date'))


                }
            })
            .catch((error) => {
                console.log('fetch data failed', error);
            });
    };

    const config = {
        data,
        xField: 'qy',
        yField: 'notices',
        title: {
            visible: true,
        },
        isGroup: true,
        isStack: false,
        seriesField: 'operator',
        tooltip: {
            formatter: (datum: any) => {

                return {
                    name: `${datum.notices} Notice${datum.notices > 1 ? 's' : ''}`,
                    value: data.find((d: any) => d.qy === datum.qy && datum.operator === d.operator).issue_category
                }
            },
        },
    };

    const operatorConfig: ColumnConfig = {
        data: byOperator,
        xField: 'qy',
        yField: 'notices',
        // title: {
        //     visible: true,
        // },
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
        // isStack: false,
        seriesField: 'operator',
        // tooltip: {
        //     formatter: (datum: any) => {
        //
        //         return {
        //             name: `${datum.notices} Notice${datum.notices > 1 ? 's' : ''}`,
        //             value: data.find((d: any) => d.qy === datum.qy && datum.operator === d.operator).issue_category
        //         }
        //     },
        // },
    };

    return <>
        <div style={{background: '#fff', padding: 20, textAlign: 'center', maxWidth: 1200, margin: '0 auto'}}>
            <h2>Complaints & Regulator Notices (NOAV)</h2>
            <br/>
            <Column {...config} />
        </div>

        <div style={{
            background: '#fff',
            padding: 20,
            textAlign: 'center',
            maxWidth: 1200,
            marginTop: 40,
            marginLeft: 'auto',
            marginRight: 'auto',
        }}>
            <h2>Complaints Intensity Histogram</h2>
            <br/>
            <Column {...operatorConfig} />
        </div>
    </>

}

export default Complaints
