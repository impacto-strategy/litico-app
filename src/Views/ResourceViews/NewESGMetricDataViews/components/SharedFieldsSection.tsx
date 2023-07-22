import { Row } from 'antd';
import { useState } from 'react';

import BasinField from './SharedFieldsComponents/BasinField';
import DateField from './SharedFieldsComponents/DateField';
import OrganizationFacilityField from './SharedFieldsComponents/OrganizationFacilityField';
import RiskField from './SharedFieldsComponents/RiskField';
import SourceField from './SharedFieldsComponents/SourceField';
import StateField from './SharedFieldsComponents/StateField';
import TimeframeField from './SharedFieldsComponents/TimeframeField';

const SharedFieldsSection = ({ searchParams, standards }: any) => {
    const [timeframeSelected, setTimeFrame] = useState<"date" | "month" | "quarter" | "year">("date");
    
    // Set is utilized due to better performance.
    const sharedFields: any = new Set([
        {
            component: TimeframeField,
            props: { searchParams, setTimeFrame },
            excludeFrom: ['Employee Matching', 'Social Investment', 'Volunteering - Community']
        },
        {
            component: DateField,
            props: { searchParams, timeframeSelected },
            excludeFrom: []
        },
        {
            component: OrganizationFacilityField,
            props: { standards },
            excludeFrom: []
        },
        {
            component: BasinField,
            excludeFrom: ['Employee Matching', 'Social Investment', 'Volunteering - Community']
        },
        {
            component: StateField,
            excludeFrom: []
        },
        {
            component: SourceField,
            excludeFrom: ['Employee Matching', 'Social Investment', 'Volunteering - Community']
        },
        {
            component: RiskField,
            excludeFrom: ['Employee Matching', 'Social Investment', 'Volunteering - Community']
        },
    ]);

    const buildRows = (fields: any) => {
        // Create an array of arrays. then we can iterate through the bigger array when it's time to render.
        let rows: any = [];
        let counter = 0;

        fields.forEach((item: any) => {
            if (counter % 2 === 0) {
                rows.push([]);
            }
            if (!item.excludeFrom.includes(searchParams.get("metric_subtype"))) {
                if (item.component === StateField) {
                    rows.push([]);
                    rows[rows.length - 1].push(item);
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