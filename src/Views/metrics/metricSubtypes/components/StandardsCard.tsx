/* IMPORT EXTERNAL MODULES */
import { Card, Row, Space, Tag } from "antd";
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { FC, useState } from 'react';

/**
 * Interface (Card interface specifically) for showing which standards and metric codes are relevant to the metric subtype for which data is being added to.
 */
const StandardsCard: FC<any> = ({ standards }): JSX.Element => {
    // React Hooks
    const [showDescription, setShowDescription] = useState<any>(false)

    return (
        <Card
            title={standards?.[0].metric_subtype}
            type='inner'
        >
            <Space direction={'vertical'}>
                    {standards?.[0].metric_code.split(',').map((code: any, idx:string) => (
                        <Tag key={idx}>{code}</Tag>
                    )
                    )}
            </Space>
            {(standards?.[0].description && !showDescription) &&
                <DownOutlined style={{
                float: 'right'
                }} onClick={(() => setShowDescription(true))} />
            }
            {(standards?.[0].description && showDescription) &&
                <>
                    <UpOutlined style={{
                        float: 'right'
                    }} onClick={(() => setShowDescription(false))} />

                    <Row style={{ paddingTop: '20px' }}>
                        <p>{standards?.[0].description}</p>
                    </Row>
                </>
            }
        </Card>
    )
}

export default StandardsCard;