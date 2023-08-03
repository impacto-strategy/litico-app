import {FC, useCallback, useEffect, useMemo, useState} from "react";
import {
    Button,
    Col,
    Collapse,
    Divider,
    Drawer,
    Form,
    Input,
    InputNumber,
    List,
    Modal,
    notification,
    PageHeader,
    Row,
    Select,
    Space,
    Switch,
    Tabs,
    Tag,
    Typography,
    Upload,
} from "antd";
import {DeleteOutlined, ExclamationCircleOutlined, UploadOutlined} from '@ant-design/icons'
import styled from "styled-components";
import ResourceService from "../../../../Services/ResourceService";
import ReportCategorySelector from "../../../../Components/ReportCategorySelector";
import {groupBy, map} from "lodash";
import {Link} from "react-router-dom";
import IpiecaIndicatorSelector from "../../../../Components/IpiecaIndicatorSelector";
import SasbIndicatorSelector from "../../../../Components/SasbIndicatorSelector";
import GoalViewer from "./GoalViewer";
import Cookies from 'js-cookie';

const {Panel} = Collapse;
const baseUrl = process.env.API_URL || 'http://localhost'
const {Title} = Typography

type TReportYearViewer = {
    report: any | {
        year: number
        reports: any[]
    }
}
const FormWrapper = styled.div`

  margin-top: 20px;

`

const ReportCard = styled.div<{ notStarted?: boolean }>`
  border: 1px solid #dadce0;
  border-radius: 8px;
  width: 100%;
  padding: 20px 30px;
  opacity: ${props => props.notStarted ? 0.5 : 1};
`

