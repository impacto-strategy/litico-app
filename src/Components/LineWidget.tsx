import {FC} from 'react';
import {Line, LineConfig} from "@ant-design/charts";
import styled from "styled-components";

const Wrapper = styled.div`
  background: #fff;
  padding: 20px;
  width: 62%;
`

const LineWidget: FC<{ title: string, data: any, label: string }> = props => {
    const config: LineConfig = {
        data: props.data,
        xField: 'type',
        yField: 'value',
        seriesField: 'name',
        color: '#477EB7',
        xAxis: {
            nice: true,
            tickCount: 8,
            label: {
                rotate: Math.PI / 6,
                offset: 10,
                style: {
                    fill: '#aaa',
                    fontSize: 12,
                },
                formatter: (name) => name,
            },
            title: {
                text: `${props.label}`,
                style: {
                    fontSize: 16,
                },
            },
            line: {
                style: {
                    stroke: '#aaa',
                },
            },
            tickLine: {
                style: {
                    lineWidth: 2,
                    stroke: '#aaa',
                },
                length: 5,
            },
            grid: {
                line: {
                    style: {
                        stroke: '#ddd',
                        lineDash: [4, 2],
                    },
                },
                alternateColor: 'rgba(0,0,0,0.05)',
            },
        },
        yAxis: {
            label: {
                autoRotate: false,
                style: {
                    fill: '#aaa',
                    fontSize: 14,
                },
            },
            title: {
                text: 'Metric Tons (CO2e)',
                style: {
                    fontSize: 16,
                },
            },
            line: {
                style: {
                    stroke: '#aaa',
                },
            },
            tickLine: {
                style: {
                    lineWidth: 2,
                    stroke: '#aaa',
                },
                length: 5,
            },
            grid: {
                line: {
                    style: {
                        stroke: '#ddd',
                        lineDash: [4, 2],
                    },
                },
                alternateColor: 'rgba(0,0,0,0.05)',
            },
        },
        label: {
            layout: [
                {
                    type: 'hide-overlap',
                },
            ],
            style: {
                textAlign: 'right',
            },
            formatter: (item) => item['value'].toLocaleString(undefined, {maximumFractionDigits: 0}),
        },
        tooltip: {
            formatter: (item) => {
                return { name: item.name, value: item.value.toLocaleString(undefined, {maximumFractionDigits: 0}) };
            },
        },
        legend: {
            position: 'top-right',
            itemName: {
                style: {
                    fill: '#000',
                },
                formatter: (name) => name,
            },
        },
        smooth: true,
        animation: {
            appear: {
                animation: 'path-in',
                duration: 3000,
            },
        },
    };

    return (
        <Wrapper>
            <h3>
                {props.title}
            </h3><Line {...config} />
        </Wrapper>);
};

export default LineWidget