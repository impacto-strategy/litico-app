import {Bar, ColumnConfig} from "@ant-design/charts";
import styled from "styled-components";
import { FC } from "react";

const Wrapper = styled.div`
  background: #fff;
  padding: 20px;
  width: 100%;
  grid-column: 1/5;
  @media (min-width: 767px) {
      grid-column: 1/5
  }
`

const DonationsVolunteer: FC<{data: any}> = (props) => {
    const data = props.data.concat({
        label: "2022",
        value: 20000
    })
    console.log(data)
    const config: ColumnConfig = {
        data: data,
        xField: 'value',
        yField: 'label',
        seriesField: 'label',
        legend: {
            position: 'top-left',
            flipPage: false,
            itemName: {
                formatter: (text: string, item: any, index: number) => {
                    return text + " Donations ($)";
                }
            }
        },
        xAxis: {
            // Adjust label for hours
            label: {
              formatter: (val: any) => `${(val).substring(0,15)}`,
            },
            title: {
                style: {
                    fontSize: 12,
                },
                text: "Donations ($)"
            },
        },
        meta: {
            value: {
              formatter: (val: any) => {
                    return `$${val.toString().replace(/\d{1,3}(?=(\d{3})+$)/g, (s: any) => `${s},`)}`
              },
            },
        },
        tooltip: {
            formatter: (data: any) => {
                return {name: `${data.label} Donations ($)`, value: `$${data.value.toString().replace(/\d{1,3}(?=(\d{3})+$)/g, (s: any) => `${s},`)}`}
            }
        }
    };
    return (
        <Wrapper>
            <h2>
                Charitable Contributions
            </h2>
            <Bar {...config} />
        </Wrapper>
    )
}

export default DonationsVolunteer