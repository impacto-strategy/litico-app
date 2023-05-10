import {DotMap, DotMapConfig} from "@ant-design/maps";
import {useEffect, useMemo, useState} from "react";
import {Card, Col, Row} from "antd";
import {differenceInBusinessDays} from "date-fns";

const PermitSurveillance = () => {


    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        asyncFetch();
    }, []);

    const asyncFetch = () => {
        fetch('https://q4yg5ip6re.execute-api.us-west-2.amazonaws.com/default/cogcc?records=drill_permits')
            .then((response) => response.json())
            .then((json) => {
                if (Array.isArray(json)) {


                    let _data = json

                        .map(row => {

                            row.lat = parseFloat(row.lat)
                            row.lng = parseFloat(row.lng)
                            row.approvalTime = differenceInBusinessDays(new Date(row['approved_date']), new Date(row['2a_date']))
                            return {
                                // "type": "Feature",
                                // "geometry": {
                                //     "type": "Point",
                                //     "coordinates": [
                                //         row.lng,
                                //         row.lat
                                //     ]
                                // },
                                // "properties": {
                                //     "operator": row.operator_name,
                                //     "permit_type": row.permit_type,
                                // }
                                ...row,
                                lng: row.lng,
                                lat: row.lat,
                                approvalTime: row.approvalTime
                            }


                        })


                    setData(_data)

                }
            })
            .catch((error) => {
                console.log('fetch data failed', error);
            });
    };

    const hexColors = useMemo(() => {
        const getRandomHexColor = () => {
            const letters = "0123456789ABCDEF";

            let color = "#";
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        const _hexColors: string[] = [];

        while (_hexColors.length < 100) {
            const randomColor = getRandomHexColor();
            if (!_hexColors.includes(randomColor)) {
                _hexColors.push(randomColor);
            }
        }

        return _hexColors
    }, [])

    const config: DotMapConfig = {
        map: {
            type: 'mapbox',
            // style: "dark",
            token: 'pk.eyJ1Ijoic2toYW5uYTEwMDA1IiwiYSI6ImNsaDZjbzBxcDA0cTYza21wejhpZjl6MWMifQ.5sxEGc0Rgl8mwGJDuFpIvg',
            pitch: 0,
            center: [-104.991531, 39.742043],
            zoom: 8.2,
        },
        source: {
            data,
            // data: {
            //     type: "FeatureCollection",
            //     features: data
            // },
            parser: {
                type: 'json',
                x: 'lng',
                y: 'lat',
            },
            // parser: {type: 'geojson'},
        },
        // shape: 'dot',
        tooltip: {
            items: ['permit_type', 'operator_name', 'county', 'approvalTime'],

            customItems: (data) => {
                console.log({data})
                return [
                    {
                        name: 'Operator',
                        value: data.operator_name
                    },
                    {
                        name: 'Permit Type',
                        value: data.permit_type
                    },
                    {
                        name: 'Approval Time',
                        value: data.approvalTime + ' Business Days'
                    }
                ]
            }
        },
        label: {
            visible: false,
            // 是否显示标签图层
            field: 'operator_name',
            style: {
                fill: '#fff',
                opacity: 0.6,
                fontSize: 12,
                textAnchor: 'top',
                // 文本相对锚点的位置 center|left|right|top|bottom|top-left
                textOffset: [0, 20],
                // 文本相对锚点的偏移量 [水平, 垂直]
                spacing: 1,
                // 字符间距
                padding: [5, 5],
                // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
                stroke: '#ffffff',
                // 描边颜色
                strokeWidth: 0.3,
                // 描边宽度
                strokeOpacity: 1.0,
            },
        },

        legend: {
            position: 'bottomleft',
        },
        color: {
            field: 'operator_name',
            value: [
                ...hexColors
            ].reverse()
        },
        autoFit: true,
        zoom: {
            position: 'bottomright',
        },
        size: {
            field: 'approvalTime',
            value: [10, 30]
        },
        style: {
            opacity: 0.3,
            strokeWidth: 0,
        },
        state: {
            active: {
                color: '#FFF684',
            },
        },
    };


    return (
        <div className={"container"}>
            <Row gutter={[16, 20]}>
                <Col span={24}>
                    <Card title={
                        <Card.Meta
                            title="Drilling Permits Surveillance"
                            description="Map of Permit Activity & length to approval, colored by operator"
                        />
                    } bordered={false}>
                        <div style={{height: '60vh'}}>
                            <DotMap {...config} />
                        </div>
                    </Card>
                </Col>

            </Row>
        </div>
    )
}

export default PermitSurveillance
