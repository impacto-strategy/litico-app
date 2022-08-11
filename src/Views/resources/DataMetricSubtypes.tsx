import {Space} from "antd";
import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
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

    const getStandards = useCallback(() => {
        ResourceService.index({
            resourceName: 'standards'
        }).then(({ data }) => {
            setStandards(data)
        })
    }, [])

    useEffect(() => {
        getStandards()
    }, [getStandards])

    return (
        <Wrapper>
            <Space direction="vertical" style={{ width: '100%' }} size={"large"}>
                <ContentWrapper>
                    <h2>Add Data to your LITICO Database</h2>
                    <MetricSubtypeTabs standards={standards} report={null} showReport={false}/>
                </ContentWrapper>
            </Space>
        </Wrapper>
    )
}

export default DataMetricSubtypes