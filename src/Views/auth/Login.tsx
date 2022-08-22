import {useLocation, useNavigate} from 'react-router-dom'
import {Button, Checkbox, Col, Form, Input, Row} from 'antd';

import useAuth from "../../Providers/Auth/useAuth"
import styled from "styled-components";
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import React, {useEffect, useState} from "react";
import {AxiosResponse} from "axios";


const Wrapper = styled.div`
  padding: 70px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;

  .ant-input {
    padding-left: 10px !important;
  }

  [role="alert"] {
    color: red;
  }
`
const Container = styled.div`
  width: 100%;
  padding: 0 15px;

  & > * {
    max-width: 1130px;
    margin: auto;

  }
`

const IconWrapper = styled.span`
  opacity: 0.56;
`

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
`

const FormWrap = styled.h1`
  padding: 30px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 10%);
`


const Login = () => {
    const navigate = useNavigate();
    const {login, user} = useAuth();

    const {state} = useLocation();

    const [errors, setErrors] = useState([])
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        if(user){
            navigate('/dashboard')
        }
    }, [navigate, user])

    const onFinish = (values: any) => {

        setLoading(true)
        login({...values}).then(() => {
            navigate((state as any).from.pathname || "/dashboard");
        }).catch((e: AxiosResponse) => {
            if (e.data.errors.email) {
                setErrors(e.data.errors.email)
            }
            setLoading(false)
        })
    };


    return (
        <Wrapper>
            <Container>
                <div>
                    <Row>
                        <Col sm={{span: 24, offset: 8}} lg={{span: 12, offset: 6}}>
                            <FormWrap>
                                <div><Title>
                                    <div className="logo">
                                        Litico
                                    </div>
                                </Title>
                                </div>
                                <Form
                                    name="login"
                                    initialValues={{remember: true}}
                                    onFinish={onFinish}
                                    size={"large"}
                                    layout={"vertical"}
                                >
                                    <Form.Item
                                        name="email"
                                        rules={[{required: true, message: 'Please enter your email!'}]}
                                    >
                                        <Input prefix={<IconWrapper><UserOutlined/></IconWrapper>}
                                               placeholder="Email"/>
                                    </Form.Item>

                                    <Form.Item
                                        name="password"
                                        rules={[{required: true, message: 'Please enter your password!'}]}
                                    >
                                        <Input.Password
                                            prefix={<IconWrapper><LockOutlined/></IconWrapper>}
                                            placeholder={"Password"}
                                        />
                                    </Form.Item>

                                    <Form.Item name="remember" valuePropName="checked" noStyle>
                                        <Checkbox>Remember me</Checkbox>
                                    </Form.Item>


                                    <Form.Item>
                                        <Button loading={loading} type="primary" htmlType="submit"
                                                style={{width: '100%', marginTop: 20}}>
                                            Submit
                                        </Button>
                                    </Form.Item>
                                    <Form.ErrorList errors={errors}/>
                                </Form>
                            </FormWrap>
                        </Col>
                    </Row>
                </div>


            </Container>
        </Wrapper>
    );
};


export default Login