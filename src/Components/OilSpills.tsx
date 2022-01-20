import {Column, ColumnConfig} from "@ant-design/charts";
import styled from "styled-components";

const dataSource = [
    {
        name: 'Spill Intensity',
        year: '2018',
        value: 0.015
    },
    {        name: 'Spill Intensity',

        year: '2019',
        value: 0.003
    },
    {
        name: 'Spill Intensity',

        year: '2020',
        value: 0.007
    }
]


const Wrapper = styled.div`
  background: #fff;
  padding: 20px;
  width: 30%;
`

const OilSpills = () => {
    const config: ColumnConfig = {
        data: dataSource,
        xField: 'year',
        yField: 'value',
        seriesField: 'name',
        legend:{
          position: 'top-right'
        },
        label:{
            layout: [
                {
                    type: 'hide-overlap',
                },
            ],
            style: {
                textAlign: 'center',
            },
            formatter: (text) => text.value + '%'
        },
        color: [ '#E8684A', '#F6BD16'],
        conversionTag: {},

        yAxis: {
            title:{
                text: 'Produced Liquids Spilled (Bbl)/\n' +
                    'Total Produced Liquids (MBbl)',
                style: {
                    fontSize: 16,
                    lineHeight: 20,

                },
            },
            max:0.025,
            label: {
                autoHide: false,
                autoRotate: false,
                formatter: (text) => `${text}%`
            },
        },

    };
    return (
        <Wrapper>
            <h2>
                Spills
            </h2>
            <Column style={{height: 500}} {...config} />
        </Wrapper>
    )
}

export default OilSpills