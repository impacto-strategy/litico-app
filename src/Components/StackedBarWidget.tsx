import {FC } from "react"
import styled from "styled-components";
import {Bar} from "@ant-design/plots";

const StackedBarWidget: FC<{ isGroup: boolean, isPercentage: boolean, label: string, width: string, subTitle: string, title: string, data: any }> = props => {
  const config = {
    data: props.data,
    isStack: true,
    isGroup: props.isGroup,
    xField: 'value',
    yField: 'label',
    seriesField: 'type',
    isPercent: props.isPercentage,
    tooltip: {
      formatter: (data: any) => {
        let val = data.value
        let label = data.type

        if (props.label === 'currency') {
          val = `$${val.toLocaleString("en-US")}`
        }

        if (props.label === 'percentage') {
          val = `${(val * 100).toFixed(2)}%`
        }

        if (props.isGroup) label = data.label
        return { name: label, value: val };
      },
    }
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
          <Bar {...config} />
      </Wrapper>
  )
}

export default StackedBarWidget