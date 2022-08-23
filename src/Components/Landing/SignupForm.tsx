// import {useForm, ValidationError} from '@formspree/react';
import { Modal, Col, Row } from "antd";
import { FC, Dispatch, SetStateAction } from "react";
import styled from "styled-components";

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
  border: none;
  overflow: visible;
  font: inherit;
  color: #fff;
  -webkit-appearance: none;
  border-radius: 0;
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
  background: ${(props) => `var(--landing-secondary)` || "inherit"};
  margin-top: 20px;
  &:hover {
    background: ${(props) => `var(--landing-secondary-700)` || "inherit"};
  }
`;
const SignupForm: FC<{visible: boolean, setVisible: Dispatch<SetStateAction<boolean>>}> = (props: {visible: boolean, setVisible: Dispatch<SetStateAction<boolean>>}) => {
  // const [state, handleSubmit] = useForm("xdobzqzp");
  // if (state.succeeded) {
  //     return <p>You message has been sent! One of of our team members will reach out to you shortly.</p>;
  // }

  return (
    // Alterations to Modal style can be found in global.less
    <Modal 
      title="Sign Up Today"
      visible={props.visible}
      onOk={() => {
        props.setVisible(false);
      }}
      onCancel={() => {
        props.setVisible(false);
      }}>
      <Section>
        <Form>
          <Row>
            <Col md={18} lg={10}>
              <input
                placeholder={"Name"}
                id="fullname"
                type="text"
                name="fullname"
                required
              />
              {/* <ValidationError
                  prefix="Name"
                  field="fullname"
                  errors={state.errors}
              /> */}
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

              {/* <ValidationError
                  prefix="Email"
                  field="email"
                  errors={state.errors}
              /> */}
            </Col>
            <Col md={18} lg={{ span: 10, offset: 2 }}>
              <input placeholder={"Title"} id="title" type="text" name="title" />
              <input
                placeholder={"Contact Number"}
                id="phone"
                type="tel"
                name="phone"
              />
              <input
                placeholder={"Company URL"}
                id="domain"
                type="url"
                name="domain"
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
              {/* <ValidationError
                  prefix="Message"
                  field="message"
                  errors={state.errors}
              /> */}
            </Col>
          </Row>
          <SubmitButton type="submit">Submit</SubmitButton>
        </Form>
      </Section>
    </Modal>
  );
};

export default SignupForm;
