import {Alert, Button, Col, Form, Input, Row} from 'antd';
import ResourceService from "../../Services/ResourceService";
import styled from "styled-components";
import {UserOutlined} from '@ant-design/icons';
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

const ForgotPassword = () => {
  const [success, setSuccess] = useState(false)
  const sendPasswordLink = useCallback((data:any) => {
      ResourceService.store({
          resourceName: 'forgot-password',
          fields: {...data}
      }).then(({ data }) => {
        setSuccess(true)
      }).catch(() => {
        setSuccess(true)
      })
  }, [])

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
                                    onFinish={sendPasswordLink}
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
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit"
                                                style={{width: '100%', marginTop: 20}}>
                                            Send Reset Link
                                        </Button>
                                      </Form.Item>
                                      {success &&
                                        <Alert message="If your e-mail is in our system then a password reset link has been sent. Please check your e-mail." type="success" closable/>
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


export default ForgotPassword