import { FC } from 'react';
import styled from "styled-components";
import { DualAxes } from '@ant-design/plots';


const DualAxesLineColWidget: FC<{ data: any, lineLabel: string, title: string, width: string, y1Lablel: string, y2Lablel: string }> = props => {
  const Wrapper = styled.div`
    background: #fff;
    padding: 20px;
    width: ${props.width}%;
  `
  const config = {
    data: [props.data, props.data],
    color: ['#477EB7', '#5AC5BF', '#46AD75'],
    xField: 'type',
    yField: ['value', 'intensity'],
    yAxis: {
      value: {
        title: { text: props.y1Lablel }
      },
      intensity: {
        title: { text: props.y2Lablel }
      }
    },
    geometryOptions: [
      {
        geometry: 'line',
        lineStyle: {
          lineWidth: 2,
        },
      },
      {
        geometry: 'column',
        pattern: {
          type: 'line',
        },
      },
    ],
    tooltip: {
      formatter: (data: any) => {
        let name = data.intensity ? 'Intensity' : props.lineLabel
        return { name: name, value: (data.value || data.intensity).toLocaleString() };
      },
    },
    meta: {
      value: {
        alias: props.lineLabel,
      },
      intensity: {
        alias: 'Intensity'
      },
    },
  };
  return (
    <Wrapper>
      <h2>
        {props.title}
      </h2>

      <DualAxes {...config} />
    </Wrapper>
  )
};

export default DualAxesLineColWidget