import {FC} from "react"
import styled from "styled-components";
import {Bar} from "@ant-design/plots";
import { filter, sumBy } from "lodash";

const StackedBarWidget: FC<{ isGroup: boolean, isPercentage: boolean, label: string, gridColumns: string, subTitle: string, title: string, data: any }> = props => {
  const config = {
    data: props.data,
    isStack: true,
    isGroup: props.isGroup,
    colorField: 'type',
    color: ['#477EB7', '#5AC5BF', '#46AD75'],
    xField: 'value',
    yField: 'label',
    seriesField: 'type',
    isPercent: props.isPercentage,
    legend: {
      itemValue: {
        formatter: (val: any) => {
          if (props.label === 'currency') {
            let total = sumBy(filter(props.data, { 'type': val }), 'value');
            return `(${total.toLocaleString("en-US", {style:'currency', currency:'USD'})})`;
          }
        },
      },
    },
    meta: {
      value: {
        formatter: (val: any) => {
          if (props.label === 'currency') {
            return `${val.toLocaleString("en-US", {style:'currency', currency:'USD'})}`
          }

          if (props.label === 'percentage') {
            return `${(val * 100).toFixed()}%`
          }

          return val;
        },
      },
    },
    tooltip: {
      formatter: (data: any) => {
        let val = data.value
        let label = data.type

        if (props.label === 'currency') {
          val = `${val.toLocaleString("en-US", {style:'currency', currency:'USD'})}`
        }

        if (props.label === 'percentage') {
          val = `${(val * 100).toFixed()}%`
        }

        if (props.isGroup) label = data.label
        return { name: label, value: val };
      },
    }
  }

  const Wrapper = styled.div`
    background: #fff;
    padding: 20px;
    grid-column: ${props.gridColumns}
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