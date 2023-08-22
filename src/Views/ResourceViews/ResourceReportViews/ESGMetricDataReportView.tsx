import {
    Link, 
    useParams, 
    useSearchParams
} from "react-router-dom";
import styled from "styled-components";
import {
    Button, 
    Col,
    Divider,
    Modal, 
    PageHeader,
    Row, 
    Skeleton, 
    Space
} from "antd";
import { 
    useCallback, 
    useEffect, 
    useState 
} from "react";
import {
    flatten,
    map,
    uniq
} from "lodash";

import ESGMetricReportTable from "./components/ESGMetricReportTable";
import ReportStandardsCards from "./components/ReportStandardsCards";
import ResourceService from "../../../Services/ResourceService";

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

/**
 * A container component that shows the report for a specific selected metric subtype.
 */
const ESGMetricDataReportView = () => {
    const { reportID } = useParams()
    const [searchParams] = useSearchParams();
    const [initLoading, setInitLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [metricDescription, setMetricDescription] = useState("")
    const [metricStandards, setMetricStandards] = useState<any>()
    const [reportData, setReportData] = useState<any>({year: '', period: '', esg_metrics: [], report: {}})

    const handleOk = () => {
        setIsModalOpen(false);
    }

    const handleCancel = () => {
        setIsModalOpen(false);
    }

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

    /**
     * Gets esg metric data based on metric-subtype.
     * 
     * @returns Object - includes property with array of objects representing
     * esg metric data.
     */
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
                setReportData(data)
                let codes = map(data.esg_metrics, 'metric_code').map((m) => m.split(';'))
                getStandards(uniq(flatten(codes)).filter(c => c !== 'n/a'))
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
                    title={`Edit Report | ${reportData?.year}`}
                    extra={[
                        <Link key="1" to={`/metric-subtype?metric_name=${searchParams.get("metric_name")}&metric_subtype=${searchParams.get("metric_subtype")}`}>
                            <Button type="primary">
                                Add Data
                            </Button>
                        </Link>
                    ]}
                ><Divider />
                    <ContentWrapper>
                        <Skeleton active loading={initLoading}>
                            <ESGMetricReportTable 
                                getMetric={getMetric}
                                reportData={reportData}
                                searchParams={searchParams}
                            />

                            <Row> 
                            </Row>
                            <Row>
                                <Col span={24}>
                                </Col>
                                <Col span={24}>
                                    <ReportStandardsCards 
                                        getMetric={getMetric}
                                        metricStandards={metricStandards}
                                        setMetricDescription={setMetricDescription}
                                        setIsModalOpen={setIsModalOpen}
                                    />
                                </Col>
                            </Row>
                        </Skeleton>
                    </ContentWrapper>

                </PageHeader>
            </Space>
            <Modal 
                title="Metric Description"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <p>{metricDescription}</p>
            </Modal>
        </Wrapper>
    )
}

export default ESGMetricDataReportView;