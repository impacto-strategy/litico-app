import { FC } from 'react';
import { Line, LineConfig } from "@ant-design/charts";
import styled from "styled-components";

const Wrapper = styled.div`
  background: #fff;
  padding: 20px;
`

const Containter = styled.div`
  width: 95%;
`

const Productions: FC<{ data: any, productType: string, title: string, y1Lablel: string}> = props => {
    const config: LineConfig = {
        data: props.data,
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
        yAxis: {
            title: {
                style: {
                    fontSize: 14,
                },
                text: props.y1Lablel
            },
        },
    };
    return (
        <Containter>
            {props.data.length > 0 &&
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