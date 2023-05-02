import {GeographicHeatmap, GeographicHeatmapConfig} from "@ant-design/maps";
import {useEffect, useState} from "react";
import {orderBy, remove, snakeCase} from "lodash";
import {getQuarter, getYear} from "date-fns";
import {Line, LineConfig} from "@ant-design/charts";

const Spills = () => {


    const [data, setData] = useState<any[]>([]);
    const [operatorData, setOperatorData] = useState<any[]>([]);

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
                            // console.log({n: _data[row.operator_number + row.qy].notices})
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


                    setOperatorData(orderBy(operatorData, ['date_of_discovery', 'spills']))


                }
            })
            .catch((error) => {
                console.log('fetch data failed', error);
            });
    };

    const config: GeographicHeatmapConfig = {
        map: {
            type: 'mapbox',
            style: "dark",
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

    return (
        <div className={"container"}>
            <div style={{height: 700}}>
                <GeographicHeatmap {...config} />
            </div>
            <div style={{background: '#fff', maxWidth: 1200, margin: '20px auto', padding: 30}}>
                <Line {...operatorConfig} />
            </div>
        </div>
    )
}

export default Spills
