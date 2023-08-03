import {PageHeader, Space} from "antd";
import {useParams, useSearchParams} from "react-router-dom";
import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import MetricSubtypeTabs from "../../../Components/MetricSubtypeTabs";
import ResourceService from "../../../Services/ResourceService";
import { groupBy } from "lodash";

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
              metric_name: searchParams.get("metric_name"),
              esg_pillar: searchParams.get("esg_pillar"),
          }
        }).then(({ data }) => {
            let groupedData = groupBy(data, 'metric_subtype')
            let sorted: any[] = []
            Object.keys(groupedData).sort().reduce(
                (obj: any, key) => {
                    sorted.push(groupedData[key])
                    return groupedData
                },
                {}
            );
            setStandards(sorted)
        })
    }, [searchParams])

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
                    <MetricSubtypeTabs standards={standards} report={report} showReport={true} />
                </ContentWrapper>
            </Space>
        </Wrapper>
    )
}

export default MetricSubtypes