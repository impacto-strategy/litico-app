import {FC} from "react"
import styled from "styled-components";
import { DualAxes } from '@ant-design/plots';

// Will need to adjust interface.
interface GHGChartProps {
    data: any
}

/**
 * Renders to a chart with stacked bars representing Greenhouse Gas Emissions
 * Volume by basin and multiple lines representing Greenhouse Gas Emissions
 * intensity by basin. Might consider making this more general purpose later.
 *
 * @param props - React Component Props.
 * @returns React Component that renders Ant Design graph
 *
 */
const GHGChart: FC<GHGChartProps> = props => {

    const Wrapper = styled.div`
        background: #fff;
        padding: 20px;
        grid-column: 1 /5;
        @media (min-width: 767px) {
            grid-column: 1/5
        }
    `

    const config = {
        color: ['#477EB7', '#5AC5BF', '#46AD75'],
        // Second source is for our line(s).
        data: [props.data, props.data],
        xField: 'type',
        yField: ['value', 'intensity'],
        yAxis: {
            intensity: {
                min: 0,
                title: {
                    style: {
                        fontSize: 12,
                    },
                    text: "GHG Emission Intensity (mt/BoE)"
                },
            },
            value: {
                label: {
                    formatter: (v: string) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
                },
                min: 0,
                title: {
                    style: {
                        fontSize: 12,
                    },
                    text: "Greenhouse Gas Emissions (mt CO₂-e)"
                },
            }
        },
        geometryOptions: [
            {
                geometry: 'column',
                isStack: true,
                isPercent: false,
                // How we seperate the columns
                seriesField: 'basin',
            },
            {
                geometry: 'line',
                point: {
                    shape: 'dot',
                    size: 5,
                },
                // How we seperate the lines
                seriesField: 'basin',
            },
        ],
        legend: {
            flipPage: false,
            itemName: {
                formatter: (text: string, item: any, index: number) => {
                    let name: string;
                    if (index > 1) {
                        name = `${text} Intensity`
                    } else {
                        name = `${text} Emission Volume`
                    }
                    return name
                }
            }
        },
        meta: {
            
        },
        // This is for the modal when we hover over a column/line.
        tooltip: {
            formatter: (data: any) => {
                return { name: data.basin, value: (data.value || data.intensity).toLocaleString() };
            },
        },
    }
    return (
        <Wrapper>
        <h3>
          {/* {props.title} */}
        </h3>
        <DualAxes {...config} />
      </Wrapper>
    ) 
}

export default GHGChart