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

                <Col span={24}>
                    <Card title={
                        <Card.Meta
                            title="Permit Approval (Industry M&A)*"
                            description="What’s my permit Intensity?  What are my competitor’s permit intensity?"
                        />
                    } bordered={false}>
                        <div style={{maxHeight: '60vh'}}>
                            {data && <Line data={{
                                labels: [...data.flatMap(o => o.my)],
                                datasets: [
                                    {
                                        label: 'K',
                                        data: [8, 8, 8, 8, 8]
                                    }
                                ]
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

export default Inspections
