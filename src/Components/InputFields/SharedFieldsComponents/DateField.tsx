import { Col, DatePicker, Form } from 'antd';

const DateField = ({searchParams, timeframeSelected}: any) => {
    return (
        <Col
            lg={{span: 12}}
            sm={{span: 24}}
        >
            <Form.Item
                name="date"
                required label={searchParams.get("metric_subtype") + " Date"}
                tooltip="This is the end date of the Timeframe indicated"
            >
                <DatePicker picker={timeframeSelected} />
            </Form.Item>
        </Col>
    )
}

export default DateField;