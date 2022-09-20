import styled from "styled-components";
import {Column, ColumnConfig} from "@ant-design/charts";

const dataSource = [
    {
        period: '2017',
        value: 2100,
        label: 'Leaks Detected'
    }, {
        period: '2017',
        value: 75,
        label: 'Inspections'
    },
    {
        period: '2018',
        value: 2075,
        label: 'Leaks Detected'

    }, {
        period: '2018',
        value: 60,
        label: 'Inspections'

    }, {
        period: '2019',
        value: 1900,
        label: 'Leaks Detected'

    }, {
        period: '2019',
        value: 100,
        label: 'Inspections'

    }, {
        period: '2020',
        value: 1750,
        label: 'Leaks Detected'

    }, {
        period: '2020',
        value: 50,
        label: 'Inspections'

    }
]

const Wrapper = styled.div`
  background: #fff;
  padding: 20px;
  grid-column: 1/5;
`


const LDAR = () => {
    const config: ColumnConfig = {
        data: dataSource,
        // isStack: true,
        xField: 'period',
        yField: 'value',
        seriesField: 'label',
        isGroup: true,
        label: {
            position: 'middle',
            layout: [
                {type: 'interval-adjust-position'},
                {type: 'interval-hide-overlap'},
                {type: 'adjust-color'},
            ],
        },
        yAxis: {
            label: {
                formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
            }
        }
    };
    return (
        <Wrapper>
            <h2>
                LDAR Inspections - YoY
            </h2>

            <Column {...config} />

        </Wrapper>
    )
}

export default LDAR