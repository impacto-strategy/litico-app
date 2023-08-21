import { Row } from 'antd';
import { useState } from 'react';

import BasinField from './SharedFieldsComponents/BasinField';
import DateField from './SharedFieldsComponents/DateField';
import OrganizationFacilityField from './SharedFieldsComponents/OrganizationFacilityField';
import RiskField from './SharedFieldsComponents/RiskField';
import SourceField from './SharedFieldsComponents/SourceField';
import StateField from './SharedFieldsComponents/StateField';
import TimeframeField from './SharedFieldsComponents/TimeframeField';

/**
 * Renders the fields on the ESG Metric form which mainly shared by all ESG metric subtypes. Each field was given it's own component to make conditional rendering easier since some shared fields are changing now.
 */
const SharedFieldsSection = ({ initialValues, searchParams, standards }: any) => {
    const [timeframeSelected, setTimeFrame] = useState<"date" | "month" | "quarter" | "year">(initialValues ? initialValues["timeframe"] : "date");
    
    const checkOrganizationOrFacility = () => {
        if (initialValues) {
            return initialValues["organization"] ? initialValues["organization"] : initialValues["facility"];
        } else {
            return null;
        }
    }
    
    // Set is utilized due to better performance.
    const sharedFields: any = new Set([
        {
            component: TimeframeField,
            props: { 
                initialValue: initialValues ? initialValues["timeframe"] : null,
                timeframeSelected,
                searchParams, 
                setTimeFrame 
            },
            excludeFrom: [
                'Employee Matching', 
                'Employee Volunteering Match', 
                'Social Investment'
            ]
        },
        {
            component: DateField,
            props: { initialDate: initialValues ? initialValues["date"] : null, searchParams, timeframeSelected },
            excludeFrom: []
        },
        {
            component: OrganizationFacilityField,
            props: { initialValue: checkOrganizationOrFacility(), standards },
            excludeFrom: []
        },
        {
            component: BasinField,
            props: { initialValue: initialValues ? initialValues["basin"] : null },
            excludeFrom: [
                'Employee Matching', 
                'Employee Volunteering Match',
                'Social Investment'
            ]
        },
        {
            component: StateField,
            props: { initialState: initialValues ? initialValues["state"] : null },
            excludeFrom: []
        },
        {
            component: SourceField,
            props: { initialValue: initialValues ? initialValues["source"] : null },
            excludeFrom: [
                'Employee Matching', 
                'Employee Volunteering Match', 
                'Social Investment'
            ]
        },
        {
            component: RiskField,
            props: { initialValue: initialValues ? initialValues["risk"] : null },
            excludeFrom:[
                'Employee Matching', 
                'Employee Volunteering Match', 
                'Social Investment'
            ]
        },
    ]);

    const buildRows = (fields: any) => {
        let rows: any = [];
        let counter = 0;
    
        fields.forEach((item: any) => {
            if (counter % 2 === 0 && item.component !== StateField) {
                rows.push([]);
            }
            
            if (!item.excludeFrom.includes(searchParams.get("metric_subtype"))) {
                if (item.component === StateField) {
                    // If the last row is empty, use it. Otherwise, create a new row.
                    if (rows[rows.length - 1].length === 0) {
                        rows[rows.length - 1].push(item);
                    } else {
                        rows.push([item]);
                    }
                    counter = 0;
                } else {
                    rows[rows.length - 1].push(item);
                    counter += 1;
                }
            }
        });
    
        return rows;
    }

    const rows = buildRows(sharedFields);

    return (
        <>
            {rows.map((row: any, rowIndex: number) => (
                <Row gutter={24} key={rowIndex}>
                    {row.map((item: any) => (
                        <item.component {...item.props} />
                    ))}
                </Row>
            ))}
        </>
    )
}

export default SharedFieldsSection;