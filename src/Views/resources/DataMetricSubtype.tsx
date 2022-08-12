import {Button, Card, Col, DatePicker, Divider, Form, Input, message, PageHeader, Row, Select, Space, Tag} from "antd";
import styled from "styled-components";
import {useSearchParams} from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import ResourceService from "../../Services/ResourceService";
import { find, orderBy } from 'lodash';

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
    const [searchParams] = useSearchParams();
    const [form] = Form.useForm();
    const [facilities, setFacilities] = useState<any>()
    const [standards, setMetricStandards] = useState<any>()
    const [fields, setFields] = useState<any>()
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
            setFacilities(orderBy(data, 'name'))
        })
    }, [])

    const getStandards = useCallback(() =>{
        ResourceService.index({
            resourceName: 'standards',
            params: {metric_subtype: searchParams.get("metric_subtype")}
        }).then(({ data }) => {
            setMetricStandards(data);
            setFields(data[0].esg_metric_factors)
        })

    }, [searchParams, setMetricStandards])

    const createMeasurementMetrics = (measurementIds: any[]) => {
        ResourceService.store({
            resourceName: 'measurement-esg-metrics',
            fields: {
                measurement_ids: measurementIds,
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
            formValues['esg_metric_factor_id'] = factor.id;
            formValues['esg_metric_factor_name'] = factor.name;
            formValues['measurement_unit'] = factor.measurement_units[0];
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
                    title={searchParams.get("metric_name")}
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
                        <Row style={{paddingTop: '20px'}}>
                            <p>{standards?.[0].description}</p>
                        </Row>
                    </Card>
                    <Divider />
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                    >
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item name="timeframe" label="Timeframe" required tooltip="This is a required field">
                                    <Select>
                                        {timeframeOptions.map((option: any) => (
                                            <Select.Option key={option.name} value={option.value} >{option.name}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                </Col>
                            <Col span={12}>
                                <Form.Item name="date" label="Date">
                                    <DatePicker />
                                    </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item name="facility_name" label="Facility">
                                    <Select>
                                        {facilities?.map((facility: any) => (
                                            <Select.Option key={facility.id} value={facility.name} >{facility.name}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="basin" label="Basin">
                                    <Input/>
                                </Form.Item>
                            </Col>
                        </Row>
                        
                        <Row gutter={24}>
                            <Col span={12}>
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
                            <Col key={field.id} span={8}>
                                <Form.Item label={field.name}>
                                    <Input.Group compact>
                                        <Form.Item
                                            name={['factors', field.col_label]}
                                            noStyle
                                            >
                                            <Input style={{ width: '50%' }} />
                                        </Form.Item>
                                        <Form.Item
                                            noStyle
                                            >
                                            <Select placeholder={field.measurement_units[0]}>
                                                {field.measurement_units.map((option: string) => (
                                                    <Select.Option key={option} value={option} >{option}</Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Input.Group>
                                </Form.Item>
                            </Col>
                            ))}
                        </Row>
                        <Divider />
                        <Form.Item name="comments" label="Comments">
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" >Submit</Button>
                        </Form.Item>
                    </Form>
                </ContentWrapper>
            </Space>
        </Wrapper>
    )
}

export default DataMetricSubtype