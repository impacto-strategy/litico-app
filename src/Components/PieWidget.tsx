import {FC} from "react"
import styled from "styled-components";
import {Pie, PieConfig} from "@ant-design/plots";

const PieWidget: FC<{ label: string, gridColumns: string, subTitle: string, title: string, data: any }> = props => {
  const config: PieConfig = {
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
      content: (val: any) => `${(val.percent * 100).toFixed(0)}%`,
      style: {
        textAlign: 'center',
      },
    },
    legend: {
      position: 'left-top'
    },
  }

  const Wrapper = styled.div`
    background: #fff;
    padding: 20px;
    grid-column: 1 /5;
    @media (min-width: 767px) {
      grid-column: ${props.gridColumns}
    }
  `

  return (
      <Wrapper>
          <h3>{props.title}</h3>
          <h4>{props.subTitle}</h4>
          <Pie {...config} />
      </Wrapper>
  )
}

export default PieWidget