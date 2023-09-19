import { Col, Form, Select } from 'antd';

const RiskField = ({ initialValue }: any) => {
    const riskOptions = [
        {name: 'High', value: 'high'},
        {name: 'Medium', value: 'medium'},
        {name: 'Low', value: 'low'}
    ]

    return (
        <Col
            lg={{span: 12}}
            sm={{span: 24}}
        >
            <Form.Item
                initialValue={initialValue}
                name="risk"
                label="Risk"
            >
                <Select>
                    {riskOptions.map((option: any) => (
                        <Select.Option 
                            key={option.name} 
                            value={option.value} 
                        >
                            {option.name}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
        </Col>
    )
}

export default RiskField;