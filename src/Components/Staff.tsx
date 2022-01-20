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
        "year": "2017",
    },


    {
        "name": "2018",
        "year": "2018",
        "staff": 736,
        females: 17,
        minority: 208
    }, {
        "name": "2019",
        "year": "2019",
        "staff": 504,
        females: 25,
        minority: 151

    }, {

        "name": "2020",
        "year": "2020",
        "staff": 402,
        females: 50,
        minority: 113
    },
    {
        "year": "2021",
    }

]

const Staff = () => {

    const config: DualAxesConfig = {

        data: [data, data],
        xField: 'year',
        yField: ['minority', 'staff'],
        yAxis: [{
            max: 900, min: 0,
            label: {
                formatter: text => text
            },
            title: {
                text: 'Female and/or Minority'
                ,
                style: {
                    fontSize: 16,
                    lineHeight: 20,

                }
            },
        },
            {
                max: 900, min: 0,
                title: {
                    text: 'Total Staff',
                    style: {
                        fontSize: 16,
                        lineHeight: 20,

                    }
                }
            }],

        geometryOptions: [
            {
                label: {
                    formatter: (datum) => {
                        return `${datum.minority} Females and/or Minorities \n(${(datum.minority/datum.staff *100).toFixed(0)}%)\n`;
                    },
                },
                geometry: 'line',
                smooth: true,
                color: '#29cae4',
                point: {
                    shape: 'circle',
                    size: 4,
                    style: {
                        stroke: '#fff',
                        fill: '#29cae4',
                    },
                },
            },
            {
                geometry: 'line',
                color: '#586bce',
                smooth: true,
                label: {
                    layout: {
                        type: 'hide-overlap'
                    },
                    formatter: (datum) => {
                        return `Total Staff: ${datum.staff}`;
                    },
                },
                point: {

                    shape: 'diamond',
                    size: 4,
                    style: {
                        stroke: '#fff',
                        fill: '#586bce',
                    },
                },
            },
        ],
    };

    return (
        <Wrapper>
            <h2>
                Careers
            </h2>
            <h4>
                Female and/or Minority in Total Workforce
            </h4>
            <DualAxes  {...config} />
        </Wrapper>);
};

export default Staff