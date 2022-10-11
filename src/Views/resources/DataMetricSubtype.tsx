import { Button, Card, Col, DatePicker, Divider, Form, Input, message, PageHeader, Row, Select, Space, Tag, Upload } from "antd";
import { DownOutlined, InboxOutlined, UpOutlined } from '@ant-design/icons';
import styled from "styled-components";
import {useSearchParams} from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
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

/**
 * General purpose module that provides users the ability to add data on a specifc metric and sub metric type.
 * 
 * @params - No parameters.
 * 
 * @returns - JSX element that renders to form.
 */
const DataMetricSubtype = () => {
    const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost' : 'https://api.litico.app'
    const [searchParams] = useSearchParams();

    const stateCodes = [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS',
        'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY',
        'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV',
        'WI', 'WY'
    ]

    const [form] = Form.useForm();
    let resources: any[] = [];
    const [facilities, setFacilities] = useState<any>()
    const [standards, setMetricStandards] = useState<any>()
    const [fields, setFields] = useState<any>()
    const [showDescription, setShowDescription] = useState<any>(false)

    const riskOptions = [
        {name: 'High', value: 'high'},
        {name: 'Medium', value: 'medium'},
        {name: 'Low', value: 'low'}
    ]
    const timeframeOptions = [
        {name: 'Yearly', value: 'yearly'},
        {name: 'Quarterly', value: 'quarterly'},
        {name: 'Daily', value: 'daily'}
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

    const normFile = (e: any) => {
        console.log('Upload event:', e)
        if (e?.file?.status === 'done') {
            resources.push(e.file.response)
        }
        return e && e.fileList;
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

    const createMeasurementMetrics = (measurementIds: any[]) => {
        ResourceService.store({
            resourceName: 'measurement-esg-metrics',
            fields: {
                measurement_ids: measurementIds,
                metric_subtype: searchParams.get("metric_subtype"),
                year: form.getFieldValue('date').year()
            }
        }).then((res) => {
            message.success('Data was added successfully');
            form.resetFields()
        })
    }

    const onFinish = (values: any) => {
        let measurementIds: any[] = [];
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
        Promise.all(requests).then(() => {
            return createMeasurementMetrics(measurementIds);
        });
    };

    useEffect(() => {
        getFacilities()
        getStandards()
    }, [getFacilities, getStandards])

    return (
        <Wrapper>
            <Space direction="vertical" style={{ width: '100%' }} size={"large"}>
                <PageHeader
                    ghost={false}
                    onBack={() => window.history.back()}
                    title={searchParams.get("metric_subtype")}
                />
                <ContentWrapper>
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
                        <Row gutter={24}>
                            <Col lg={{span: 12}} sm={{span: 24}}>
                                <Form.Item name="timeframe" label="Timeframe" required tooltip="This is a required field">
                                    <Select>
                                        {timeframeOptions.map((option: any) => (
                                            <Select.Option key={option.name} value={option.value} >{option.name}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                </Col>
                            <Col lg={{span: 12}} sm={{span: 24}}>
                                <Form.Item name="date" required label="Date" tooltip="This is the end date of the Timeframe indicated">
                                    <DatePicker />
                                    </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            { standards?.[0].location_type && standards?.[0].location_type === 'facility' &&
                                <Col lg={{span: 12}} sm={{span: 24}}>
                                    <Form.Item name="organization" label="Facility">
                                        <Select>
                                            {facilities?.map((facility: any) => (
                                                <Select.Option key={facility.id} value={facility.name} >{facility.name}</Select.Option>
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