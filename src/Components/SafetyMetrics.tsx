/* IMPORT EXTERNAL MODULES */
import {FC} from 'react'
import styled from "styled-components";
import { DualAxes } from '@ant-design/plots';

/* IMPORT INTERNAL MODULES */
import { formatValue } from '../utils/utils';

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
        data: [props.data, props.data],
        animation: false,
        color: ['#477EB7', '#5AC5BF', '#46AD75'],
        xField: 'date',
        point: {
            style: () => {
                let config = {
                    fill: 'white',
                    lineWidth: 3
                }
                return config;
            },
        },
        // First is column, second is line.
        yField: ['incidents', 'trir'],
        yAxis: {
            incidents: {
                // Chart values for value label
                label: {
                    formatter: (v: string) => formatValue(+v),
                },
                tickInterval: 1,
                title: {
                    style: {
                    fontSize: 12,
                    },
                    text: "Number of Recordable Incidents"
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
                point: {
                    lineWidth: 2,
                    shape: 'dot',
                    size: 5,
                },
            },
        ],
        tooltip: {
            formatter: (data: any) => {
                let name = (data.incidents || data.incidents === 0 ) ? "# of Recordable Incidents" : "Total Recordable Incident Rate"
                return { name: name, value: (data.incidents || data.trir || 0).toLocaleString() };
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