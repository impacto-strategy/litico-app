/* IMPORT EXTERNAL MODULES */
import styled from "styled-components";
import { DualAxes } from '@ant-design/plots';

/* IMPORT INTERNAL MODULES */
import { formatValue } from "../utils";

const dataSource = [
    {
        period: '2017',
        leaks: 2100, // Leaks Detected
        inspections: 75, // Inspections
    },
    {
        period: '2018',
        leaks: 2075,
        inspections: 60,
    }, {
        period: '2019',
        leaks: 1900,
        inspections: 100,
    }, {
        period: '2020',
        leaks: 1750,
        inspections: 50,
    }
]

const Wrapper = styled.div`
  background: #fff;
  padding: 20px;
  grid-column: 1/5;
`

const LDAR = () => {

    const config ={
        data: [dataSource, dataSource],
        xField: 'period',
        yField: ['leaks', 'inspections'],
        yAxis: {
            leaks: {
                label: {
                    formatter: (v: string) => formatValue(+v),
                },
            },
            inspections: {
                min: 0,
                max: 125,
                label: {
                    formatter: (v: string) => formatValue(+v),
                }
            }
        },
        legend: {
            itemName: {
                formatter: (v: string) => {
                    return v === 'leaks' ? 'Leaks Detected' : 'Inspections'
                }
            }
        },
        geometryOptions: [
            {
              geometry: 'column',
            },
            {
                geometry: 'line',
                lineStyle: {
                    lineWidth: 0,
                },
                point: {
                    size: 5,
                    shape: 'dot',
                    style: {
                        fill: '#f05b72',
                        stroke: '#f05b72',
                        lineWidth: 2,
                    },
                },
                color: '#f05b72'
            },
        ],
        tooltip: {
            formatter: (data: any) => {
                let val = data.hasOwnProperty('leaks') ? data.leaks : data.inspections
                val = `${val}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`)
                const name = data.hasOwnProperty('leaks') ? 'Leaks Detected' : 'Inspections'
                return { name: name, value: val };
            },
        },
    }

    return (
        <Wrapper>
            <h2>
                LDAR Inspections - YoY
            </h2>

            <DualAxes {...config} />

        </Wrapper>
    )
}

export default LDAR