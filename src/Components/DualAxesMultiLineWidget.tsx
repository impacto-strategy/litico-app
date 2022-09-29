import { FC } from 'react';
import { DualAxes} from "@ant-design/charts";
import styled from "styled-components";
import {filter} from "lodash";

/* IMPORT INTERNAL MODULES */
import { formatValue } from '../utils';

interface DualAxesMultiLineWidgetProps {
    // Look to cleaning this interface property.
    data: any
    gridColumns: string,
    title: string
}

const Wrapper = styled.div`
  background: #fff;
  padding: 20px;
`

/**
 * Renders a graph with multiple lines and mulitple Y-axes
 * 
 * @param props - interface above has more details
 * @returns JSX Element that renders an Ant Design graph.
 */
const DualAxesMultiLineWidget: FC<DualAxesMultiLineWidgetProps> = props => {
    const Containter = styled.div`
        grid-column: 1 /5;
        @media (min-width: 767px) {
            grid-column: ${props.gridColumns}
        }
    `

    /**
     * Utility function to adjust values of production data to match specified unit.
     * 
     * @param arr - Production data as array of objects 
     * @param adjustment - Numerical value by which the data needs to be adjusted by.
     * @returns New array of production data.
     */
    const adjustUnits = (arr: {[key: string]: any}[], adjustment: number) => {
        let tempArr = [...arr];
        for (let i = 0; i < arr.length; i++) {
            tempArr[i].amount = tempArr[i].amount / adjustment
        }
        return tempArr
    }

    const adjustData = (data: any) => {
        
        let temp = []
        for(let obj of data) {
            
        }
    }

    console.log("Data at the moment: ", props.data)

    // Configuration options for the graph visuals.
    const config = {
        data: [filter(props.data, (o) => o.product === "oil"), filter(props.data, (o) => o.product === "gas")],
        animation: false,
        xField: 'date',
        yField: ['amount', 'amount'],
        smooth: true,
        yAxis: {
            amount: {
                label: {
                    formatter: (v: string) => formatValue(v),
                },
            }
        },
        legend: {
        },
        // This will be how we customize the line color.
        color: ['#4CE64C', '#FF3399'],
        // point: {
        //     size: 5,
        //     shape: 'diamond',
        //     style: ({ product }: {product: string}) => {
        //         let config = {
        //             fill: 'white',
        //             lineWidth: 2,
        //             stroke: product === 'oil' ? '#4CE64C' : '#FF3399'
        //         }
        //         return config;
        //     },
        // },
        // tooltip: {
        //     formatter: (data: any) => {
        //         const value = formatValue(data.amount)
        //         const name = data.product === 'oil' ? 'Oil (bbls)' : 'Natural Gas (mmscf)'
        //         return { name: name, value: value };
        //     },
        //   },
    };
    return (
        <Containter>
            <Wrapper>
                <h3>
                    {props.title}
                </h3>
                <DualAxes {...config} />
            </Wrapper>
        </Containter>
    )
}

export default DualAxesMultiLineWidget