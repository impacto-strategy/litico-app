import {useParams} from "react-router-dom";
import styled from "styled-components";
import {Avatar, Card, Col, Descriptions, Divider, List, PageHeader, Row, Skeleton, Space, Statistic, Tag} from "antd";
import React, {useCallback, useEffect, useState} from "react";
import ResourceService from "../../../Services/ResourceService";
import {serializeHtml} from "../../../utils";


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
    const {metricTypeID, year, quarter} = useParams()

    const [initLoading, setInitLoading] = useState(true)
    const [metricData, setMetricData] = useState<any>(null)

    const getMetric = useCallback(() => {
        ResourceService.get({
            resourceName: 'metric-types',
            resourceID: Number(metricTypeID) as number,
            params: {
                year,
                period: quarter
            }
        })
            .then(({data}) => setMetricData(data))
            .finally(() => setInitLoading(false))

    }, [metricTypeID, quarter, year])

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
                        <div style={{width: 200, background: '#fafafa', height: '20px'}}/> : metricData?.name}
                    subTitle={`ESG Report |  ${year} - ${quarter}`}
                ><Divider/>
                    <ContentWrapper>
                        <Skeleton active loading={initLoading}>
                            {metricData && <Row>
                                <Col xs={2} sm={4} md={6} lg={8} xl={10}>
                                    <Space direction={'vertical'}>
                                        {metricData.result && <Card title={"Total"} style={{marginBottom: 20}}>
                                            <Statistic
                                                value={metricData.result}
                                                valueStyle={{color: "#1890ff"}}
                                                suffix={metricData.measurement_units ?? ''}
                                            />
                                        </Card>}
                                        <p><Tag
                                            color={['High', 'Very Hight'].includes(metricData.risk) ? 'red' : 'orange'}>Risk: {metricData.risk}</Tag>
                                            <Tag>{metricData.isNumeric ? 'Quantitative' : 'Qualitative'}</Tag>
                                        </p>
                                        <p>{metricData.description}</p>

                                        {metricData.narrative && <><Divider>Narrative</Divider>
                                            <p>
                                                {metricData.narrative}
                                            </p></>}

                                        {metricData.ipieca_indicators && <><Divider>IPIECA Indicators</Divider> <List
                                            grid={{gutter: 16, column: 2}}
                                            dataSource={metricData.ipieca_indicators}
                                            renderItem={(item: any) => (
                                                <List.Item>
                                                    <Card
                                                        title={item.name}>
                                                        <Card.Meta title={<Tag>
                                                            {item.indicator}
                                                        </Tag>} description={item.module}>
                                                        </Card.Meta>
                                                    </Card>
                                                </List.Item>
                                            )}
                                        /></>}

                                        {metricData.sasb_standards && <><Divider>SASB Standards</Divider> <List
                                            grid={{gutter: 16, column: 2}}
                                            dataSource={metricData.sasb_standards}
                                            renderItem={(item: any) => (
                                                <List.Item>
                                                    <Card
                                                        title={item.topic}>
                                                        <Card.Meta title={<Tag>
                                                            {item.code}
                                                        </Tag>} description={item.accounting_metric}>
                                                        </Card.Meta>
                                                        <Divider/>
                                                        <Descriptions column={1} size={"small"} layout={"horizontal"}>
                                                            {item.unit_of_measure && <Descriptions.Item
                                                                label={"Unit OF Measure"}>
                                                                <Tag>{item.unit_of_measure}</Tag>
                                                            </Descriptions.Item>}
                                                            <Descriptions.Item
                                                                label={"Category"}>
                                                                <Tag>{item.category}</Tag>
                                                            </Descriptions.Item>
                                                        </Descriptions>
                                                    </Card>
                                                </List.Item>
                                            )}
                                        /></>}
                                    </Space>
                                </Col>

                                <Col xs={2} sm={4} md={6} lg={8} xl={10} offset={4}>
                                    <Card title={"Activity"} type={"inner"}>
                                        <List
                                            itemLayout="horizontal"
                                            dataSource={metricData.sessions}
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