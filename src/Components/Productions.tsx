import { FC } from 'react';
import { Line, LineConfig } from "@ant-design/charts";
import styled from "styled-components";

const Wrapper = styled.div`
  background: #fff;
  padding: 20px;
`

const Productions: FC<{ data: any }> = props => {
    const Containter = styled.div`
        grid-column: 1 /5;
        @media (min-width: 767px) {
            grid-column: 1/5
        }
    `

    const config: LineConfig = {
        data: props.data,
        animation: false,
        xField: 'date',
        yField: 'amount',
        seriesField: 'product',
        smooth: true,
        yAxis: {
            label: {
                formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
            },
        },
        legend: {
            itemName: {
                formatter: (v) => {
                    return v === 'oil' ? `${ v[0].toUpperCase() + v.substring(1)} Production (bbls)` : `Natural ${ v[0].toUpperCase() + v.substring(1)} Production (mmscf)`
                }
            }
        },
        // This will be how we customize the line color.
        color: ['#48ac76', '#f05b72'],
        point: {
            size: 5,
            shape: 'diamond',
            style: ({ product }: {product: string}) => {
                let config = {
                    fill: 'white',
                    lineWidth: 2,
                    stroke: product === 'oil' ? '#48ac76' : '#f05b72'
                }
                return config;
            },
        },
        tooltip: {
            formatter: (data: any) => {
                const value = `${data.amount}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`)
                const name = data.product === 'oil' ? 'Oil (bbls)' : 'Natural Gas (mmscf)'
                return { name: name, value: value };
            },
          },
    };
    return (
        <Containter>
            {props.data.length > 0 &&
                <Wrapper>
                    <h3>
                        Oil & Gas Production
                    </h3>
                    <Line {...config} />
                </Wrapper>
            }
        </Containter>
    )
}

export default Productions