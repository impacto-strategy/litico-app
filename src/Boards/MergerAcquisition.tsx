import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip,} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import {Card, Col, Row} from "antd";
import {Bar} from "react-chartjs-2";
import {useMemo} from "react";
import {map} from "lodash";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    annotationPlugin
);

const MergerAcquisition = () => {
    const d = {
        "CRESTONE PEAK RESOURCES OPERATING LLC": [NaN, 1, 4, NaN, NaN, NaN],
        "VERDAD RESOURCES LLC": [NaN, 0, 4, NaN, NaN, NaN],
        "GREAT WESTERN OPERATING COMPANY LLC": [NaN, NaN, 1, NaN, NaN, NaN],
        "NOBLE ENERGY INC": [NaN, NaN, 1, NaN, NaN, NaN],
        "KERR MCGEE OIL & GAS ONSHORE LP": [NaN, 1, 4, NaN, NaN, NaN],
        "MALLARD EXPLORATION LLC": [NaN, NaN, 5, NaN, NaN, NaN],
        "BONANZA CREEK ENERGY OPERATING COMPANY LLC": [NaN, NaN, 1, NaN, NaN, NaN],
        "PDC ENERGY INC": [NaN, NaN, 1, NaN, NaN, NaN],
        "BAYSWATER EXPLORATION & PRODUCTION LLC": [NaN, NaN, 2, NaN, NaN, NaN],
        "CONFLUENCE DJ LLC": [NaN, NaN, 1, NaN, NaN, NaN]
    }


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

        while (_hexColors.length < 10) {
            const randomColor = getRandomHexColor();
            if (!_hexColors.includes(randomColor)) {
                _hexColors.push(randomColor);
            }
        }

        return _hexColors
    }, [])

    let datasets = map(d, (val, k) => ({
        label: k,
        data: val,
        // stack: 'Stack 0',
        backgroundColor: hexColors[Object.keys(d).indexOf(k)]
    }))


    return (
        <div className={"container"}>
            <Row gutter={[16, 20]}>
                <Col span={24}>
                    <Card title={
                        <Card.Meta
                            title="Permit Expiration (Industry M&A)"
                            description="When do my permits expire?  When do my competitor’s permits expire?​"
                        />
                    } bordered={false}>
                        <div style={{maxHeight: '60vh'}}>
                            {<Bar data={{
                                labels: [2023, 2024, 2025, 2026, 2027],
                                datasets: datasets
                            }}

                                  options={{
                                      responsive: true,

                                      plugins: {
                                          legend: {
                                              position: 'right',
                                          }
                                      },
                                      scales: {
                                          y: {
                                              beginAtZero: true,
                                              ticks: {
                                                  precision: 0
                                              },
                                              title: {
                                                  text: "Count of permits expiring within the year",
                                                  display: true
                                              }
                                          },
                                          x: {
                                              title: {
                                                  text: "Year of expiry",
                                                  display: true
                                              }
                                          }
                                      }
                                  }}
                            />}
                        </div>
                    </Card>
                </Col>
                <Col span={24}>
                    <Card title={
                        <Card.Meta
                            title="Permit Approval (Industry M&A)*"
                            description="What’s my permit Intensity?  What are my competitor’s permit intensity?"
                        />
                    } bordered={false}>
                        <div style={{maxHeight: '60vh'}}>
                            {<Bar data={{
                                labels: [2023, 2024, 2025, 2026, 2027],
                                datasets: datasets
                            }}

                                  options={{
                                      responsive: true,

                                      plugins: {
                                          legend: {
                                              position: 'right',
                                          }
                                      },
                                      scales: {
                                          y: {
                                              beginAtZero: true,
                                              ticks: {
                                                  precision: 0
                                              },
                                              title: {
                                                  text: "Count of permits expiring within the year",
                                                  display: true
                                              }
                                          },
                                          x: {
                                              title: {
                                                  text: "Year of expiry",
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

export default MergerAcquisition