const ReportYearViewer: FC<TReportYearViewer> = ({ report }) => {
    let token = Cookies.get('XSRF-TOKEN')
    const headers = {
        'X-XSRF-TOKEN': token || ''
    }
    const [form] = Form.useForm()

    const [initLoading, setInitLoading] = useState(true)
    const [loadingSasbStandards, setLoadingSasbStandards] = useState(false)

    const [updatingMetric, setUpdatingMetric] = useState<boolean | any>(false)

    const [updatingGoal, setUpdatingGoal] = useState<boolean | any>(false)

    const [isNumeric, setIsNumeric] = useState(true)

    const isPeriodAnnual = (period: string) => period === 'YR'

    const [metricTypes, setMetricTypes] = useState([])

    const modMetricTypes = useMemo(() => {
        return map(groupBy(report.reports[0].esg_metrics, 'category'), (metric_types, cat) => ({
            category: cat,
            metric_types
        }))
    }, [report.reports])

    const getMetricTypes = useCallback(() => {
        ResourceService.index({
            resourceName: 'metric-types',
            params: {
                year: report.year
            }
        }).then(({data}) => {
            setMetricTypes(data.metric_types)
        }).finally(() => {
            setInitLoading(false)
        })
    }, [report.year])

    const deleteMetricTypes = useCallback(() => {
        setInitLoading(true)
        console.log(metricTypes)

        ResourceService.delete({
            resourceName: 'metric-types',
            resourceID: updatingMetric.id
        }).then(({data}) => {
            notification['success']({
                message: 'Metric Deleted!',
                description: `Successfully deleted metric.`,
            });
            setUpdatingMetric(false)
            getMetricTypes()
            form.resetFields()
        }).finally(() => {
            setInitLoading(false)
        })

    }, [form, getMetricTypes, updatingMetric.id, metricTypes])

    useEffect(() => {

        getMetricTypes()

    }, [getMetricTypes])


    const createResource = useCallback((fields) => {

        setInitLoading(true)
        ResourceService.store({
            resourceName: 'metric-types',
            fields
        }).then(() => {
            setUpdatingMetric(false)
            getMetricTypes()
            form.resetFields()
        }).catch(e => {
            console.log(e)
        }).finally(() => {
            setInitLoading(false)
        })
    }, [form, getMetricTypes])

    const updateResource = useCallback((fields, id) => {

        setInitLoading(true)
        ResourceService.update({
            resourceName: 'metric-types',
            resourceID: id,
            fields
        }).then(() => {
            setUpdatingMetric(false)
            getMetricTypes()
            form.resetFields()
        }).catch(e => {
            console.log(e)
        }).finally(() => {
            setInitLoading(false)
        })
    }, [form, getMetricTypes])

    const editingExistingMetric = useMemo(() => {
        return updatingMetric?.id
    }, [updatingMetric])

    const loadSasbStandard = useCallback((standard: any) => {
        form.setFieldsValue({
            name: standard.topic,
            description: standard.accounting_metric,
            formula: 'SUM',
            isNumeric: !!standard.unit_of_measure,
            measurement_units: standard.unit_of_measure ?? undefined
        })

        setLoadingSasbStandards(false)
    }, [form])

    const editThisMetric = useCallback((item: any) => {
        setUpdatingMetric(item)

        form.setFieldsValue({
            ...item
        })
    }, [form])

    return (
        <div>
            <Row
                align={"middle"}
                gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
                <Col span={6}>
                    <Title level={2}>{report.year} - ESG Report</Title>
                </Col>
                <Col span={18}>
                    <Row
                        gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
                        {report.reports.map((rep: any) => (
                            <Col key={rep.year + '_col' + rep.period} span={4}>
                                <Link to={`/reports/${rep.id}`}>
                                    <ReportCard>
                                        <Title level={4}>{isPeriodAnnual(rep.period) ? 'EOY' : rep.period}</Title>
                                    </ReportCard>
                                </Link>
                            </Col>
                        ))}

                    </Row>
                </Col>
            </Row>
            <Divider>
                Report Template
            </Divider>
            <div>


                <PageHeader
                    ghost
                    subTitle={"These metrics can be used to generate Quarterly and EOY  reports for year " + report.year}
                    extra={
                        <Upload name="files" action={`${baseUrl}/api/uploads?report_id=${report.reports[0].id}`} withCredentials={true} headers={headers}>
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                    }
                >
                </PageHeader>
                {modMetricTypes && <Collapse >
                    {
                        modMetricTypes.map(({category, metric_types }, idx) => (
                            <Panel header={category} key={idx}>

                                {<List
                                    loading={initLoading}
                                    itemLayout="horizontal"
                                    dataSource={metric_types}
                                    renderItem={(item: any) => <List.Item
                                        actions={[item.isNumeric && <Button key={'goal button'}
                                                                            type={"primary"}
                                                                            ghost
                                                                            onClick={() => setUpdatingGoal(item)}>Set Goal</Button>,
                                            <Button key={'edit button'}
                                                          onClick={() => editThisMetric(item)}>Edit</Button>]}
                                    >
                                        <List.Item.Meta
                                            title={item.metric_name}
                                            description={<Space direction={'vertical'}>
                                                {(item.value > 0 && item.measurement_units === '%' &&
                                                    <p>{(item.value * 100).toLocaleString()}{item.measurement_units}</p>)
                                                    || (item.value > 0 && item.measurement_units === '$' &&
                                                    <p>{item.measurement_units}{item.value.toFixed(2)}</p>)
                                                    || (item.value > 0 &&
                                                    <p>{item.value} {item.measurement_units}</p>)
                                                }
                                                <div><Tag
                                                    color={['High', 'Very High'].includes(item.risk) ? 'red' : 'orange'}>Risk: {item.risk}</Tag>
                                                    <Tag>{item.isNumeric ? 'Quantitative' : 'Qualitative'}</Tag>
                                                </div>
                                                <p>{item.description} {item.organization}</p></Space>}
                                        />
                                    </List.Item>
                                    }
                                />}

                            </Panel>))
                    }

                </Collapse>}

            </div>
            {updatingGoal && <Modal
                title={`Setting Goal for ${updatingGoal.name}`}
                centered
                visible
                footer={null}
                onCancel={() => setUpdatingGoal(false)}
                width={1000}
            >
                <GoalViewer year={report.year} metricType={updatingGoal}/>
            </Modal>}
            {updatingMetric &&
            <Drawer
                title={editingExistingMetric ? 'Editing Metric - ' + updatingMetric.name : `Adding New Metric Type`}
                placement="right"
                size={"large"}
                onClose={() => Modal.confirm({
                    title: 'Do you want to discard unsaved changes?',
                    icon: <ExclamationCircleOutlined/>,
                    onOk() {
                        form.resetFields()
                        setUpdatingMetric(false)
                    },
                    onCancel() {
                    },
                })}
                visible
            >
                <FormWrapper>
                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={{
                            year: report.year,
                            isNumeric: false,
                            isPositive: true,
                            risk: "Moderate"
                        }}

                        onFinish={(values) => editingExistingMetric ? updateResource(values, updatingMetric.id) : createResource(values)}
                    >
                        <Tabs defaultActiveKey="1" type="card" size={"large"}
                              tabBarExtraContent={<Button type={"primary"} htmlType="submit"
                                                          loading={initLoading}>Submit</Button>}>
                            <Tabs.TabPane tab="Details" key="1">

                                <Divider orientation={"right"}>
                                    <Button type={"ghost"} onClick={() => setLoadingSasbStandards(true)}>Load SASB
                                        Standard</Button>
                                    <Button type={"ghost"} onClick={() => form.resetFields()}>Clear</Button>
                                </Divider>

                                {loadingSasbStandards && <Modal
                                    title="Load From SASB"
                                    centered
                                    visible
                                    footer={null}
                                    onCancel={() => setLoadingSasbStandards(false)}
                                    width={1000}
                                >
                                    <SasbIndicatorSelector defaultValue={[]} onSelect={loadSasbStandard}
                                                           onUpdate={() => null}/>
                                </Modal>}

                                <Form.Item required label="Year" name={"year"}>
                                    <InputNumber readOnly disabled/>
                                </Form.Item>

                                <Form.Item required label="Category" name={"report_category_id"}>
                                    <ReportCategorySelector/>
                                </Form.Item>

                                <Form.Item required label="Metric Name" name={"name"}>
                                    <Input/>
                                </Form.Item>

                                <Form.Item required label="Metric Value" name={"value"}>
                                    <InputNumber style={{width: '150px'}}/>
                                </Form.Item>

                                <Form.Item label="Metric Description" name={"description"}>
                                    <Input.TextArea/>
                                </Form.Item>

                                <Form.Item label="Narrative" name={"narrative"}>
                                    <Input.TextArea/>
                                </Form.Item>


                                <Form.Item valuePropName={"checked"} label="Is Numeric?" name={"isNumeric"}>
                                    <Switch onChange={setIsNumeric}/>
                                </Form.Item>
                                {isNumeric && <>
                                    <Form.Item label="Measurement Units" name={"measurement_units"}>
                                        <Input.TextArea placeholder={'e.g.: mt, $'}/>
                                    </Form.Item>

                                    <Form.Item valuePropName={"checked"} label="Is Positive?" name={"isPositive"}>
                                        <Switch defaultChecked/>
                                    </Form.Item>
                                    <Form.Item label="Formula" name={"formula"}>
                                        <Input placeholder={"SUM"}/>
                                    </Form.Item>
                                </>}

                                <Form.Item label="Risk" name={"risk"}>
                                    <Select
                                        options={['None', 'Negligible', 'Low', 'Moderate', 'High', 'Very High'].map((i) => ({value: i}))}/>
                                </Form.Item>


                            </Tabs.TabPane>
                            <Tabs.TabPane tab="IPIECA Standards" key="2">
                                <Form.Item name={"ipieca_indicators"}>
                                    <IpiecaIndicatorSelector
                                        defaultValue={updatingMetric.ipieca_indicators?.map((indicator: any) => Number(indicator.id))}
                                        onUpdate={(ids) => form.setFieldsValue({
                                            ipieca_indicators: ids
                                        })}/>
                                </Form.Item>
                            </Tabs.TabPane>

                            <Tabs.TabPane tab="SASB Standards" key="3">
                                <Form.Item name={"sasb_standards"}>
                                    <SasbIndicatorSelector
                                        defaultValue={updatingMetric.sasb_standards?.map((indicator: any) => Number(indicator.id))}
                                        onUpdate={(ids) => form.setFieldsValue({
                                            sasb_standards: ids
                                        })}/>
                                </Form.Item>
                            </Tabs.TabPane>
                        </Tabs>
                    </Form>
                    <hr/>
                    <Button danger
                            type={"text"}
                            onClick={() => Modal.confirm({
                                title: 'Are you sure you want to delete this metric type?',
                                icon: <DeleteOutlined/>,
                                okText: "Delete",
                                type:"error",
                                okType: "danger",
                                onOk() {
                                    deleteMetricTypes()
                                },
                                onCancel() {
                                },
                            })}
                    >Delete Metric Type</Button>
                </FormWrapper>
            </Drawer>}
        </div>
    )
}

export default ReportYearViewer