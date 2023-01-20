/* IMPORT EXTERNAL MODULES */
import {
    Button,
    Card,
    Col,
    Row,
    Space,
    Tag
} from "antd"
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { FC, useEffect, useLayoutEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"

interface CardProps {
    displayDescription: Function,
    getLink: Function,
    getReportEntries: any,
    hideDescription: Function,
    idx: string,
    item: any,
    metricCodes: Function,
    showDescription: string[],
    showModal: Function,
    showReport: Function
}

/**
 * Generates an individual metric card on the add data screen when a metric type has been selected.
 * 
 * @returns React component that renders the cards with Metric Subtype when adding new data.
 */
const MetricSubtypeCards: FC<CardProps> = ({
    displayDescription,
    getLink,
    getReportEntries,
    hideDescription,
    idx,
    item,
    metricCodes,
    showDescription,
    showModal,
    showReport
}) => {
    const Overlay = styled.div `
        position: absolute;
        background-color: lightgray;
        z-index: 100;
        opacity: .5;
        span {
            transform: rotate(300deg);
            -webkit-transform: rotate(300deg);
            -moz-transform: rotate(300deg);
            -ms-transform: rotate(300deg);
            -o-transform: rotate(300deg);
            position: absolute;
            top: 35%;
            left:40%;
            font-size: 18px;
            color: #000000;
            @media only screen and (min-width: 1024px) {
            top: 35%;
            left: 50%;
            font-size: 20px;
            }
        }
    `
    // React Hooks
    const [cardWidth, setWidth] = useState<number>(0)
    const [cardHeight, setHeight] = useState<number>(0)
    const cardRef = useRef<any>()

    // Component Functions
    /**
     * Updates width and height state when card is initially generated and anytime the 
     * window is resized.
     * @returns Void
     */
    const getCardDimensions = (): void => {
        if(cardRef.current) {
              setWidth(cardRef.current.clientWidth + 1)
              setHeight(cardRef.current.clientHeight + 1)
        }
    }

    // Helps get width and height after element has been generated.
    useLayoutEffect(() => {
        getCardDimensions();
    })
    
    useEffect(() => {
        window.addEventListener('resize', () => {
            getCardDimensions();
        })
        return window.removeEventListener('resize', () => {
            getCardDimensions();
        })
    }, [])

    return (
        <Col sm={{ span: 24 }} lg={{ span: 8 }} key={idx} style={{ marginBottom: 32 }}>
            {item[0].is_active !== 1 &&
                <Link to={getLink(item[0])}>
                    <Overlay
                        style={cardWidth && cardHeight ? {width: cardWidth, height: cardHeight} : {}}
                    >
                        <span>Coming Soon</span>
                    </Overlay>
                </Link>
            }
            <Card
              title={item[0].metric_subtype}
              key={idx}
              type='inner'
              ref={cardRef}
              extra={<Link
                  to={getLink(item[0])}>View</Link>}
                  actions={showReport 
                    ? [
                      <div>{showReport && getReportEntries(item[0].metric_subtype)}</div>,
                      <div>{showReport && '0 Pending Approval'}</div>
                    ]
                    : []
                  }
              >
              <Space direction={'vertical'}>
                  {metricCodes(item).map((code: any) => (
                      <Tag key={code}>{code}</Tag>
                    )
                  )}
              </Space>
              {(item[0].description && !showReport && !showDescription.includes(idx)) &&
                <DownOutlined style={{
                  float: 'right'
                }} onClick={(() => displayDescription(idx))} />
              }
              {(item[0].description && !showReport && showDescription.includes(idx)) &&
                <UpOutlined style={{
                  float: 'right'
                }} onClick={(() => hideDescription(idx))} />
              }
              {(!showReport && showDescription.includes(idx)) &&
                <Row style={{ paddingTop: '20px' }}>
                  {(item?.description && item[0].description.length > 500) ?
                    <div>
                      <p>{`${item[0].description.substring(0, 500)}...`}</p>
                      <p><Button type="link" onClick={() => showModal(item[0].description)}>Read more</Button></p>
                    </div>
                    :
                    <p>{item[0].description}</p>
                  }
                </Row>
              }
            </Card>
          </Col>
    )
}

export default MetricSubtypeCards