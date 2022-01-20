import React from 'react';
import {DualAxes, DualAxesConfig} from "@ant-design/charts";
import styled from "styled-components";

const Wrapper = styled.div`
  background: #fff;
  padding: 20px;
  width: 62%;
`

const data = [
    {
        "name": "Gross Annual Volume of Flared Gas",
        "year": "2018",
        "value": 17753994,
        "percentage": 16.08
    }, {
        "name": "Gross Annual Volume of Flared Gas",
        "year": "2019",
        "value": 21344480,
        "percentage": 17.82
    }, {
        "name": "Gross Annual Volume of Flared Gas",
        "year": "2020",
        "value": 7074008,
        "percentage": 6.79
    }

]

const DemoLine = () => {

    const config: DualAxesConfig = {

        data: [data, data],
        xField: 'year',

        yField: ['value', 'percentage'],
        yAxis: [{
            label: {
                formatter: (v: any) => `${(v / 10e5).toFixed(1)} M`,
            },
            max: 30000000,
            title: {
                text: 'Gross Annual Volume of Flared Gas (Mcf)',
                style: {
                    fontSize: 16,
                },
            },
        }, {
            max: 30,
            label: {
                formatter: (v: any) => `${v}%`,
            },
            title: {
                text: '% of gas flared per Mcf of gas produced',
                style: {
                    fontSize: 16,
                },
            },
        }],
        geometryOptions: [
            {
                geometry: 'column',
                pattern: {
                    type: 'line',
                },
            },
            {
                geometry: 'line',
                lineStyle: {
                    lineWidth: 4,
                },
            },
        ],

        legend: {
            position: 'top-right',
            itemName: {
                style: {
                    fill: '#000',
                },
                formatter: (name) => name,
            },
        },

    };

    return (
        <Wrapper>
            <h2>
                Flaring
            </h2><DualAxes style={{height: 500}} {...config} />
        </Wrapper>);
};

export default DemoLine