import {Col, Form, Select} from 'antd';

const StateField = () => {
    const stateCodes = [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS',
        'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY',
        'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV',
        'WI', 'WY'
    ]

    return (
        <Col lg={{span: 4}} sm={{span: 24}}>
            <Form.Item name="state" label="State">
                <Select>
                    {stateCodes.map((code: string) => (
                        <Select.Option key={code} value={code} >{code}</Select.Option>
                    ))}
                </Select>
            </Form.Item>
        </Col>
    )
}

export default StateField;