import {FC, useCallback, useEffect, useState} from "react";
import styled from "styled-components";
import {Link, useNavigate} from "react-router-dom";

const Wrapper = styled.section`
  margin: auto;
  max-width: 900px;
  padding-top: 20px;

  a {
    background: #fff;
    padding: 14px 30px;
    margin-top: 30px;
    font-size: 24px;
  }
`

const Title = styled.h1`
  margin-bottom: 40px;
  font-size: 1.5rem;
  color: #333;
`

const MetricsPeriodSelector: FC = () => {

    const navigate = useNavigate()

    const [companiesOption, setCompaniesOption] = useState([])

    useEffect(() => {

    }, [])

    const submitForm = useCallback((fields) => {

    }, [])

    return (
        <Wrapper>
            <Title>
                Select A Year
            </Title>
            <div>
                <Link to={"2020"}>
                    2020
                </Link>
            </div>
        </Wrapper>
    )
}

export default MetricsPeriodSelector