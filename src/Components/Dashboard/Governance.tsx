/* IMPORT EXTERNAL MODULES */
import {Divider} from "antd";
import {FC} from "react";

/* IMPORT INTERNAL MODULES */
import GovernanceCheckList from "../GovernanceCheckList";

interface SectionProps {
    esgMetrics: any
}

const Governance: FC<SectionProps> = (props): JSX.Element => {
    return (
        <>
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
                {props?.esgMetrics && props?.esgMetrics?.length > 0 &&
                    <GovernanceCheckList esgMetrics={props?.esgMetrics} />
                }
            </div>
            <div style={{paddingBottom: 40}}/>
        </>
    )
}

export default Governance;