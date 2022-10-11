import {FC} from 'react'
import styled from "styled-components";
import { DualAxes } from '@ant-design/plots';

/*
    Tasks:
    - Get hours worked from database
    - Get recordable incidents from database
    - create calculation for incidents
    - Display results on graph
*/

const Wrapper = styled.div`
background: #fff;
padding: 20px;
grid-column: 1 /5;
@media (min-width: 767px) {
  grid-column: 1/5
}
`

const SafetyMetrics: FC = () => {
    // const config = {
    //     // First index is for column, second is for line.
    //     data: [props.data, props.data],
    //     animation: false,
    //     // Point on line. Needs adjustment
    //     point: {
    //         style: () => {
    //         let config = {
    //             fill: 'white',
    //             lineWidth: 2
    //         }
    //         return config;
    //         },
    //     },
    //     color: ['#477EB7', '#5AC5BF', '#46AD75'],
    //     // Date (depends on how stored in database)
    //     xField: 'type',
    //     // First is column, second is line.
    //     yField: ['value', 'intensity'],
    //     yAxis: {
    //         value: {
    //             tickCount: 5,
    //             title: {
    //                 style: {
    //                 fontSize: 12,
    //                 },
    //                 text: props.y1Lablel
    //             },
    //             // Chart values for value label
    //             label: {
    //                 formatter: (v: string) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
    //             },
    //         },
    //         intensity: {
    //             min: 0,
    //             max: props.lineMax,
    //             tickCount: 5,
    //             title: {
    //                 style: {
    //                 fontSize: 12,
    //                 },
    //                 text: props.y2Lablel
    //             },
    //         },
    //     },
    //     legend: {
    //         flipPage: false,
    //     },
    //     geometryOptions: [
    //         {
    //             geometry: 'column',
    //         },
    //         {
    //             geometry: 'line',
    //                 lineStyle: {
    //                     lineWidth: 2,
    //                 },
    //         },
    //     ],
    //     // I belive this is when we hover over it.
    //     tooltip: {
    //         formatter: (data: any) => {
    //             let name = data.intensity ? props.lineLabel : props.colLabel
    //             return { name: name, value: (data.value || data.intensity).toLocaleString() };
    //         },
    //     },
    // }
    return (
        <Wrapper>
            <h3>Total Recordable Incident Rate</h3>
            {/* <DualAxes {...config} /> */}
            <div>Testing</div>
        </Wrapper>
    )
}

export default SafetyMetrics