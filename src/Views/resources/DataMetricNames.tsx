/* IMPORT EXTERNAL MODULES */
import { Button, Col, Row, Space, Upload } from "antd";
import {UploadOutlined} from '@ant-design/icons'
import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import {Link} from "react-router-dom";

/* IMPORT INTERNAL MODULES */
import MetricPillarTabs from "../../Components/MetricPillarTabs";
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

const DataMetricNames = () => {
    const baseUrl = process.env.API_URL || 'http://localhost'
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

    const createCompanyUpload = useCallback((data:any) => {
        ResourceService.store({
            resourceName: 'company-uploads',
            fields: {...data}
        }).then(({ data }) => {
            console.log(data)
        })
    }, [])

    const normFile = (e: any) => {
        if (e?.file?.status === 'done') {
            let data = {
                url: e.file.response,
                name: e.file.name,
                file_type: e.file.type
            }
            createCompanyUpload(data)
        }
        return e && e.fileList;
    };

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
                        <Col lg={{ span: 10 }} sm={{ span: 24 }}>
                            <div style={{ float: 'right' }} >
                                <Upload name="file" onChange={(normFile)} action={`${baseUrl}/api/resources`} withCredentials={true} headers={headers} accept=".csv,.pdf,.doc,.docx,.jpeg,.png,.jpg,.svg">
                                    <Button icon={<UploadOutlined />}>Raw Data File Upload</Button>
                                </Upload>
                            </div>
                        </Col>
                        <Col lg={{ span: 2 }} sm={{ span: 24 }}>
                            <Button style={{ float: 'right' }}><Link to="/company-uploads">Upload History</Link></Button>
                        </Col>
                    </Row>
                    <MetricPillarTabs standards={standards} report={null} showReport={false}/>
                </ContentWrapper>
            </Space>
        </Wrapper>
    )
}

export default DataMetricNames