import {
    Checkbox,
    Col,
    DatePicker,
    Form,
    Input,
    Row,
    Select
} from 'antd';

const DynamicFieldsSection = ({ fields }: any) => {
    return (
        <Row gutter={24}>
            {fields?.map((field: any) => (
                <Col key={field.id} lg={{span: 8}} sm={{span: 24}}>
                    <Form.Item label={field.name}>
                        <Input.Group compact>
                                {field.field_type === "checkbox" && 
                                    <Form.Item
                                        name={['factors', field.col_label]}
                                        noStyle
                                    >
                                        <Checkbox.Group style={{width: "50vw"}}>
                                            {field.factor_form_options.map((choice: any, index: number) => {
                                                return <Checkbox key={index} name={choice.opion} value={choice.option}>{choice.option}</Checkbox>
                                            })}
                                        </Checkbox.Group>
                                    </Form.Item>
                                }
                                {field.field_type === "date_time" &&
                                    <Form.Item
                                        name={['factors', field.col_label]}
                                        noStyle
                                    >
                                        <DatePicker showTime={true} />
                                    </ Form.Item>
                                }
                                {field.field_type === "textarea" &&
                                    <Form.Item
                                        name={['factors', field.col_label]}
                                        noStyle
                                    >
                                        <Input.TextArea />
                                    </Form.Item>
                                }
                                {!field.field_type &&
                                    <Form.Item
                                        name={['factors', field.col_label]}
                                        noStyle
                                    >
                                        <Input style={{ width: '50%' }} />
                                    </Form.Item>
                                }
                            {field.measurement_units[0] &&
                                <Form.Item
                                    noStyle
                                >
                                    <Select placeholder={field.measurement_units[0]}>
                                        {field.measurement_units.map((option: string) => (
                                            <Select.Option key={option} value={option} >{option}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            }
                        </Input.Group>
                    </Form.Item>
                </Col>
            ))}
        </Row>
    )
}

export default DynamicFieldsSection;