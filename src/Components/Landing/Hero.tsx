import { FC } from "react";
import { Row, Col } from "antd";

import styled from "styled-components";

const LiticoBlueSection = styled.section`
  --text-white: #fff;

  background-color: var(--litico-blue);
  min-height: 50vh;
  padding: 3rem;
  text-align: center;

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
    font-weight: 600;
  
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
      <Row justify="center" align="middle">
        <Col xs={18} md={16}>
          <div>
            <HeroHeading>ESG reporting shouldn't be so hard</HeroHeading>
            <HeroHeading2>It's time to simplify ESG for good.</HeroHeading2>
            <HeroHeading3>
              A purpose-built SaaS platform that simplifies how companies
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
