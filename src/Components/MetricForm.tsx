import React, {useState} from 'react';
import {Button, Col, Form, Input, InputNumber, Row, Select} from 'antd';
import {CheckOutlined, PlusOutlined, SendOutlined} from '@ant-design/icons'

const {Option} = Select;
const {TextArea} = Input
const MetricForm = ({metric, onAdd}: any) => {
    const [form] = Form.useForm();

    const [updated, setUpdated] = useState(true)
    const [narrative, setNarrative] = useState<any>(null)

    const getColor = (riskLevel: any) => {
        const keyCodes = {
            'Low': 'green',
            'Moderate': 'orange',
            'High': 'red'
        }

        // @ts-ignore
        return keyCodes[riskLevel ?? metric.risk] ?? 'transparent'
    }


    const onFinish = (values: any) => {
        onAdd(values)
        setUpdated(true)
    };

    return (
        <Form form={form} layout="inline"
              initialValues={{
                  ...metric,
                  year: 2020
              }}
              onValuesChange={() => updated && setUpdated(false)}
              onFinish={onFinish}
              style={{width: '100%', display: 'block', marginTop: 20}}>
            <Row>
                <Col span={6}>
                    <Form.Item
                        name={"name"}
                    >
                        <Input placeholder="Metric Name"/>
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item

                        name={"value"}
                    >
                        <InputNumber style={{width: '100%'}} placeholder="Metric Value"/>
                    </Form.Item>
                </Col>
                <Col span={3}>
                    <Form.Item
                        name={"risk"}
                        shouldUpdate
                    >
                        <Select placeholder={"Select Risk"}

                                style={{
                                    border: `1px solid transparent`,
                                    borderColor: getColor(form.getFieldValue('risk'))
                                }}>
                            <Option value="Low">Low</Option>
                            <Option value="Moderate">Moderate</Option>
                            <Option value="High">
                                High
                            </Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                        name={"narrative"}
                        hidden={narrative === null}
                    >
                        <TextArea placeholder={"Narrative"}/>

                    </Form.Item>
                    {narrative === null &&
                    <Button type={'dashed'} icon={<PlusOutlined/>} onClick={() => setNarrative('')}>
                        Add Narrative
                    </Button>}
                </Col>

                <Form.Item hidden name={"i_p_i_e_c_a_indicator_id"}>
                    <Input hidden/>
                </Form.Item>
                <Form.Item hidden name={"year"}>
                    <Input hidden/>
                </Form.Item>
                <Col span={3}>

                    <Form.Item shouldUpdate>

                        <Button htmlType="submit" type={'primary'}
                                disabled={updated}
                                icon={updated ? <CheckOutlined/> : <SendOutlined/>}/>

                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default MetricForm