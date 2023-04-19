import { FC } from "react";

import styled from "styled-components";

const BodyCopySection = styled.section`
    color: rgba(64, 72, 82, 0.76);
    padding: 3rem;
    text-align: center;
    position: relative;

    font-family: 'Montserrat', sans-serif;
    font-size: 20px;
    font-weight: 500;
`

const Trademark = styled.span`
  display: inline-block;
  font-size: 0.8rem;
  height: 2.2rem;
  vertical-align: middle;
`;

const BodyCopyOne: FC = () => {
    return (
        <BodyCopySection>
            <div>
                Litico<Trademark>™</Trademark> is an analytics, risk-management platform that tracks oil and gas regulatory compliance and ESG performance simplifying how oil and gas companies integrate, manage, visualize and report data.
                <div style={{marginBottom: 10}}></div>
                <br style={{marginBottom: 10}}/> 
                Litico is transforming the way oil and gas companies operate by providing the technology to help them meet and exceed the regulatory requirements that are critical to successful operations. 
                <div style={{marginBottom: 10}}></div>
                <br style={{marginBottom: 10}}/> 
                Our custom surveillance tools are built to help operators navigate a complex regulatory landscape by revealing permitting trends, competitor surveillance, compliance risk, and delivering real-time reporting.
            </div>
        </BodyCopySection>
    )
}

export default BodyCopyOne