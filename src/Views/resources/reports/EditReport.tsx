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
  margin-bottom: 32px;
`

const EditReport = () => {

    const {id} = useParams()

    const [report, setReport] = useState<any>({esg_metrics: [], year: ''})

    const modReport = useMemo(() => {
        return sortBy(map(groupBy(report.esg_metrics, 'category'), (metric_types, cat) => ({
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
    }, [report])

    const getReport = useCallback(() => {
        ResourceService.get({
            resourceName: 'reports',
            resourceID: Number(id) as number
        })
            .then(({ data }) => setReport(data[0]))

    }, [id])

    useEffect(() => {
        getReport()
    }, [getReport])

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
                        {modReport.map(({category, metric_types}, idx) => (
                            <Tabs.TabPane tab={category} key={idx}>
                                <Row gutter={40}>
                                    {metric_types.map((item: any) => (
                                        <Col span={8} key={item.id} style={{ marginBottom: 32 }}>
                                            <Card
                                                title={item.metric_name}
                                                type='inner'
                                                extra={<Link
                                                    to={`/reports/${report.id}/metrics/${item.id}`}>View</Link>}
                                                    actions={[
                                                        <div>{item.metric_code.split(';').length} Entr{item.metric_code.split(';').length === 1 ? 'y' : 'ies'}</div>,
                                                        <div>0 Pending Approval</div>,
                                                    ]}
                                            >
                                                <Space direction={'vertical'}>
                                                    <p>{item.metric_subtype}</p>
                                                    <p>{item.description} {item.organization}</p>
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