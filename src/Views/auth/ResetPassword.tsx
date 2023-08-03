import {Alert, Button, Col, Form, Input, Row} from 'antd';
import ResourceService from "../../Services/ResourceService";
import styled from "styled-components";
import {useSearchParams} from "react-router-dom";
import {useCallback, useState} from "react";

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

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
`

const FormWrap = styled.h1`
  padding: 30px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 10%);
`

const ResetPassword = () => {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [searchParams] = useSearchParams();
  const resetPassword = useCallback((data: any) => {
      data.token = searchParams.get("token")
      ResourceService.store({
          resourceName: 'reset-password',
          fields: {...data}
      }).then(({ data }) => {
        setSuccess(true)
      }).catch((err) => {
        setError(err.response?.data?.error)
      })
  }, [searchParams])

    return (
        <Wrapper>
            <Container>
                <div>
                    <Row>
                        <Col sm={{span: 24, offset: 8}} lg={{span: 12, offset: 6}}>
                            <FormWrap>
                                <div><Title>
                                  <div className="logo">
                                    <a style={{color: '#333'}}href="/">Litico</a>
                                  </div>
                                </Title>
                                </div>
                                <Form
                                    name="resetPassword"
                                    initialValues={{remember: true}}
                                    onFinish={resetPassword}
                                    size={"large"}
                                    layout={"vertical"}
                                >
                                    <Form.Item
                                      name="password"
                                      label="New Password"
                                      rules={[{required: true, min: 8}]}
                                    >
                                      <Input.Password />
                                    </Form.Item>
                                    <Form.Item
                                        name="password_confirmation"
                                        dependencies={['password']}
                                        label="Password Confirmation"
                                        hasFeedback
                                        rules={[
                                          {
                                            required: true,
                                            message: 'Please confirm your password!',
                                          },
                                          ({ getFieldValue }) => ({
                                            validator(_, value) {
                                              if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                              }
                                              return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                            },
                                          }),
                                        ]}
                                    >
                                      <Input.Password />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit"
                                                style={{width: '100%', marginTop: 20}}>
                                            Reset Password
                                        </Button>
                                      </Form.Item>
                                      {success &&
                                        <Alert
                                          message="Password has been reset"
                                          type="success"
                                          action={
                                            <a href='/login'>
                                              <Button size="small" type="primary">
                                                Login
                                              </Button>
                                            </a>
                                        } closable />           
                                      }
                                      {error &&
                                        <Alert
                                          message={error}
                                          type="error"
                                          action={
                                            <a href='/forgot-password'>
                                              <Button size="small" type="primary">
                                                Forgot Password
                                              </Button>
                                            </a>
                                        } closable />
                                      }
                                </Form>
                            </FormWrap>
                        </Col>
                    </Row>
                </div>
            </Container>
        </Wrapper>
    );
};


export default ResetPassword