import { Col, Form, Select } from 'antd';

const RiskField = () => {
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
            <Form.Item name="risk" label="Risk">
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