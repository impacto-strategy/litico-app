import {HexbinMap, HexbinMapConfig} from "@ant-design/maps";
import {useEffect, useState} from "react";
import {isEmpty} from "lodash";

const Spills = () => {


    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        asyncFetch();
    }, []);

    const asyncFetch = () => {
        fetch('https://q4yg5ip6re.execute-api.us-west-2.amazonaws.com/default/cogcc?records=spills')
            .then((response) => response.json())
            .then((json) => {
                console.log(json)
                if (Array.isArray(json)) {

                    let _data = json
                        .filter(row => {
                            return !isEmpty(row.latitude)
                        })
                        .map(row => {
                            row.geometry = {
                                "coordinates": [
                                    parseFloat(row.longitude),
                                    parseFloat(row.latitude)
                                ],
                                "type": "Point"
                            }
                            row.lat = parseFloat(row.latitude)
                            row.lng = parseFloat(row.longitude)
                            row.n = row.operator
                            return row

                        })


                    console.log(_data)
                    setData(_data)


                }
            })
            .catch((error) => {
                console.log('fetch data failed', error);
            });
    };

    const config: HexbinMapConfig = {
        map: {
            type: 'mapbox',
            style: 'dark',
            token: 'pk.eyJ1Ijoic2toYW5uYTEwMDA1IiwiYSI6ImNsaDZjbzBxcDA0cTYza21wejhpZjl6MWMifQ.5sxEGc0Rgl8mwGJDuFpIvg',
            pitch: 43,
            center: [-104.991531, 39.742043],
            zoom: 8.2,
        },
        source: {
            data: data,
            parser: {type: 'json', x: 'lat', y: 'lng', t: 30},
            aggregation: {
                radius: 1200,
                field: 'rank',
                method: 'sum',
            },
        },
        shape: 'hexagonColumn',
        size: {
            field: 'sum',
            value: ({sum}) => {
                return sum * 100;
            },
        },
        color: {
            field: 'sum',
            value: ['#0553A1', '#0B79B0', '#10B3B0', '#7CCF98', '#DCE872'],
        },
        style: {
            coverage: 0.8,
            angle: 0,
            opacity: 1.0,
        },
    };

    return (
        <div style={{height: 700}}>
            <HexbinMap {...config} />
        </div>
    )
}

export default Spills
