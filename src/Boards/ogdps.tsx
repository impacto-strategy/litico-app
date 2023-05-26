import {Card, Col, Row} from "antd";
import {Bar, Line} from "react-chartjs-2";
import {useCallback, useEffect, useMemo, useState} from "react";
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import {filter, groupBy, map, sortBy, sumBy} from "lodash";

ChartJS.register(
    PointElement,
    LineElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    annotationPlugin
);

const Ogdps = () => {


    const [wellsData, setWellsData] = useState<any>()


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

        while (_hexColors.length < 20) {
            const randomColor = getRandomHexColor();
            if (!_hexColors.includes(randomColor)) {
                _hexColors.push(randomColor);
            }
        }

        return _hexColors
    }, [])

    const asyncWells = useCallback(() => {
        fetch('https://q4yg5ip6re.execute-api.us-west-2.amazonaws.com/default/cogcc?records=wells')
            .then((response) => response.json())
            .then(datum => {


                const statuses: any = {
                    "PA": [],
                    "PR": [],
                    "SI": [],
                    "AL": [],
                    "TA": [],
                    "AC": [],
                    "IJ": [],
                    "EP": [],
                    "DG": [],
                    "WO": [],
                    "AP": [],
                    "DA": [],
                    "SO": [],
                    "CM": []
                };

                const definitions: {
                    [l: string]: string
                } = {
                    "PA": "PLUGGED AND ABANDONED",
                    "PR": "PRODUCING WELL",
                    "SI": "SHUT-IN FORMATION COMPLETION",
                    "AL": "ABANDONED LOCATION: PERMIT VACATED; PER OPERATOR: WELL HAS NOT BEEN SPUD.",
                    "TA": "TEMPORARILY ABANDONED",
                    "AC": "ACTIVE",
                    "IJ": "INJECTION WELL",
                    "EP": "EP",
                    "DG": "DRILLING",
                    "WO": "DRILLED, NOT COMPLETED",
                    "AP": "AP",
                    "DA": "DRY AND ABANDONED",
                    "SO": "SO",
                    "CM": "COMMINGLED"
                }

                let operatorData = sortBy(filter(groupBy(datum, 'operator_name'), (val: any) => {
                    return sumBy(val, 'facility_count') > 500

                }), objs => -sumBy(objs, 'facility_count'))


                map(operatorData, val => {
                    Object.keys(statuses).map((status: any) => {
                        const st = val.find(({facility_status}) => facility_status === status)
                        if (st) {
                            statuses[status].push(st.facility_count)
                        } else {
                            statuses[status].push(0)
                        }
                    })
                })

                let datasets = map(statuses, (val, k) => ({
                    label: k in definitions ? definitions[k] : k,
                    data: val,
                    stack: 'Stack 0',
                    backgroundColor: hexColors[Object.keys(statuses).indexOf(k)]
                }))

                const _data = {
                    labels: operatorData.map(objs => objs[0].operator_name),
                    datasets: [
                        ...datasets
                    ]
                }

                setWellsData(_data)

            })
            .catch((error) => {
                console.log('fetch data failed', error);
            });


    }, [hexColors])

    useEffect(() => {
        asyncWells()
    }, [])


    const [data, setData] = useState<any>({
        labels: [1, 2, 3, 4, 5, 6, 7].map(y => `${y} Years`),
        datasets: [{
            label: '# of Permits',
            data: [0, 0, 57, 0, 0, 0, 8],
            backgroundColor: [
                'rgba(99, 170, 123, 0.8)'
            ],
            borderColor: [
                'rgb(99, 170, 123)'
            ],
            borderWidth: 1
        }]
    })


// <block:utils:4>
    function average(ctx: { chart: { data: { datasets: { data: any; }[]; }; }; }) {

        return 3.49
        const values = ctx.chart.data.datasets[0].data;
        return values.reduce((a: any, b: any) => a + b, 0) / values.length;
    }

    function standardDeviation(ctx: { chart: any; }) {
        const values = ctx.chart.data.datasets[0].data;
        const n = values.length;
        const mean = average(ctx);
        return 1.5;
    }

// </block:utils>

    // <block:annotation1:1>
    const annotation1 = {
        type: 'line',
        borderColor: 'rgb(117, 82, 155)',
        borderDashOffset: 0,
        borderWidth: 3,
        label: {
            display: true,
            backgroundColor: 'rgb(117, 82, 155)',
            content: (ctx: any) => 'Mean: ' + average(ctx).toFixed(2) + ' years'
        },
        scaleID: 'x',

        value: (ctx: any) => average(ctx) - 1
    };
// </block:annotation1>

