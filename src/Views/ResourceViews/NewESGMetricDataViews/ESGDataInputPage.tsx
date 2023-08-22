import { Divider, Form, PageHeader, Space } from "antd";
import Cookies from 'js-cookie';
import { FC, useCallback, useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";

import BulkDataFormOptions from "./components/BulkDataFormOptions";
import ESGDataInputForm from "./components/ESGDataInputForm";
import MetricStandardsCard from "./components/MetricStandardsCard";

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
 * User interface for users to input new ESG metric data for specific metric and sub metric type. By dividing the code into three sub components, we wanted to ensure it was readable for developers by reducing overall file size.
 */
const ESGDataInputPage: FC = (): JSX.Element => {

    const [fields, setFields] = useState<ifields>();
    const [form] = Form.useForm();
    const [searchParams] = useSearchParams();
    const [standards, setMetricStandards] = useState<any>();

    const setDefaultFields = useCallback(() => {
        form.setFieldsValue({
            state: 'CO',
            basin: 'DJ Basin'
        })
    }, [form])

    const getStandards = useCallback(() => {
        ResourceService.index({
            resourceName: 'standards',
            params: { metric_subtype: searchParams.get("metric_subtype") }
        }).then(({ data }) => {
            setMetricStandards(data);
            setFields(data[0].esg_metric_factors);
            setDefaultFields();
        })

    }, [searchParams, setMetricStandards, setDefaultFields])

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
                    {/* These are the excel buttons near the top of the page. */}
                    <BulkDataFormOptions
                        headers={headers}
                        searchParams={searchParams}
                    />
                    <MetricStandardsCard standards={standards} />
                    <Divider />
                    <ESGDataInputForm
                        fields={fields}
                        form={form}
                        searchParams={searchParams}
                        standards={standards}
                    />
                </ContentWrapper>
            </Space>
        </Wrapper>
    )
}

export default ESGDataInputPage;