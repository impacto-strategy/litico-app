import {
    Checkbox,
    Col,
    DatePicker,
    Form,
    Input,
    Row,
    Select
} from 'antd';

/**
 * Handles both UI and logic for fields specific to an ESG Metric subtype. Seperation from shared fields allows for better maintainability and readibility.
 */
const DynamicFieldsSection = ({ fields, initialValues }: any) => {
    const getInitialSelectValue = (field: any) => {
        if (initialValues[field.col_label]) {
            return initialValues[field.col_label]
        } else if (field.field_type === "select") {
            return field.factor_form_options[0].option
        } else {
            return undefined
        }
    }

    return (
        <Row gutter={24}>
            {fields?.map((field: any) => (
                <Col key={field.id} lg={{span: 12}} sm={{span: 36}}>
                    <Form.Item 
                        label={field.name}
                    >
                        <Input.Group compact>
                                {field.field_type === "checkbox" && 
                                    <Form.Item
                                        name={['factors', field.col_label]}
                                        noStyle
                                    >
                                        <Checkbox.Group style={{width: "50vw"}}>
                                            {field.factor_form_options.map((choice: any, index: number) => {
                                                return <Checkbox key={index} name={choice.option} value={choice.option}>{choice.option}</Checkbox>
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
                                {field.field_type === "select" &&
                                    <Form.Item
                                        initialValue={getInitialSelectValue(field)}
                                        name={['factors', field.col_label]}
                                        noStyle
                                    >
                                        <Select>
                                            {field.factor_form_options.map((choice: any, index: number) => (
                                                <Select.Option key={index} value={choice.option} >{choice.option}</Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                }
                                {!field.field_type &&
                                    <Form.Item
                                        initialValue={initialValues[field.col_label]}
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