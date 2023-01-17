/* IMPORT EXTERNAL MODULES */
import {Divider} from "antd";
import React, {FC} from "react";

/* IMPORT INTERNAL MODULES */
import { getYearlyComplaintsData } from "../../Services/ComplaintsService";
import { getYearlyEmissionsData } from "../../Services/EmissionsService";
import { getYearlyProductionData } from "../../Services/ProductionService";
import { getYearlySpillsData } from "../../Services/SpillsService";

interface SectionProps {
    emissions: any,
    production: any,
    spills: any
}

const Environment: FC<SectionProps> = (props): JSX.Element => {
    // GET EMISSIONS DATA FUNCTION
    // getYearlyEmissionsData(props.emissions);

    // GET SPILLS DATA FUNCTION
    // getYearlySpillsData(props.spills, props.production)

    // GET COMPLAINTS DATA FUNCTION
    // getYearlyComplaintsData(props.spills);

    // GET PRODUCTION DATA
    // getYearlyProductionData(props.production);
    return (
        <div>
            <div>
                <Divider>
                    Environment
                </Divider>
            </div>

            <div style={{
                display: 'grid',
                textAlign: 'center',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '2em'
            }}>
                {/* ALL CHARTS WILL GO HERE. */}
            </div>
        </div>
    )
}

export default Environment;