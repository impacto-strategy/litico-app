import { FC } from "react";
import { Row, Col } from "antd";
import styled from "styled-components";

const Section = styled.section`
  padding: 2rem 0;
  text-align: center;
`;

const Button = styled.button`
  background-color: var(--litico-blue);
  color: #fff;
  border: 0px solid transparent;
  border-radius: 1.5rem;
  padding: 0.75rem 1.5rem;
  text-transform: uppercase;
`;

const LimitedSpotsDisclaimer = styled.p`
  color: var(--litico-blue);
  font-weight: 600;
`;

const BetaGroupCTA: FC = () => {
  return (
    <Section>
      <Row justify="center">
        <Col>
          <p>
            {/* TODO: where does this need to link to? */}
            <Button>Join our beta group today!</Button>
          </p>
          <LimitedSpotsDisclaimer>
            Limited number of spots available.
          </LimitedSpotsDisclaimer>
        </Col>
      </Row>
    </Section>
  );
};

export default BetaGroupCTA;
