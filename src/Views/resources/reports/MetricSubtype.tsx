import {Link, useParams, useSearchParams} from "react-router-dom";
import styled from "styled-components";
import {Button, Card, Col, Descriptions, Divider, List, Modal, PageHeader, Row, Skeleton, Space, Table, Tag, Upload } from "antd";
import {DownOutlined, DownloadOutlined, UpOutlined, UploadOutlined} from '@ant-design/icons'
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
    const [metricDescription, setMetricDescription] = useState("");
    const [showDescription, setShowDescription] = useState<any>([]);

    const displayDescription = (idx: any) => {
        let arr = [...showDescription]
        arr.push(idx)
        setShowDescription(arr)
    }

    const hideDescription = (idx: any) => {
        let arr = [...showDescription]
        setShowDescription(arr.filter(x => x !== idx))
    }

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = (description:string) => {
        setMetricDescription(description)
        setIsModalOpen(true);
    }

    const handleOk = () => {
        setIsModalOpen(false);
    }

    const handleCancel = () => {
        setIsModalOpen(false);
    }

    const colHeaders = useMemo(() => {
        return [
            'ESG Pillar',
            'Standard',
            'Metric Name',
            'Metric Subtype',
            'Metric Code',
            'Risk',
            'Value',
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
            'Date',
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

    const columns = [
    {
        title: searchParams.get("metric_subtype") || '',
        dataIndex: 'value',
        key: 'value'
    },
    {
        title: 'Timeframe',
        dataIndex: '',
        key: '',
        render: (value: any) => (
            <span>{reportData?.period === 'YR' ? 'EOY' : reportData?.period}</span>
        )
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
    },
    {
        title: 'Resources',
        dataIndex: 'resources',
        key: 'resources',
        render: (value: any) => (
            <>
            {value?.map((link:string, idx:number) => {
              return (
                  <a key={link} href={link}>Resource {idx +1} </a>
              );
            })}
          </>
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

    const discussionColumns = [
    {
        title: searchParams.get("metric_subtype") || '',
        dataIndex: 'value',
        key: 'value',
        render: (value:any) => (
            <span>
                {value > 0 ? 'Policy in place' : 'No policy'}
            </span>
        ),
    },
    {
        title: 'Timeframe',
        dataIndex: '',
        key: '',
        render: (value: any) => (
            <span>{reportData?.period === 'YR' ? 'EOY' : reportData?.period}</span>
        )
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
    },
    {
        title: 'Resources',
        dataIndex: 'resources',
        key: 'resources',
        render: (value: any) => (
            <>
            {value?.map((link:string, idx:number) => {
              return (
                  <a key={link} href={link}>Resource {idx +1} </a>
              );
            })}
          </>
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

    const ghgColumns = [
    {
        title: 'GHG Emissions',
        dataIndex: 'value',
        key: 'value',
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
        title: 'Timeframe',
        dataIndex: '',
        key: '',
        render: (value: any) => (
            <span>{reportData?.period === 'YR' ? 'EOY' : reportData?.period}</span>
        )
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
        title: 'Resources',
        dataIndex: 'resources',
        key: 'resources',
        render: (value: any) => (
            <>
            {value?.map((link:string, idx:number) => {
              return (
                  <a key={link} href={link}>Resource {idx +1} </a>
              );
            })}
          </>
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
        title: 'Timeframe',
        dataIndex: '',
        key: '',
        render: (value: any) => (
            <span>{reportData?.period === 'YR' ? 'EOY' : reportData?.period}</span>
        )
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
        title: 'Resources',
        dataIndex: 'resources',
        key: 'resources',
        render: (value: any) => (
            <>
            {value?.map((link:string, idx:number) => {
              return (
                  <a key={link} href={link}>Resource {idx +1} </a>
              );
            })}
          </>
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
        title: 'Timeframe',
        dataIndex: '',
        key: '',
        render: (value: any) => (
            <span>{reportData?.period === 'YR' ? 'EOY' : reportData?.period}</span>
        )
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
        title: 'Resources',
        dataIndex: 'resources',
        key: 'resources',
        render: (value: any) => (
            <>
            {value?.map((link:string, idx:number) => {
              return (
                  <a key={link} href={link}>Resource {idx +1} </a>
              );
            })}
          </>
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
        title: 'Timeframe',
        dataIndex: '',
        key: '',
        render: (value: any) => (
            <span>{reportData?.period === 'YR' ? 'EOY' : reportData?.period}</span>
        )
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
        title: 'Resources',
        dataIndex: 'resources',
        key: 'resources',
        render: (value: any) => (
            <>
            {value?.map((link:string, idx:number) => {
              return (
                  <a key={link} href={link}>Resource {idx +1} </a>
              );
            })}
          </>
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
        title: 'Timeframe',
        dataIndex: '',
        key: '',
        render: (value: any) => (
            <span>{reportData?.period === 'YR' ? 'EOY' : reportData?.period}</span>
        )
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
        title: 'Resources',
        dataIndex: 'resources',
        key: 'resources',
        render: (value: any) => (
            <>
            {value?.map((link:string, idx:number) => {
              return (
                  <a key={link} href={link}>Resource {idx +1} </a>
              );
            })}
          </>
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
            title: 'Timeframe',
            dataIndex: '',
            key: '',
            render: (value: any) => (
                <span>{reportData?.period === 'YR' ? 'EOY' : reportData?.period}</span>
            )
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
            title: 'Resources',
            dataIndex: 'resources',
            key: 'resources',
            render: (value: any) => (
                <>
                {value?.map((link:string, idx:number) => {
                  return (
                      <a key={link} href={link}>Resource {idx +1} </a>
                  );
                })}
              </>
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
        if (searchParams.get("metric_subtype")?.includes('Discussion')) return discussionColumns

        switch (searchParams.get("metric_subtype")) {
            case 'Volunteering - Community':
                return hoursColumns
            case 'Social Investment':
                return donationColumns
            case 'Workforce Demographics - Gender':
                return genderColumns
            case 'Workforce Demographics - Ethnicity':
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

    const getMetrics = (e: any) => {
        if (e?.file?.status === 'done') {
            getMetric()
        }
    }

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
                        </Link>,
                    ]}
                ><Divider />
                    <ContentWrapper>
                        <Skeleton active loading={initLoading}>
                            <Row>
                                <Col span={12}>
                                    <Button icon={<DownloadOutlined />}><CSVLink data={[colHeaders]}> Download Blank Form</CSVLink></Button>
                                </Col>
                                <Col span={12}>
                                    <Upload name="files" onChange={getMetrics} action={`${baseUrl}/api/uploads?report_id=${reportID}`} withCredentials={true} headers={headers}>
                                        <Button icon={<UploadOutlined />}>Upload Completed Form</Button>
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
                                                        </Tag>}>
                                                        </Card.Meta>
                                                        {(item.description && !showDescription.includes(idx)) &&
                                                            <DownOutlined style={{
                                                            float: 'right'
                                                            }} onClick={(() => displayDescription(idx))} />
                                                        }
                                                        {(item.description && showDescription.includes(idx)) &&
                                                            <UpOutlined style={{
                                                            float: 'right'
                                                            }} onClick={(() => hideDescription(idx))} />
                                                        }
                                                        {showDescription.includes(idx) &&
                                                            <Row style={{ paddingTop: '20px' }}>
                                                            {(item?.description && item.description.length > 500) ?
                                                                <div>
                                                                <p>{`${item.description.substring(0, 500)}...`}</p>
                                                                <p><Button type="link" onClick={() => showModal(item.description)}>Read more</Button></p>
                                                                </div>
                                                                :
                                                                <p>{item.description}</p>
                                                            }
                                                            </Row>
                                                        }
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
            <Modal title="Metric Description" visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>{metricDescription}</p>
            </Modal>
        </Wrapper>
    )
}

export default MetricSubtype