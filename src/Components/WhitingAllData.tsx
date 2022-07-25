import React from 'react';
import {Line, LineConfig} from "@ant-design/charts";
import styled from "styled-components";

const Wrapper = styled.div`
  background: #fff;
  padding: 20px;
  width: 46%;
`

const data = [
    {
        "name": "GHG Emissions (CO2e)",
        "year": "2018",
        "Metric Tons": 2674144
    }, {
        "name": "GHG Emissions (CO2e)",
        "year": "2019",
        "Metric Tons": 3146665
    }, {
        "name": "GHG Emissions (CO2e)",
        "year": "2020",
        "Metric Tons": 1259176
    }

]

const DemoLine = () => {

    const config: LineConfig = {
        data,
        xField: 'year',
        yField: 'Metric Tons',
        seriesField: 'name',
        // yAxis: {
        //     base:10,
        //     label: {
        //         formatter: (v: any) => `${(v / 10e5).toFixed(1)} M`,
        //     },
        // },

        xAxis: {
            nice: true,
            tickCount: 8,
            // 文本标签

            label: {
                // autoRotate: false,
                rotate: Math.PI / 6,
                offset: 10,
                style: {
                    fill: '#aaa',
                    fontSize: 12,
                },
                formatter: (name) => name,
            },
            title: {
                text: 'Year',
                style: {
                    fontSize: 16,
                },
            },
            // 坐标轴线的配置项 null 表示不展示
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
        // Y 轴相关配置
        yAxis: {
            // max: 3000,
            // 文本标签
            label: {
                autoRotate: false,
                style: {
                    fill: '#aaa',
                    fontSize: 14,
                },
                formatter: (v: any) => `${(v / 10e5).toFixed(1)} M`,

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
            max: 5000000,
        },
        // label
        label: {
            layout: [
                {
                    type: 'hide-overlap',
                },
            ],
            style: {
                textAlign: 'right',
            },

            formatter: (item) => item['Metric Tons'].toLocaleString(),
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
                duration: 5000,
            },
        },
    };

    return (
        <Wrapper>
            <h2>
                Greenhouse Gas Emissions
            </h2><Line {...config} />
        </Wrapper>);
};

export default DemoLine