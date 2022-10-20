/* IMPORT EXTERNAL MODULES */
import {Bar, ColumnConfig} from "@ant-design/charts";
import styled from "styled-components";
import { FC, useState, useEffect } from "react";
import { Modal, Table } from 'antd';
import { filter } from "lodash";

/* IMPORT INTERNAL MODULES */
import { extractYear } from "../utils";

/**
 * Generates chart with volunteer and charitable contributions for company.
 * 
 * @param props 
 * @returns JSX Element
 */
const DonationsVolunteer: FC<{title: string, data: any, gridCol: string, type: string, tableData: any}> = (props) => {
    const Wrapper = styled.div`
        background: #fff;
        padding: 20px;
        grid-column: 1/5;
        @media (min-width: 767px) {
            grid-column: ${props.gridCol}
        }
    `

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [drillDownData, setDrillDownData] = useState<any>([]);

    const columns = [
        {
            title: "Date",
            dataIndex: "date",
            key: "date"
        },
        {
            title: "Organization",
            dataIndex: "organization",
            key: "organization"
        },
        // Volunteer Hours or Contribution Amount
        {
            title: props.type === "Donations" ? "Donations ($)" : "Volunteer Hours",
            dataIndex: "value",
            key: "value"
        }
    ]

    useEffect(() => {
        if (drillDownData.length > 0) showModal();
      }, [drillDownData]);
    
      const showModal = () => {
        setIsModalVisible(true);
      };
    
      const closeModal = () => {
        setIsModalVisible(false);
      };
    
    const config: ColumnConfig = {
        data: props.data,
        color: "#6395f9",
        xField: 'value',
        yField: 'label',
        seriesField: 'label',
        legend: false,
        xAxis: {
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
                        : data.value + " Hours"
                }
            }
        },
        onReady: (plot: any) => {
            if (props.tableData) {
                plot.on('interval:click', (args: any) => {
                    // Filters by individual bar date then adjusts data for table.
                    setDrillDownData(filter(props.tableData, (o: any) => {
                        if (extractYear(o.date) === args.data.data.label.toString()) {
                            return o.date
                        }
                    })
                    // Data gets revamped for better presentation
                    .map((obj: any) => ({
                        date: extractYear(obj.date),
                        organization: obj.organization,
                        // Needs to be revamped for hours as well.
                        value: props.type === "Donations" 
                        ? obj.value.toLocaleString('en-US', {style: 'currency',currency: 'USD'}) 
                        : obj.value + " Hours"
                    })))
                });
            }
        }
    };
    return (
        <Wrapper>
            <h2>
                {props.title}
            </h2>
            <Bar {...config} />
            {props.tableData &&
                <Modal title={props.type === "Donations" ? "Contributions by Organization" : "Hours by Organization"} open={isModalVisible} onOk={closeModal} onCancel={closeModal} width={1000}>
                    <Table dataSource={drillDownData} columns={columns} />
                </Modal>
            }

        </Wrapper>
    )
}

export default DonationsVolunteer