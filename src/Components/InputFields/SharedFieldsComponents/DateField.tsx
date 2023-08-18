import { Col, DatePicker, Form } from 'antd';
import moment from 'moment';
import { useCallback } from 'react';

const DateField = ({initialDate, searchParams, timeframeSelected}: any) => {

    const setInitialDate = useCallback(() => {
        if (timeframeSelected === "date") {
            return moment(initialDate, "YYYY-MM-DD");
        } else {
            return null
        }
    }, [initialDate, timeframeSelected]);

    return (
        <Col
            lg={{span: 12}}
            sm={{span: 24}}
        >
            <Form.Item
                initialValue={setInitialDate()}
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