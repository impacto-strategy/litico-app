import {FC}  from 'react';
import styled from "styled-components";
import { Bar, BarConfig } from "@ant-design/charts";

const Wrapper = styled.div`
  background: #fff;
  padding: 20px;
`

const Containter = styled.div`
  width: 46%;
`

const Emissions2020CO2: FC<{ units: string, title: string, data: any }> = props => {
    const config: BarConfig = {
        data: props.data,
        isGroup: true,
        xField: 'value',
        yField: 'epa_requirement_description',
        yAxis: {
            label: {
                style: {
                    fontSize: 14,
                },
                formatter: (text) => `${text.substring(0, 20)}`
            },
        },
        seriesField: 'date',
        legend: false,
    };
    return (
        <Containter>
            {props.data.length > 0 &&
                <Wrapper>
                    <h2>
                        {props.title}
                    </h2>

                    <Bar {...config} />
                </Wrapper>
            }
        </Containter>
    )
}

export default Emissions2020CO2