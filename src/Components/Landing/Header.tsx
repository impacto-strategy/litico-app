import { FC } from 'react'
import {Row, Col,Menu} from 'antd';
import { Link } from "react-router-dom";

import styled from "styled-components";

// @ts-ignore
import logo from './images/Litico_tm.jpg'

const MenuItem = styled(Menu.Item)`
  font-weight: 600;
  font-size: 1.1rem;
`

const HeaderWrapper = styled.div`
  margin: 1em;
  padding: 1em;
`

const Header: FC = () => {
  return (
    <header>
      <HeaderWrapper>
        <Row justify='space-between'>
          <Col>
            <img src={logo} alt="Litico logo" height={80} />
          </Col>
          <Col>
            <Menu>
              <MenuItem key="0">
                  <Link to={`/login`}>
                      Client Login
                  </Link>
              </MenuItem>
            </Menu>
          </Col>
        </Row>        
      </HeaderWrapper>
    </header>
  )
}

export default Header