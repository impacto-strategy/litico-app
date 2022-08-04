import {Card, Col, PageHeader, Row, Space, Tabs, Tag} from "antd";
import {Link, useParams, useSearchParams} from "react-router-dom";
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

const MetricSubtypes = () => {

    const {id} = useParams()
    const [searchParams] = useSearchParams();
    const [report, setReport] = useState<any>({ esg_metrics: [], year: '' })
    const [standards, setStandards] = useState<any>()

    const groupByCat = (subMetrics:any) => {
        return sortBy(map(groupBy(subMetrics, 'category'), (metric_names, category) => ({
            category: category,
            metric_names: map(groupBy(metric_names, 'metric_name'), (items,name) => ({items, name}))
        })), (item) => {
            const order: any = {
                'Environment': 0,
                "Social": 1,
                "Governance": 2
            }
            return order[item.category]
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
          resourceName: 'standards',
          params: {
            metric_name: searchParams.get("metric_name")
          }
        }).then(({ data }) => {
            setStandards(data)
        })
    }, [searchParams])

    const getReportEntries = (metricSubtype:string) => {
        let metrics = filter(report.esg_metrics, {'metric_subtype': metricSubtype});
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
                    <h2>Choose a Metric Subtype to View</h2>
                    <Row gutter={40}>
                        {standards?.map((item: any, idx:string) => (
                            <Col span={8} key={idx} style={{ marginBottom: 32 }}>
                                <Card
                                    title={item.metric_subtype}
                                    key={idx} 
                                    type='inner'
                                    extra={<Link
                                        to={`/reports/${report.id}/metric-subtype?metric_name=${item.metric_name}&metric_subtype=${item.metric_subtype}`}>View</Link>}
                                        actions={[
                                            <div>{getReportEntries(item.metric_subtype)}</div>,
                                            <div>0 Pending Approval</div>,
                                        ]}
                                >
                                    <Space direction={'vertical'}>
                                        {item.metric_code.split(',').map((code: any, idx:string) => (
                                            <Tag key={idx}>{code}</Tag>
                                          )
                                        )}
                                    </Space>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </ContentWrapper>
            </Space>
        </Wrapper>
    )
}

export default MetricSubtypes