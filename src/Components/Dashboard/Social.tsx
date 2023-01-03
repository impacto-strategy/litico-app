import {Divider} from "antd";
import React from "react";

const Social = () => {
    return (
        <div>
            <div>
                <Divider>
                    Social
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

export default Social;