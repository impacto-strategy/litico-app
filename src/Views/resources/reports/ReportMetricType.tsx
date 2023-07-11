import {useParams, useSearchParams} from "react-router-dom";
import styled from "styled-components";
import {Button, Card, Col, Descriptions, Divider, List, PageHeader, Row, Skeleton, Space, Table, Tag } from "antd";
import {PlusOutlined} from '@ant-design/icons'
import React, {useCallback, useEffect, useState} from "react";
import ResourceService from "../../../Services/ResourceService";
import { flatten, map, uniq } from "lodash";
import moment from 'moment';


const Wrapper = styled.section`
  margin: auto;
  max-width: none;
  padding-top: 20px;
  padding-bottom: 40px;
`
const ContentWrapper = styled.section`
  margin: auto;
  max-width: none;
  padding-top: 20px;
  padding-bottom: 40px;

`


const ReportMetricType = () => {
    const {reportID} = useParams()
    const [searchParams] = useSearchParams();
    const columns = [{
        title: 'Organization',
        dataIndex: 'organization',
        key: 'organization',
    },
    {
        title: 'Value',
        dataIndex: 'value',
        key: 'value',
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
    },
    {
        title: 'City',
        dataIndex: 'city',
        key: 'city',
    },
    {
        title: 'State',
        dataIndex: 'state',
        key: 'state',
    },
    {
        title: 'Type A',
        dataIndex: 'type_a',
        key: 'type_a',
    },
    {
        title: 'Type B',
        dataIndex: 'type_b',
        key: 'type_b',
    },
    {
        title: 'User',
        dataIndex: 'user_name',
        key: 'user_name',
    },
    {
        title: 'Submitted on',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (value:any) => (
            <span>
                {moment(value).format('MM/DD/YYYY h:mm')}
            </span>
        ),
    }]
    const [initLoading, setInitLoading] = useState(true)
    const [reportData, setReportData] = useState<any>({year: '', period: '', esg_metrics: [], report: {}})
    const [metricStandards, setMetricStandards] = useState<any>()


    const getStandards = useCallback((metricCodes: any) =>{
        ResourceService.index({
            resourceName: 'standards',
            params: {metric_codes: JSON.stringify(metricCodes).replaceAll(" ", "").replaceAll("n/a", "")}
        })
            .then(({ data }) => {
                setMetricStandards(data);
            })
            .finally(() => setInitLoading(false))

    }, [setMetricStandards])

    const getMetric = useCallback(() => {
        ResourceService.index({
            resourceName: 'esg-metrics',
            params: {
                metric_name: searchParams.get("metric_name"),
                metric_subtype: searchParams.get("metric_subtype"),
                report_id: reportID
            }
        })
            .then(({ data }) => {
                setReportData(data);
                let codes = map(data.esg_metrics, 'metric_code').map((m) => m.split(';'));
                getStandards(uniq(flatten(codes)).filter(c => c !== 'n/a'));
            })
            .finally(() => setInitLoading(false))

    }, [reportID, searchParams, getStandards])

    useEffect(() => {
        getMetric()
    }, [getMetric])

    return (
        <Wrapper>
            <Space direction="vertical" style={{width: '100%'}} size={"large"}>
                <PageHeader
                    ghost={false}
                    onBack={() => window.history.back()}
                    title={initLoading ?
                        <div style={{width: 200, background: '#fafafa', height: '20px'}}/> : reportData?.esg_metrics[0]?.metric_name}
                    subTitle={`ESG Report | ${reportData?.year} - ${reportData?.period}`}
                ><Divider />
                    <ContentWrapper>
                        <Skeleton active loading={initLoading}>
                            {reportData && <Row>
                                <Col span={24}>
                                    <Table
                                        title={() => `${reportData?.esg_metrics[0]?.metric_name} - ${reportData?.esg_metrics[0]?.metric_subtype}`}
                                        footer={() =>
                                            <Button icon={<PlusOutlined/>}>
                                                Add Metric
                                            </Button>
                                        }
                                        pagination={false}
                                        columns={columns} dataSource={reportData?.esg_metrics} rowKey={'id'} />
                                </Col>
                            </Row>}
                            <Row>
                                <Col span={24}>
                                    <Space direction={'vertical'}>
                                        <Divider>Standards</Divider>
                                        <List
                                            grid={{gutter: 16, column: 2}}
                                            dataSource={metricStandards}
                                            renderItem={(item: any, idx) => (
                                                <List.Item>
                                                    <Card
                                                        title={item.metric_name}>
                                                        <Card.Meta 
                                                            title={
                                                                <Tag>
                                                                    {item.metric_code}
                                                                </Tag>
                                                            }
                                                            description={item.description}
                                                        />
                                                        <Divider/>
                                                        <Descriptions column={1} size={"small"} layout={"horizontal"}>
                                                            {item.measurement_units && <Descriptions.Item
                                                                label={"Unit Of Measure"}>
                                                                <Tag>{item.measurement_units}</Tag>
                                                            </Descriptions.Item>}
                                                            <Descriptions.Item
                                                                label={"Category"}>
                                                                <Tag>{item.category}</Tag>
                                                            </Descriptions.Item>
                                                        </Descriptions>
                                                    </Card>
                                                </List.Item>
                                            )}
                                        />
                                    </Space>
                                </Col>
                            </Row>
                        </Skeleton>
                    </ContentWrapper>

                </PageHeader>
            </Space>
        </Wrapper>
    )
}

export default ReportMetricType