import React from 'react';
import {Line, LineConfig} from "@ant-design/charts";
import styled from "styled-components";

const Wrapper = styled.div`
  background: #fff;
  padding: 20px;
  width: 46%;
`

const COLOR_PLATE_10 = [

    '#F6BD16',
    '#E8684A',
    '#6DC8EC',
    '#9270CA',
    '#FF9D4D',
    '#269A99',
    '#FF99C3',
];

const data = [
    {
        "name": "Methane Emissions (CH4)",
        "year": "2018",
        "Metric Tons": 27958
    }, {
        "name": "Methane Emissions (CH4)",
        "year": "2019",
        "Metric Tons": 30370
    }, {
        "name": "Methane Emissions (CH4)",
        "year": "2020",
        "Metric Tons": 12986
    }

]

const DemoLine = () => {

    const config: LineConfig = {
        data,
        xField: 'year',
        yField: 'Metric Tons',
        seriesField: 'name',
        color: ['#477EB7', '#5AC5BF', '#46AD75'],
        xAxis: {
            tickCount: 8,
            title: {
                text: 'Year',
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
        },
        yAxis: {
            label: {
                autoRotate: false,
                style: {
                    fill: '#aaa',
                    fontSize: 12,
                },
                formatter: (v: any) => `${(v / 10e2).toFixed(1)} K`,

            },
            title: {
                text: 'Metric Tons (CH4)',
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
            max: 50000,
        },
        // label
        label: {
            layout: [
                {
                    type: 'hide-overlap',
                },
            ],
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
        animation: false
    };

    return (
        <Wrapper>
            <h2>
                Methane Emissions
            </h2><Line {...config} />
        </Wrapper>);
};

export default DemoLine