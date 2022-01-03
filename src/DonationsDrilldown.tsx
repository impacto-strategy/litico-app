import {Column, ColumnConfig} from "@ant-design/charts";
import styled from "styled-components";


const dataSource = [
    {
        month: "Jan",
        value: 9500,
        foundation: "The Bridge Project"
    },

    {
        month: "May",
        value: 3000,
        foundation: "Cleo Parker Robinson Dance Ensemble"
    },
    {
        month: "May",
        value: 1000,
        foundation: "Colorado Ballet"
    },
    {
        month: "May",
        value: 7500,
        foundation: "Colorado Science & Engineering Fair"
    },
    {
        month: "May",
        value: 1000,
        foundation: "Denver Center of Performing Arts"
    },
    {
        month: "Jun",
        value: 29000,
        foundation: "Denver Earth Resources Library"
    },
    {
        month: "Jun",
        value: 15000,
        foundation: "Energy Outreach Colorado"
    },
    {
        month: "Jul",
        value: 14000,
        foundation: "Howard County Volunteer Fire Department"
    },

    {
        month: "Jul",
        value: 1000,
        foundation: "The Wyoming Two Fly Foundation"
    },

    {
        month: "Jul",
        value: 1625,
        foundation: "Weld County Fair"
    },
    {
        month: "Aug",
        value: 1000,
        foundation: "Colorado Ballet"
    },
    {
        month: "Aug",
        value: 7500,
        foundation: "Colorado Science & Engineering Fair"
    },
    {
        month: "Sep",
        value: 1000,
        foundation: "Denver Center of Performing Arts"
    },
    {
        month: "Oct",
        value: 29000,
        foundation: "Denver Earth Resources Library"
    },
    {
        month: "Nov",
        value: 15000,
        foundation: "Energy Outreach Colorado"
    },
    {
        month: "Nov",
        value: 14000,
        foundation: "Howard County Volunteer Fire Department"
    },

    {
        month: "Dec",
        value: 1000,
        foundation: "The Wyoming Two Fly Foundation"
    },

    {
        month: "Dec",
        value: 1625,
        foundation: "Weld County Fair"
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