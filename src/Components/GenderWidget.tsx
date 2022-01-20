import styled from "styled-components";
import {Pie, PieConfig} from "@ant-design/charts";

const Wrapper = styled.div`
  background: #fff;
  padding: 20px;
  width: 32%;
`

const GenderWidget = () => {
    const data = [
        {type: 'Male', value: 50},
        {type: 'Female', value: 50}
    ];
    const config: PieConfig = {
        angleField: 'value',
        colorField: 'type',
        radius: 0.75,
        legend: false,
        label: {
            type: 'inner',
            autoRotate: false,
            offset: '-50%',
            content: ({percent, type}) => `${(percent * 100).toFixed(0)}% ${type}\nDirectors`,

            style: {
                fontSize: 16,
                textAlign: 'center',
            },
        },
        data: data
    }

    return (
        <Wrapper>
            <h2>Gender in the workplace - 2020</h2>
            <h4>% Female Directors that make
                up Independent Board of
                Directors</h4>
            <Pie {...config} />
        </Wrapper>
    )
}

export default GenderWidget