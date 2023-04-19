import { FC } from "react";
import { Row, Col } from "antd";

import styled from "styled-components";

// @ts-ignore
import LaptopDemoImg from "./images/LITICOLaptop.jpg";

const ESGSimplifiedSection = styled.section`
  height: 600px;
  padding: 1.5rem;
  margin-top: 1rem;
`

const SimplifiedContentCard = styled.div`
  border-radius: 0.375rem;
  filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06));
  padding: 1rem;
  text-align: right;
  background-color: #fff;

  @media only screen and (min-width: 960px) {
    transform: translateX(-100px);
  }

  h2 {
    color: var(--litico-blue);
    font-size: 3rem;
    line-height: 1.5;
    font-weight: 800;
    margin-bottom: 0.4rem;
  }

  h3 {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 0;

    // 3n + 1

    &:nth-child(2n+1), &:nth-child(2n+2) {
      span {
        &:first-child {
          color: var(--landing-primary-300);
        }

        &:last-child {
          color: var(--landing-primary);
        }
      }
    }

    &:nth-child(2n+3), &:nth-child(2n+4) {
      span {
        &:first-child {
          color: var(--landing-secondary-300);
        }

        &:last-child {
          color: var(--landing-secondary);
        }
      }
    }

    &:nth-child(2n+5), &:nth-child(2n+6) {
      span {
        &:first-child {
          color: var(--landing-accent-300);
        }

        &:last-child {
          color: var(--landing-accent);
        }
      }
    }

  }
`

const LaptopDemoImgSection = styled.div`
  padding: 0.5rem;

  img {
    max-height: 100%;
    max-width: 100%;
  }
`

const ESGSimplified: FC = () => {
  return (
    <ESGSimplifiedSection>
      <Row justify="end" align="middle">
        {/* Initially 12 for span */}
        <Col span={30} order={1} sm={{span: 14, order: 0}} md={10} style={{zIndex: 1}}>
          <SimplifiedContentCard>
            <h2>Business Intelligence</h2>
            <div>
              <h3><span>Risk</span> <span>mitigation</span></h3>
              <h3><span>Regulatory</span> <span>preparedness</span></h3>
              <h3><span>Competitor</span> <span>surveillance</span></h3>
              <h3><span>Compliance</span> <span>risk management</span></h3>
              <h3><span>Real-time</span> <span>reporting</span></h3>
              <h3><span>ESG</span> <span>integration & reporting</span></h3>
            </div>
          </SimplifiedContentCard>
        </Col>
        <Col xs={22} sm={{span: 12, order: 0}} md={12} order={0}>
          <LaptopDemoImgSection>
            <img src={LaptopDemoImg} alt="Dashboard on a laptop screen" />
          </LaptopDemoImgSection>
        </Col>
      </Row>
    </ESGSimplifiedSection>
  );
};

export default ESGSimplified