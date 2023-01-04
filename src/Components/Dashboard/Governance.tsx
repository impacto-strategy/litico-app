import {Divider} from "antd";
import React, {FC} from "react";

interface SectionProps {

}

const Governance: FC = (props: SectionProps): JSX.Element => {
    return (
        <div>
            <div>
                <Divider>
                    Governance
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

export default Governance;