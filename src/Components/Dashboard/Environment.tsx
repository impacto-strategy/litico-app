import {Divider} from "antd";
import React, {FC} from "react";

interface SectionProps {

}

const Environment: FC = (props: SectionProps): JSX.Element => {
    // GET EMISSIONS DATA FUNCTION

    // GET SPILLS DATA FUNCTION

    // GET COMPLAINTS DATA FUNCTION

    // GET PRODUCTION DATA
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