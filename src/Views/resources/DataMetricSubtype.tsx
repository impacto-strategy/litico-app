import { Alert, Button, Card, Col, DatePicker, Divider, Form, Input, message, PageHeader, Row, Select, Space, Tag, Tooltip, Upload } from "antd";
import { DownOutlined, DownloadOutlined, InboxOutlined, QuestionCircleOutlined, UpOutlined, UploadOutlined } from '@ant-design/icons';
import styled from "styled-components";
import {useSearchParams} from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CSVLink } from "react-csv";
import ResourceService from "../../Services/ResourceService";
import { find, orderBy } from 'lodash';
import Cookies from 'js-cookie';

const Wrapper = styled.section`
  margin: auto;
  max-width: none;
  padding-top: 20px;
  padding-bottom: 40px;

`

const ContentWrapper = styled.div`
  background: #fff;
  padding: 60px 30px;
  margin-bottom: 32px;
`

const DataMetricSubtype = () => {
    const baseUrl = process.env.API_URL || 'http://localhost'
    const [searchParams] = useSearchParams();
    // React State
    const [timeframeSelected, setTimeFrame] = useState<"date" | "month" | "quarter" | "year">("date")
    const [defaultColumns] = useState<any>([
        'ESG Pillar',
        'Standard',
        'Metric Name',
        'Metric Subtype',
        'Metric Code',
        'Risk',
        'Value',
        'Measurement Units',
        'Numerator 1',
        'Numerator 2',
        'Numerator 3',
        'Numerator 4',
        'Numerator 5',
        'Numerator 6',
        'Numerator 7',
        'Numerator 8',
        'Denominator',
        'Description',
        'Narrative',
        'Date',
        'Organization',
        'Contact',
        'Name',
        'Address',
        'City',
        'State',
        'Basin',
        'Type A',
        'Type B'
    ])
    const [facilities, setFacilities] = useState<any>()
    const [fields, setFields] = useState<any>()
    const [headerColumns, setHeaderColumns] = useState<any>()
    const [showDescription, setShowDescription] = useState<any>(false)
    const [standards, setMetricStandards] = useState<any>()
    const [uploaded, setUploaded] = useState<any>(false)

    const stateCodes = [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS',
        'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY',
        'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV',
        'WI', 'WY'
    ]

    const [form] = Form.useForm();
    let resources: any[] = [];

    const colHeaders = useMemo(() => {
        if (headerColumns && headerColumns.length > 0) {
            return [headerColumns.map((header :any) => header.col_header), headerColumns.map((header:any) => header.default_value)]
        } else {
            return [defaultColumns, defaultColumns.map(() => '')]
        }
    }, [defaultColumns, headerColumns])

    const riskOptions = [
        {name: 'High', value: 'high'},
        {name: 'Medium', value: 'medium'},
        {name: 'Low', value: 'low'}
    ]

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
            subMetricName === "Community Grievances" ||
            subMetricName === "Workforce Demographics - Ethnicity" ||
            subMetricName === "Workforce Demographics - Gender" ||
            subMetricName === "Production - Oil, Gas, Produced Water, Synthetic Oil, Synthetic Gas" ||
            subMetricName === "TRIR - Employees" ||
            subMetricName === "TRIR - All Workers"
        ){
            return [ 
                {name: 'Yearly', value: 'yearly'},
                {name: 'Quarterly', value: 'quarterly'},
                {name: 'Monthly', value: 'monthly'}
            ]
        } else if (
            subMetricName === "Social Investment" ||
            subMetricName === "Volunteering - Community"
        ) {
            return [ {name: 'Daily', value: 'daily'} ]
        }
        else {
            return [
                {name: 'Yearly', value: 'yearly'},
                {name: 'Quarterly', value: 'quarterly'},
                {name: 'Monthly', value: 'monthly'}
            ]
        }
    }, [])

    const getFacilities = useCallback(() => {
        ResourceService.index({
            resourceName: 'facilities'
        }).then(({ data }) => {
            let facilities = orderBy(data, 'name')
            facilities.unshift({ name: "All Facilities" })
            setFacilities(facilities)
        })
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

    const normFile = (e: any) => {
        console.log('Upload event:', e)
        if (e?.file?.status === 'done') {
            resources.push(e.file.response)
        }
        return e && e.fileList;
    };

    const uploadFile = (e: any) => {
        if (e?.file?.status === 'done') {
            setUploaded(true)
        }
    };

    let token = Cookies.get('XSRF-TOKEN')
    const headers = {
        'X-XSRF-TOKEN': token || ''
    }

    const setDefaultFields = useCallback(() => {
        form.setFieldsValue({
            state: 'CO',
            basin: 'DJ Basin'
        })
    },[form])

    const getStandards = useCallback(() => {
        ResourceService.index({
            resourceName: 'standards',
            params: {metric_subtype: searchParams.get("metric_subtype")}
        }).then(({ data }) => {
            setMetricStandards(data);
            setFields(data[0].esg_metric_factors)
            setDefaultFields()
        })

    }, [searchParams, setMetricStandards, setDefaultFields])

    const getColumns = useCallback(() => {
        ResourceService.fields(
            {
                resourceName: 'metric-types',
                params: {metric_subtype: searchParams.get("metric_subtype")}
            }
        ).then(({ data }) => {
            setHeaderColumns(data)
        })

    }, [searchParams])

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

    const createMeasurementMetrics = (measurementIds: any[]) => {
        ResourceService.store({
            resourceName: 'measurement-esg-metrics',
            fields: {
                measurement_ids: measurementIds,
                metric_subtype: searchParams.get("metric_subtype"),
                year: form.getFieldValue('date').year(),
                employee_id: form.getFieldValue('factors').employee_id,
                tax_id: form.getFieldValue('factors').tax_id,
            }
        }).then((res) => {
            message.success('Data was added successfully');
            form.resetFields()
        })
    }

    const onFinish = (values: any) => {
        let measurementIds: any[] = [];
        delete values.factors.employee_id
        delete values.factors.tax_id

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
            return createMeasurementMetrics(measurementIds);
        });
    };

    useEffect(() => {
        getFacilities()
        getStandards()
        getColumns()
    }, [getColumns, getFacilities, getStandards])

    return (
        <Wrapper>
            <Space direction="vertical" style={{ width: '100%' }} size={"large"}>
                <PageHeader
                    ghost={false}
                    onBack={() => window.history.back()}
                    title={searchParams.get("metric_subtype")}
                />
                <ContentWrapper>
                    <Row>
                        <Col span={24}>
                            <span style={{ float: 'right' }} >
                                <Tooltip placement="topLeft" title={'Enter a single data point below or bulk upload using these buttons'}>
                                    <QuestionCircleOutlined style={{ paddingRight: '24px' }} />
                                </Tooltip>
                                <Button icon={<DownloadOutlined />}><CSVLink data={colHeaders}> Download Blank Form</CSVLink></Button>
                            </span>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{ paddingTop: '20px', paddingBottom: '20px' }} span={24}>
                            <span style={{ float: 'right' }}>
                                <Upload name="files" action={`${baseUrl}/api/uploads?metric_subtype=${searchParams.get("metric_subtype")}`} onChange={uploadFile} withCredentials={true} headers={headers}>
                                    <Button style={{ float: 'right' }}  icon={<UploadOutlined />}>Upload Completed Form</Button>
                                </Upload>
                                {uploaded &&
                                    <Alert message="Upload Successful" type="success" closable/>
                                }
                            </span>
                        </Col>
                    </Row>
                    <Card
                        title={standards?.[0].metric_subtype}
                        type='inner'
                        >
                        <Space direction={'vertical'}>
                                {standards?.[0].metric_code.split(',').map((code: any, idx:string) => (
                                    <Tag key={idx}>{code}</Tag>
                                )
                                )}
                        </Space>
                        {(standards?.[0].description && !showDescription) &&
                            <DownOutlined style={{
                            float: 'right'
                            }} onClick={(() => setShowDescription(true))} />
                        }
                        {(standards?.[0].description && showDescription) &&
                            <>
                                <UpOutlined style={{
                                    float: 'right'
                                }} onClick={(() => setShowDescription(false))} />

                                <Row style={{ paddingTop: '20px' }}>
                                    <p>{standards?.[0].description}</p>
                                </Row>
                            </>
                        }
                    </Card>
                    <Divider />
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
                                    <Input/>
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
                                            <Select.Option key={option.name} value={option.value} >{option.name}</Select.Option>
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
                                        <Form.Item
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
                        <Form.Item label="Upload Supporting Documentation" tooltip="Upload any document that compliments this entry.">
                            <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={normFile}  noStyle>
                                <Upload.Dragger name="file" action={`${baseUrl}/api/resources`} withCredentials={true} headers={headers} accept=".csv,.pdf,.doc,.docx,.jpeg,.png,.jpg,.svg">
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined/>
                                    </p>
                                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                    <p className="ant-upload-hint">Support for a single or bulk upload.</p>
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
                </ContentWrapper>
            </Space>
        </Wrapper>
    )
}

export default DataMetricSubtype