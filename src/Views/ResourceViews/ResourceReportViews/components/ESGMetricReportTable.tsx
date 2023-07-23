import {
    Col,
    Drawer,
    message,
    Popconfirm,
    Popover,
    Row,
    Table
} from 'antd';
import {
    DeleteOutlined,
    EditOutlined,
} from '@ant-design/icons';
import { 
    find,
    sortBy
} from 'lodash';
import moment from 'moment';
import { FC, useCallback, useState } from 'react';
import ResourceService from '../../../../Services/ResourceService';
import styled from "styled-components";

import ReportEditForm from './ReportEditForm';
import { getSignedUrl } from '../../../../utils/utils';

const LiticoBlue = styled.span`
    color: rgb(46, 67, 117)
`

const ESGMetricReportTable: FC<any> = ({ getMetric, reportData, searchParams }) => {
    const [id, setId] = useState(0) // Prevents multiple forms from rendering (more efficient)
    const [visible, setVisibility] = useState(false);


    const subMetricColumns = {
        "GHG Emissions": [
            {
                title: 'GHG Emissions',
                dataIndex: 'value',
                key: 'value',
                render: (value:any) => (
                    <span>
                        {value.toLocaleString()}
                    </span>
                ),
            },
            {
                title: 'CO2 Emissions (mt CO2)',
                dataIndex: 'num_1',
                key: 'num_1',
            },
            {
                title: 'CH4 Emissions (mt CH4)',
                dataIndex: 'num_2',
                key: 'num_2',
            },
            {
                title: 'N2O Emissions (mt N2O)',
                dataIndex: 'num_3',
                key: 'num_3',
            },
            {
                title: 'Timeframe',
                dataIndex: '',
                key: '',
                render: (value: any) => (
                    <span>{reportData?.period === 'YR' ? 'Annual' : reportData?.period}</span>
                )
            },
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                render: (value:any) => (
                    <span>
                        {moment(value).format('MM/DD/YYYY')}
                    </span>
                ),
            },
        ],
        "Production - Oil, Gas, Produced Water, Synthetic Oil, Synthetic Gas": [
            {
                title: 'Oil Production',
                dataIndex: 'num_1',
                key: 'num_1'
            },
            {
                title: 'Gas Production',
                dataIndex: 'num_2',
                key: 'num_2'
            },
            {
                title: 'Produced Water Production',
                dataIndex: 'num_3',
                key: 'num_3'
            },
            {
                title: 'Synthetic Oil Production',
                dataIndex: 'num_4',
                key: 'num_4'
            },
            {
                title: 'Synthetic Gas Production',
                dataIndex: 'num_5',
                key: 'num_5'
            },
            {
                title: 'Timeframe',
                dataIndex: '',
                key: '',
                render: (value: any) => (
                    <span>{reportData?.period === 'YR' ? 'Annual' : reportData?.period}</span>
                )
            },
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                render: (value:any) => (
                    <span>
                        {moment(value).format('MM/DD/YYYY')}
                    </span>
                ),
            },
        ],
        "Social Investment": [
            {
                title: 'Organization',
                dataIndex: 'organization',
                key: 'organization'
            },
            {
                title: 'Amount Donated',
                dataIndex: 'denominator',
                key: 'denominator',
                render: (value:any) => (
                    <span>
                        {value.toLocaleString('en-US', {style: 'currency',currency: 'USD'})}
                    </span>
                ),
            },
            {
                title: 'Timeframe',
                dataIndex: '',
                key: '',
                render: (value: any) => (
                    <span>{reportData?.period === 'YR' ? 'Annual' : reportData?.period}</span>
                )
            },
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                render: (value:any) => (
                    <span>
                        {moment(value).format('MM/DD/YYYY')}
                    </span>
                ),
            },
        ],
        "TRIR - Employees": [
            {
                title: 'TRIR Employees',
                dataIndex: 'value',
                key: 'value',
            },
            {
                title: 'Number of Employee Recordable Incidents',
                dataIndex: 'num_1',
                key: 'num_2',
            },
            {
                title: 'Number of Employee Fatalities',
                dataIndex: 'num_2',
                key: 'num_2',
            },
            {
                title: 'Number of Employee Lost Time Incidents',
                dataIndex: 'num_3',
                key: 'num_3',
            },
            {
                title: 'Employee Hours Worked',
                dataIndex: 'denominator',
                key: 'denominator',
            },
            {
                title: 'Timeframe',
                dataIndex: '',
                key: '',
                render: (value: any) => (
                    <span>{reportData?.period === 'YR' ? 'Annual' : reportData?.period}</span>
                )
            },
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                render: (value:any) => (
                    <span>
                        {moment(value).format('MM/DD/YYYY')}
                    </span>
                ),
            },
        ],
        "Employee Volunteering Match": [
            {
                title: 'Organization',
                dataIndex: 'organization',
                key: 'organization'
            },
            {
                title: 'Hours',
                dataIndex: 'num_1',
                key: 'num_1',
            },
            {
                title: 'Employee ID',
                dataIndex: 'employee_id',
                key: 'employee_id',
            },
            {
                title: 'Tax ID',
                dataIndex: 'tax_id',
                key: 'tax_id',
            },
            {
                title: 'Timeframe',
                dataIndex: '',
                key: '',
                render: (value: any) => (
                    <span>{reportData?.period === 'YR' ? 'Annual' : reportData?.period}</span>
                )
            },
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                render: (value:any) => (
                    <span>
                        {moment(value).format('MM/DD/YYYY')}
                    </span>
                ),
            },
        ],
        "Workforce Demographics - Gender": [
            {
                title: 'Total Employees',
                dataIndex: 'value',
                key: 'value',
            },
            {
                title: 'Male',
                dataIndex: 'num_1',
                key: 'num_2',
            },
            {
                title: 'Female',
                dataIndex: 'num_2',
                key: 'num_2',
            },
            {
                title: 'Non-Binary',
                dataIndex: 'num_3',
                key: 'num_3',
            },
            {
                title: 'No Response',
                dataIndex: 'num_4',
                key: 'num_4',
            },
            {
                title: 'Timeframe',
                dataIndex: '',
                key: '',
                render: (value: any) => (
                    <span>{reportData?.period === 'YR' ? 'Annual' : reportData?.period}</span>
                )
            },
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                render: (value:any) => (
                    <span>
                        {moment(value).format('MM/DD/YYYY')}
                    </span>
                ),
            },
        ],
        "Workforce Demographics - Ethnicity": [
            {
                title: 'Total Employees',
                dataIndex: 'value',
                key: 'value',
            },
            {
                title: 'White/Caucasian',
                dataIndex: 'num_1',
                key: 'num_2',
            },
            {
                title: 'Black/African American',
                dataIndex: 'num_2',
                key: 'num_2',
            },
            {
                title: 'Asian/Pacific American',
                dataIndex: 'num_3',
                key: 'num_3',
            },
            {
                title: 'Latino/Hispanics',
                dataIndex: 'num_4',
                key: 'num_4',
            },
            {
                title: 'Native American',
                dataIndex: 'num_5',
                key: 'num_5',
            },
            {
                title: 'Other',
                dataIndex: 'num_6',
                key: 'num_6',
            },
            {
                title: 'Timeframe',
                dataIndex: '',
                key: '',
                render: (value: any) => (
                    <span>{reportData?.period === 'YR' ? 'Annual' : reportData?.period}</span>
                )
            },
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                render: (value:any) => (
                    <span>
                        {moment(value).format('MM/DD/YYYY')}
                    </span>
                ),
            },
        ]
    }


    /**
     * Creates columns for reports based on metric-subtype
     * 
     * @returns Array of Objects
     */
    const determineColumns = (columnOptions: any, metricSubtype: string | null) => {
        const columnExists = metricSubtype ? columnOptions.hasOwnProperty(metricSubtype) : false;
        
        if (columnExists && metricSubtype) {
            return columnOptions[metricSubtype];
        } else {
            const checkIfDiscussion = metricSubtype?.includes('Discussion');
            if (checkIfDiscussion) {
                // Return Discussion Columns
                return [{
                    title: searchParams.get("metric_subtype") || '',
                    dataIndex: 'value',
                    key: 'value',
                    render: (value:any) => (
                        <span>
                            {value > 0 ? 'Policy in place' : 'No policy'}
                        </span>
                    ),
                },
                {
                    title: 'Timeframe',
                    dataIndex: '',
                    key: '',
                    render: (value: any) => (
                        <span>{reportData?.period === 'YR' ? 'Annual' : reportData?.period}</span>
                    )
                },
                {
                    title: 'Date',
                    dataIndex: 'date',
                    key: 'date',
                }]
            } else {
                // Returns Base Columns
                return [{
                        title: metricSubtype || '',
                        dataIndex: 'value',
                        key: 'value'
                    },
                    // We've got a side effect here.
                    {
                        title: 'Timeframe',
                        dataIndex: '',
                        key: '',
                        render: (value: any) => (
                            <span>{reportData?.period === 'YR' ? 'Annual' : reportData?.period}</span>
                        )
                    },
                    {
                        title: 'Date',
                        dataIndex: 'date',
                        key: 'date',
                }]
            }
        }
    }

    /**
     * Determines which columns to generate based on metric-subtype. This function helps when dealing with a component that's dynamic.
     * 
     * @returns Array of Objects representing meta data about columns to render.
     */
    const getColumns = (objectOfColumns: any, metricSubtype: string | null) => {
        let baseColumns = determineColumns(objectOfColumns, metricSubtype)
        // Columns that every option shares in common.
        const additionalColumns = [{
            title: 'Resources',
            dataIndex: 'resources',
            key: 'resources',
            render: (value: any) => (
                <>
                {value?.map((link:string, idx:number) => {
                    return (
                        <a key={link} href={getSignedUrl(link)}>Resource {idx +1} </a>
                    );
                })}
                </>
            ),
        },
        {
            title: 'Source',
            dataIndex: 'source',
            key: 'source',
        },
        {
            title: 'User',
            dataIndex: 'user_name',
            key: 'user_name',
        },
        {
            title: 'Submitted on',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (value:any) => (
                <span>
                    {moment(value).format('MM/DD/YYYY h:mm')}
                </span>
            ),
        },
        {
            title: 'Actions',
            // Gives access to ID for deleting the value.
            dataIndex: 'id',
            key: 'id',
            render: (value: any) => (
                <>
                    <Popconfirm
                        title="Delete This Row?"
                        okText="Delete"
                        // Another side effect
                        onConfirm={(e: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => {
                            handleDelete(e, value)
                        }}
                    >
                        <Popover content="Delete Datapoint">
                            <DeleteOutlined
                                style={{color: 'red'}}
                            />
                        </Popover>
                    </Popconfirm>
                    <Popover content="Edit Report Entry">
                        <LiticoBlue>
                            <EditOutlined
                                onClick={(e) => openEditDrawer(e, value)}
                                style={{cursor: 'pointer', marginLeft: 20}}
                            />
                        </LiticoBlue>
                    </Popover>
                    {id === value &&
                        <Drawer
                            placement={"right"}
                            open={visible}
                            onClose={(e) => closeEditDrawer(e)}
                            size={"large"}
                            title={"Edit Form for Report Entry"}
                        >
                            <ReportEditForm 
                                close={closeEditDrawer}
                                refresh={getMetric}
                                data={find(reportData.esg_metrics, (o) => o.id === value)}
                            />
                        </ Drawer>
                    }
                </>
            )
        }]

        return baseColumns.concat(additionalColumns)
    }

    /**
     * Removes selected row of data from database.
     * 
     * @params e - Event Object.
     * @params id - data's id number in the database.
     */
    const handleDelete = useCallback( async (e: React.MouseEvent<HTMLElement, MouseEvent> | undefined, id: number) => {
        if (e) {
            e.preventDefault()
        }

        const payload = {
            resourceID: id,
            resourceName: 'esg-metrics'
        }
        try {
            ResourceService.delete(payload)
            message.success("Successfully Deleted")
            getMetric()
        } catch (err) {
            console.log(err)
            message.error("Unable to delete")
        }
    }, [getMetric])

    const openEditDrawer = (e: any, value: number) => {
        if (e) {
            e.preventDefault()
        }
        setId(value);
        setVisibility(true);
    }

    const closeEditDrawer = (e: any) => {
        if (e) {
            e.preventDefault()
        }
        setId(0);
        setVisibility(false);
    }


    return (
        <>
            {reportData && 
                <Row>
                    <Col span={24}>
                        <Table
                            title={() => `${searchParams.get("metric_name")} - ${searchParams.get("metric_subtype")}`}
                            pagination={false}
                            columns={getColumns(subMetricColumns, searchParams.get("metric_subtype"))}
                            dataSource={sortBy(reportData?.esg_metrics, [function(o) { return o.date; }])} 
                            rowKey={'id'}
                        />
                    </Col>
                </Row>
            }
        </>
    )
}

export default ESGMetricReportTable;