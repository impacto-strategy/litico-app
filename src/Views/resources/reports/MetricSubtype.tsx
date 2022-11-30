/* IMPORT EXTERNAL MODULES */
import {Link, useParams, useSearchParams} from "react-router-dom";
import styled from "styled-components";
import {
    Button, 
    Card, 
    Col,
    Descriptions, 
    Divider, 
    List,
    message,
    Modal, 
    PageHeader,
    Popconfirm,
    Popover,
    Row, 
    Skeleton, 
    Space, 
    Table, 
    Tag 
} from "antd";
import { DeleteOutlined, DownOutlined, UpOutlined } from '@ant-design/icons'
import { useCallback, useEffect, useState } from "react";
import { flatten, map, sortBy, uniq } from "lodash";
import moment from 'moment';

/* IMPORT INTERNAL MODULES */
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

const MetricSubtype = () => {
    const { reportID } = useParams()
    const [searchParams] = useSearchParams();
    /* REACT STATE */
    const [initLoading, setInitLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [metricDescription, setMetricDescription] = useState("")
    const [metricStandards, setMetricStandards] = useState<any>()
    const [reportData, setReportData] = useState<any>({year: '', period: '', esg_metrics: [], report: {}})
    const [showDescription, setShowDescription] = useState<any>([])

    const displayDescription = (idx: any) => {
        let arr = [...showDescription]
        arr.push(idx)
        setShowDescription(arr)
    }

    const hideDescription = (idx: any) => {
        let arr = [...showDescription]
        setShowDescription(arr.filter(x => x !== idx))
    }

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

    const columns = [{
        title: searchParams.get("metric_subtype") || '',
        dataIndex: 'value',
        key: 'value'
    },
    {
        title: 'Timeframe',
        dataIndex: '',
        key: '',
        render: (value: any) => (
            <span>{reportData?.period === 'YR' ? 'Annual' : reportData?.period}</span>
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
            <span>{reportData?.period === 'YR' ? 'Annual' : reportData?.period}</span>
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
            <span>{reportData?.period === 'YR' ? 'Annual' : reportData?.period}</span>
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
        dataIndex: 'employee_id',
        key: 'employee_id',
    },
    {
        title: 'Tax ID',
        dataIndex: 'tax_id',
        key: 'tax_id',
    },
    {
        title: 'Timeframe',
        dataIndex: '',
        key: '',
        render: (value: any) => (
            <span>{reportData?.period === 'YR' ? 'Annual' : reportData?.period}</span>
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
            <span>{reportData?.period === 'YR' ? 'Annual' : reportData?.period}</span>
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
            <span>{reportData?.period === 'YR' ? 'Annual' : reportData?.period}</span>
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
            <span>{reportData?.period === 'YR' ? 'Annual' : reportData?.period}</span>
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
                <span>{reportData?.period === 'YR' ? 'Annual' : reportData?.period}</span>
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

    const productionsColumns = [
        {
            title: 'Oil Production',
            dataIndex: 'num_1',
            key: 'num_1'
        },
        {
            title: 'Gas Production',
            dataIndex: 'num_2',
            key: 'num_2'
        },
        {
            title: 'Produced Water Production',
            dataIndex: 'num_3',
            key: 'num_3'
        },
        {
            title: 'Synthetic Oil Production',
            dataIndex: 'num_4',
            key: 'num_4'
        },
        {
            title: 'Synthetic Gas Production',
            dataIndex: 'num_5',
            key: 'num_5'
        },
        {
            title: 'Timeframe',
            dataIndex: '',
            key: '',
            render: (value: any) => (
                <span>{reportData?.period === 'YR' ? 'Annual' : reportData?.period}</span>
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
     * Determines which columns to generate based on metric-subtype.
     * 
     * @returns Array of Objects
     */
    const getColumns = () => {
        // Placing this column allows me to place it on every table.
        const actionsColumn = [{
            title: 'Actions',
            // Gives access to ID for deleting the value.
            dataIndex: 'id',
            key: 'id',
            render: (value: any) => (
                <Popconfirm
                    title="Delete This Row?"
                    okText="Delete"
                    onConfirm={(e: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => {
                        handleDelete(e, value)
                    }}
                >
                    <Popover content="Delete Datapoint">
                        <DeleteOutlined 
                            style={{color: 'red'}}
                        />
                    </Popover>
                </Popconfirm>
            )
        }]

        if (searchParams.get("metric_subtype") === 'GHG Emissions') return ghgColumns.concat(actionsColumn)
        if (searchParams.get("metric_subtype")?.includes('Discussion')) return discussionColumns.concat(actionsColumn)

        switch (searchParams.get("metric_subtype")) {
            case 'Volunteering - Community':
                return hoursColumns.concat(actionsColumn)
            case 'Social Investment':
                return donationColumns.concat(actionsColumn)
            case 'Workforce Demographics - Gender':
                return genderColumns.concat(actionsColumn)
            case 'Workforce Demographics - Ethnicity':
                return ethnicityColumns.concat(actionsColumn)
            case 'TRIR - Employees':
                return trirColumns.concat(actionsColumn)
            case 'Production - Oil, Gas, Produced Water, Synthetic Oil, Synthetic Gas':
                return productionsColumns.concat(actionsColumn)
            default:
                return columns.concat(actionsColumn)
        }
    }

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

    /**
     * Removes selected row of data from database.
     * 
     * @params e - Event Object.
     * @params id - data's id number in the database.
     */
    const handleDelete = useCallback( async (e: React.MouseEvent<HTMLElement, MouseEvent> | undefined, id: number) => {
        if (e) {
            e.preventDefault()
        }

        const payload = {
            resourceID: id,
            resourceName: 'esg-metrics'
        }
        try {
            ResourceService.delete(payload)
            message.success("Successfully Deleted")
            getMetric()
        } catch (err) {
            console.log(err)
            message.error("Unable to delete")
        }
    }, [getMetric])


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

                            {reportData && <Row>
                                <Col span={24}>
                                    <Table
                                        title={() => `${searchParams.get("metric_name")} - ${searchParams.get("metric_subtype")}`}
                                        pagination={false}
                                        columns={getColumns()} 
                                        dataSource={sortBy(reportData?.esg_metrics, [function(o) { return o.date; }])} 
                                        rowKey={'id'} 
                                    />
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
            <Modal title="Metric Description" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>{metricDescription}</p>
            </Modal>
        </Wrapper>
    )
}

export default MetricSubtype
