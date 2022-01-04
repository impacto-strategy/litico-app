import React, {FC, useEffect, useState} from "react";
import styled from "styled-components";
import ResourceService from "../Services/ResourceService";
import {groupBy, map, sortBy} from "lodash";
import {Button} from "antd";
import MetricForm from "../Components/MetricForm";

const Wrapper = styled.section`
  margin: auto;
  max-width: 1150px;
  padding-top: 20px;
  padding-bottom: 40px;

`

const Title = styled.h1`
  margin-bottom: 40px;
  font-size: 1.5rem;
  color: #333;
`



const Metrics: FC = () => {


    const [ipiecaStandards, setIpiecaStandards] = useState<any>([])



    const handleAdd = (standard: any, id: any) => {

        const data = [...ipiecaStandards]


        const idx = data.indexOf(standard)

        const standards = data[idx]

        const metricInstance = standards.standards.find((item: any) => item.id === id)

        const metricIdx = standards.standards.indexOf(metricInstance)

        const newData: any = {
            name: data[idx].standards[metricIdx].name,
            value: null,
            risk: null,
            narrative: '',
            i_p_i_e_c_a_indicator_id: data[idx].standards[metricIdx].id
        };

        data[idx].standards[metricIdx].metrics.push(newData)

        setIpiecaStandards(data)
    };




    useEffect(() => {
        ResourceService.index({resourceName: 'ipieca-indicators'}).then(({data}) => {
            setIpiecaStandards(sortBy(map(groupBy(data, 'module'), (standards, moduleName) => {
                return {
                    moduleName,
                    standards
                }
            }), 'moduleName'))
        })
    }, [])


    const updateMetric = (metric: any) => {
        ResourceService.store({
            resourceName: 'metrics',
            fields: metric
        })
    }

    return (
        <Wrapper>
            <Title>
                2020 Metrics
            </Title>
            <div>
                {ipiecaStandards.map((std: any) => (
                    <div key={std.moduleName}>
                        <h2>{std.moduleName}</h2>
                        <hr/>
                        {std.standards.map((item: any) => (
                            <div key={item.id}>
                                <h3>{item.indicator} | {item.name}</h3>

                                <div style={{marginBottom: 40}}>

                                    <div>
                                        {item.metrics.map((metric: any, idx: number) => (
                                            <MetricForm key={idx} metric={metric} onAdd={updateMetric}/>
                                        ))}
                                    </div>

                                    <Button type="primary" onClick={() => handleAdd(std, item.id)}
                                            style={{marginTop: 16}}>
                                        Add a metric
                                    </Button>

                                </div>
                            </div>
                        ))}

                    </div>
                ))}
            </div>
        </Wrapper>
    )
}

export default Metrics