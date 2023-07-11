/* eslint-disable no-restricted-globals */
import {Alert, Button, Form, Input, PageHeader, Select} from "antd";
import {useNavigate} from "react-router-dom";
import ResourceService from "../../../Services/ResourceService";
import {useCallback, useEffect, useMemo, useState} from "react";
import styled from "styled-components";


const FormWrapper = styled.div`
  background: #fff;
  padding: 30px;
  margin-top: 20px;
  max-width: 600px;
`

const STATES = [
    {
        "label": "Alabama",
        "value": "AL"
    },
    {
        "label": "Alaska",
        "value": "AK"
    },
    {
        "label": "American Samoa",
        "value": "AS"
    },
    {
        "label": "Arizona",
        "value": "AZ"
    },
    {
        "label": "Arkansas",
        "value": "AR"
    },
    {
        "label": "California",
        "value": "CA"
    },
    {
        "label": "Colorado",
        "value": "CO"
    },
    {
        "label": "Connecticut",
        "value": "CT"
    },
    {
        "label": "Delaware",
        "value": "DE"
    },
    {
        "label": "District Of Columbia",
        "value": "DC"
    },
    {
        "label": "Federated States Of Micronesia",
        "value": "FM"
    },
    {
        "label": "Florida",
        "value": "FL"
    },
    {
        "label": "Georgia",
        "value": "GA"
    },
    {
        "label": "Guam",
        "value": "GU"
    },
    {
        "label": "Hawaii",
        "value": "HI"
    },
    {
        "label": "Idaho",
        "value": "ID"
    },
    {
        "label": "Illinois",
        "value": "IL"
    },
    {
        "label": "Indiana",
        "value": "IN"
    },
    {
        "label": "Iowa",
        "value": "IA"
    },
    {
        "label": "Kansas",
        "value": "KS"
    },
    {
        "label": "Kentucky",
        "value": "KY"
    },
    {
        "label": "Louisiana",
        "value": "LA"
    },
    {
        "label": "Maine",
        "value": "ME"
    },
    {
        "label": "Marshall Islands",
        "value": "MH"
    },
    {
        "label": "Maryland",
        "value": "MD"
    },
    {
        "label": "Massachusetts",
        "value": "MA"
    },
    {
        "label": "Michigan",
        "value": "MI"
    },
    {
        "label": "Minnesota",
        "value": "MN"
    },
    {
        "label": "Mississippi",
        "value": "MS"
    },
    {
        "label": "Missouri",
        "value": "MO"
    },
    {
        "label": "Montana",
        "value": "MT"
    },
    {
        "label": "Nebraska",
        "value": "NE"
    },
    {
        "label": "Nevada",
        "value": "NV"
    },
    {
        "label": "New Hampshire",
        "value": "NH"
    },
    {
        "label": "New Jersey",
        "value": "NJ"
    },
    {
        "label": "New Mexico",
        "value": "NM"
    },
    {
        "label": "New York",
        "value": "NY"
    },
    {
        "label": "North Carolina",
        "value": "NC"
    },
    {
        "label": "North Dakota",
        "value": "ND"
    },
    {
        "label": "Northern Mariana Islands",
        "value": "MP"
    },
    {
        "label": "Ohio",
        "value": "OH"
    },
    {
        "label": "Oklahoma",
        "value": "OK"
    },
    {
        "label": "Oregon",
        "value": "OR"
    },
    {
        "label": "Palau",
        "value": "PW"
    },
    {
        "label": "Pennsylvania",
        "value": "PA"
    },
    {
        "label": "Puerto Rico",
        "value": "PR"
    },
    {
        "label": "Rhode Island",
        "value": "RI"
    },
    {
        "label": "South Carolina",
        "value": "SC"
    },
    {
        "label": "South Dakota",
        "value": "SD"
    },
    {
        "label": "Tennessee",
        "value": "TN"
    },
    {
        "label": "Texas",
        "value": "TX"
    },
    {
        "label": "Utah",
        "value": "UT"
    },
    {
        "label": "Vermont",
        "value": "VT"
    },
    {
        "label": "Virgin Islands",
        "value": "VI"
    },
    {
        "label": "Virginia",
        "value": "VA"
    },
    {
        "label": "Washington",
        "value": "WA"
    },
    {
        "label": "West Virginia",
        "value": "WV"
    },
    {
        "label": "Wisconsin",
        "value": "WI"
    },
    {
        "label": "Wyoming",
        "value": "WY"
    }
]

const CompaniesNew = () => {
    const navigate = useNavigate()

    const [errors, setErrors] = useState<string[]>([]);

    const [users, setUsers] = useState<any[]>([]);

    const errorsRenderer = useMemo(() => {
        return errors.map(error => <Alert type="error" message={error} banner/>)
    }, [errors])


    useEffect(() => {
        ResourceService.index({
            resourceName: 'users'
        }).then(({data}) => setUsers(data))
    }, [])

const usersFormatted = useMemo(() => {
    return users.map(user => ({value: user.id, label: user.email}))
}, [users])

    const submitForm = useCallback((fields: any) => {


        ResourceService.store({
            resourceName: 'companies',
            fields
        }).then(() => {
            navigate('/companies')
        }).catch((e) => {
            if (e.response?.data.errors) {
                setErrors([...Object.values(e.response.data.errors as string[])])
                return
            }

            if (e.response?.data.message) {
                setErrors([e.response.data.message])
            }
        })
    }, [navigate])

    return (

        <>

            <PageHeader
                className="site-page-header"
                ghost={false}
                onBack={() => confirm('Are you sure you want to leave this page?') && navigate('/companies')}
                title="Add New Company"
                subTitle="Use this page to add a new company."
            />
            <FormWrapper>
                <Form.ErrorList errors={errorsRenderer}/>
                <br/>
                <Form
                    autoComplete={"off"}
                    layout="horizontal"
                    onFinish={submitForm}
                >
                    <Form.Item required label="Company Logo" name={"logo"}>
                        <Input/>
                    </Form.Item>

                    <Form.Item required label="Company Name" name={"name"}>
                        <Input/>
                    </Form.Item>

                    <Form.Item required label="Street Address" name={"address"}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="Address 2" name={"address2"}>
                        <Input/>
                    </Form.Item>

                    <Form.Item label="City" name={"city"}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="State" name={"state"}>
                        <Select
                            showSearch
                            optionFilterProp="label"
                            options={STATES}
                            placeholder="Type State"
                            filterOption={true}
                            aria-autocomplete={"none"}

                        />
                    </Form.Item>
                    <Form.Item initialValue={"US"} label="Country" name={"country"}>
                        <Input readOnly disabled/>
                    </Form.Item>
                    <Form.Item label="Phone" name={"phone"}
                               rules={[{required: true, message: 'Please enter company phone number!'}]}
                    >
                        <Input type={"tel"}/>
                    </Form.Item>
                    <Form.Item required label="Website" name={"website"}>
                        <Input/>
                    </Form.Item>

                    <Form.Item name={"users"}>
                        <Select
                            mode="multiple"
                            options={usersFormatted}
                            style={{width: '100%'}}
                            placeholder="Add users to the company"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type={"primary"} htmlType="submit">Submit</Button>
                    </Form.Item>
                </Form>
            </FormWrapper>
        </>
    )
}

export default CompaniesNew