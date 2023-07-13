/* IMPORT EXTERNAL MODULES */
import { 
    Button, 
    Checkbox,
    Col, 
    DatePicker, 
    Divider, 
    Form, 
    Input, 
    message, 
    Row, 
    Select, 
    Upload 
} from "antd";
import { InboxOutlined} from '@ant-design/icons';
import { find, orderBy } from "lodash";
import { FC, useCallback, useEffect, useState } from "react";

/* IMPORT INTERNAL MODULES */
import ResourceService from "../../../../Services/ResourceService";

/**
 * Interface for form where ESG metric data is added pertaining to specific ESG metric.
 */
const ESGDataInputForm: FC<any> = ({fields, form, headers, searchParams, standards}): JSX.Element => {
    // COMPONENT HOOKS
    const baseUrl = process.env.API_URL || 'http://localhost'
    const [facilities, setFacilities] = useState<any>();
    const [timeframeSelected, setTimeFrame] = useState<"date" | "month" | "quarter" | "year">("date");

    // COMPONENT FUNCTIONS
    const createMeasurementMetrics = (measurementIds: any[]) => {
        console.log("starting request")
        console.log(form.getFieldValue('factors'))
        ResourceService.store({
            resourceName: 'measurement-esg-metrics',
            fields: {
                measurement_ids: measurementIds,
                metric_subtype: searchParams.get("metric_subtype"),
                year: form.getFieldValue('date').year(),
                employee_id: form.getFieldValue('factors').employee_id,
                tax_id: form.getFieldValue('factors').tax_id,
                factors: form.getFieldValue('factors')
            }
        }).then((res) => {
            message.success('Data was added successfully');
            form.resetFields()
        })
    }

    const getFacilities = useCallback(() => {
        ResourceService.index({
            resourceName: 'facilities'
        }).then(({ data }) => {
            let facilities = orderBy(data, 'name')
            facilities.unshift({ name: "All Facilities" })
            setFacilities(facilities)
        })
    }, [])

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

    const normFile = (e: any) => {
        console.log('Upload event:', e)
        if (e?.file?.status === 'done') {
            resources.push(e.file.response)
        }
        return e && e.fileList;
    };

    const onFinish = (values: any) => {
        let measurementIds: any[] = [];
        delete values.factors.employee_id
        delete values.factors.tax_id

        console.log("What are values?", values)
        let requests = Object.keys(values.factors).map(async (key) => {
            let formValues = Object.assign({}, values);
            let factor = find(fields, { 'col_label': key });
            formValues['value'] = values['factors'][key];
            formValues['value'] = values['factors'][key];
            formValues['esg_metric_factor_id'] = factor.id;
            formValues['esg_metric_factor_name'] = factor.name;
            formValues['measurement_unit'] = factor.measurement_units[0];
            formValues['resources'] = resources;
            let request  = ResourceService.store({
                resourceName: 'measurements',
                fields: {...formValues}
            }).then((response) => {
                measurementIds.push(response.data.id)
            })

            return request;
        })

        // If there's an additional table needing updating, this function calls otherwise the promise is defaulted to resolved.
        if (searchParams.get("metric_subtype") === "Production - Oil, Gas, Produced Water, Synthetic Oil, Synthetic Gas") {
            requests.push(storeAdditionalMetrics(Object.assign({}, values)));
        }

        Promise.all(requests).then(() => {
            console.log("create measurement metrics")
            return createMeasurementMetrics(measurementIds);
        });
    };

    /**
     * Handles cases where data may need to be stored in tables other
     * than ESG metrics and Measurements (e.g., productions). Will look at
     * exploring alternatives in the future.
     * 
     * @param data The information to be stored
     * 
     */
    const storeAdditionalMetrics = async (data: any): Promise<void> => {
        /*
            This function only supports production and only if production is yearly.
        */
        if (searchParams.get("metric_subtype") === "Production - Oil, Gas, Produced Water, Synthetic Oil, Synthetic Gas") {
        return ResourceService.store({
            resourceName: 'productions',
            fields: {
                year: form.getFieldValue('date').year(),
                ...data
            }
        }).then((response) => {
            return;
        })
        }
    }

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

    // MISC
    let resources: any[] = [];

    const stateCodes = [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS',
        'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY',
        'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV',
        'WI', 'WY'
    ]

    const riskOptions = [
        {name: 'High', value: 'high'},
        {name: 'Medium', value: 'medium'},
        {name: 'Low', value: 'low'}
    ]

    useEffect(() => {
        getFacilities()
    }, [getFacilities])

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
        >
            {/* Timeframe and Date Section */}
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
            {/* Facilities/Organization Section */}
            <Row gutter={24}>
                { standards?.[0].location_type && standards?.[0].location_type === 'facility' &&
                    <Col lg={{span: 12}} sm={{span: 24}}>
                        <Form.Item name="organization" label="Facility" initialValue={'All Facilities'}>
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
                        <Form.Item name="organization" label="Organization">
                            <Input/>
                        </Form.Item>
                    </Col>
                }
                <Col lg={{span: 12}} sm={{span: 24}}>
                    <Form.Item name="basin" label="Basin">
                        <Select>
                                <Select.Option 
                                    key={"Basin"} 
                                    value={"DJ Basin"}
                                >
                                    DJ Basin
                                </Select.Option>
                                <Select.Option 
                                    key={"Basin"} 
                                    value={"Permian"}
                                >
                                    Permian
                                </Select.Option>
                                <Select.Option 
                                    key={"Basin"} 
                                    value={""}
                                >
                                    N/A
                                </Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col lg={{span: 4}} sm={{span: 24}}>
                    <Form.Item name="state" label="State">
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
                    <Form.Item name="source" label="Source">
                        <Input />
                    </Form.Item>
                </Col>
                <Col lg={{span: 12}} sm={{span: 24}}>
                    <Form.Item name="risk" label="Risk">
                        <Select>
                            {riskOptions.map((option: any) => (
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
            </Row>
            <Divider />
            <Row gutter={24}>
                {fields?.map((field: any) => (
                <Col key={field.id} lg={{span: 8}} sm={{span: 24}}>
                    <Form.Item label={field.name}>
                        <Input.Group compact>
                                {field.field_type === "checkbox" && 
                                    <Form.Item
                                        name={['factors', field.col_label]}
                                        noStyle
                                    >
                                        <Checkbox.Group style={{width: "50vw"}}>
                                            {field.factor_form_options.map((choice: any, index: number) => {
                                                return <Checkbox key={index} name={choice.opion} value={choice.option}>{choice.option}</Checkbox>
                                            })}
                                        </Checkbox.Group>
                                    </Form.Item>
                                }
                                {field.field_type === "date_time" &&
                                    <Form.Item
                                        name={['factors', field.col_label]}
                                        noStyle
                                    >
                                        <DatePicker showTime={true} />
                                    </ Form.Item>
                                }
                                {field.field_type === "textarea" &&
                                    <Form.Item
                                        name={['factors', field.col_label]}
                                        noStyle
                                    >
                                        <Input.TextArea />
                                    </Form.Item>
                                }
                                {!field.field_type &&
                                    <Form.Item
                                        name={['factors', field.col_label]}
                                        noStyle
                                    >
                                        <Input style={{ width: '50%' }} />
                                    </Form.Item>
                                }
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
            <Form.Item label="Upload Supporting Documentation" tooltip="Upload any document that compliments this entry.">
                <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={normFile}  noStyle>
                    <Upload.Dragger name="file" action={`${baseUrl}/api/resources`} withCredentials={true} headers={headers} accept=".csv,.pdf,.doc,.docx,.jpeg,.png,.jpg,.svg">
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined/>
                        </p>
                        <p className="ant-upload-text">
                            Click or drag file to this area to upload
                        </p>
                        <p className="ant-upload-hint">
                            Support for a single or bulk upload.
                        </p>
                    </Upload.Dragger>
                </Form.Item>
            </Form.Item>
            <Divider />
            <Form.Item name="comments" label="Discussion and Analysis">
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
    )
}

export default ESGDataInputForm;