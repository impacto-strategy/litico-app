import {PageHeader, Space} from "antd";
import {useParams} from "react-router-dom";
import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import MetricPillarTabs from "../../../Components/MetricPillarTabs";
import ResourceService from "../../../Services/ResourceService";

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
                    <h2>Choose an ESG Pillar & Metric Category</h2>
                    <MetricPillarTabs standards={standards} report={report} showReport={true}/>
                </ContentWrapper>
            </Space>
        </Wrapper>
    )
}

export default MetricNames