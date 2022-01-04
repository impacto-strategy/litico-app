import React, {FC, useState} from "react";
import useAuth from "../Providers/Auth/useAuth";
import {Link, Outlet, useNavigate} from "react-router-dom";
import {
    BarChartOutlined,
    ContainerOutlined,
    DatabaseOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ToolOutlined
} from '@ant-design/icons';
import {Col, Layout, Menu, Row} from 'antd';

const {Header, Content, Sider} = Layout;


const Home: FC = () => {

    const [collapsed, setCollapsed] = useState(false)


    const {user, logout} = useAuth();
    const navigate = useNavigate();


    const handleLogout = () => {
        logout();
        navigate("/");
    };


    return (
        <Layout id={"components-layout-demo-fixed-sider"}>

            <Sider collapsible collapsed={collapsed} theme={"light"} style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
            }}>
                <>
                    <div className="logo">
                        L<span hidden={collapsed}>itico</span>
                    </div>
                    <Menu theme="light" mode="inline" defaultSelectedKeys={['0']}>
                        <Menu.Item key="0" icon={<BarChartOutlined/>}>
                            <Link to={`/dashboard`}>
                                Dashboard
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="1" icon={<ContainerOutlined/>}>
                            <Link to={`/reports`}>
                                Reports
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="3" icon={<DatabaseOutlined/>}>
                            <Link to={`/companies`}>
                                Companies
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="4" icon={<DatabaseOutlined/>}>
                            <Link to={`/locations`}>
                                Locations
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="5" icon={<DatabaseOutlined/>}>
                            <Link to={`/facilities`}>
                                Facilities
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="6" icon={<ToolOutlined/>}>
                            <Link to={`/equipments`}>
                                Equipment
                            </Link>
                        </Menu.Item>
                    </Menu>
                </>
            </Sider>
            <Layout className="site-layout" style={{marginLeft: collapsed ? 80 : 200, transition: '.2s ease'}}>
                <Header className="site-layout-background" style={{padding: 0}}>

                    <Row>
                        <Col span={8}>
                            <div onClick={() => setCollapsed(!collapsed)} className={"trigger"}>
                                {collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}</div>
                        </Col>
                        <Col span={8} offset={8}>
                            <div className={"companySelector"}>
                                <img
                                    src={"https://ik.imagekit.io/nginr/hrm-favicon__0GlLjdC7.png?updatedAt=1636936723321"}
                                    width={24} alt={""}/>
                                <div>HRM Resources</div>
                                <span>{user.name}</span>
                                {user && (
                                    <span style={{cursor: 'pointer'}} onClick={handleLogout}>
                                        Logout
                                    </span>
                                )}
                            </div>
                        </Col>

                    </Row>
                </Header>
                <Content style={{margin: '24px 16px 0', overflow: 'initial', minHeight: 'calc(100vh - 64px)'}}>
                    <Outlet/>
                </Content>
            </Layout>
        </Layout>
    )
}

export default Home