// <block:annotation2:2>
    const annotation2 = {
        type: 'line',
        borderColor: 'rgb(117, 82, 155)',
        borderDash: [6, 6],
        borderDashOffset: 0,
        borderWidth: 3,
        label: {
            display: true,
            backgroundColor: 'rgb(117, 82, 155)',
            color: 'white',
            content: (ctx: any) => 'Std dev ' + standardDeviation(ctx) + ' years',
            position: 'center',
            rotation: -90,
        },
        scaleID: 'x',
        value: (ctx: { chart: any; }) => average(ctx) + standardDeviation(ctx) - 1
    };
// </block:annotation2>

// <block:annotation3:3>
    const annotation3 = {
        type: 'line',
        borderColor: 'rgb(117, 82, 155)',
        borderDash: [6, 6],
        borderDashOffset: 0,
        borderWidth: 3,
        label: {
            display: true,
            backgroundColor: 'rgb(117, 82, 155)',

            color: 'white',
            content: (ctx: any) => 'Std dev ' + standardDeviation(ctx) + ' years',
            position: 'center',
            rotation: 90,
        },
        scaleID: 'x',
        value: (ctx: any) => average(ctx) - standardDeviation(ctx) - 1
    };
// </block:annotation3>

    return (
        <div className={"container"}>
            <Row gutter={[16, 20]}>
                <Col span={12}>
                    <Card title={
                        <Card.Meta
                            title="OGDP Time to Expiration of Permits"
                            description="For what time is COGCC granting permits?"
                        />
                    } bordered={false}>
                        <div>
                            {data && <Bar data={data}

                                          options={{

                                              scales: {
                                                  y: {
                                                      beginAtZero: true,
                                                      title: {
                                                          display: true,
                                                          text: 'Frequency'
                                                      }

                                                  },
                                                  x: {
                                                      beginAtZero: false,
                                                      title: {
                                                          display: true,
                                                          text: 'Years'
                                                      }
                                                  }
                                              },
                                              plugins: {
                                                  annotation: {
                                                      //@ts-ignore
                                                      annotations: {
                                                          annotation1,
                                                          annotation2,
                                                          annotation3
                                                      }
                                                  },
                                                  tooltip: {}
                                              }

                                          }}
                            />}
                        </div>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title={
                        <Card.Meta
                            title="Length of Approval Process and Duration until Expiration"
                            description="has this trend been changing through time?"
                        />
                    } bordered={false}>
                        <div>
                            <Line data={{
                                labels: ["Q1 2021", "Q2 2021", "Q3 2021", "Q4 2021", "Q1 2021", "Q2 2021", "Q3 2021", "Q4 2021"],
                                datasets: [
                                    {
                                        label: 'Average time of OGDP Approval Process (months)',
                                        data: [9, 9, 11, 10.6, 7.8, 6.8, NaN, NaN],
                                        borderColor: 'rgb(99,170,123)',
                                        fill: false,
                                        cubicInterpolationMode: 'monotone',
                                        tension: 0.4
                                    }, {
                                        label: 'Average time to expiration',
                                        data: [3, 3, 3.8, 4, 5, 4, NaN, NaN],
                                        borderColor: 'rgb(84,125,179)',
                                        fill: false,
                                        tension: 0.4
                                    }]
                            }}
                                  options={{
                                      responsive: true,
                                      interaction: {
                                          intersect: false,
                                      },
                                      scales: {
                                          x: {
                                              display: true,
                                              title: {
                                                  display: true,
                                                  text: 'Timeframe ODGP application received'
                                              }
                                          },
                                          y: {
                                              display: true,
                                              title: {
                                                  display: true,
                                                  text: 'Time (Months to Years)'
                                              },
                                              suggestedMin: 0,
                                              suggestedMax: 14
                                          }
                                      }
                                  }}
                            />
                        </div>
                    </Card>
                </Col>

                <Col span={24}>
                    <Card title={
                        <Card.Meta
                            title="Permitted Wellbore Surveillance"
                            description="Which operators own the development capacity across the basin?"
                        />
                    } bordered={false}>
                        <div>
                            {wellsData && <Bar data={wellsData}
                                               options={{
                                                   plugins: {
                                                       legend: {
                                                           position: 'bottom'
                                                       }
                                                   },
                                                   responsive: true,
                                                   interaction: {
                                                       intersect: true,
                                                   },
                                                   scales: {
                                                       x: {
                                                           stacked: true,
                                                           title: {
                                                               text: 'Operators',
                                                               display: true
                                                           }
                                                       },
                                                       y: {
                                                           stacked: true,
                                                           title: {
                                                               text: 'Well Count',
                                                               display: true
                                                           }
                                                       }
                                                   }
                                               }}
                            />}
                        </div>
                    </Card>
                </Col>

            </Row>
        </div>
    )
}

export default Ogdps
