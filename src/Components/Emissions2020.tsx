import styled from "styled-components";
import {Pie, PieConfig} from "@ant-design/charts";

const dataSource = [
    {
        label: 'Natural Gas Pneumatic Devices',
        value: 684.6
    },
    {
        label: 'Natural Gas Driven Pneumatic Pumps',
        value: 419.1
    },
    {
        label: 'Dehydrators',
        value: 102.1
    },
    {
        label: 'Completions and Workovers with Hydraulic Fracturing',
        value: 0.1
    },
    {
        label: 'Atmospheric Storage Tanks',
        value: 55.2

    },
    {
        label: 'Reciprocating Compressors',
        value: 5.5

    },
    {
        label: 'Equipment Leaks Surveys and Population Counts',
        value: 34.9
    },
    {
        label: 'Combustion Equipment',
        value: 31.5
    }
]

const Wrapper = styled.div`
  background: #fff;
  padding: 20px;
  grid-column: 1/5;
  @media (min-width: 767px) {
    grid-column: 3/5;
  }
`


const Emissions2020 = () => {
    const config: PieConfig = {
        appendPadding: 10,
        data: dataSource,
        angleField: 'value',
        colorField: 'label',
        radius: 0.9,
        label: {
            type: 'inner',
            labelHeight: 40,
            content: (_ref) => {
                const percent = _ref.percent;
                return ''.concat((percent * 100).toFixed(0), '%');
            },
            style: {
                fontSize: 14,
                textAlign: 'center',
            },
        },
        interactions: [{type: 'element-active'}],
    };
    return (
        <Wrapper>
            <h3>
                Methane Emissions for Production
            </h3>

            <Pie {...config} />
        </Wrapper>
    )
}

export default Emissions2020