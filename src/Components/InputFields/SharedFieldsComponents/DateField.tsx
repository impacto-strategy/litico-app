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
        if (initialDate === null) {
            return null
        }
        switch(timeframeSelected) {
            case "month":
                return moment(initialDate, "YYYY-MM");
            case "quarter":
                return moment(initialDate, "YYYY-MM-DD");
            case "year":
                return moment(initialDate, "YYYY");
            default:
                return moment(initialDate, "YYYY-MM-DD");
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