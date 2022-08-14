import { Layout } from "antd";
import { FC } from "react";

import styled from "styled-components";
import ESG_Simplified from "../Components/Landing/ESG_Simplified";

import Header from "../Components/Landing/Header";
import Hero from "../Components/Landing/Hero";

const LandingLayout = styled(Layout)`
  --landing-primary: rgb(46, 67, 117);
  --environmental-green: rgb(76,230,76);
  --environmental-green-light: rgb(171,255,171);
  --social-teal: rgb(102,255,179);

  --governance-blue: rgb(77,153,255);
  --governance-blue-light: rgb(166,204,255);

  header > *,
  main > * {
    margin-left: auto;
    margin-right: auto;
    max-width: 1500px;
    width: 100%;
  }
`;

const Landing: FC = () => {
  return (
    <LandingLayout id={"components-landing-page-layout"}>
      <Header />
      <main>
        <Hero />
        <ESG_Simplified />
      </main>
    </LandingLayout>
  );
};

export default Landing;
