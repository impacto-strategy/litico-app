import { FC } from 'react';
import { DualAxes } from '@ant-design/plots';

const DualAxesLineColWidget: FC<{ data: any }> = props => {
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
  };
  return <DualAxes {...config} />;
};

export default DualAxesLineColWidget