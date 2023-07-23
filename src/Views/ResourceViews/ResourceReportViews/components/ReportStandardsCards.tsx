import {
    Button,
    Card,
    Descriptions,
    Divider,
    List,
    Row,
    Space,
    Tag
} from 'antd';
import {
    DownOutlined,
    UpOutlined,
} from '@ant-design/icons';
import { FC, useState } from 'react';

/**
 * Renders UI showing what standards pertain to the submetric type using card format. Note, this doesn't include description code (which is in parent component).
 */
const ReportStandardsCards: FC<any> = ({ 
    metricStandards,
    setMetricDescription,
    setIsModalOpen 
}): JSX.Element => {
    const [showDescription, setShowDescription] = useState<any>([]);

    // The hide/display description is utilized by Modal component on ESGMetricDataReportView for the metric's description.
    const displayDescription = (idx: any) => {
        let arr = [...showDescription]
        arr.push(idx)
        setShowDescription(arr)
    }

    const hideDescription = (idx: any) => {
        let arr = [...showDescription]
        setShowDescription(arr.filter(x => x !== idx))
    }

    const showModal = (description:string) => {
        setMetricDescription(description)
        setIsModalOpen(true);
    }

    return (
        <Space direction={'vertical'}>
            <Divider>Standards</Divider>
            <List
                grid={{gutter: 16, column: 2}}
                dataSource={metricStandards}
                renderItem={(item: any, idx) => (
                    <List.Item>
                        <Card
                            title={item.metric_name}>
                            <Card.Meta title={<Tag>
                                {item.metric_code}
                            </Tag>}>
                            </Card.Meta>
                            {(item.description && !showDescription.includes(idx)) &&
                                <DownOutlined style={{
                                float: 'right'
                                }} onClick={(() => displayDescription(idx))} />
                            }
                            {(item.description && showDescription.includes(idx)) &&
                                <UpOutlined style={{
                                float: 'right'
                                }} onClick={(() => hideDescription(idx))} />
                            }
                            {showDescription.includes(idx) &&
                                <Row style={{ paddingTop: '20px' }}>
                                {(item?.description && item.description.length > 500) ?
                                    <div>
                                    <p>{`${item.description.substring(0, 500)}...`}</p>
                                    <p><Button type="link" onClick={() => showModal(item.description)}>Read more</Button></p>
                                    </div>
                                    :
                                    <p>{item.description}</p>
                                }
                                </Row>
                            }
                            <Divider/>
                            <Descriptions column={1} size={"small"} layout={"horizontal"}>
                                {item.measurement_units && <Descriptions.Item
                                    label={"Unit Of Measure"}>
                                    <Tag>{item.measurement_units}</Tag>
                                </Descriptions.Item>}
                                <Descriptions.Item
                                    label={"Category"}>
                                    <Tag>{item.category}</Tag>
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </List.Item>
                )}
            />
        </Space>
    )
}

export default ReportStandardsCards;