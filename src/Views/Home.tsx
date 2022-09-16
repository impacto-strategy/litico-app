import React, {FC, useCallback, useEffect, useState} from "react";
import useAuth from "../Providers/Auth/useAuth";
import {Link, Outlet, useNavigate} from "react-router-dom";
import {
    BarChartOutlined,
    ContainerOutlined,
    DatabaseOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons';
import {Col, Dropdown, Layout, Menu, Row} from 'antd';
import ResourceService from "../Services/ResourceService";

const {Header, Content, Sider} = Layout;

const CompanyMenu = ({companies, onClick} : {companies: any[], onClick: (ev: any) => void}) => {


    return (
        <Menu onClick={onClick}>
            {companies.map(company => <Menu.Item key={company.id}>
                {company.name}
            </Menu.Item>
            )}
        </Menu>
    )
}


const Home: FC = () => {

    const [collapsed, setCollapsed] = useState(false)
    const [companies, setCompanies] = useState<any[]>([])



    const {user, logout, switchCompany} = useAuth();
    const navigate = useNavigate();


    const handleLogout = () => {
        logout();
        navigate("/");
    };

    useEffect(() => {
        ResourceService.index({
            resourceName:'companies'
        }).then(({data}) => {
            setCompanies(data)
        })
    }, [])

    const handleCompanyChange = useCallback((ev) => {
      switchCompany(ev.key).finally(() => {
          window.location.reload()
      })
    }, [switchCompany])

    return (
        <Layout id={"components-layout-demo-fixed-sider"}>
            <Sider
                breakpoint="lg"
                collapsible
                onBreakpoint={(broken) => {
                    setCollapsed(broken)
                }}
                collapsed={collapsed} theme={"light"} style={{
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
                        {/* <Menu.Item key="2" icon={<FundOutlined/>}>
                            <Link to={`/performance`}>
                                Performance
                            </Link>
                        </Menu.Item> */}

                        {/* <Menu.Item key="4" icon={<DatabaseOutlined/>}>
                            <Link to={`/locations`}>
                                Locations
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="6" icon={<ToolOutlined/>}>
                            <Link to={`/equipments`}>
                                Equipment
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="5" icon={<DatabaseOutlined/>}>
                            <Link to={`/facilities`}>
                                Facilities
                            </Link>
                        </Menu.Item> */}
                        {/* <Menu.Item key="6" icon={<SwitcherOutlined />}>
                            <Link to={`/standards`}>
                                Standards
                            </Link>
                        </Menu.Item> */}
                        {/* <Menu.Item key="7" icon={<WarningOutlined />}>
                            <Link to={`/complaints`}>
                                Complaints
                            </Link>
                        </Menu.Item> */}
                        <Menu.Item key="8" icon={<DatabaseOutlined />}>
                            <Link to={`/metric-names`}>
                                Add Data
                            </Link>
                        </Menu.Item>
                    </Menu>
                    <div className="hidden-mobile" style={{position: 'absolute', bottom: '50px', paddingLeft: '24px'}}>
                        <a href="https://docs.google.com/forms/d/e/1FAIpQLSdhz31TSBov8mui_c617Nm7m0nyPPRkr-FqIoCnAEiiXPphTg/viewform" target="blank">Send Feedback</a>
                    </div>
                    <div className="hidden-desktop" style={{position: 'absolute', bottom: '50px', paddingLeft: '6px'}}>
                        <a href="https://docs.google.com/forms/d/e/1FAIpQLSdhz31TSBov8mui_c617Nm7m0nyPPRkr-FqIoCnAEiiXPphTg/viewform" target="blank">Feedback</a>
                    </div>
                </>
            </Sider>
            <Layout className="site-layout" style={{marginLeft: collapsed ? 80 : 200, transition: '.2s ease'}}>
                <Header className="site-layout-background" style={{padding: 0}}>

                    <Row>
                        <Col lg={{ span: 8 }} md={{ span: 4}} className="hidden-mobile"  sm={4}>
                            <div onClick={() => setCollapsed(!collapsed)} className={"trigger"}>
                                {collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}</div>
                        </Col>
                        <Col sm={24} md={{ span: 16, offset: 4 }} lg={{ span: 8, offset: 8 }}>
                            <div className={"companySelector"}>
                                <Dropdown overlay={<CompanyMenu onClick={handleCompanyChange} companies={companies}/>} trigger={['click']}>
                                    <div style={{
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        <img
                                            src={user.selectedCompany.logo}
                                            width={24} alt={""}/>
                                        <div>{user.selectedCompany.name}</div>
                                    </div>
                                </Dropdown>
                                <span >{user.name}</span>
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