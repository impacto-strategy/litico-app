/* IMPORT EXTERNAL MODULES */
import { FC } from 'react';
import { DualAxes} from "@ant-design/charts";
import styled from "styled-components";

/* IMPORT INTERNAL MODULES */
import { formatValue } from '../utils/utils';

interface ProductionChartProps {
    data: any,
    gridColumns: string,
    title: string
}

const Wrapper = styled.div`
  background: #fff;
  padding: 20px;
`

/**
 * Renders a graph with multiple lines and mulitple Y-axes
 * 
 * @param props - interface above has more details
 * @returns JSX Element that renders an Ant Design graph.
 */
const ProductionChart: FC<ProductionChartProps> = props => {
    const Containter = styled.div`
        grid-column: 1 /5;
        @media (min-width: 767px) {
            grid-column: ${props.gridColumns}
        }
    `

    const config = {
        data: [props.data, props.data],
        animation: false,
        xField: 'date',
        yField: ['oil', 'gas'],
        yAxis: {
            oil: {
                label: {
                    formatter: (v: string) => formatValue(+v)
                },
                min: 0,
                title: {
                    text: "Liquid Production (bbl)"
                }
            },
            gas: {
                label: {
                    formatter: (v: string) => formatValue(+v)
                },
                min: 0,
                // max: 15000,
                title: {
                    text: "Gas Production (mmscf)"
                }
            }
        },
        geometryOptions: [
            {
                geometry: 'line',
                color: '#48ac76',
                lineStyle: {
                    lineWidth: 2
                },
                point: {
                    size: 5,
                    shape: 'diamond',
                    style: {
                        fill: 'white',
                        lineWidth: 2,
                        stroke: '#48ac76'
                    }
                },
                smooth: true,
            },
            {
                geometry: 'line',
                color: '#f05b72',
                lineStyle: {
                    lineWidth: 2
                },
                point: {
                    size: 5,
                    shape: 'diamond',
                    style: {
                        fill: 'white',
                        lineWidth: 2,
                        stroke: '#f05b72'
                    }
                },
                smooth: true,
            },
        ],
        legend: {
            flipPage: false,
            itemName: {
                formatter: (text: string, item: any, index: number) => 
                    text === 'gas' 
                        ? `${text.charAt(0).toUpperCase() + text.slice(1)} Production (mmscf)`
                        : `${text.charAt(0).toUpperCase() + text.slice(1)} Production (bbl)`
            }
        },
        limitInPlot: false,
        tooltip: {
            formatter: (data: any) => {
                return { 
                    name: data.hasOwnProperty('oil') ? 'Oil Production (bbls)' : 'Natural Gas Production (mmscf)', 
                    value: data.gas ? formatValue(data.gas) : formatValue(data.oil) 
                };
            },
        },
    };
    return (
        <Containter>
            <Wrapper>
                <h3>
                    {props.title}
                </h3>
                <DualAxes {...config} />
            </Wrapper>
        </Containter>
    )
}

export default ProductionChart