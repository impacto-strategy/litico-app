import styled from "styled-components";
import {Bar} from "@ant-design/charts";
import {useEffect, useState} from "react";
import {Spin} from "antd";
import ResourceService from "../Services/ResourceService";
import {map} from "lodash";
import {Link} from "react-router-dom";
import {BarConfig} from "@ant-design/plots/es/components/bar";

const Wrapper = styled.div`
  background: #fff;
  padding: 20px;
  width: 50%;
`

const EmissionsDrillDown = () => {
    const [_data, setData] = useState<any>(null)

    useEffect(() => {
        ResourceService.index({resourceName: 'metrics-summary'}).then(({data}) => {
            setData(map(data, (values, label) => ({
                type: label,
                value: values.length
            })))
        })
    }, [])

    const config: BarConfig = {
        data: _data,
        xField: 'value',
        yField: 'type',
        seriesField: 'type',
        color: function color(_ref: any) {
            var type = _ref.type;
            if (type === 'High') {
                return 'red'
            }

            return type === 'Low' ? 'green' : 'orange';
        },

        conversionTag: {},
        meta: {
            type: {alias: 'Emissions'},
            value: {alias: 'Count'},
        },
    };


    return (
        <Wrapper>
            <h2>2020 Summary</h2>
            {_data ? <Bar {...config}/> : <Spin size={'large'} style={{marginTop: 90}}/>}
            <div style={{marginTop: 20}}>
                <Link to={'/metrics/2020'}>
                    See Full Report
                </Link>
            </div>
        </Wrapper>
    )
}

export default EmissionsDrillDown