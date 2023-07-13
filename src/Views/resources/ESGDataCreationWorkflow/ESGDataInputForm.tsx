import { Divider, Form, PageHeader, Space } from "antd";
import Cookies from 'js-cookie';
import { FC, useCallback, useEffect, useState } from "react"
import {useSearchParams} from "react-router-dom";
import styled from "styled-components";

import ExcelFormOptions from "./components/ExcelFormOptions";
import MetricSubtypeAddForm from "./components/MetricSubtypeAddForm";
import StandardsCard from "./components/StandardsCard";

import ResourceService from "../../../Services/ResourceService";

const Wrapper = styled.section`
  margin: auto;
  max-width: none;
  padding-top: 20px;
  padding-bottom: 40px;

`

const ContentWrapper = styled.div`
  background: #fff;
  padding: 60px 30px;
  margin-bottom: 32px;
`

interface ifields {
    id: number,
    name: string,
    col_label: string,
    measurement_units: string[]
}

/**
 * Interface for page where data is added pertaining to a metric subtype.
 */
const ESGDataInputForm: FC = (): JSX.Element => {
    // COMPONENT HOOKS
    const [fields, setFields] = useState<ifields>();
    const [form] = Form.useForm();
    const [searchParams] = useSearchParams();
    const [standards, setMetricStandards] = useState<any>();

    // COMPONENT FUNCTIONS
    const setDefaultFields = useCallback(() => {
        form.setFieldsValue({
            state: 'CO',
            basin: 'DJ Basin'
        })
    },[form])

    const getStandards = useCallback(() => {
        ResourceService.index({
            resourceName: 'standards',
            params: {metric_subtype: searchParams.get("metric_subtype")}
        }).then(({ data }) => {
            setMetricStandards(data);
            console.log(data[0].esg_metric_factors)
            setFields(data[0].esg_metric_factors);
            setDefaultFields();
        })

    }, [searchParams, setMetricStandards, setDefaultFields])

    // MISC
    let token = Cookies.get('XSRF-TOKEN')
    const headers = {
        'X-XSRF-TOKEN': token || ''
    }

    useEffect(() => {
        getStandards()
    }, [getStandards])

    return (
        <Wrapper>
            <Space direction="vertical" style={{ width: '100%' }} size={"large"}>
                <PageHeader
                    ghost={false}
                    onBack={() => window.history.back()}
                    title={searchParams.get("metric_subtype")}
                />
                <ContentWrapper>
                    <ExcelFormOptions 
                        headers={headers}
                        searchParams={searchParams}
                    />
                    <StandardsCard standards={standards}/>
                    <Divider />
                    <MetricSubtypeAddForm 
                        fields={fields}
                        form={form}
                        headers={headers}
                        searchParams={searchParams}
                        standards={standards}
                    />
                </ContentWrapper>
            </Space>
        </Wrapper>
    )
}

export default ESGDataInputForm;