import {FC} from "react"
import styled from "styled-components";
import {Pie} from "@ant-design/plots";

const PieWidget: FC<{ label: string, width: string, subTitle: string, title: string, data: any }> = props => {
  const config = {
    data: props.data,
    angleField: 'value',
    colorField: 'type',
    color: ['#477EB7', '#5AC5BF', '#46AD75', '#8f46ad'],
    tooltip: {
      formatter: (val: any) => {
        return { name: val.type, value: `${val.value} Employees` };
      },
    },
    label: {
      type: 'inner',
      offset: '-30%',
      content: (val: any) => `${(val.percent * 100).toFixed(0)}%`,
      style: {
        textAlign: 'center',
      },
    },
  }

  const Wrapper = styled.div`
    background: #fff;
    padding: 20px;
    width: ${props.width};
  `

  return (
      <Wrapper>
          <h2>{props.title}</h2>
          <h4>{props.subTitle}</h4>
          <Pie {...config} />
      </Wrapper>
  )
}

export default PieWidget