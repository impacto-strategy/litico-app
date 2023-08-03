import { Col, Form, Select } from 'antd';

const BasinField = () => {
    return (
        <Col
            lg={{span: 12}}
            sm={{span: 24}}
        >
            <Form.Item name="basin" label="Basin">
                <Select>
                        <Select.Option 
                            key={"Basin"} 
                            value={"DJ Basin"}
                        >
                            DJ Basin
                        </Select.Option>
                        <Select.Option 
                            key={"Basin"} 
                            value={"Permian"}
                        >
                            Permian
                        </Select.Option>
                        <Select.Option 
                            key={"Basin"} 
                            value={""}
                        >
                            N/A
                        </Select.Option>
                </Select>
            </Form.Item>
        </Col>
    )
}

export default BasinField;