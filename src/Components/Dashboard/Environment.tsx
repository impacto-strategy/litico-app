/* IMPORT EXTERNAL MODULES */
import {Divider} from "antd";
import {FC} from "react";

/* IMPORT INTERNAL MODULES */
// Components
import ColumnWidget from "../ColumnWidget";
import DualAxesLineColWidget from "../DualAxesLineColWidget";
import GHGChart from "../GHGChart";
import LDAR from "../LDAR";
import ProductionChart from "../ProductionChart";

// Services
import { getYearlyComplaintsData } from "../../Services/ComplaintsService";
import { getYearlyEmissionsData } from "../../Services/EmissionsService";
import { getYearlyProductionData } from "../../Services/ProductionService";
import { getYearlySpillsData } from "../../Services/SpillsService";

// Misc
import useAuth from "../../Providers/Auth/useAuth";

interface SectionProps {
    complaints: any,
    emissions: any,
    production: any,
    spills: any
}

const Environment: FC<SectionProps> = (props): JSX.Element => {
    // React Context
    const {user} = useAuth();

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
                {props.emissions.length > 0 && props.production.length > 0 &&
                    <GHGChart
                        data={getYearlyEmissionsData(props.emissions, props.production)}
                    />
                }

                {/* <WhitingAllData /> */}

                {props.spills.length > 0 &&
                  <DualAxesLineColWidget
                      data={getYearlySpillsData(props.spills, props.production)}
                      colLabel="Spill Incident Count"
                      lineLabel="Spills Intensity (bbl spill/kbbl produced)"
                      title="Spill Incident Count & Intensity"
                      gridColumns="1 / 3"
                      y1Lablel="Spill Incident Count"
                      y2Lablel="Spill Intensity (bbl spill/kbbl produced)"
                      includeModal={true}
                  />
                }

                {props.complaints.length > 0 &&
                    <ColumnWidget 
                        data={getYearlyComplaintsData(props.complaints)} 
                        title="Complaints" 
                        modalTitle="Complaints" 
                        includeModal={true} 
                        gridColumns="3 / 5" 
                    />
                }

                {/* Charts/Graphs that are currently beyond MVP. */}
                {/* {user.selectedCompany.name === 'Demo Energy' &&
                    <MethaneEmissions/>
                }
                { user.selectedCompany.name === 'Demo Energy' &&
                    <Flaring/>
                } */}
                {/* { user.selectedCompany.name === 'Demo Energy' &&
                    <OilSpills/>
                } */}
                {/* { user.selectedCompany.name === 'Demo Energy' &&
                    <Emissions2020/>
                } */}
                {/* <Emissions2020CO2 data={co2Emission} units="mt CO2" title="Carbon Dioxide Emissions for Production" />
                <Emissions2020CO2 data={ch4Emission} units="mt CH4" title="Methane Emissions for Production" />
                <Emissions2020CO2 data={n20Emission} units="mt N2O" title="Nitrous Oxide Emissions for Production" /> */}

                {props.production.length > 0 &&
                    <ProductionChart
                        data={getYearlyProductionData(props.production)}
                        gridColumns={'1/5'}
                        title={'Total Oil & Gas Production'}
                    />
                }

                {user.selectedCompany.name === 'Demo Energy' &&
                    <LDAR />
                }
            </div>
        </div>
    )
}

export default Environment;