import {Column, ColumnConfig} from "@ant-design/charts";
import styled from "styled-components";


const dataSource = [
    {
        month: "Jan",
        value: 9500,
        foundation: "Food Bank of The Rockies"
    },

    {
        month: "May",
        value: 3000,
        foundation: "Weld County Food Bank"
    },
    {
        month: "May",
        value: 1000,
        foundation: "Great Plains Food Bank"
    },
    {
        month: "May",
        value: 7500,
        foundation: "McKenzie County Health System"
    },
    {
        month: "May",
        value: 1000,
        foundation: "Colorado Children’s Hospital"
    },
    {
        month: "Jun",
        value: 29000,
        foundation: "A Precious Child"
    },
    {
        month: "Jun",
        value: 15000,
        foundation: "McKenzie County School District"
    },
    {
        month: "Jul",
        value: 14000,
        foundation: "Colorado Energy Foundation"
    },

    {
        month: "Jul",
        value: 1000,
                foundation: "Food Bank of The Rockies"

    },

    {
        month: "Jul",
        value: 1625,
                foundation: "Weld County Food Bank"

    },
    {
        month: "Aug",
        value: 1000,
                foundation: "Great Plains Food Bank"

    },
    {
        month: "Aug",
        value: 7500,
                foundation: "McKenzie County Health System"

    },
    {
        month: "Sep",
        value: 1000,
                foundation: "Colorado Children’s Hospital"

    },
    {
        month: "Oct",
        value: 29000,
                foundation: "A Precious Child"

    },
    {
        month: "Nov",
        value: 15000,
                foundation: "McKenzie County School District"

    },
    {
        month: "Nov",
        value: 14000,
                foundation: "Colorado Energy Foundation"

    },

    {
        month: "Dec",
        value: 1000,
                        foundation: "McKenzie County Health System"

    },

    {
        month: "Dec",
        value: 1625,
                        foundation: "Colorado Children’s Hospital"

    },
]


const Wrapper = styled.div`
  background: #fff;
  padding: 20px;
  width: 90%;
`

const DonationsDrilldown = () => {
    const config: ColumnConfig = {
        data: dataSource,
        isStack: true,
        xField: 'month',
        yField: 'value',
        seriesField: 'foundation',
        label: {
            position: 'middle',
            formatter: (text) => (text.value).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
            }),
            layout: [
                {type: 'interval-adjust-position'},
                {type: 'interval-hide-overlap'},
                {type: 'adjust-color'},
            ],
        },

    };
    return (
        <Wrapper>
            <h2>
                Charitable Donations Drilldown
            </h2>
            <Column {...config} />
        </Wrapper>
    )
}

export default DonationsDrilldown