import {FC, useCallback, useEffect, useState} from "react";
import {AutoComplete, Button, Form, Input, InputNumber} from 'antd';
import styled from "styled-components";
import ResourceService from "../../../Services/ResourceService";
import {useNavigate} from "react-router-dom";

const Wrapper = styled.section`
  margin: auto;
  max-width: 900px;
  padding-top: 20px;

  form {
    background: #fff;
    padding: 30px;
  }
`

const Title = styled.h1`
  margin-bottom: 40px;
  font-size: 1.5rem;
  color: #333;
`

const NewLocation: FC = () => {

    const navigate = useNavigate()

    const [companiesOption, setCompaniesOption] = useState([])

    useEffect(() => {
        ResourceService.index({resourceName: 'companies'})
            .then(({data}) => {
                setCompaniesOption(data.map((company: { name: any; id: any; }) => ({
                    label: company.name,
                    value: company.id
                })))
            })
    }, [])

    const submitForm = useCallback((fields) => {
        ResourceService.store({
            resourceName: 'locations',
            fields
        }).then(res => {
            navigate('/locations')
        }).catch(e => {
            console.log(e)
        })
    }, [])

    return (
        <Wrapper>
            <Title>
                Adding New Location
            </Title>
            <Form
                layout="vertical"
                onFinish={submitForm}
            >
                <Form.Item required label="Location Name" name={"name"}>
                    <Input/>
                </Form.Item>

                <Form.Item required label="Net Acres" name={"net_acres"}>
                    <InputNumber min={0}/>
                </Form.Item>
                <Form.Item required label="County" name={"county"}>
                    <Input/>
                </Form.Item>
                <Form.Item required label="City" name={"city"}>
                    <Input/>
                </Form.Item>
                <Form.Item required label="State" name={"state"}>
                    <Input/>
                </Form.Item>
                <Form.Item required label="Latitude" name={"latitude"}>
                    <Input/>
                </Form.Item>
                <Form.Item required label="Longitude" name={"longitude"}>
                    <Input/>
                </Form.Item>

                <Form.Item
                    name="company_id"
                    label="Select A Company"
                    rules={[{required: true, message: 'Please Select A Company'}]}
                >
                    <AutoComplete options={companiesOption} placeholder="company">
                        <Input/>
                    </AutoComplete>
                </Form.Item>

                <Form.Item>
                    <Button type={"primary"} htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
        </Wrapper>
    )
}

export default NewLocation