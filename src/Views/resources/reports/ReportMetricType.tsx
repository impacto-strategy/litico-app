import {useParams} from "react-router-dom";
import styled from "styled-components";
import {Avatar, Card, Col, Descriptions, Divider, List, PageHeader, Row, Skeleton, Space, Statistic, Tag} from "antd";
import React, {useCallback, useEffect, useState} from "react";
import ResourceService from "../../../Services/ResourceService";
import {serializeHtml} from "../../../utils";
import {orderBy} from "lodash";


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
    const {metricID} = useParams()

    const [initLoading, setInitLoading] = useState(true)
    const [metricData, setMetricData] = useState<any>({report:[], reporting_standard: ''})

    const getMetric = useCallback(() => {
        ResourceService.get({
            resourceName: 'esg-metrics',
            resourceID: Number(metricID) as number
        })
            .then(({data}) => setMetricData(data[0]))
            .finally(() => setInitLoading(false))

    }, [metricID])

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
                        <div style={{width: 200, background: '#fafafa', height: '20px'}}/> : metricData?.metric_name}
                    subTitle={`ESG Report | ${metricData.report.year} - ${metricData.report.period}`}
                ><Divider/>
                    <ContentWrapper>
                        <Skeleton active loading={initLoading}>
                            {metricData && <Row>
                                <Col xs={2} sm={4} md={6} lg={8} xl={10}>
                                    <Space direction={'vertical'}>

                                        {!!metricData.value && <Card title={"Total"} style={{marginBottom: 20}}>
                                            <Statistic
                                                value={metricData.measurement_units === '%' ? (metricData.value * 100).toLocaleString() :  metricData.value}
                                                valueStyle={{color: "#1890ff"}}
                                                suffix={metricData.measurement_units !== '$' ? metricData.measurement_units : ''}
                                                prefix={metricData.measurement_units === '$' ? '$' : ''}
                                            />
                                        </Card>}
                                        <p><Tag
                                            color={['High', 'Very High'].includes(metricData.risk) ? 'red' : 'orange'}>Risk: {metricData.risk}</Tag>
                                            <Tag>{metricData.isNumeric ? 'Quantitative' : 'Qualitative'}</Tag>
                                        </p>
                                        <p>{metricData.description}</p>
                                        <p>{metricData.organization}</p>

                                        {metricData.narrative && <><Divider>Narrative</Divider>
                                            <p>
                                                {metricData.narrative}
                                            </p></>}
                                            <><Divider>Standards</Divider> <List
                                            grid={{gutter: 16, column: 2}}
                                            dataSource={metricData.reporting_standard.split(';')}
                                            renderItem={(item: any, idx) => (
                                                <List.Item>
                                                    <Card
                                                        title={metricData.metric_name}>
                                                        <Card.Meta title={<Tag>
                                                            {metricData.metric_code.split(';')[idx]}
                                                        </Tag>} description={'This is the Standard description. Still need.'}>
                                                        </Card.Meta>
                                                        <Divider/>
                                                        <Descriptions column={1} size={"small"} layout={"horizontal"}>
                                                            {metricData.measurement_units && <Descriptions.Item
                                                                label={"Unit OF Measure"}>
                                                                <Tag>{metricData.measurement_units}</Tag>
                                                            </Descriptions.Item>}
                                                            <Descriptions.Item
                                                                label={"Category"}>
                                                                <Tag>{metricData.category}</Tag>
                                                            </Descriptions.Item>
                                                        </Descriptions>
                                                    </Card>
                                                </List.Item>
                                            )}
                                        /></>
                                    </Space>
                                </Col>

                                <Col xs={2} sm={4} md={6} lg={8} xl={10} offset={4}>
                                    <Card title={"Activity"} type={"inner"}>
                                        <List
                                            itemLayout="horizontal"
                                            dataSource={orderBy(metricData.sessions, 'created_at', 'desc')}
                                            renderItem={(item: any) => (
                                                <List.Item>
                                                    <List.Item.Meta
                                                        description={
                                                            <div>{new Date(item.created_at).toLocaleString('en-US', {
                                                                month: 'short',
                                                                day: '2-digit',
                                                                year: 'numeric'
                                                            })}, {new Date(item.created_at).toLocaleString('en-US', {
                                                                timeStyle: 'short'
                                                            })}</div>}
                                                        avatar={<Avatar
                                                            src={`https://avatars.dicebear.com/api/initials/${item.user.name}.svg`}/>}
                                                        title={<a href="https://ant.design">{item.user.name}</a>}

                                                    />
                                                    &nbsp;
                                                    {item.dimensions[0].metrics[0] !== '' &&
                                                    <div style={{
                                                        padding: 20,
                                                        background: '#fafafa',
                                                        border: '1px solid #eee'
                                                    }}>
                                                        {serializeHtml(JSON.parse(item.dimensions[0].metrics[0].notes))}
                                                    </div>}
                                                    <Divider orientation={"left"}>
                                                        Data Recorded
                                                    </Divider>
                                                    <Card>
                                                        <Statistic
                                                            title={item.dimensions[0].name}
                                                            value={item.dimensions[0].metrics[0].value}
                                                            valueStyle={{color: "#1890ff"}}
                                                            suffix={metricData.measurement_units ?? ''}
                                                        />
                                                    </Card>
                                                </List.Item>
                                            )}
                                        />
                                    </Card>
                                </Col>
                            </Row>}
                        </Skeleton>
                    </ContentWrapper>

                </PageHeader>
            </Space>
        </Wrapper>
    )
}

export default ReportMetricType