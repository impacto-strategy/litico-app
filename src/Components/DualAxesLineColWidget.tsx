import { FC } from 'react';
import styled from "styled-components";
import { DualAxes } from '@ant-design/plots';

const Wrapper = styled.div`
  background: #fff;
  padding: 20px;
  width: 62%;
`

const DualAxesLineColWidget: FC<{ data: any, lineLabel: string, title: string }> = props => {
  const config = {
    data: [props.data, props.data],
    color: ['#477EB7', '#5AC5BF', '#46AD75'],
    xField: 'type',
    yField: ['value', 'intensity'],
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