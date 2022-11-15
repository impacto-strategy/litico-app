import { FC, useState, useEffect } from 'react';
import { Column, ColumnConfig } from "@ant-design/charts";
import styled from "styled-components";
import { Modal, Table } from 'antd';
import { sortBy } from 'lodash';

const ColumnWidget: FC<{ data: any, title: string, includeModal: boolean, modalTitle: string, gridColumns: string }> = props => {
    const Wrapper = styled.div`
        background: #fff;
        padding: 20px;
        grid-column: 1 /5;
        @media (min-width: 767px) {
            grid-column: ${props.gridColumns}
        }
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
          title: 'Complaintant',
          dataIndex: 'complaintant',
          key: 'complaintant',
        },
        {
          title: 'Link',
          dataIndex: 'url',
          key: 'url',
            render: (data: any) => <a href={`${data}`} target='blank'>See complaint</a>
        },
    ];

    const showModal = () => {
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    useEffect(() => {
        if (drillDownData.length > 0) showModal();
    }, [drillDownData]);

    const config: ColumnConfig = {
        data: props.data,
        animation: false,
        color: ['#477EB7', '#5AC5BF', '#46AD75'],
        xField: 'type',
        yField: 'value',
        seriesField: 'name',
        legend:{
          position: 'top-right',
          itemName: {
            formatter: (text: string, item: any, index: number) => {
                return text + ' - DJ Basin';
            }}
        },
        label:{
            layout: [
                {
                    type: 'hide-overlap',
                },
            ],
            style: {
                textAlign: 'center',
            },
            formatter: (text) => text.name === 'intensity' ? text.value.toFixed(4) : text.value
        },
        tooltip: {
            formatter: (data: any) => {
                return {name: data.name + ' - DJ Basin', value: data.value}
            },
        },
        onReady: (plot: any) => {
            if (props.includeModal) {
                plot.on('interval:click', (args: any) => {
                    let elements = sortBy(args.data.data.items, function(em:any) {
                        return new Date(em.date);
                      });
                    setDrillDownData(elements);
              });
            }
        }
    };
    return (
        <Wrapper>
            <h3>
                {props.title}
            </h3>
            <Column style={{ height: 500 }} {...config} />
            {props.includeModal &&
                <Modal title={props.modalTitle} open={isModalVisible} onOk={closeModal} onCancel={closeModal} width={1000}>
                    <Table dataSource={drillDownData} columns={columns} />
                </Modal>
            }
        </Wrapper>
    )
}

export default ColumnWidget