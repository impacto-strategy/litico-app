import styled from "styled-components";
import {Bar, BarConfig} from "@ant-design/charts";

const dataSource = [
    {
        label: 'Natural Gas Pneumatic Devices',
        value: 65.0
    },
    {
        label: 'Natural Gas Driven Pneumatic Pumps',
        value: 38.4

    },
    {
        label: 'Dehydrators',
        value: 291.1
    },
    {
        label: 'Completions and Workovers with Hydraulic Fracturing',
        value: 10.7
    },
    {
        label: 'Atmospheric Storage Tanks',
        value: 1356.0

    },
    {
        label: 'Reciprocating Compressors',
        value: 0.8

    },
    {
        label: 'Equipment Leaks Surveys and Population Counts',
        value: 3.1

    },
    {
        label: 'Combustion Equipment',
        value: 41876.3
    }
]

const Wrapper = styled.div`
  background: #fff;
  padding: 20px;

  width: 40%;
`


const Emissions2020CO2 = () => {
    const config: BarConfig = {
        data: dataSource,
        xField: 'value',
        yField: 'label',
        seriesField: 'label',
        legend: false,
    };
    return (
        <Wrapper>
            <h2>
                Carbon Dioxide Emissions for Production
            </h2>

            <Bar {...config} />
        </Wrapper>
    )
}

export default Emissions2020CO2