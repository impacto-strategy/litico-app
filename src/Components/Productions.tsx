import React, {FC, useState, useEffect, useCallback } from 'react';
import { Line, LineConfig } from "@ant-design/charts";
import styled from "styled-components";
import { filter } from "lodash";
import ResourceService from "../Services/ResourceService";

const Wrapper = styled.div`
  background: #fff;
  padding: 20px;
`

const Containter = styled.div`
  width: 93%;
`

const Productions: FC<{productType: string, title: string}> = props => {
  const [_data, setProductionData] = useState<any>([])

  const getMetricTypes = useCallback(() => {
        ResourceService.index({
            resourceName: 'productions'
        }).then(({ data }) => {
            setProductionData(filter(data, { 'product': props.productType }))
        })

  }, [props.productType])
  
  useEffect(() => {
      getMetricTypes()
  }, [ getMetricTypes])

    const config: LineConfig = {
        data: _data,
        xField: 'date',
        yField: 'amount',
        smooth: true,
        point: {
            size: 5,
            shape: 'diamond',
            style: {
                fill: 'white',
                stroke: '#5B8FF9',
                lineWidth: 2,
            },
        },
    };
    return (
        <Containter>
            {_data.length > 0 &&
            <Wrapper>
                <h2>
                    {props.title}
                </h2>
                <Line {...config} />
            </Wrapper>
            }
        </Containter>
    )
}

export default Productions