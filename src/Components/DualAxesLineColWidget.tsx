import { FC, useState, useEffect } from 'react';
import styled from "styled-components";
import { DualAxes } from '@ant-design/plots';
import { Modal, Table } from 'antd';
import {sortBy} from 'lodash'

const DualAxesLineColWidget: FC<{ data: any, lineLabel: string, title: string, width: string, y1Lablel: string, y2Lablel: string, includeModal: boolean }> = props => {
  const Wrapper = styled.div`
    background: #fff;
    padding: 20px;
    width: ${props.width}%;
  `

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [drillDownData, setDrillDownData] = useState<any>([]);
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Facility Name',
      dataIndex: 'facility_name',
      key: 'facility_name',
    },
    {
      title: 'Vol Recovered Oil',
      dataIndex: 'vol_recover_oil',
      key: 'vol_recover_oil',
    },
    {
      title: 'Vol Recovered Water',
      dataIndex: 'vol_recover_water',
      key: 'vol_recover_water',
    },
    {
      title: 'Vol Released Oil',
      dataIndex: 'vol_released_oil',
      key: 'vol_released_oil',
    },
    {
      title: 'Vol Released Water',
      dataIndex: 'vol_released_water',
      key: 'vol_released_water',
    },
    {
      title: 'Resolution Date',
      dataIndex: 'resolution_date',
      key: 'resolution_date',
    },
  ];

  useEffect(() => {
    if (drillDownData.length > 0) showModal();
  }, [drillDownData]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const config = {
    data: [props.data, props.data],
    animation: false,
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
    onReady: (plot: any) => {
      if (props.includeModal) {
        plot.on('interval:click', (args: any) => {
          let elements = sortBy(args.data.data.items, function(em:any) {
            return new Date(em.date);
          });
          setDrillDownData(elements)
        });
      }
    }
  };
  return (
    <Wrapper>
      <h2>
        {props.title}
      </h2>
      <DualAxes {...config} />
      {props.includeModal &&
        <Modal title={props.y1Lablel} visible={isModalVisible} onOk={closeModal} onCancel={closeModal} width={1000}>
          <Table dataSource={drillDownData} columns={columns} />
        </Modal>
      }
    </Wrapper>
  )
};

export default DualAxesLineColWidget