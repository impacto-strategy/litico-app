// import {useForm, ValidationError} from '@formspree/react';
import { Modal, Col, Row } from "antd";
import React, { useState, FC, Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import { useForm, ValidationError } from '@formspree/react';

const Section = styled.section`
  padding: 2rem;
`;

const Form = styled.form`
  input {
    margin-bottom: 24px;
    padding: 12px;
    width: 100%;
    height: 48px;
    border: 1px solid var(--landing-primary);
    color: #434e46;
  }
  textarea {
    padding: 12px;
    width: 100%;
    height: 240px;
    border: 1px solid var(--landing-primary);
    color: #434e46;
  }

  [required]:before {
    content: "*";
  }
`;

const SubmitButton = styled.button`
  border: 0px solid transparent;
  border-radius: 5px;
  overflow: visible;
  font: inherit;
  color: #fff;
  -webkit-appearance: none;
  display: inline-block;
  box-sizing: border-box;
  vertical-align: middle;
  line-height: 42px;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  transition: 0.1s ease-in-out;
  padding: 0 34px;
  transition-property: color, background-color, border-color;
  font-weight: 800;
  font-size: 16px;
  background-color: #497cb6;
  margin-top: 20px;
  &:hover {
    background: #2a5b93;
  }
`;
const SignupForm: FC<{visible: boolean, setVisible: Dispatch<SetStateAction<boolean>>}> = (props: {visible: boolean, setVisible: Dispatch<SetStateAction<boolean>>}) => {
  const [state, handleSubmit] = useForm("mpznzykz");
  const [title, setTitle] = useState<String>('Sign Up Today');

  const submitForm = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    handleSubmit(e);
    setTitle('Thank You');
    return;
  }

  return (
    // Alterations to Modal style can be found in global.less
    <Modal 
      title={title}
      visible={props.visible}
      onCancel={(e) => {
        e.preventDefault();
        props.setVisible(false);
      }}
      footer={null}
      keyboard={true}>
      {state.succeeded&&
        <Section>
          <p>You message has been sent! One of of our team members will reach out to you shortly.</p>
        </Section>
      }
      {!state.succeeded&& 
        <Section>
        <Form onSubmit={(e) => submitForm(e)}>
          <Row>
            <Col md={18} lg={10}>
              <input
                placeholder={"Name"}
                id="fullname"
                type="text"
                name="fullname"
                required
              />
              <ValidationError
                  prefix="Name"
                  field="fullname"
                  errors={state.errors}
              />
              <input
                placeholder={"Email"}
                id="email"
                required
                type="email"
                name="email"
              />
              <input
                placeholder={"Company Name"}
                id="company"
                type="text"
                name="company"
              />
              <ValidationError
                  prefix="Email"
                  field="email"
                  errors={state.errors}
              />
            </Col>
            <Col md={18} lg={{ span: 10, offset: 2 }}>
              <input placeholder={"Title"} id="title" type="text" name="title" />
              <input
                placeholder={"Contact Number"}
                id="phone"
                type="tel"
                name="phone"
              />
              <ValidationError
                  prefix="Phone"
                  field="phone"
                  errors={state.errors}
              />
              <input
                placeholder={"Company URL"}
                id="domain"
                type="url"
                name="domain"
              />
              <ValidationError
                  prefix="Domain"
                  field="domain"
                  errors={state.errors}
              />
            </Col>
          </Row>
          <Row>
            <Col span={48} xs={24} sm={24} md={38} lg={22}>
              <textarea
                id="message"
                name="message"
                placeholder={"How did you hear about the LITICO platform?"}
              />
              <ValidationError
                  prefix="Message"
                  field="message"
                  errors={state.errors}
              />
            </Col>
          </Row>
          <SubmitButton type="submit" disabled={state.submitting}>Submit</SubmitButton>
        </Form>
      </Section>
      }

    </Modal>
  );
};

export default SignupForm;
