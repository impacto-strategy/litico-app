import { FC } from 'react';
import { Column, ColumnConfig } from "@ant-design/charts";
import styled from "styled-components";


const Wrapper = styled.div`
  background: #fff;
  padding: 20px;
  width: 30%;
`

const ColumnWidget: FC<{ data: any, title: string }> = props => {
    const config: ColumnConfig = {
        data: props.data,
        color: ['#477EB7', '#5AC5BF', '#46AD75'],
        xField: 'type',
        yField: 'value',
        seriesField: 'name',
        legend:{
          position: 'top-right'
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
            formatter: (text) => {
                let value = text.name === 'intensity' ? text.value.toFixed(4) : text.value
                return { name: text.name, value: value }
            }
        }
    };
    return (
        <Wrapper>
            <h2>
                {props.title}
            </h2>
            <Column style={{height: 500}} {...config} />
        </Wrapper>
    )
}

export default ColumnWidget