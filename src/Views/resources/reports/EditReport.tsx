import {Card, Col, PageHeader, Row, Space, Tabs, Tag} from "antd";
import {Link, useParams} from "react-router-dom";
import styled from "styled-components";
import {useCallback, useEffect, useMemo, useState} from "react";
import ResourceService from "../../../Services/ResourceService";
import {flatten, groupBy, map, uniq, sortBy} from "lodash";

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

const EditReport = () => {

    const {id} = useParams()

    const [report, setReport] = useState<any>({ esg_metrics: [], year: '' })
    const [standards, setStandards] = useState<any>()

    const groupByCat = (subMetrics:any) => {
        return sortBy(map(groupBy(subMetrics, 'category'), (subtype_metrics, category) => ({
            category: category,
            subtype_metrics
        })), (item) => {
            const order: any = {
                'Environmental': 0,
                "Social": 1,
                "Governance": 2
            }
            return order[item.category]
        })
    }

    // const modReport = useMemo(() => {
    //     let subMetrics = map(groupBy(report.esg_metrics, 'metric_subtype'), (metrics, key) => ({
    //         category: metrics[0].category,
    //         metric_name: metrics[0].metric_name,
    //         metric_subtype: key,
    //         metric_codes: metrics.map((m) => m.metric_code.split(';')),
    //         metrics
    //     }))
    //     return groupByCat(subMetrics)
    // }, [report])

    const modStandards = useMemo(() => {
        return groupByCat(standards)
    }, [standards])

    const getReport = useCallback(() => {
        ResourceService.get({
            resourceName: 'reports',
            resourceID: Number(id) as number
        })
            .then(({ data }) => setReport(data[0]))

    }, [id])

    const getStandards = useCallback(() => {
        ResourceService.index({
            resourceName: 'standards'
        }).then(({ data }) => {
            setStandards(data)
        })
    }, [])

    useEffect(() => {
        getReport()
        getStandards()
    }, [getReport, getStandards])

    return (
        <Wrapper>
            <Space direction="vertical" style={{ width: '100%' }} size={"large"}>

                <PageHeader
                    ghost={false}
                    onBack={() => window.history.back()}
                    title={`Edit Report | ${report.year}`}
                >
                </PageHeader>
                <ContentWrapper>
                    <Tabs defaultActiveKey={"0"}>
                        {modStandards.map(({ category , subtype_metrics }, idx) => (
                            <Tabs.TabPane tab={category} key={idx}>
                                <Row gutter={40}>
                                    {subtype_metrics.map((item: any) => (
                                        <Col span={8} key={item.id} style={{ marginBottom: 32 }}>
                                            <Card
                                                title={item.metric_name}
                                                type='inner'
                                                extra={<Link
                                                    to={`/reports/${report.id}/metrics?metric_name=${item.metric_name}&metric_subtype=${item.metric_subtype}`}>View</Link>}
                                                    actions={[
                                                        <div>{item.metrics?.length} Entr{item.metrics?.length === 1 ? 'y' : 'ies'}</div>,
                                                        <div>0 Pending Approval</div>,
                                                    ]}
                                            >
                                                <Space direction={'vertical'}>
                                                    <p>{item.metric_subtype}</p>
                                                    <p><Tag
                                                        color={['High', 'Very High'].includes(item.risk) ? 'red' : 'orange'}>Risk: {item.risk}</Tag>
                                                        {map(uniq(flatten(map(item.metric_codes))), (met: any) => (
                                                            <Tag>{met}</Tag>
                                                        ))}
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