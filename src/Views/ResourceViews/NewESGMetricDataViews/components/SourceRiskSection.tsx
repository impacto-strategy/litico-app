import {
    Col,
    Form,
    Input,
    Row,
    Select
} from 'antd';

const SourceRiskSection = () => {
    const riskOptions = [
        {name: 'High', value: 'high'},
        {name: 'Medium', value: 'medium'},
        {name: 'Low', value: 'low'}
    ]

    return (
        <Row gutter={24}>
            <Col lg={{span: 12}} sm={{span: 24}}>
                <Form.Item name="source" label="Source">
                    <Input />
                </Form.Item>
            </Col>
            <Col lg={{span: 12}} sm={{span: 24}}>
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
        </Row>
    )
}

export default SourceRiskSection;