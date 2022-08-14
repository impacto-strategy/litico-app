import { FC } from "react";
import { Row, Col, Menu } from "antd";
import { Link } from "react-router-dom";


import styled from "styled-components";

// @ts-ignore
import logo from "./images/Litico_tm.jpg";
import { MenuOutlined } from "@ant-design/icons";

const MenuItem = styled(Menu.Item)`
  font-weight: 600;
  font-size: 1.1rem;
`;

const HeaderWrapper = styled.div`
  margin: 1em;
  padding: 1em;
`;

const Logo = styled.img`
  height: 80px;

  @media only screen and (max-width: 640px) {
    height: 50px;
  }
`;

const Header: FC = () => {
  return (
    <header>
      <HeaderWrapper>
        <Row justify="space-between">
          <Col span={18} sm={12}>
            <Logo src={logo} alt="Litico logo" />
          </Col>
          <Col span={6} sm={12}>
            <Menu mode="horizontal"
              overflowedIndicator={<MenuOutlined />}
              style={{ justifyContent: "end", borderBottom: 0 }}>
              <MenuItem key="0">
                <a href="https://www.impactostrategy.com/meet-the-team">
                  Meet the Team
                </a>
              </MenuItem>
              <MenuItem key="1">
                <a href="https://www.impactostrategy.com/">Impacto</a>
              </MenuItem>
              <MenuItem key="2">
                <Link to={`/login`}>Client Login</Link>
              </MenuItem>
            </Menu>{" "}
          </Col>
        </Row>
      </HeaderWrapper>
    </header>
  );
};

export default Header;
