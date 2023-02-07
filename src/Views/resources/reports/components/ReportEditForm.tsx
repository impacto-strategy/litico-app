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
    data: any, // Original ESG Metric data to be updated.
    refresh: any // used to help update report table once data has been edited.
}

/**
 * React Component that renders UI and handles logic for updating ESG Metric data.
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

    // Helps with metrics that have unique factors.
    const uniqueFactors = {
        'employee_id': true,
        'tax_id': true,
    }

    /**
     * Retrieves all facilities from database. Note: contains side effect.
     */
    const getFacilities = useCallback(() => {
        ResourceService.index({
            resourceName: 'facilities'
        }).then(({ data }) => {
            let facilities = orderBy(data, 'name')
            facilities.unshift({ name: "All Facilities" })
            setFacilities(facilities)
        })
    }, [])

    /**
     * Retrieves all standards from database. Note: contains side effect.
     */
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

    /**
     * Determines what the initial value should be for factor fields.
     * 
     * TODO: Think of potentially better name for function.
     * 
     * @param val - The original data's initial value
     * @param col_label - The column name in the database corresponding to the factor.
     * @param idx - index of input.
     * @returns What the form's value should be.
     */
    const checkInitialValue = (val: any, col_label: any, idx: any) => {

        // Handles factors that aren't just num_1, num_2, etc. (e.g., tax_id)
        if (uniqueFactors.hasOwnProperty(col_label)) {
            return props.data[col_label];
        } else if (val === 0) {
            return 0;
        } 
        // Helps with gas which is stored as MCF in the database, but the form suppports mmscf
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
    
    /**
     * Determines which timeframe options a submetric is able to support.
     */
    const getTimeframeOptions = useCallback((subMetricName: string): any => {
        if ([
            'Community Grievances', 'GHG Emissions', 'Production - Gas', 
            'Production - Oil', 'Spills- Volume', 'Volunteering - Community',
            'Workforce Demographics - Ethnicity', 'Workforce Demographics - Gender', 'Production - Oil, Gas, Produced Water, Synthetic Oil, Synthetic Gas'
        ].includes(subMetricName)) {
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

    /**
     * Prepares form data to be sent to the backend and updated.
     * 
     * @param values - Form Data
     */
    const updateESGMetric = (values: any) => {

        let data: any = JSON.parse(JSON.stringify(props.data));

        // Updates each column based on what's in the input field.
        ['basin', 'date', 'narrative', 'organization', 'risk', 'state', 'source', 'timeframe'].forEach((item) => {
            data[item] = values[item]
        })

        let index = 1;

        Object.keys(values.factors).map(async (key) => {
            // Helps ensure unique ESG Metric columns are updated properly.
            if (uniqueFactors.hasOwnProperty(key)) {
                data[key] = values['factors'][key]
            } else {
                data[`num_${index}`] = values['factors'][key] ? parseInt(values["factors"][key]) : null
            }
            
            index++;
        })

        // Now form data is sent to backend.
        ResourceService.update({
            fields: data,
            resourceName: 'esg-metrics',
            resourceID: data.id
        }).then((res) => {
            if (res.data) {
                message.success('Data was added successfully');
                form.resetFields();
                // Refresh report component to show updated data.
                props.refresh();
                // Closes form
                props.close();
            }
        }).catch((err) => {
            console.log(err);
            message.error(`Unable to update, Try again later`);
        })
    }

    /**
     * Updates state so that the date picker input updates correctly.
     */
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
                                    initialValue={checkInitialValue(props.data[`num_${index + 1}`], field.col_label, index)}
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
                    initialValue={props.data.narrative}
                    name="narrative"
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