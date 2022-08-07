import {Card, Col, PageHeader, Row, Space, Tag, Input} from "antd";
import {Link, useParams, useSearchParams} from "react-router-dom";
import styled from "styled-components";
import {useCallback, useEffect, useMemo, useState} from "react";
import ResourceService from "../../../Services/ResourceService";
import {filter} from "lodash";

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
    const [search, setSearch] = useState("");

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

    const modStandards = useMemo(() => {
        if (search === '') return standards;
        return filter(standards, (standard) => { return standard.metric_subtype.toLowerCase().indexOf(search) !== -1; })
    }, [standards, search])

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
                        <Col span={8} style={{ marginBottom: 32 }}>
                            <h3>Metric Search:</h3>
                            <Input placeholder="Search for metric subytype" allowClear={true} onChange={(e) => setSearch(e.target.value.toLowerCase())} />
                        </Col>
                    </Row>
                    <Row gutter={40}>
                        {(modStandards && modStandards?.length < 1) &&
                            <p>No results</p>
                        }
                        {modStandards?.map((item: any, idx:string) => (
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