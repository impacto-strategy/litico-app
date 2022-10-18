import {Bar, ColumnConfig} from "@ant-design/charts";
import styled from "styled-components";
import { FC } from "react";

/*
    Breaking Down Modal Table:
    - Let's find which module has modal tables and see how it solved the problem.
    
    Breakdown of Modal Table:
    - Each object in the array is being passed a collection of the data.
    
    Gameplan: 
    - Create additional prop with relevant data
    - Pass to table thing.
*/

/**
 * Generates chart with volunteer and charitable contributions for company.
 * 
 * @param props 
 * @returns JSX Element
 */
const DonationsVolunteer: FC<{title: string, data: any, gridCol: string, type: string}> = (props) => {
    const Wrapper = styled.div`
        background: #fff;
        padding: 20px;
        grid-column: 1/5;
        @media (min-width: 767px) {
        grid-column: ${props.gridCol}
        }
    `

    const columns = [
        {
            Title: "Date",
            dataIndex: "date",
            key: "date"
        },
        {
            Title: "Organization",
            dataIndex: "organization",
            key: "organization"
        },
        // Volunteer Hours or Contribution Amount
        {

        }
    ]

    // Temporary data to ensure charts work properly.
    let data;
    if (props.type === "Donations") {
        data = props.data.concat([
            {label: 2022, value: 34567}
        ])
    } else {
        data = props.data
    }
    
    const config: ColumnConfig = {
        data: data,
        color: "#6395f9",
        xField: 'value',
        yField: 'label',
        seriesField: 'label',
        legend: false,
        xAxis: {
            // Adjust label for hours
            label: {
              formatter: (val: any) => {
                if (props.type === "Donations") {
                    return `${(val).substring(0,15)}`
                } else {
                    return val
                }
              },
            },
            title: {
                style: {
                    fontSize: 12,
                },
                text: props.type === "Donations" ? "Donations ($)" : "Time Volunteered (man-hours)"
            },
        },
        meta: {
            value: {
              formatter: (val: any) => {
                    return props.type === "Donations" ? `$${val.toString().replace(/\d{1,3}(?=(\d{3})+$)/g, (s: any) => `${s},`)}` : val
              },
            },
        },
        tooltip: {
            formatter: (data: any) => {
                return {
                    name: data.label + (props.type === "Donations" ? " Donations ($)" : " Volunteer Hours"), 
                    value: props.type === "Donations" 
                        ? data.value.toLocaleString('en-US', {style: 'currency',currency: 'USD'}) 
                        : data.value
                }
            }
        }
    };
    return (
        <Wrapper>
            <h2>
                {props.title}
            </h2>
            <Bar {...config} />
        </Wrapper>
    )
}

export default DonationsVolunteer