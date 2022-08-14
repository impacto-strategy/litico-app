import { FC } from "react";
import {Row, Col} from "antd";

import styled from "styled-components";

const LiticoBlueSection = styled.section`
  --text-white: #fff;

  background-color: var(--landing-primary);
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
`;

const HeadingsRow = styled(Row)`
`

const HeroHeading1 = styled.h1`
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
      <HeadingsRow justify="center" align="middle">
        <Col xs={18} md={16}>
          <HeroHeading1>ESG reporting shouldn't be so hard</HeroHeading1>
          <HeroHeading2>It's time to simplify ESG for good.</HeroHeading2>
          <HeroHeading3>
            A purpose-built SaaS platform that simplifies how companies
            integrate, manage, visualize, report, and amplify their
            sustainability performance.
          </HeroHeading3>
        </Col>
      </HeadingsRow>
    </LiticoBlueSection>
  );
};

export default Hero;
