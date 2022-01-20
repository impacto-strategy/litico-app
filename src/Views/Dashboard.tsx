import {FC} from "react";
import GenderWidget from "../Components/GenderWidget";
import Emissions2020 from "../Components/Emissions2020";
import Emissions2020CO2 from "../Components/Emissions2020CO2";
import DonationsDrilldown from "../DonationsDrilldown";
import LDAR from "../Components/LDAR";
import {Button, Divider} from "antd";

import {PlusCircleOutlined} from '@ant-design/icons'
import {Link} from "react-router-dom";
import WhitingAllData from "../Components/WhitingAllData";
import MethaneEmissions from "../Components/MethaneEmissions";
import Flaring from "../Components/Flaring";
import OilSpills from "../Components/OilSpills";
import Staff from "../Components/Staff";

const Dashboard: FC = () => {
    return (
        <div className="site-layout-background"
        >
            <div>
                <Divider orientation={"center"}>
                    Quick Links
                </Divider>
                <Button.Group style={{justifyContent: 'center', width: '100%'}}>
                    <Link to={"/add-metric"}>
                        <Button icon={<PlusCircleOutlined/>} type={"primary"}>
                            Add Metric
                        </Button>
                    </Link>
                </Button.Group>
            </div>
            <div>
                <Divider>
                    Overview
                </Divider>
            </div>

            <div style={{
                padding: '0 24p 90px 24px',
                textAlign: 'center',
                display: 'flex',
                gap: '2rem',
                flexWrap: 'wrap'
            }}>
                <WhitingAllData/>
                <MethaneEmissions/>
                <Flaring/>
                <OilSpills/>
                <Staff/>
                <GenderWidget/>
                <Emissions2020/>
                <Emissions2020CO2/>
                <LDAR/>
                {/*<Donations/>*/}
                <DonationsDrilldown/>
            </div>
            <div style={{paddingBottom: 40}}/>
        </div>
    )
}

export default Dashboard