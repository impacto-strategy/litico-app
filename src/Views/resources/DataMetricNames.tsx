import { Button, Col, Row, Space, Upload } from "antd";
import {UploadOutlined} from '@ant-design/icons'
import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import MetricPillarTabs from "../../Components/MetricPillarTabs";
import ResourceService from "../../Services/ResourceService";
import Cookies from 'js-cookie';

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

const DataMetricNames = () => {
    const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost' : 'https://api.litico.app'
    const [standards, setStandards] = useState<any>()
    let token = Cookies.get('XSRF-TOKEN')
    const headers = {
        'X-XSRF-TOKEN': token || ''
    }

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
                    <Row>
                        <Col lg={{span: 12}} sm={{span: 24}}>
                            <h2>Add Data to your LITICO Database</h2>
                        </Col>
                        <Col lg={{span: 12}} sm={{span: 24}}>
                            <Upload name="file" action={`${baseUrl}/api/resources`} withCredentials={true} headers={headers} accept=".csv,.pdf,.doc,.docx,.jpeg,.png,.jpg,.svg">
                                <Button icon={<UploadOutlined />}>Upload Documents</Button>
                            </Upload>
                        </Col>
                    </Row>
                    <MetricPillarTabs standards={standards} report={null} showReport={false}/>
                </ContentWrapper>
            </Space>
        </Wrapper>
    )
}

export default DataMetricNames