import React from "react";
import {render} from "react-dom";
import 'antd/dist/antd.css'
import "./Styles/global.less"
import {BrowserRouter} from "react-router-dom";

import {ConfigProvider} from "antd";
import {AuthProvider} from "./Providers/Auth/useAuth";
import App from "./App";



render(<BrowserRouter>
    <ConfigProvider componentSize={"large"}>
        <AuthProvider>
            <App/>
        </AuthProvider>
    </ConfigProvider>
</BrowserRouter>, document.getElementById("root"));
