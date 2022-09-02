import {useParams, useSearchParams} from "react-router-dom";
import styled from "styled-components";
import {Button, Card, Col, Descriptions, Divider, List, PageHeader, Row, Skeleton, Space, Table, Tag, Upload } from "antd";
import {DownloadOutlined, UploadOutlined} from '@ant-design/icons'
import { useCallback, useEffect, useMemo, useState } from "react";
import ResourceService from "../../../Services/ResourceService";
import { CSVLink } from "react-csv";
import { flatten, map, uniq } from "lodash";
import moment from 'moment';
import Cookies from 'js-cookie';

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


const MetricSubtype = () => {
    const { reportID } = useParams()
    const [searchParams] = useSearchParams();
    let token = Cookies.get('XSRF-TOKEN')
    const headers = {
        'X-XSRF-TOKEN': token || ''
    }
    const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost' : 'https://api.litico.app';
    const colHeaders = useMemo(() => {
        return [
            'ESG Pillar',
            'Standard',
            'Metric Code',
            'Metric Subtype',
            'Measurement Units',
            'Numerator 1',
            'Numerator 2',
            'Numerator 3',
            'Numerator 4',
            'Numerator 5',
            'Numerator 6',
            'Numerator 7',
            'Numerator 8',
            'Denominator',
            'Description',
            'Narrative',
            'Measurement',
            'Date',
            'Timeframe',
            'Organization',
            'Contact',
            'Name',
            'Address',
            'City',
            'State',
            'Basin',
            'Type A',
            'Type B'
        ]
    }, [])

    const columns = [{
        title: 'Organization',
        dataIndex: 'organization',
        key: 'organization',
    },
    {
        title: 'Value',
        dataIndex: 'value',
        key: 'value',
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
    },
    {
        title: 'City',
        dataIndex: 'city',
        key: 'city',
    },
    {
        title: 'State',
        dataIndex: 'state',
        key: 'state',
    },
    {
        title: 'Type A',
        dataIndex: 'type_a',
        key: 'type_a',
    },
    {
        title: 'Type B',
        dataIndex: 'type_b',
        key: 'type_b',
    },
    {
        title: 'User',
        dataIndex: 'user_name',
        key: 'user_name',
    },
    {
        title: 'Submitted on',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (value:any) => (
            <span>
                {moment(value).format('MM/DD/YYYY h:mm')}
            </span>
        ),
    }]

    const ghgColumns = [
    {
        title: 'GHG Emissions',
        dataIndex: 'denominator',
        key: 'denominator',
        render: (value:any) => (
            <span>
                {value.toLocaleString()}
            </span>
        ),
    },
    {
        title: 'CO2 Emissions (mt CO2)',
        dataIndex: 'num_1',
        key: 'num_1',
    },
    {
        title: 'CH4 Emissions (mt CH4)',
        dataIndex: 'num_2',
        key: 'num_2',
    },
    {
        title: 'N2O Emissions (mt N2O)',
        dataIndex: 'num_3',
        key: 'num_3',
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        render: (value:any) => (
            <span>
                {moment(value).format('MM/DD/YYYY')}
            </span>
        ),
    },
    {
        title: 'User',
        dataIndex: 'user_name',
        key: 'user_name',
    },
    {
        title: 'Submitted on',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (value:any) => (
            <span>
                {moment(value).format('MM/DD/YYYY h:mm')}
            </span>
        ),
    }]

    const hoursColumns = [
    {
        title: 'Organization',
        dataIndex: 'organization',
        key: 'organization'
    },
    {
        title: 'Hours',
        dataIndex: 'num_1',
        key: 'num_1',
    },
    {
        title: 'Employee ID',
        dataIndex: 'num_2',
        key: 'num_2',
    },
    {
        title: 'Tax ID',
        dataIndex: 'num_3',
        key: 'num_3',
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        render: (value:any) => (
            <span>
                {moment(value).format('MM/DD/YYYY')}
            </span>
        ),
    },
    {
        title: 'User',
        dataIndex: 'user_name',
        key: 'user_name',
    },
    {
        title: 'Submitted on',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (value:any) => (
            <span>
                {moment(value).format('MM/DD/YYYY h:mm')}
            </span>
        ),
    }]

    const donationColumns = [
    {
        title: 'Organization',
        dataIndex: 'organization',
        key: 'organization'
    },
    {
        title: 'Amount Donated',
        dataIndex: 'denominator',
        key: 'denominator',
        render: (value:any) => (
            <span>
                {value.toLocaleString('en-US', {style: 'currency',currency: 'USD'})}
            </span>
        ),
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        render: (value:any) => (
            <span>
                {moment(value).format('MM/DD/YYYY')}
            </span>
        ),
    },
    {
        title: 'User',
        dataIndex: 'user_name',
        key: 'user_name',
    },
    {
        title: 'Submitted on',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (value:any) => (
            <span>
                {moment(value).format('MM/DD/YYYY h:mm')}
            </span>
        ),
    }]
    const genderColumns = [
    {
        title: 'Total Employees',
        dataIndex: 'value',
        key: 'value',
    },
    {
        title: 'Male',
        dataIndex: 'num_1',
        key: 'num_2',
    },
    {
        title: 'Female',
        dataIndex: 'num_2',
        key: 'num_2',
    },
    {
        title: 'Non-Binary',
        dataIndex: 'num_3',
        key: 'num_3',
    },
    {
        title: 'No Response',
        dataIndex: 'num_4',
        key: 'num_4',
    },
    {
        title: 'User',
        dataIndex: 'user_name',
        key: 'user_name',
    },
    {
        title: 'Submitted on',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (value:any) => (
            <span>
                {moment(value).format('MM/DD/YYYY h:mm')}
            </span>
        ),
    }]
    const ethnicityColumns = [
    {
        title: 'Total Employees',
        dataIndex: 'value',
        key: 'value',
    },
    {
        title: 'White/Caucasian',
        dataIndex: 'num_1',
        key: 'num_2',
    },
    {
        title: 'Black/African American',
        dataIndex: 'num_2',
        key: 'num_2',
    },
    {
        title: 'Asian/Pacific American',
        dataIndex: 'num_3',
        key: 'num_3',
    },
    {
        title: 'Latino/Hispanics',
        dataIndex: 'num_4',
        key: 'num_4',
    },
    {
        title: 'Native American',
        dataIndex: 'num_5',
        key: 'num_5',
    },
    {
        title: 'Other',
        dataIndex: 'num_6',
        key: 'num_6',
    },
    {
        title: 'User',
        dataIndex: 'user_name',
        key: 'user_name',
    },
    {
        title: 'Submitted on',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (value:any) => (
            <span>
                {moment(value).format('MM/DD/YYYY h:mm')}
            </span>
        ),
    }]
    const trirColumns = [
        {
            title: 'TRIR Employees',
            dataIndex: 'value',
            key: 'value',
        },
        {
            title: 'Number of Employee Recordable Incidents',
            dataIndex: 'num_1',
            key: 'num_2',
        },
        {
            title: 'Number of Employee Fatalities',
            dataIndex: 'num_2',
            key: 'num_2',
        },
        {
            title: 'Number of Employee Lost Time Incidents',
            dataIndex: 'num_3',
            key: 'num_3',
        },
        {
            title: 'Employee Hours Worked',
            dataIndex: 'denominator',
            key: 'denominator',
        },
        {
            title: 'User',
            dataIndex: 'user_name',
            key: 'user_name',
        },
        {
            title: 'Submitted on',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (value:any) => (
                <span>
                    {moment(value).format('MM/DD/YYYY h:mm')}
                </span>
            ),
        }]
    const [initLoading, setInitLoading] = useState(true)
    const [reportData, setReportData] = useState<any>({year: '', period: '', esg_metrics: [], report: {}})
    const [metricStandards, setMetricStandards] = useState<any>()

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

    const getColumns = () => {
        if (searchParams.get("metric_subtype") === 'GHG Emissions') return ghgColumns

        switch (searchParams.get("metric_subtype")) {
            case 'Volunteer Hours':
                return hoursColumns
            case 'Social investment':
                return donationColumns
            case 'Workforce, by Gender':
                return genderColumns
            case 'Workforce, by Ethnicity':
                return ethnicityColumns
            case 'TRIR - Employees':
                return trirColumns
            default:
                return columns
        }
    }

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
                setReportData(data);
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
                ><Divider />
                    <ContentWrapper>
                        <Skeleton active loading={initLoading}>
                            <Row>
                                <Col span={12}>
                                    <Button icon={<DownloadOutlined />}><CSVLink data={[colHeaders]}> Click to Download Form</CSVLink></Button>
                                </Col>
                                <Col span={12}>
                                    <Upload name="files" action={`${baseUrl}/api/uploads?report_id=${reportID}`} withCredentials={true} headers={headers}>
                                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                    </Upload>
                                </Col>
                            </Row>
                            {reportData && <Row>
                                <Col span={24}>
                                    <Table
                                        title={() => `${reportData?.esg_metrics[0]?.metric_name} - ${reportData?.esg_metrics[0]?.metric_subtype}`}
                                        pagination={false}
                                        columns={getColumns()} dataSource={reportData?.esg_metrics} rowKey={'id'} />
                                </Col>
                            </Row>}
                            <Row>
                                
                            </Row>
                            <Row>
                            <Col span={24}>
                                </Col>
                                <Col span={24}>
                                    <Space direction={'vertical'}>
                                        <Divider>Standards</Divider>
                                        <List
                                            grid={{gutter: 16, column: 2}}
                                            dataSource={metricStandards}
                                            renderItem={(item: any, idx) => (
                                                <List.Item>
                                                    <Card
                                                        title={item.metric_name}>
                                                        <Card.Meta title={<Tag>
                                                            {item.metric_code}
                                                        </Tag>} description={item.description}>
                                                        </Card.Meta>
                                                        <Divider/>
                                                        <Descriptions column={1} size={"small"} layout={"horizontal"}>
                                                            {item.measurement_units && <Descriptions.Item
                                                                label={"Unit Of Measure"}>
                                                                <Tag>{item.measurement_units}</Tag>
                                                            </Descriptions.Item>}
                                                            <Descriptions.Item
                                                                label={"Category"}>
                                                                <Tag>{item.category}</Tag>
                                                            </Descriptions.Item>
                                                        </Descriptions>
                                                    </Card>
                                                </List.Item>
                                            )}
                                        />
                                    </Space>
                                </Col>
                            </Row>
                        </Skeleton>
                    </ContentWrapper>

                </PageHeader>
            </Space>
        </Wrapper>
    )
}

export default MetricSubtype