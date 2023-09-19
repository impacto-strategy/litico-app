import {Col, Form, Select} from 'antd';
import {FC} from 'react';

const StateField: FC<any> = ({ initialState }) => {
    const stateCodes = [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS',
        'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY',
        'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV',
        'WI', 'WY'
    ]

    return (
        <Col lg={{span: 4}} sm={{span: 24}}>
            <Form.Item 
                initialValue={initialState || "CO"}
                name="state" 
                label="State"
            >
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