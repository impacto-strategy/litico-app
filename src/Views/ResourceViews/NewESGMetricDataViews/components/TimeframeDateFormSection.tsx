import {
    Col,
    DatePicker,
    Form,
    Row,
    Select
} from 'antd';
import { useCallback, useState } from 'react';

const TimeframeDateSection = ({searchParams}: any) => {

    const [timeframeSelected, setTimeFrame] = useState<"date" | "month" | "quarter" | "year">("date");

    // Commented out temporarily until forms have all options available.
    // const timeframeOptions = [
    //     {name: 'Yearly', value: 'yearly'},
    //     {name: 'Quarterly', value: 'quarterly'},
    //     {name: 'Monthly', value: 'monthly'}
    // ]

    // Temporary timeframe options function.
    const getTimeframeOptions = useCallback((subMetricName: string): any => {
        if (
            subMetricName === "GHG Emissions" ||
            subMetricName === "Spils- Volume" ||
            subMetricName === "Production - Gas" ||
            subMetricName === "Production - Oil" ||
            subMetricName === "Social Investment" ||
            subMetricName === "Volunteering - Community" ||
            subMetricName === "Workforce Demographics - Ethnicity" ||
            subMetricName === "Workforce Demographics - Gender" ||
            subMetricName === "Production - Oil, Gas, Produced Water, Synthetic Oil, Synthetic Gas"
        ){
            return [ {name: 'Yearly', value: 'yearly'} ]
        } else if (
            subMetricName === "TRIR - Employees" ||
            subMetricName === "TRIR - All Workers"
        ) {
            return [ {name: 'Quarterly', value: 'quarterly'} ]
        }
        else {
            return [
                {name: 'Yearly', value: 'yearly'},
                {name: 'Quarterly', value: 'quarterly'},
                {name: 'Monthly', value: 'monthly'}
            ]
        }
    }, [])

    const updateTimeFrame = useCallback((e, setState) => {
        if (e === "yearly") {
            setState('year');
        } else if (e === "quarterly") {
            setState('quarter');
        } else if (e === "monthly") {
            setState('month');
        } else {
            setState('date');
        }
    }, [])

    return (
        <Row gutter={24}>
            <Col lg={{span: 12}} sm={{span: 24}}>
                <Form.Item name="timeframe" label="Timeframe" required tooltip="This is a required field">
                    <Select
                        // See if we can improve the e's type later.
                        onSelect={(e: any) => updateTimeFrame(e, setTimeFrame)}
                    >
                        {getTimeframeOptions(searchParams.get("metric_subtype")!).map((option: any) => (
                            <Select.Option key={option.name} value={option.value} >{option.name}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            <Col lg={{span: 12}} sm={{span: 24}}>
                <Form.Item name="date" required label="Date" tooltip="This is the end date of the Timeframe indicated">
                    <DatePicker picker={timeframeSelected} />
                </Form.Item>
            </Col>
        </Row>
    )
}

export default TimeframeDateSection;