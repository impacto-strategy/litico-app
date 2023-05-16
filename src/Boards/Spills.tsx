import {GeographicHeatmap, GeographicHeatmapConfig} from "@ant-design/maps";
import {useEffect, useState} from "react";
import {orderBy, remove, snakeCase} from "lodash";
import {getQuarter, getYear} from "date-fns";
import {Column, ColumnConfig, Line, LineConfig} from "@ant-design/charts";
import {Card, Col, Row} from "antd";

const Spills = () => {


    const [data, setData] = useState<any[]>([]);
    const [operatorData, setOperatorData] = useState<any[]>([]);
    const [operatorYoY, setOperatorYoY] = useState<any[]>([]);

    useEffect(() => {
        asyncFetch();
    }, []);

    const asyncFetch = () => {
        fetch('https://q4yg5ip6re.execute-api.us-west-2.amazonaws.com/default/cogcc?records=spills')
            .then((response) => response.json())
            .then((json) => {
                if (Array.isArray(json)) {


                    let _data = json

                        .map(row => {

                            row.lat = parseFloat(row.latitude)
                            row.lng = parseFloat(row.longitude)

                            const volume = !row.surface_area_length ? 10000 : row.surface_area_length * row.surface_area_width * row.depth_of_impact_in_feet
                            return {
                                "type": "Feature",
                                "geometry": {
                                    "type": "Point",
                                    "coordinates": [
                                        row.lng,
                                        row.lat
                                    ]
                                },
                                "properties": {
                                    "area": volume,
                                }
                            }


                        })


                    setData(_data)
                    let operatorData: any = {}

                    json.map(row => {
                        row.qy = `Q${getQuarter(new Date(row.date_of_discovery))} - ${getYear(new Date(row.date_of_discovery))}`

                        const key = snakeCase(`${row.operator_number}-${row.qy}`)

                        if (!(key in operatorData)) {
                            operatorData[key] = {
                                ...row,
                                spills: 1,
                                qy: row.qy
                            }
                        } else {
                            operatorData[key] = {
                                ...row,
                                spills: operatorData[key].spills + 1,
                                qy: row.qy
                            }
                        }


                    })

                    operatorData = Object.values(operatorData)

                    remove(operatorData, (n: any) => {

                        return n.spills < 25
                    })


                    setOperatorData(orderBy(operatorData, ['date_of_discovery', 'spills'], ['asc', 'desc']))


                    let _YoYData: any = {}
                    json.map(row => {
                        row.year = getYear(new Date(row.date_of_discovery))
                        //
                        // return row
                        //
                        const key = snakeCase(`${row.operator_number}-${row.year}`)


                        if (!(key in _YoYData)) {
                            _YoYData[key] = {
                                ...row,
                                spills: 1,
                                year: row.year
                            }
                        } else {
                            // console.log({n: _data[row.operator_number + row.qy].notices})
                            _YoYData[key] = {
                                ...row,
                                spills: _YoYData[key].spills + 1,
                                year: row.year
                            }
                        }


                        return row

                    })
                    _YoYData = Object.values(_YoYData)
                    console.log({_YoYData})
                    setOperatorYoY(orderBy(_YoYData, ['date_of_discovery']))
                }
            })
            .catch((error) => {
                console.log('fetch data failed', error);
            });
    };

    const config: GeographicHeatmapConfig = {
        map: {
            type: 'mapbox',
            // style: "dark",
            token: 'pk.eyJ1Ijoic2toYW5uYTEwMDA1IiwiYSI6ImNsaDZjbzBxcDA0cTYza21wejhpZjl6MWMifQ.5sxEGc0Rgl8mwGJDuFpIvg',
            pitch: 43,
            center: [-104.991531, 39.742043],
            zoom: 8.2,
        },
        source: {
            data: {
                "type": "FeatureCollection",
                features: data
            },
            parser: {type: 'geojson'},
        },
        shape: 'heatmap3D',
        size: {
            field: 'area',
            value: ({area}) => area / 100000,
        },
        legend: {
            position: 'bottomleft',
        },
        style: {
            intensity: 3,
            radius: 20,
            opacity: 1,
            colorsRamp: [
                {color: 'rgba(33,102,172,0.0)', position: 0},
                {color: 'rgb(193,197,255)', position: 0.2},
                {color: 'rgb(132,139,250)', position: 0.4},
                {color: 'rgb(79,89,255)', position: 0.6},
                {color: 'rgb(39,51,255)', position: 0.8},
                {color: 'rgb(2,12,218)', position: 1},
            ],
        }
    };


    const operatorConfig: LineConfig = {
        data: operatorData,
        xField: 'qy',
        yField: 'spills',
        seriesField: 'operator',
        yAxis: {
            exponent: 20,
            title: {
                text: '# of Spills'
            }
        },
        legend: {
            position: 'top',
        },
        smooth: true,
        animation: {
            appear: {
                animation: 'path-in',
                duration: 5000,
            },
        },
    };


    let preSelected: any = {}

    orderBy(operatorYoY, 'spills', 'desc').map(op => {
        if (Object.keys(preSelected).length > 16) {
            preSelected[op.operator] = false

        } else {
            preSelected[op.operator] = true

        }
    })

    const spillConfigYoY: ColumnConfig = {
        data: operatorYoY,
        xField: 'year',
        yField: 'spills',
        // title: {
        //     visible: true,
        // },
        xAxis: {
            label: {
                autoRotate: false,
            },
            title: {
                text: "Years"
            },
        },
        yAxis: {
            title: {
                text: "# of Spills"
            },
            position: 'left',

            label: {
                autoRotate: true
            }
        },

        isGroup: true,
        // isStack: false,
        seriesField: 'operator',
        legend: {
            selected: {
                ...preSelected
            },
            layout: "horizontal",
            position: 'bottom',
            flipPage: true,
            maxRow: 3,
        },
    };


    return (
        <div className={"container"}>
            <Row gutter={[16, 20]}>
                <Col span={12}>
                    <Card title={
                        <Card.Meta
                            title="Spills Surveillance (Industry & M&A)"
                            description="Map Showing Estimated Spill Volume"
                        />
                    } bordered={false}>
                        <div style={{height: 400}}>
                            <GeographicHeatmap {...config} />
                        </div>
                    </Card>
                </Col>

                <Col span={12}>
                    <Card title={<Card.Meta
                        title="Spills Intensity Trend-line"
                        description="How are the top 25 producers doing"
                    />} bordered={false}>

                        <Line {...operatorConfig} />
                    </Card>
                </Col>

                <Col span={24}>
                    <Card title={<Card.Meta
                        title="Spills Surveillance (Industry) $$"
                        description="Key Competitor Comparison, year-over-year"
                    />} bordered={false}>

                        <Column {...spillConfigYoY} />
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default Spills
