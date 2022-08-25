import {PageHeader, Space} from "antd";
import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import {useSearchParams} from "react-router-dom";
import MetricSubtypeTabs from "../../Components/MetricSubtypeTabs";
import ResourceService from "../../Services/ResourceService";

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

const DataMetricSubtypes = () => {

    const [standards, setStandards] = useState<any>()
    const [searchParams] = useSearchParams();

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

    useEffect(() => {
        getStandards()
    }, [getStandards])

    return (
        <Wrapper>
            <Space direction="vertical" style={{ width: '100%' }} size={"large"}>
                <PageHeader
                    ghost={false}
                    onBack={() => window.history.back()}
                    title={searchParams.get("metric_name")}
                />
                <ContentWrapper>
                    <h2>Add Data to your LITICO Database</h2>
                    <MetricSubtypeTabs standards={standards} report={null} showReport={false}/>
                </ContentWrapper>
            </Space>
        </Wrapper>
    )
}

export default DataMetricSubtypes