/* IMPORT EXTERNAL MODULES */
import React, {FC, useState} from 'react';
import type {RadioChangeEvent} from 'antd';
import {Tabs} from 'antd';
import type {SizeType} from 'antd/es/config-provider/SizeContext';
import Complaints from "../Boards/Complaints";
import Spills from "../Boards/Spills";
import PermitSurveillance from "../Boards/PermitsSurveillance";
import Ogdps from "../Boards/ogdps";
import MergerAcquisition from "../Boards/MergerAcquisition";
import Inspections from "../Boards/Inspections";

const Beta: FC = () => {

    const [size, setSize] = useState<SizeType>('small');

    const onChange = (e: RadioChangeEvent) => {
        setSize(e.target.value);
    };

    const boards = [
        {
            label: "Permits Surveillance",
            key: "ogdp",
            children: <Ogdps/>
        }, {
            label: "Mergers & Acquisition",
            key: "MergerAcquisition",
            children: <MergerAcquisition/>
        },
        {
            label: "Complaints",
            key: "complaints",
            children: <Complaints/>
        },
        {
            label: "Spills",
            key: "spills",
            children: <Spills/>
        },
        {
            label: "Drilling Permits Surveillance",
            key: "permit_surveillance",
            children: <PermitSurveillance/>
        },
        {
            label: "Inspections",
            key: "inspections",
            children: <Inspections/>
        }
    ]
    return (
        <div>

            <Tabs
                defaultActiveKey="ogdp"
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
