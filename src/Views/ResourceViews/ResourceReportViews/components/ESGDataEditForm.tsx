import { FC, useCallback, useState } from 'react';
import {useSearchParams} from 'react-router-dom';

import ResourceService from '../../../../Services/ResourceService';

interface IEditFormProps {
    
};

/**
 * Handles both the logic and UI for editing ESG Metric Data.
 */
const ESGDataEditForm: FC = (): JSX.Element => {
    const [fields, setFields] = useState<any>();
    const [standards, setStandards] = useState<any>();
    const [searchParams] = useSearchParams();

    /**
     * Retrieves all standards from database. Note: contains side effect.
     */
    const getStandards = useCallback(() => {
        ResourceService.index({
            resourceName: "standards",
            params: {metric_subtype: searchParams.get("metric_subtype")}
        }).then(({ data }) => {
            console.log("Show me what the data looks like: ", data);
            // setStandards(data);
            // setFields(data[0].esg_metric_factors)
            // setDefaultFields()
        })

    }, [searchParams, setStandards])

    getStandards();

    return (
        <div>
            Testing
        </div>
    )
}

export default ESGDataEditForm;