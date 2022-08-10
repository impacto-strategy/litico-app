import {Card, Col, PageHeader, Row, Space, Tabs, Tag} from "antd";
import {Link, useParams} from "react-router-dom";
import styled from "styled-components";
import {useCallback, useEffect, useMemo, useState} from "react";
import ResourceService from "../../../Services/ResourceService";
import {flatten, groupBy, map, uniq, sortBy, filter} from "lodash";

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

const MetricNames = () => {

    const {id} = useParams()

    const [report, setReport] = useState<any>({ esg_metrics: [], year: '' })
    const [standards, setStandards] = useState<any>()

    const groupByCat = (subMetrics:any) => {
        return sortBy(map(groupBy(subMetrics, 'esg_pillar'), (metric_names, esg_pillar) => ({
            esg_pillar: esg_pillar,
            metric_names: map(groupBy(metric_names, 'metric_name'), (items,name) => ({items, name}))
        })), (item) => {
            const order: any = {
                'Environment': 0,
                "Social": 1,
                "Governance": 2
            }
            return order[item.esg_pillar]
        })
    }

    const codesByStandard = (items: any) => {
        return map(groupBy(items, 'reporting_standard'), (data, name) => ({
            data,
            name
        }))
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

    const getReportEntries = (standards: any) => {
        let codes = map(standards.items, 'metric_code')
        let metrics = filter(report.esg_metrics, function (metric: any) {
            let metricCodes = metric.metric_code.split(';').map((c:string) => c.trim())
            return metricCodes.some((c:any) => codes.indexOf(c) >= 0)
        });
        let text = `${metrics.length} Entr${metrics?.length === 1 ? 'y' : 'ies'}`
        return text
    }

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
                    <h2>Choose an ESG Pillar & Metric Category</h2>
                    <Tabs defaultActiveKey={"0"}>
                        {modStandards.map(({ esg_pillar, metric_names }, idx) => (
                            <Tabs.TabPane tab={esg_pillar} key={idx}>
                                <Row gutter={40}>
                                    {metric_names.map((item: any) => (
                                        <Col span={8} key={item.name} style={{ marginBottom: 32 }}>
                                            <Card
                                                title={item.name}
                                                type='inner'
                                                extra={<Link
                                                    to={`/reports/${report.id}/metric-subtypes?metric_name=${item.name}`}>View</Link>}
                                                    actions={[
                                                        <div>{getReportEntries(item)}</div>,
                                                        <div>0 Pending Approval</div>,
                                                    ]}
                                            >
                                                <Space direction={'vertical'}>
                                                    <p>{item.metric_subtype}</p>
                                                    {codesByStandard(map(item.items)).map((standard: any, idx) => (
                                                        <div key={idx} >
                                                            <Space key={standard.id} style={{paddingRight: '20px'}}>{standard.name}</Space>
                                                            {map(uniq(flatten(map(standard.data, s =>(s.metric_code)))), (met: any) => (
                                                            <Tag key={met}>{met}</Tag>
                                                            ))}

                                                        </div>
                                                        )
                                                    )}
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

export default MetricNames