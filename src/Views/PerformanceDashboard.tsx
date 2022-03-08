import React, {FC, useCallback, useEffect, useState} from 'react'
import {Card, Divider, Statistic} from "antd";
import styled from "styled-components";
import ResourceService from "../Services/ResourceService";

type PerformanceDashboardProps = {}

const Wrapper = styled.div`
  background: #fff;
  padding: 20px;
  width: 30%;
`


const PerformanceDashboard: FC<PerformanceDashboardProps> = ({}) => {

    const [indicators, setIndicators] = useState<any[]>([])
    const [initLoading, setInitLoading] = useState(true)

    useEffect(() => {
        ResourceService.index({
            resourceName: 'performance-indicators',
        }).then(({data}) => {
            setIndicators(data)
        }).finally(() => {
            setInitLoading(false)
        })
    }, [])

    const getRiskLevel = useCallback(() => {

    }, [])

    return (
        <>
            <div className="site-layout-background">
            <div>
                <Divider orientation={"center"}>
                    Performance Indicators
                </Divider>
            </div>
            <div style={{
                padding: '0 24p 90px 24px',
                textAlign: 'center',
                display: 'flex',
                gap: '2rem',
                flexWrap: 'wrap'
            }}>
                {indicators && indicators.map(item => (
                    <Wrapper key={item.id}>

                        <Card title={item.name} style={{marginBottom: 20}}>
                            <Statistic
                                value={item.result}
                                valueStyle={{color: "#1890ff"}}
                            />
                            <hr/>
                            Low: {item.low} | Low: {item.moderate} | High: {item.high}
                        </Card>
                    </Wrapper>
                ))}
            </div>
        </div>
        </>
    )
}

export default PerformanceDashboard