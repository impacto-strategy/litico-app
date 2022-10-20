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
import DataMetricNames from "./Views/resources/DataMetricNames";
import DataMetricSubtype from "./Views/resources/DataMetricSubtype";
import DataMetricSubtypes from "./Views/resources/DataMetricSubtypes";
import MetricNames from "./Views/resources/reports/MetricNames";
import MetricSubtype from "./Views/resources/reports/MetricSubtype";
import MetricSubtypes from "./Views/resources/reports/MetricSubtypes";
import ReportMetricType from "./Views/resources/reports/ReportMetricType";
import CompaniesNew from "./Views/resources/companies/CompaniesNew";
import PerformanceDashboard from "./Views/PerformanceDashboard";
import Landing from "./Views/Landing";


const App: FC = () => {
    return (
        <Routes>
            <Route element={<RequireAuth><Home/></RequireAuth>}>
                <Route path="dashboard" element={<Dashboard/>}/>
                <Route path=":resourceName" element={<ResourceIndex/>}/>
                <Route path="equipments" element={<EquipmentIndex/>}/>
                <Route path="locations/new" element={<NewLocation/>}/>
                <Route path="metrics" element={<MetricsPeriodSelector/>}/>
                <Route path="metrics/:year" element={<Metrics/>}/>
                <Route path="reports" element={<ReportsIndex/>}/>
                <Route path="reports/new" element={<ReportsNew/>}/>
                <Route path="companies/new" element={<CompaniesNew />} />
                <Route path="metric-names" element={<DataMetricNames />} />
                <Route path="metric-subtypes" element={<DataMetricSubtypes />} />
                <Route path="metric-subtype" element={<DataMetricSubtype />} />
                <Route path="reports/:id/metric-names" element={<MetricNames />} />
                <Route path="reports/:id/metric-subtypes" element={<MetricSubtypes/>}/>
                <Route path="reports/:reportID/metrics" element={<ReportMetricType />} />
                <Route path="reports/:reportID/metric-subtype" element={<MetricSubtype/>}/>
                <Route path="add-metric" element={<AddMetric/>}/>
                <Route path="performance" element={<PerformanceDashboard/>}/>
            </Route>

            <Route path={"/"} element={<Landing/>}/>

            <Route path={"/login"} element={<Login/>}/>

        </Routes>

    );
};

export default App;


