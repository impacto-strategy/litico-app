import { Col, Form, Input } from 'antd';

const SourceField = ({ initialValue }: any) => {
    return (
        <Col
            lg={{span: 12}}
            sm={{span: 24}}
        >
            <Form.Item
                initialValue={initialValue}
                name="source"
                label="Source"
            >
                <Input />
            </Form.Item>
        </Col>
    )
}

export default SourceField;