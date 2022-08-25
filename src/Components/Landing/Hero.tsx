import { FC } from "react";
import { Row, Col } from "antd";

import styled from "styled-components";

// @ts-ignore
import HeroImage from './images/_Broomfield_Set_02-8913.jpg'

const LiticoBlueSection = styled.section`
  --text-white: #fff;

  background-image: url(${HeroImage});
  background-size: cover;
  background-position: 50% 50%;
  min-height: 60vh;
  padding: 3rem;
  text-align: center;
  position: relative;

  font-family: 'Montserrat', sans-serif;
  font-weight: 700;

  canvas.overlay {
    background-color: rgba(46,67,117, 0.85);
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    height: 100%;
    width: 100%;
  }

  display: flex;
  justify-content: center;
  align-items: center;

  h1,
  h2,
  h3 {
    color: var(--text-white);
  }

  h1 {
    font-size: 3rem;
    font-weight: 700;
  
    margin-bottom: 0px;
  }

  @media only screen and (max-width: 640px) {
    padding: 1rem;
  }
`;

// TODO: not working? see duped styles above
const HeroHeading = styled.h1`
  font-size: 3rem;
  font-weight: 600;

  margin-bottom: 0px;
`;

const HeroHeading2 = styled.h2`
  font-size: 2.2rem;
  font-weight: 500;
`;

const HeroHeading3 = styled.h3`
  font-size 1.5rem;
  white-space: pre-line; 
`;

const Hero: FC = () => {
  return (
    <LiticoBlueSection>
      <canvas className="overlay" />
      <Row justify="center" align="middle">
        <Col xs={18} md={16}>
          <div>
            <HeroHeading>ESG reporting shouldn't be so hard</HeroHeading>
            <HeroHeading2>It's time to simplify ESG for good.</HeroHeading2>
            <HeroHeading3>
              A purpose-built SaaS platform that simplifies how oil and gas companies
              integrate, manage, visualize, report, and amplify their
              sustainability performance.
            </HeroHeading3>
          </div>
        </Col>
      </Row>
    </LiticoBlueSection>
  );
};

export default Hero;
