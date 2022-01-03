import {Column, ColumnConfig} from "@ant-design/charts";
import styled from "styled-components";

const dataSource = [
    {
        period: 'Q1',
        value: 12500.00
    },
    {
        period: 'Q2',
        value: 35800.00
    },
    {
        period: 'Q3',
        value: 36625.00
    },
    {
        period: 'Q4',
        value: 56625.00
    }
]


const Wrapper = styled.div`
  background: #fff;
  padding: 20px;
  width: 50%;
`

const Donations = () => {
    const config: ColumnConfig = {
        data: dataSource,
        xField: 'period',
        yField: 'value',
        conversionTag: {},
        yAxis: {

            label: {
                autoHide: false,
                autoRotate: false,
                formatter: (text) => `${Number(text).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                })}`
            },
        },

    };
    return (
        <Wrapper>
            <h2>
                Charitable Donations - 2020
            </h2>
            <Column {...config} />
        </Wrapper>
    )
}

export default Donations