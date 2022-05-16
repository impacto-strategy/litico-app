import React, {FC, useEffect, useState, useCallback }  from 'react';
import styled from "styled-components";
import { Bar, BarConfig } from "@ant-design/charts";
import { filter } from "lodash";
import ResourceService from "../Services/ResourceService";

const Wrapper = styled.div`
  background: #fff;
  padding: 20px;
`

const Containter = styled.div`
  width: 46%;
`

const Emissions2020CO2: FC<{units: string, title: string}> = props => {
    const [_data, setEmissionData] = useState<any>([])

    const getEmissions = useCallback(() => {
            ResourceService.index({
                resourceName: 'emissions'
            }).then(({ data }) => {
                setEmissionData(filter(data, (em) => {return  em.units === props.units && em.value > 0 }))
            })

    }, [props.units])

    useEffect(() => {
        getEmissions()
    }, [ getEmissions])


    const config: BarConfig = {
        data: _data,
        isGroup: true,
        xField: 'value',
        yField: 'epa_requirement_description',
        yAxis: {
            label: {
                formatter: (text) => `${text.substring(0, 20)}`
            },
        },
        seriesField: 'date',
        legend: false,
    };
    return (
        <Containter>
            {_data.length > 0 &&
                <Wrapper>
                    <h2>
                        {props.title}
                    </h2>

                    <Bar {...config} />
                </Wrapper>
            }
        </Containter>
    )
}

export default Emissions2020CO2