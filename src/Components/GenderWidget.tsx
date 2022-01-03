import styled from "styled-components";
import {Pie} from "@ant-design/charts";

const Wrapper = styled.div`
  background: #fff;
  padding: 20px;
  width: 40%;
`

const GenderWidget = () => {
    const data = [
        {type: 'Male', value: 100},
        {type: 'Female', value: 34}
    ];


    return (
        <Wrapper>
            <h2>Gender in the workplace</h2>
            <Pie angleField={'value'} colorField={'type'}
                 appendPadding={10}
                 radius={0.75}

                 label={{
                     type: 'spider',
                     labelHeight: 40,
                     content: '{percentage}\n{name} Emp.',

                 }} data={data}/>
        </Wrapper>
    )
}

export default GenderWidget