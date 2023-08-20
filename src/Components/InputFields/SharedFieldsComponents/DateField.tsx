import { Col, DatePicker, Form } from 'antd';
import moment from 'moment';
import { FC, useCallback } from 'react';

interface IProps {
    initialDate: string | null,
    searchParams: any,
    timeframeSelected: any
}

const DateField: FC<IProps> = ({initialDate, searchParams, timeframeSelected}) => {

    const setInitialDate = useCallback(() => {
        if (timeframeSelected === "date" && initialDate !== null) {
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