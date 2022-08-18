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
  text-align: left;
  background-color: #fff;

  @media only screen and (min-width: 960px) {
    transform: translateX(130px);
  }

  h2 {
    color: var(--litico-blue);
    font-size: 3rem;
    line-height: 1.5;
    font-weight: 600;
    margin-bottom: 0.4rem;
  }

  h3 {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 0;

    &:first-child {
      span {
        &:first-child {
          color: var(--landing-primary-300);
        }

        &:last-child {
          color: var(--landing-primary);
        }
      }
    }

    &:nth-child(2) {
      span {
        &:first-child {
          color: var(--landing-secondary-300);
        }

        &:last-child {
          color: var(--landing-secondary);
        }
      }
    }

    &:nth-child(3) {
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
        <Col span={24} order={1} sm={{span: 12, order: 0}} md={8} style={{zIndex: 1}}>
          <SimplifiedContentCard>
            <h2>ESG Simplified</h2>
            <div>
              <h3><span>Build</span> <span>Trust</span></h3>
              <h3><span>Drive</span> <span>Growth</span></h3>
              <h3><span>Bring</span> <span>Change</span></h3>
            </div>
          </SimplifiedContentCard>
        </Col>
        <Col xs={24} sm={{span: 12, order: 0}} md={14} order={0}>
          <LaptopDemoImgSection>
            <img src={LaptopDemoImg} alt="Dashboard on a laptop screen" />
          </LaptopDemoImgSection>
        </Col>
      </Row>
    </ESGSimplifiedSection>
  );
};

export default ESGSimplified