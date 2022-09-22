import {FC} from "react"
import styled from "styled-components";
import { DualAxes } from '@ant-design/plots';

interface StackedBarMultiLineWidgetProps {
    data: {[key: string]: any}
}

/*
    Developing a game plan:
    - Currently the data doesn't divide based on Basin, I might want to discuss with Matt on how we could pull this off.
*/

const StackedBarMultiLineWidget: FC<StackedBarMultiLineWidgetProps> = props => {
    const Wrapper = styled.div`
        background: #fff;
        padding: 20px;
        grid-column: 1 /5;
        @media (min-width: 767px) {
            grid-column: 1/5
        }
    `

    // This will be our temporary data for now.
    const dataSource = [
        {
            intensity: 0.0006961975859919857,
            name: 'GHG Emissions (CO2e)',
            type: 2019,
            value: 72237.96,
            basin: 'DJ'
        },
        {
            intensity: 0.0009881348544279512,
            name: 'GHG Emissions (CO2e)',
            type: 2020,
            value: 102529.58,
            basin: 'DJ'
        },
        {
            intensity: 0.0017320616792968159,
            name: 'GHG Emissions (CO2e)',
            type: 2021,
            value: 179719.96,
            basin: 'DJ'
        },
        // Change Numbers
        {
            intensity: 0.0007961975859919857,
            name: 'GHG Emissions (CO2e)',
            type: 2019,
            value: 79461.77,
            basin: 'Permian'
        },
        {
            intensity: 0.0010881348544279512,
            name: 'GHG Emissions (CO2e)',
            type: 2020,
            value: 101503.71,
            basin: 'Permian'
        },
        {
            intensity: 0.0018320616792968159,
            name: 'GHG Emissions (CO2e)',
            type: 2021,
            value: 197691.96,
            basin: 'Permian'
        },
    ]

    const config = {
        color: ['#477EB7', '#5AC5BF', '#46AD75'],
        // Second source is for our line(s).
        data: [dataSource, dataSource],
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
                lineStyle: {
                    lineWidth: 1,
                },
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
        },
        // This is how we add text to the hover. We will need to update this later.
        tooltip: {
            formatter: (data: any) => {
                // let name = data.intensity ? props.lineLabel : props.colLabel
                return { name: data.basin, value: (data.value || data.intensity).toLocaleString() };
            },
        },
    }
    return (
        <Wrapper>
            <DualAxes {...config} />
        </Wrapper>
    ) 
}

export default StackedBarMultiLineWidget