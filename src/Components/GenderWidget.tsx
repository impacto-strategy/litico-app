import styled from "styled-components";
import {Pie, PieConfig} from "@ant-design/charts";

const Wrapper = styled.div`
  background: #fff;
  padding: 20px;
  width: 32%;
`

const GenderWidget = () => {
    const data = [
        {type: 'Male', value: 72},
        {type: 'Female', value: 28}
    ];
    const config: PieConfig = {
        angleField: 'value',
        colorField: 'type',
        radius: 0.75,
legend: false,
        label: {
            type: 'inner',
            autoRotate:false,
            offset: '-50%',
            content: ({ percent, type }) => `${(percent * 100).toFixed(0)}% ${type}\nEmployees`,

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
            <Pie {...config} />
        </Wrapper>
    )
}

export default GenderWidget