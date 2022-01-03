/* eslint-disable no-restricted-globals */
import {Button, Checkbox, DatePicker, Form, PageHeader} from "antd";
import {useNavigate} from "react-router-dom";
import ResourceService from "../../../Services/ResourceService";
import {useCallback} from "react";
import styled from "styled-components";


const FormWrapper = styled.div`
  background: #fff;
  padding: 30px;
  margin-top: 20px;
  max-width: 600px;
`

const ReportsNew = () => {
    const navigate = useNavigate()

    const submitForm = useCallback((fields) => {
        ResourceService.store({
            resourceName: 'reports',
            fields
        }).then(res => {
            navigate('/reports')
        }).catch(e => {
            console.log(e)
        })
    }, [])

    return (

        <>
            <PageHeader
                className="site-page-header"
                ghost={false}
                onBack={() => confirm('Are you sure you want to leave this page?') && navigate('/reports')}
                title="Add New Report"
                subTitle="Use this page to add a new report template for the given period."
            />
            <FormWrapper>
                <Form
                    layout="vertical"
                    onFinish={submitForm}
                >
                    <Form.Item required label="Select Year" name={"year"}>
                        <DatePicker picker="year" mode={"year"} format={"YYYY"}/>
                    </Form.Item>

                    <Form.Item name={"includeQuarterlyReports"}
                               valuePropName="checked"
                    >
                        <Checkbox>
                            Generate Quarterly Reports
                        </Checkbox>
                    </Form.Item>


                    <Form.Item>
                        <Button type={"primary"} htmlType="submit">Submit</Button>
                    </Form.Item>
                </Form>
            </FormWrapper>
        </>
    )
}

export default ReportsNew