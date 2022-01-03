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
    PageHeader,
    Row,
    Select,
    Space,
    Switch,
    Tabs,
    Tag,
    Typography,
} from "antd";
import {ExclamationCircleOutlined} from '@ant-design/icons'
import styled from "styled-components";
import ResourceService from "../../../../Services/ResourceService";
import ReportCategorySelector from "../../../../Components/ReportCategorySelector";
import {groupBy, map} from "lodash";
import {Link} from "react-router-dom";
import IpiecaIndicatorSelector from "../../../../Components/IpiecaIndicatorSelector";
import SasbIndicatorSelector from "../../../../Components/SasbIndicatorSelector";

const {Panel} = Collapse;

const {Title} = Typography

type ReportYearViewer = {
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

const ReportYearViewer: FC<ReportYearViewer> = ({report}) => {

    const [form] = Form.useForm()

    const [initLoading, setInitLoading] = useState(true)
    const [loadingSasbStandards, setLoadingSasbStandards] = useState(false)

    const [updatingMetric, setUpdatingMetric] = useState<boolean | any>(false)

    const [isNumeric, setIsNumeric] = useState(true)

    const isPeriodAnnual = (period: string) => period === 'YR'

    const [metricTypes, setMetricTypes] = useState([])

    const modMetricTypes = useMemo(() => {
        return map(groupBy(metricTypes, 'report_category.name'), (metric_types, cat) => ({
            category: cat,
            metric_types
        }))
    }, [metricTypes])

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

    useEffect(() => {

        getMetricTypes()

    }, [getMetricTypes])


    const createResource = useCallback((fields) => {

        setInitLoading(true)
        ResourceService.store({
            resourceName: 'metric-types',
            fields
        }).then(({data}) => {
            setUpdatingMetric(false)
            getMetricTypes()
        }).catch(e => {
            console.log(e)
        }).finally(() => {
            setInitLoading(false)
        })
    }, [])

    const updateResource = useCallback((fields, id) => {

        setInitLoading(true)
        ResourceService.update({
            resourceName: 'metric-types',
            resourceID: id,
            fields
        }).then(({data}) => {
            setUpdatingMetric(false)
            getMetricTypes()
        }).catch(e => {
            console.log(e)
        }).finally(() => {
            setInitLoading(false)
        })
    }, [])

    const editingExistingMetric = useMemo(() => {
        return updatingMetric?.id
    }, [updatingMetric])

    const loadSasbStandard = (standard: any) => {
        console.log(standard)
        form.setFieldsValue({
            name: standard.topic,
            description: standard.accounting_metric,
            formula: 'SUM',
            isNumeric: standard.unit_of_measure ? true : false,
            measurement_units: standard.unit_of_measure ?? undefined
        })

        setLoadingSasbStandards(false)
    }

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
                                <Link to={`/reports/${rep.year}/${rep.period}`}>
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
                    extra={<Button key="b1" type={"primary"} onClick={() => setUpdatingMetric(true)}>
                        Add Metric
                    </Button>}
                >
                </PageHeader>
                {modMetricTypes && <Collapse defaultActiveKey={Object.keys(modMetricTypes)}>
                    {
                        modMetricTypes.map((template, cat) => (
                            <Panel header={template.category} key={cat}>

                                {<List
                                    loading={initLoading}
                                    itemLayout="horizontal"
                                    dataSource={template.metric_types}
                                    renderItem={(item: any) => <List.Item
                                        actions={[<Button key={'edit button'}
                                                          onClick={() => setUpdatingMetric(item)}>Edit</Button>]}
                                    >
                                        <List.Item.Meta
                                            title={item.name}
                                            description={<Space direction={'vertical'}>
                                                <div><Tag
                                                    color={['High', 'Very Hight'].includes(item.risk) ? 'red' : 'orange'}>Risk: {item.risk}</Tag>
                                                    <Tag>{item.isNumeric ? 'Quantitative' : 'Qualitative'}</Tag>
                                                </div>
                                                <p>{item.description}</p></Space>}
                                        />

                                    </List.Item>
                                    }
                                />}

                            </Panel>))
                    }

                </Collapse>}

            </div>
            {updatingMetric &&
            <Drawer
                title={editingExistingMetric ? 'Editing Metric - ' + updatingMetric.name : `Adding New Metric`}
                placement="right"

                size={"large"}
                onClose={() => Modal.confirm({
                    title: 'Do you Want to discard unsaved changes?',
                    icon: <ExclamationCircleOutlined/>,
                    onOk() {
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
                            ...updatingMetric
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
                                </Divider>

                                {loadingSasbStandards && <Modal
                                    title="Modal 1000px width"
                                    centered
                                    visible
                                    footer={null}
                                    onCancel={() => setLoadingSasbStandards(false)}
                                    width={1000}
                                >
                                    <SasbIndicatorSelector onSelect={loadSasbStandard} defaultValue={[]}
                                                           onUpdate={(id) => null}/>
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

                                <Form.Item label="Metric Description" name={"description"}>
                                    <Input.TextArea/>
                                </Form.Item>

                                <Form.Item label="Narrative" name={"narrative"}>
                                    <Input.TextArea/>
                                </Form.Item>


                                <Form.Item valuePropName={"checked"} label="Is Numeric?" name={"isNumeric"}>
                                    <Switch defaultChecked onChange={setIsNumeric}/>
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

                </FormWrapper>
            </Drawer>}
        </div>
    )
}

export default ReportYearViewer