import { FC } from "react";
import { Row, Col } from "antd";

import styled from "styled-components";

const ContactText = styled.p`
    font-weight: bold;
    margin-top: 1rem;
`

const FooterContainer = styled.div`
    --text-white: #fff;

    background-color: var(--litico-blue);
    color: var(--text-white);
    display: grid;
    grid-template-rows: 1fr 1fr;

    @media screen and (max-width: 768px) {
        height: 32vw;
    }

    @media screen and (max-width: 580px) {
        height: 40vw;
    }

    @media screen and (max-width: 466px) {
        height: 50vw;
    }

    @media screen and (max-width: 376px) {
        height: 60vw;
    }
`;

const FooterColumn = styled.div`
    text-align: center;
    margin-bottom: 1rem;
`;

const Footer: FC = () => {
    return (
        <FooterContainer>
            <Row justify="center" align="middle">
                <ContactText>Contact Us</ContactText>
            </Row>
            <Row justify="center" align="top">
                <Col xs={24} sm={24} md={6} lg={5} xl={4}>
                    <FooterColumn>410 17th Street, Suite 1600<br />Denver, CO 80202</FooterColumn>
                </Col>
                <Col xs={24} sm={24} md={6} lg={5} xl={4}>
                    <FooterColumn>
                        <a href="tel:+17207375626" style={{color: "#fff"}}>(720) 737-5626</a>
                    </FooterColumn>
                </Col>
                <Col xs={24} sm={24} md={6} lg={5} xl={4}>
                    <FooterColumn>
                        <a href="mailto:support@impactostrategy.com" style={{color: "#fff"}}>support@impactostrategy.com</a>
                    </FooterColumn>
                </Col>
            </Row>
        </FooterContainer>
    );
};

export default Footer;