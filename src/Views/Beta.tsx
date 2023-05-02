/* IMPORT EXTERNAL MODULES */
import React, {FC, useState} from 'react';
import type {RadioChangeEvent} from 'antd';
import {Tabs} from 'antd';
import type {SizeType} from 'antd/es/config-provider/SizeContext';
import Complaints from "../Boards/Complaints";
import Spills from "../Boards/Spills";

const Beta: FC = () => {

    const [size, setSize] = useState<SizeType>('small');

    const onChange = (e: RadioChangeEvent) => {
        setSize(e.target.value);
    };

    const boards = [
        {
            label: "Complaints",
            key: "complaints",
            children: <Complaints/>
        },
        {
            label: "Spills",
            key: "spills",
            children: <Spills/>
        }
    ]
    return (
        <div>

            <Tabs
                defaultActiveKey="complaints"
                size={size}
                style={{marginBottom: 32}}
                items={boards}
                type="card"
                centered={true}
            />

        </div>
    )
}

export default Beta
