import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip,} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import {Card, Col, Row} from "antd";
import {Line} from "react-chartjs-2";
import {useEffect, useState} from "react";
import {INSPECTIONS_CONFIG} from "../constants/cogcc/global";
import {cogccClient} from "../Services/CogccQueryService";
import {inspectionsTransformer} from "../transformers/cogcc/global";

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

    const [data, setData] = useState<any[] | any>([])


    useEffect(() => {
        cogccClient({interceptor: inspectionsTransformer})
            .get('https://q4yg5ip6re.execute-api.us-west-2.amazonaws.com/default/cogcc?records=inspections_bayswater')
            //TODO: Investigate typescript return type with AxiosRequest
            .then(data => setData(data))
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
                                labels: [...data.flatMap((o: any) => o.my)],
                                datasets: [
                                    {
                                        label: '# of Inspections',
                                        data: [...data.flatMap((o: any) => o.total_inspections)],
                                        fill: false,
                                        borderColor: 'rgb(75, 192, 192)',
                                        tension: 0.1
                                    }
                                ]
                            }}
                                           options={INSPECTIONS_CONFIG}
                            />}
                        </div>
                    </Card>
                </Col>


            </Row>
        </div>
    )
}

export default Inspections
