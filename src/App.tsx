/* IMPORT EXTERNAL MODULES */
import React, {FC} from "react";
import {Route, Routes} from "react-router-dom";
/* IMPORT INTERNAL MODULES */
// REACT COMPONENTS
import RequireAuth from "./Components/Utility/PrivateRoute";
// REACT VIEWS
import AddMetric from "./Views/AddMetric";
import Dashboard from "./Views/Dashboard";
import Home from "./Views/Home";
import Landing from "./Views/Landing";
import Login from "./Views/AuthViews/Login";
import Metrics from "./Views/Metrics";
import MetricsPeriodSelector from "./Views/MetricsPeriodSelector";
import PerformanceDashboard from "./Views/PerformanceDashboard";

// REACT VIEWS/AUTH
import ForgotPassword from "./Views/AuthViews/ForgotPassword";
import ResetPassword from "./Views/AuthViews/ResetPassword";

// REACT VIEWS/RESOURCES
import ResourceIndex from "./Views/ResourceViews/ResourceIndex";
import NewLocation from "./Views/ResourceViews/location/NewLocation";
import EquipmentIndex from "./Views/ResourceViews/equipment/EquipmentIndex";
import ReportsIndex from "./Views/ResourceViews/reports/ReportsIndex";
import ReportsNew from "./Views/ResourceViews/reports/ReportsNew";
import MetrictypeDataEntrySelection from "./Views/ResourceViews/NewESGMetricDataViews/MetrictypeDataEntrySelection";
import MetricSubtypeDataEntrySelection from "./Views/ResourceViews/NewESGMetricDataViews/MetricSubtypeDataEntrySelection";
import MetricNames from "./Views/ResourceViews/reports/MetricNames";
import MetricSubtype from "./Views/ResourceViews/reports/MetricSubtype";
import MetricSubtypes from "./Views/ResourceViews/reports/MetricSubtypes";
import ReportMetricType from "./Views/ResourceViews/reports/ReportMetricType";
import CompaniesNew from "./Views/ResourceViews/companies/CompaniesNew";
import Beta from "./Views/Beta";
import ESGDataInputPage from "./Views/ResourceViews/NewESGMetricDataViews/ESGDataInputPage";

const App: FC = () => {
    return (
        <Routes>
            <Route element={<RequireAuth><Home/></RequireAuth>}>
                <Route path="dashboard" element={<Dashboard/>}/>
                <Route path="beta" element={<Beta/>}/>
                <Route path=":resourceName" element={<ResourceIndex/>}/>
                <Route path="equipments" element={<EquipmentIndex/>}/>
                <Route path="locations/new" element={<NewLocation/>}/>
                <Route path="metrics" element={<MetricsPeriodSelector/>}/>
                <Route path="metrics/:year" element={<Metrics/>}/>
                <Route path="reports" element={<ReportsIndex/>}/>
                <Route path="reports/new" element={<ReportsNew/>}/>
                <Route path="companies/new" element={<CompaniesNew />} />
                <Route path="metric-names" element={<MetrictypeDataEntrySelection />} />
                <Route path="metric-subtypes" element={<MetricSubtypeDataEntrySelection />} />
                <Route path="metric-subtype" element={<ESGDataInputPage />} />
                <Route path="reports/:id/metric-names" element={<MetricNames />} />
                <Route path="reports/:id/metric-subtypes" element={<MetricSubtypes/>}/>
                <Route path="reports/:reportID/metrics" element={<ReportMetricType />} />
                <Route path="reports/:reportID/metric-subtype" element={<MetricSubtype/>}/>
                <Route path="add-metric" element={<AddMetric/>}/>
                <Route path="performance" element={<PerformanceDashboard/>}/>
            </Route>

            <Route path={"/"} element={<Landing/>}/>

            <Route path={"/login"} element={<Login/>}/>
            <Route path={"/forgot-password"} element={<ForgotPassword />} />
            <Route path={"/reset-password"} element={<ResetPassword/>}/>
        </Routes>

    );
};

export default App;


