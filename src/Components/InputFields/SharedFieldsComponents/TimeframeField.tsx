import { Col, Form, Select } from 'antd'
import { Dispatch, FC, useCallback } from 'react';

interface IProps {
    initialValue: string | null,
    searchParams: URLSearchParams,
    setTimeFrame: Dispatch<React.SetStateAction<"date" | "month" | "quarter" | "year">> // AKA setState for timeframe
}
const TimeframeField: FC<IProps> = ({ initialValue, searchParams, setTimeFrame }) => {

    const getTimeframeOptions = useCallback((subMetricName: string): any => {
        if (
            subMetricName === "GHG Emissions" ||
            subMetricName === "Spils- Volume" ||
            subMetricName === "Production - Gas" ||
            subMetricName === "Production - Oil" ||
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
        if (e === 'yearly') {
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
        <Col
            lg={{span: 12}}
            sm={{span: 24}}
        >
            <Form.Item
                initialValue={initialValue}
                name="timeframe"
                label="Timeframe"
                required tooltip="This is a required field"
            >
                <Select
                    // See if we can improve the e's type later.
                    onSelect={(e: any) => updateTimeFrame(e, setTimeFrame)}
                >
                    {getTimeframeOptions(searchParams.get("metric_subtype")!).map((option: any) => (
                        <Select.Option 
                            key={option.name}
                            value={option.value}
                        >
                                {option.name}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
        </Col>
    )
}

export default TimeframeField;