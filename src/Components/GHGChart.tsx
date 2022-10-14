import {FC, useState, useEffect} from "react"
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
    // Stores number of basin in data set
    const [occurrences, setOccurrences] = useState<number>()

    useEffect(() => {
        const result = props.data.reduce( (acc: any, o: any ) => {
             return (acc[o.basin] = (acc[o.basin] || 0)+1, acc)
        }, {} );
        setOccurrences(Object.keys(result).length - 1)
    }, [occurrences, props.data])

    const Wrapper = styled.div`
        background: #fff;
        padding: 20px;
        grid-column: 1 /5;
        @media (min-width: 767px) {
            grid-column: 1/5
        }
    `

    let config = {
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
                isPercent: false,
            },
            {
                color: ['#497cb6', '#218f3d'],
                geometry: 'line',
                point: {
                    lineWidth: 2,
                    shape: 'dot',
                    size: 5,
                },
            },
        ],
        legend: {
            flipPage: false,
            itemName: {
                formatter: (text: string, item: any, index: number) => {
                    let name: string
                    if (occurrences) {
                        if (index > occurrences) {
                            name = `${text}`
                        } else {
                            name = `${text} Emssions (mt CO2-e)`
                        }
                    } else {
                        name = text === "value" ? "Greenhouse Gas Emissions (mt CO2-e)" : "GHG Emissions Intensity (mt/BoE)"
                    }
                    return name;
                }
            }
        },
        limitInPlot: false,
        meta: {
            
        },
        // This is for the modal when we hover over a column/line.
        tooltip: {
            formatter: (data: any) => {
                if (!occurrences) {
                    return { name: data.value ? "Greenhouse Gas Emissions (mt CO₂-e)" : "GHG Emission Intensity (mt/BoE)", value: (data.value || data.intensity || '').toLocaleString() }
                } else {
                    if (data.basin) {
                        return { name: `${data.basin} Emissions (mt CO₂-e)`, value: data.value.toLocaleString() };
                    } else {
                        return { name: data.label, value: data.intensity.toLocaleString() };
                    }
                }
            },
        },
    }

    // Only adds these to config if data by basin is available
    if(occurrences && occurrences > 0) {
        Object.assign(config.geometryOptions[0], {isStack: false, seriesField: 'basin',})
        Object.assign(config.geometryOptions[1], {seriesField: 'label'})
    }
    
    return (
        <Wrapper>
        <h3>
            Greenhouse Gas Emissions Volume & Intensity
        </h3>
        <DualAxes {...config} />
      </Wrapper>
    ) 
}

export default GHGChart