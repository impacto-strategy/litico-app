import { FC } from "react";
import { Row, Col } from "antd";

import styled from "styled-components";

const ContactText = styled.p`
    font-weight: bold;
`

const FooterContainer = styled.div`
    --text-white: #fff;

    background-color: var(--litico-blue);
    color: var(--text-white);
    display: grid;
    grid-template-rows: 1fr 1fr;
    height: 8rem;
`;
const FooterColumn = styled.div`
    text-align: center;
`;

const Footer: FC = () => {
    return (
        <FooterContainer>
            <Row justify="center" align="middle">
                <ContactText>Contact Us</ContactText>
            </Row>
            <Row justify="center" align="top">
                <Col xs={8} sm={7} md={6} lg={5} xl={4}>
                    <FooterColumn>410 17th Street, Suite 1600 Denver, CO 80202</FooterColumn>
                </Col>
                <Col xs={8} sm={7} md={6} lg={5} xl={4}>
                    <FooterColumn>(720) 737-5626</FooterColumn>
                </Col>
                <Col xs={8} sm={7} md={6} lg={5} xl={4}>
                    <FooterColumn>support@impactostrategy.com</FooterColumn>
                </Col>
            </Row>
        </FooterContainer>
    );
};

export default Footer;