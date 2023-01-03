import {Divider} from "antd";
import React from "react";

const Environment = () => {
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