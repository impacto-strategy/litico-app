import {FC} from "react";
import GenderWidget from "../Components/GenderWidget";
import Emissions2020 from "../Components/Emissions2020";
import Emissions2020CO2 from "../Components/Emissions2020CO2";
import DonationsDrilldown from "../DonationsDrilldown";
import LDAR from "../Components/LDAR";
import Productions from "../Components/Productions";
import {Divider} from "antd";

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
                <Divider>
                    Environment
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
                <Emissions2020/>
                <Emissions2020CO2 units="mt CO2" title="Carbon Dioxide Emissions for Production" />
                <Emissions2020CO2 units="mt CH4" title="Methane Emissions for Production" />
                <Emissions2020CO2 units="mt N2O" title="Nitrous Oxide Emissions for Production" />
                <Productions productType="oil" title="Oil Production by Month" />
                <Productions productType="gas" title="Gas Production by Month" />
                <LDAR/>
            </div>
            <div>
                <Divider>
                    Social
                </Divider>
            </div>
            <div style={{
                padding: '0 24p 90px 24px',
                textAlign: 'center',
                display: 'flex',
                gap: '2rem',
                flexWrap: 'wrap'
            }}>

                <Staff/>
                <GenderWidget/>

                {/*<Donations/>*/}
                <DonationsDrilldown/>
            </div>
            <div style={{paddingBottom: 40}}/>
        </div>
    )
}

export default Dashboard