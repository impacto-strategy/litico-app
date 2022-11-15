// IMPORT EXTERNAL MODULES
import { FC, useState, useEffect } from 'react';
import styled from "styled-components";
import { DualAxes } from '@ant-design/plots';
import { Modal, Table } from 'antd';
import {sortBy} from 'lodash'

const DualAxesLineColWidget: FC<{ data: any, colLabel:string, lineLabel: string, title: string, gridColumns: string, y1Lablel: string, y2Lablel: string, includeModal: boolean}> = props => {
  const Wrapper = styled.div`
    background: #fff;
    padding: 20px;
    grid-column: 1 /5;
    @media (min-width: 767px) {
      grid-column: ${props.gridColumns}
    }
  `

  // React State
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
    point: {
      style: () => {
        let config = {
            fill: 'white',
            lineWidth: 3
        }
        return config;
      },
    },
    color: ['#477EB7', '#5AC5BF', '#46AD75'],
    xField: 'type',
    yField: ['value', 'intensity'],
    yAxis: {
      value: {
        tickCount: 5,
        title: {
          style: {
            fontSize: 12,
          },
          text: props.y1Lablel
        },
        label: {
          formatter: (v: string) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
        },
      },
      intensity: {
        min: 0,
        tickCount: 5,
        title: {
          style: {
            fontSize: 12,
          },
          text: props.y2Lablel
        },
      },
    },
    legend: {
      flipPage: false,
      itemName: {
        formatter: (text: string, item: any, index: number) => {
          console.log("This is text: ", text);
          console.log("This is item: ", item);
          console.log("What about index?", index);
          return text;
        }
    }
    },
    geometryOptions: [
      {
        geometry: 'column',
      },
      {
        geometry: 'line',
        lineStyle: {
          lineWidth: 3,
        },
      },
    ],
    tooltip: {
      formatter: (data: any) => {
        let name = (data.intensity || data.intensity === 0) ? props.lineLabel : props.colLabel
        return { name: name, value: (data.value || data.intensity).toLocaleString() };
      },
    },
    meta: {
      value: {
        alias: props.colLabel,
      },
      intensity: {
        alias: props.lineLabel,
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
      <h3>
        {props.title}
      </h3>
      <DualAxes {...config} />
      {props.includeModal &&
        <Modal title={props.y1Lablel} open={isModalVisible} onOk={closeModal} onCancel={closeModal} width={1000}>
          <Table dataSource={drillDownData} columns={columns} />
        </Modal>
      }
    </Wrapper>
  )
};

export default DualAxesLineColWidget