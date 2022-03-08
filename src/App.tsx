import React, {FC} from "react";
import {Route, Routes} from "react-router-dom";
import Login from "./Views/auth/Login";
import RequireAuth from "./Components/Utility/PrivateRoute";
import Dashboard from "./Views/Dashboard";
import Home from "./Views/Home";
import ResourceIndex from "./Views/resources/ResourceIndex";
import NewLocation from "./Views/resources/location/NewLocation";
import MetricsPeriodSelector from "./Views/MetricsPeriodSelector";
import Metrics from "./Views/Metrics";
import EquipmentIndex from "./Views/resources/equipment/EquipmentIndex";
import ReportsIndex from "./Views/resources/reports/ReportsIndex";
import ReportsNew from "./Views/resources/reports/ReportsNew";
import AddMetric from "./Views/AddMetric";
import EditReport from "./Views/resources/reports/EditReport";
import ReportMetricType from "./Views/resources/reports/ReportMetricType";
import CompaniesNew from "./Views/resources/companies/CompaniesNew";
import PerformanceDashboard from "./Views/PerformanceDashboard";


const App: FC = () => {


    return (
        <Routes>

            <Route path="/" element={<RequireAuth><Home/></RequireAuth>}>
                <Route path="dashboard" element={<Dashboard/>}/>
                <Route path=":resourceName" element={<ResourceIndex/>}/>
                <Route path="equipments" element={<EquipmentIndex/>}/>
                <Route path="locations/new" element={<NewLocation/>}/>
                <Route path="metrics" element={<MetricsPeriodSelector/>}/>
                <Route path="metrics/:year" element={<Metrics/>}/>
                <Route path="reports" element={<ReportsIndex/>}/>
                <Route path="reports/new" element={<ReportsNew/>}/>
                <Route path="companies/new" element={<CompaniesNew/>}/>
                <Route path="reports/:year/:quarter" element={<EditReport/>}/>
                <Route path="reports/:year/:quarter/:metricTypeID" element={<ReportMetricType/>}/>
                <Route path="add-metric" element={<AddMetric/>}/>
                <Route path="performance" element={<PerformanceDashboard/>}/>
            </Route>

            <Route path={"/login"} element={<Login/>}/>

        </Routes>

    );
};

export default App;


