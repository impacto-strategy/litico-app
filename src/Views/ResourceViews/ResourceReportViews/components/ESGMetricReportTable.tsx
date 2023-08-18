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
    sortBy
} from 'lodash';
import moment from 'moment';
import { FC, useCallback, useState } from 'react';
import ResourceService from '../../../../Services/ResourceService';
import styled from "styled-components";

import ESGDataEditForm from './ESGDataEditForm';
import { getSignedUrl } from '../../../../utils/utils';

const LiticoBlue = styled.span`
    color: rgb(46, 67, 117)
`

/**
 * Handles logic and UI for report table of metric data. Seperated into separate component for better readibility and maintainability.
 * NOTE: It's worth exploring later how to refactor to have drawer component separated into it's own component for better maintainibility.
 */
const ESGMetricReportTable: FC<any> = ({ getMetric, reportData, searchParams }) => {
    const [id, setId] = useState(0) // Prevents multiple forms from rendering (more efficient)
    const [visible, setVisibility] = useState(false);


    // the format______ functions were created since many columns use the same UI for data.
    const formatCurrency = (value: any) => (
        <span>
            {value.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
        </span>
    );
  
    const formatDate = (value: any) => (
        <span>
            {moment(value).format('MM/DD/YYYY')}
        </span>
    );
  
    const formatValue = (value: any) => (
        <span>
            {value.toLocaleString()}
        </span>
    );
  
    const timeframeColumn = {
        title: 'Timeframe',
        dataIndex: '',
        key: '',
        render: (value: any) => (
            <span>{reportData?.period === 'YR' ? 'Annual' : reportData?.period}</span>
        )
    };
  
    const dateColumn = {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        render: formatDate,
    };

    const resourceColumn = {
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
    }

    const categoriesColumn = {
        title: 'Categories',
        dataIndex: 'selection_json',
        key: 'selection_json',
        render: (value: any) => (
            value === null ? (<span>N/A</span>) : (<span>{value.join(', ')}</span>)
        )
    }
  
    const getColumn = (title: string, dataIndex: string, render?: (value: any) => JSX.Element) => ({
        title,
        dataIndex,
        key: dataIndex,
        render: render ? render : undefined
    });
  
    // Here is the list of most columns (for others used by all metric types, see getColumns function) that the metric table will.
    const subMetricColumns = {
        "Community Grievances": [
            getColumn('Name', 'contact_name'),
            getColumn('Date Reported', 'type_b'),
            getColumn('Resolution Date', 'type_a'),
            getColumn('Reason for Call', 'description'),
            getColumn('Resolution', 'narrative'),
            timeframeColumn,
            dateColumn,
            resourceColumn
        ],
        "Employee Matching": [
            getColumn('Amount Donated', 'num_1'),
            getColumn('Name', 'contact_name'),
            getColumn("Employee's Office", 'type_a'),
            dateColumn,
            resourceColumn
        ],
        "Employee Volunteering Match": [
            getColumn('Organization', 'organization'),
            getColumn('Hours Volunteered', 'num_1'),
            getColumn('Employee ID', 'employee_id'),
            getColumn("Employee's Office", 'type_a'),
            getColumn('Tax ID', 'tax_id'),
            dateColumn,
            resourceColumn
        ],
        "GHG Emissions": [
            getColumn('GHG Emissions', 'value', formatValue),
            getColumn('CO2 Emissions (mt CO2)', 'num_1'),
            getColumn('CH4 Emissions (mt CH4)', 'num_2'),
            getColumn('N2O Emissions (mt N2O)', 'num_3'),
            getColumn('Source', 'source'),
            timeframeColumn,
            dateColumn,
            resourceColumn
        ],
        "Production - Oil, Gas, Produced Water, Synthetic Oil, Synthetic Gas": [
            getColumn('Oil Production', 'num_1'),
            getColumn('Gas Production', 'num_2'),
            getColumn('Produced Water Production', 'num_3'),
            getColumn('Synthetic Oil Production', 'num_4'),
            getColumn('Synthetic Gas Production', 'num_5'),
            getColumn('Source', 'source'),
            timeframeColumn,
            dateColumn,
            resourceColumn
        ],
        "TRIR - Employees": [
            getColumn('TRIR Employees', 'value'),
            getColumn('Number of Employee Recordable Incidents', 'num_1'),
            getColumn('Number of Employee Fatalities', 'num_2'),
            getColumn('Number of Employee Lost Time Incidents', 'num_3'),
            getColumn('Employee Hours Worked', 'denominator'),
            getColumn('Source', 'source'),
            timeframeColumn,
            dateColumn,
            resourceColumn
        ],
        "Social Investment": [
            getColumn('Organization', 'organization'),
            getColumn('Amount Donated', 'denominator', formatCurrency),
            getColumn("Employee's Office", 'type_a'),
            getColumn('Tax ID', 'tax_id'),
            categoriesColumn,
            dateColumn
        ],
        "Workforce Demographics - Ethnicity": [
            getColumn('Total Employees', 'value'),
            getColumn('White/Caucasian', 'num_1'),
            getColumn('Black/African American', 'num_2'),
            getColumn('Asian/Pacific American', 'num_3'),
            getColumn('Latino/Hispanics', 'num_4'),
            getColumn('Native American', 'num_5'),
            getColumn('Other', 'num_6'),
            getColumn('Source', 'source'),
            timeframeColumn,
            dateColumn,
            resourceColumn
        ],
        "Workforce Demographics - Gender": [
            getColumn('Total Employees', 'value'),
            getColumn('Male', 'num_1'),
            getColumn('Female', 'num_2'),
            getColumn('Non-Binary', 'num_3'),
            getColumn('No Response', 'num_4'),
            getColumn('Source', 'source'),
            timeframeColumn,
            dateColumn,
            resourceColumn
        ],
    }


    /**
     * Creates data for what columns will be rendered for the metric subtype selected.
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
        const additionalColumns = [
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
                            <ESGDataEditForm 
                                data={reportData.esg_metrics.filter((val: any) => val.id === value)[0]}
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
                            title={() => `${searchParams.get("metric_name")}: ${searchParams.get("metric_subtype")}`}
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