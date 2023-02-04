/* IMPORT EXTERNAL MODULES */
import {
    Button,
    Col,
    DatePicker,
    Divider,
    Input,
    Form,
    message,
    Select,
    Spin,
    Row
} from 'antd'
import {orderBy} from 'lodash'
import moment from 'moment';
import {FC, useCallback, useEffect, useState} from 'react'
import {useSearchParams} from "react-router-dom";

/* IMPORT INTERNAL MODULES */
import ResourceService from '../../../../Services/ResourceService';

interface EditFormProps {
    close: any,
    data: any,
    refresh: any
}

/**
 * Component for form when user wants to edit a data point on the reports section.
 * 
 * @returns JSX Element that renders to edit form for single data point in reports section.
 */
const ReportEditForm: FC<EditFormProps> = (props): JSX.Element => {
    const [form] = Form.useForm();
    const [searchParams] = useSearchParams();

    // React State
    const [facilities, setFacilities] = useState<any>()
    const [fields, setFields] = useState<any>([])
    const [standards, setMetricStandards] = useState<any>()
    const [timeframeSelected, setTimeFrame] = useState<"date" | "month" | "quarter" | "year">("date")

    const riskOptions = [
        {name: 'High', value: 'high'},
        {name: 'Medium', value: 'medium'},
        {name: 'Low', value: 'low'}
    ]

    const stateCodes = [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS',
        'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY',
        'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV',
        'WI', 'WY'
    ]

    const getFacilities = useCallback(() => {
        ResourceService.index({
            resourceName: 'facilities'
        }).then(({ data }) => {
            let facilities = orderBy(data, 'name')
            facilities.unshift({ name: "All Facilities" })
            setFacilities(facilities)
        })
    }, [])

    const getStandards = useCallback(() => {
        ResourceService.index({
            resourceName: 'standards',
            params: {metric_subtype: searchParams.get("metric_subtype")}
        }).then(({ data }) => {
            setMetricStandards(data);
            setFields(data[0].esg_metric_factors)
            // setDefaultFields()
        })

    }, [searchParams, setMetricStandards])

    const checkInitialValue = (val: any, idx: any) => {
        console.log(`${idx}: ${val}`)
        if (val === 0) {
            return 0;
        }
        else if (searchParams.get("metric_subtype") === "Production - Oil, Gas, Produced Water, Synthetic Oil, Synthetic Gas") {
            if (idx === 1 || idx === 4) {
                return val / 1000;
            }
            return val;
        }
        else if (val != null) {
            return val
        }
        return null;
    }
    
    const getTimeframeOptions = useCallback((subMetricName: string): any => {
        if (
            subMetricName === "GHG Emissions" ||
            subMetricName === "Spils- Volume" ||
            subMetricName === "Production - Gas" ||
            subMetricName === "Production - Oil" ||
            subMetricName === "Community Grievances" ||
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
        } else if (subMetricName === "Social Investment") {
            return [ {name: 'Daily', value: 'daily'} ]
        } else {
            return [
                {name: 'Yearly', value: 'yearly'},
                {name: 'Quarterly', value: 'quarterly'},
                {name: 'Monthly', value: 'monthly'}
            ]
        }
    }, [])

    const updateESGMetric = (values: any) => {
        let data: any = JSON.parse(JSON.stringify(props.data));

        // Conditionals act as safety nets.
        data.timeframe = values.timeframe ? values.timeframe : props.data.timeframe
        data.date = values.date ? values.date : props.data.date
        data.basin = values.basin ? values.basin : props.data.basin
        data.state = values.state ? values.state : props.data.state
        data.source = values.source ? values.source : props.data.source
        data.risk = values.risk ? values.risk : props.data.risk

        let index = 1;
        Object.keys(values.factors).map(async (key) => {
            data[`num_${index}`] = values['factors'][key] ? parseInt(values["factors"][key]) : null
            index++;
        })

        // Now send information to backend
        ResourceService.update({
            fields: data,
            resourceName: 'esg-metrics',
            resourceID: data.id
        }).then((res) => {
            if (res.data) {
                message.success('Data was added successfully');
                form.resetFields();
                props.refresh();
                props.close();
            }
        }).catch((err) => {
            console.log(err);
            message.error(`Unable to update, Try again later`);
        })
    }

    const updateTimeFrame = useCallback((e: any, setState: any) => {
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

    useEffect(() => {
        getFacilities();
        getStandards();
        updateTimeFrame(getTimeframeOptions(searchParams.get("metric_subtype")!)[0].value, setTimeFrame)
    }, [getTimeframeOptions, searchParams, updateTimeFrame, getFacilities, getStandards])

    console.log("What does data look? ", props.data)

    return (
        <>
            {(fields.length <= 0) &&
                <Spin 
                    size='large'
                />
            }
            {(fields.length > 0) &&
            <Form
                form={form}
                layout="vertical"
                onFinish={updateESGMetric}
            >
                {/* Timeframe and Date Section */}
                <Row gutter={24}>
                    <Col lg={{span: 12}} sm={{span: 24}}>
                        <Form.Item 
                            // NOTE: needs refactoring for timeframe update.
                            initialValue={getTimeframeOptions(searchParams.get("metric_subtype")!)[0].value}
                            name="timeframe" 
                            label="Timeframe" 
                            required 
                            tooltip="This is a required field" 
                        >
                            <Select
                                onSelect={(e: any) => updateTimeFrame(e, setTimeFrame)}
                            >
                                {getTimeframeOptions(searchParams.get("metric_subtype")!).map((option: any) => (
                                    <Select.Option key={option.name} value={option.value} >{option.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col lg={{span: 12}} sm={{span: 24}}>
                        <Form.Item
                            initialValue={moment(props.data.date)}
                            label="Date"
                            name="date" 
                            required 
                            tooltip="This is the end date of the Timeframe indicated"
                        >
                            <DatePicker
                                picker={timeframeSelected} 
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Facilities/Organization/Basin/State Section */}
                <Row gutter={24}>
                    { standards?.[0].location_type && standards?.[0].location_type === 'facility' &&
                        <Col lg={{span: 12}} sm={{span: 24}}>
                            <Form.Item 
                                name="organization" 
                                label="Facility" 
                                initialValue={props.data.organization ? props.data.organization : 'All Facilities'}
                            >
                                <Select>
                                    {facilities?.map((facility: any) => (
                                        <Select.Option
                                            key={facility.id}
                                            value={facility.name}
                                        >
                                            {facility.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    }

                    {standards?.[0].location_type && standards?.[0].location_type === 'organization' &&
                        <Col lg={{span: 12}} sm={{span: 24}}>
                            <Form.Item
                                initialValue={props.data.organization ? props.data.organization : 'All Facilities'}
                                name="organization"
                                label="Organization"
                            >
                                <Input/>
                            </Form.Item>
                        </Col>
                    }
                    <Col lg={{span: 12}} sm={{span: 24}}>
                        <Form.Item
                            initialValue={props.data.basin}
                            name="basin"
                            label="Basin"
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col lg={{span: 8}} sm={{span: 24}}>
                        <Form.Item
                            initialValue={props.data.state ? props.data.state : 'CO'}
                            name="state" 
                            label="State"
                        >
                            <Select>
                                {stateCodes.map((code: string) => (
                                    <Select.Option key={code} value={code} >{code}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col lg={{span: 12}} sm={{span: 24}}>
                        <Form.Item 
                            initialValue={props.data.source ? props.data.source : ""}
                            name="source" label="Source"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col lg={{span: 12}} sm={{span: 24}}>
                        <Form.Item
                            initialValue={props.data.risk ? props.data.risk : ""}
                            name="risk"
                            label="Risk"
                        >
                            <Select>
                                {riskOptions.map((option: any) => (
                                    <Select.Option key={option.name} value={option.value} >{option.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Divider />
                <Row gutter={24}>
                    {fields?.map((field: any, index: number) => (
                    <Col key={field.id} lg={{span: 10}} sm={{span: 24}}>
                        <Form.Item label={field.name}>
                            <Input.Group compact>
                                <Form.Item
                                    initialValue={checkInitialValue(props.data[`num_${index + 1}`], index)}
                                    name={['factors', field.col_label]}
                                    noStyle
                                >
                                    <Input style={{ width: '50%' }} />
                                </Form.Item>
                                {field.measurement_units[0] &&
                                    <Form.Item
                                        noStyle
                                    >
                                    <Select placeholder={field.measurement_units[0]}>
                                        {field.measurement_units.map((option: string) => (
                                            <Select.Option key={option} value={option} >{option}</Select.Option>
                                        ))}
                                    </Select>
                                    </Form.Item>
                                }
                            </Input.Group>
                        </Form.Item>
                    </Col>
                    ))}
                </Row>
                <Divider />
                <Form.Item
                    initialValue={props.data.narrative ? props.data.narrative : ""}
                    name="comments"
                    label="Discussion and Analysis"
                >
                    <Input.TextArea />
                </Form.Item>
                <Form.Item>
                    {(fields?.length > 0) &&
                        <Button type="primary" htmlType="submit">Submit</Button>
                    }
                    {(fields?.length < 1) &&
                        <div>
                            <Button type="primary" disabled>Submit</Button>
                            <p>Form not available yet</p>
                        </div>
                    }
                </Form.Item>
            </Form>
            }
        </>
    )
}

export default ReportEditForm