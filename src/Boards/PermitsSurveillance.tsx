import {DotMap} from "@ant-design/maps";
import {useEffect, useMemo, useState} from "react";
import {Card, Col, Row} from "antd";
import {PERMIT_SURVEILLANCE_CONFIG} from "../constants/cogcc/global";
import {cogccClient} from "../Services/CogccQueryService";
import {permitSurveillanceTransformer} from "../transformers/cogcc/global";

const PermitSurveillance = () => {


    const [data, setData] = useState<any[] | any>([]);

    useEffect(() => {
        cogccClient({interceptor: permitSurveillanceTransformer})
            .get('https://q4yg5ip6re.execute-api.us-west-2.amazonaws.com/default/cogcc?records=drill_permits')
            .then(data => setData(data))
    }, []);


    //TODO: Build a service to figure out colors for each operator
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
                            <DotMap {...PERMIT_SURVEILLANCE_CONFIG(data, hexColors)}/>
                        </div>
                    </Card>
                </Col>

            </Row>
        </div>
    )
}

export default PermitSurveillance
