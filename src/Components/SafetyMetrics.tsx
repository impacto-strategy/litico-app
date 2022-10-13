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

/**
 * Renders a bar chart that displays incidents and TRIR.
 * 
 * @param props - object of mixed types
 * - Data: Array of Objects
 * 
 * @returns JSX element that renders a bar chart
 */
const SafetyMetrics: FC<{data: any}> = (props) => {
    const config = {
        // First index is for column, second is for line.
        data: [props.data, props.data],
        animation: false,
        // Point on line. Needs adjustment

        color: ['#477EB7', '#5AC5BF', '#46AD75'],
        // Date (depends on how stored in database)
        xField: 'date',
        // First is column, second is line.
        yField: ['incidents', 'trir'],
        yAxis: {
            incidents: {
                tickCount: 5,
                title: {
                    style: {
                    fontSize: 12,
                    },
                    text: "Number of Recordable Incidents"
                },
                // Chart values for value label
                label: {
                    formatter: (v: string) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
                },
            },
            trir: {
                min: 0,
                // max: ,
                tickCount: 5,
                title: {
                    style: {
                    fontSize: 12,
                    },
                    text: "TRIR (Incidents per 100 Full-Time Workers)"
                },
            },
        },
        legend: {
            flipPage: false,
            itemName: {
                formatter: (text: string, item: any, index: number) => 
                    text === 'incidents'
                        ? `Number of Recordable Incidents`
                        : `TRIR`
            }
        },
        limitInPlot: false,
        geometryOptions: [
            {
                geometry: 'column',
            },
            {
                geometry: 'line',
                lineStyle: {
                    lineWidth: 3,
                },
                point: {
                    style: () => {
                    let config = {
                        fill: '#5AC5BF',
                        lineWidth: 2,
                        stroke: '#5AC5BF'
                    }
                    return config;
                    },
                },
            },
        ],
        // I belive this is when we hover over it.
        tooltip: {
            formatter: (data: any) => {
                let name = data.incidents ? "# of Recordable Incidents" : "TRIR"
                return { name: name, value: (data.incidents || data.trir).toLocaleString() };
            },
        },
    }
    return (
        <Wrapper>
            <h3>Total Recordable Incident Rate for All Workers</h3>
            <DualAxes {...config} />
        </Wrapper>
    )
}

export default SafetyMetrics