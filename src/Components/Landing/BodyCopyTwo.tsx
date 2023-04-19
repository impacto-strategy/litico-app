import { FC } from "react";

import styled from "styled-components";

const BodyCopySection = styled.section`
    padding: 3rem;
    text-align: center;
    position: relative;

    font-family: 'Montserrat', sans-serif;
    font-size: 20px;
    font-weight: 500;
`

const BodyCopyHeader = styled.span`
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 50px;
`

const HeaderLine = styled.div`
    border-bottom: 1px solid black;
    padding: 10px;
    margin: auto;
    width: 33%;
`

const BodyCopyText = styled.div`
    margin-top: 20px;
    color: rgba(64, 72, 82, 0.76);
`

const BodyCopyTwo: FC = () => {
    return (
        <BodyCopySection>
            <BodyCopyHeader>Making the Complex Manageable</BodyCopyHeader>
            <HeaderLine></HeaderLine>
            <BodyCopyText>
                Federal, state, county, and local regulatory compliance is vital to successful oil and gas operations. The absence of a proactive, clear risk management strategy can lead to delayed permits, fines, reputational crisis, legal ramifications, and more. 
                Litico helps solve this by providing a holistic view of your operation’s compliance and regulatory activities – from site development to community feedback to reclamation processes.
                Litico sources data analytics and regulatory intelligence from regulators that delivers actionable insights through compliance and ESG reporting to inform tactical business decisions in a dynamic visual platform. It also helps the industry as a whole; seeing how operators rank when compared to their peer organization elevates operational excellence across the industry.
            </BodyCopyText>
        </BodyCopySection>
    )
}

export default BodyCopyTwo