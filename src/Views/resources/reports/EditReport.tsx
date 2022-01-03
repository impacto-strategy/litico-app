import {Card, Col, PageHeader, Row, Space, Tabs, Tag} from "antd";
import {Link, useParams} from "react-router-dom";
import styled from "styled-components";
import {useCallback, useEffect, useMemo, useState} from "react";
import ResourceService from "../../../Services/ResourceService";
import {groupBy, map, sortBy} from "lodash";

const Wrapper = styled.section`
  margin: auto;
  max-width: none;
  padding-top: 20px;
  padding-bottom: 40px;

`

const ContentWrapper = styled.div`
  background: #fff;
  padding: 60px 30px;
`
const EditReport = () => {

    const {year, quarter} = useParams()

    const [initLoading, setInitLoading] = useState(true)
    const [metricTypes, setMetricTypes] = useState([])


    const modMetricTypes = useMemo(() => {
        return sortBy(map(groupBy(metricTypes, 'report_category.name'), (metric_types, cat) => ({
            category: cat,
            metric_types
        })), (item) => {
            const order: any = {
                'Environmental': 0,
                "Social": 1,
                "Governance": 2
            }
            return order[item.category]
        })
    }, [metricTypes])


    const getMetrics = useCallback(() => {
        ResourceService.index({
            resourceName: 'metric-types',
            params: {year, withSessionCount: true}
        })
            .then(({data}) => setMetricTypes(data.metric_types))
            .finally(() => setInitLoading(false))
    }, [setMetricTypes])


    useEffect(() => {
        getMetrics()
    }, [])

    return (
        <Wrapper>
            <Space direction="vertical" style={{width: '100%'}} size={"large"}>

                <PageHeader
                    ghost={false}
                    onBack={() => window.history.back()}
                    title={`Edit Report | ${year} - ${quarter}`}
                >
                </PageHeader>
                <ContentWrapper>
                    <Tabs defaultActiveKey={"0"} style={{marginBottom: 32}}>
                        {modMetricTypes.map(({category, metric_types}, idx) => (
                            <Tabs.TabPane tab={category} key={idx.toString()}>
                                <Row gutter={40}>

                                    {metric_types.map((item: any) => (
                                        <Col span={8} key={item.id}>
                                            <Card title={item.name}
                                                  type={item.sessions.length > 0 ? 'inner' : undefined}
                                                  extra={<Link
                                                      to={`/reports/${year}/${quarter}/${item.id}`}>View</Link>}
                                                  style={{width: '100%', opacity: item.sessions.length > 0 ? 1 : 0.8}}
                                                  actions={[
                                                      <div>{item.sessions.length} Entr{item.sessions.length === 1 ? 'y' : 'ies'}</div>,
                                                      <div>0 Pending Approval</div>,
                                                  ]}
                                            >

                                                <Space direction={'vertical'}>

                                                    <p>{item.description}</p>
                                                    <p><Tag
                                                        color={['High', 'Very Hight'].includes(item.risk) ? 'red' : 'orange'}>Risk: {item.risk}</Tag>
                                                        <Tag>{item.isNumeric ? 'Quantitative' : 'Qualitative'}</Tag>
                                                    </p>
                                                </Space>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>

                            </Tabs.TabPane>
                        ))}

                    </Tabs>
                </ContentWrapper>
            </Space>

        </Wrapper>
    )
}

export default EditReport