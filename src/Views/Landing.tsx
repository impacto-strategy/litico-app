import { Layout } from "antd";
import { FC, useState } from "react";

import styled from "styled-components";
import BetaGroupCTA from "../Components/Landing/BetaGroupCTA";
import ESGSimplified from "../Components/Landing/ESGSimplified";

import Header from "../Components/Landing/Header";
import Hero from "../Components/Landing/Hero";
import SignupForm from "../Components/Landing/SignupForm";
import Footer from "../Components/Landing/Footer";

const LandingLayout = styled(Layout)`
  --landing-primary-300: #acdabb;
  --landing-primary: #49ac76;
  --landing-primary-500: #49ac76;
  --landing-primary-700: #2d7c50;
  --landing-secondary-300: #b0dfdb;
  --landing-secondary: #5bc4bf;
  --landing-secondary-500: #5bc4bf;
  --landing-secondary-700: #2d7e79;
  --landing-accent-300: #a2b9e0;
  --landing-accent: #497cb6;
  --landing-accent-500: #497cb6;
  --landing-accent-700: #1d4067;

  --litico-blue: rgb(46, 67, 117);
  --environmental-green: rgb(76, 230, 76);
  --environmental-green-light: rgb(171, 255, 171);
  --social-teal: rgb(102, 255, 179);

  --governance-blue: rgb(77, 153, 255);
  --governance-blue-light: rgb(166, 204, 255);

  font-family: 'Montserrat', sans-serif;

  header > *,
  main > * {
    margin-left: auto;
    margin-right: auto;
    max-width: 1500px;
    width: 100%;
  }
`;

const Landing: FC = () => {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <LandingLayout id={"components-landing-page-layout"}>
      <Header />
      <main>
        <Hero /> 
        <ESGSimplified />
        <BetaGroupCTA visible={visible} setVisible={setVisible}/>
        <SignupForm visible={visible} setVisible={setVisible}/>
      </main>
      <Footer />
    </LandingLayout>
  );
};

export default Landing;