import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip,} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import {Card, Col, Row} from "antd";
import {Line} from "react-chartjs-2";
import {useCallback, useEffect, useState} from "react";
import {sortBy} from "lodash";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    annotationPlugin
);

const Inspections = () => {

    const [data, setData] = useState<any[]>([])


    const asyncFetch = useCallback(() => {
        fetch('https://q4yg5ip6re.execute-api.us-west-2.amazonaws.com/default/cogcc?records=inspections_bayswater')
            .then((response) => response.json())
            .then((json) => {
                if (Array.isArray(json)) {
                    let _data = sortBy(json, 'my')
                    setData(_data)
                }
            })
            .catch((error) => {
                console.log('fetch data failed', error);
            });
    }, [])

    useEffect(() => {
        asyncFetch()
    }, [])

    return (
        <div className={"container"}>
            <Row gutter={[16, 20]}>

                <Col span={12}>
                    <Card title={
                        <Card.Meta
                            title="Bayswater field inspections in the last quarter"
                            description="Do we see any changes in inspection frequency?"
                        />
                    } bordered={false}>
                        <div>
                            {data && <Line data={{
                                labels: [...data.flatMap(o => o.my)],
                                datasets: [
                                    {
                                        label: '# of Inspections',
                                        data: [...data.flatMap(o => o.total_inspections)],
                                        fill: false,
                                        borderColor: 'rgb(75, 192, 192)',
                                        tension: 0.1
                                    }
                                ]
                            }}
                                           options={{
                                               responsive: true,

                                               plugins: {
                                                   legend: {
                                                       position: 'bottom',
                                                   }
                                               },

                                               scales: {
                                                   y: {
                                                       beginAtZero: true,
                                                       ticks: {
                                                           precision: 0
                                                       },
                                                       title: {
                                                           text: "# of Monthly Inspections",
                                                           display: true
                                                       }
                                                   },
                                                   x: {
                                                       title: {
                                                           text: "Year - Month",
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

export default Inspections
