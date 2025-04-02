// react imports
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

// My imports
import Wrapper from '../../shared/components/UI/Wrapper/Wrapper';
import BoxForm from '../../shared/components/UI/BoxForm/BoxForm';
import Input from '../../shared/components/UI/Input/Input';
import MyButton from '../../shared/components/UI/Button/MyButton';
import classes from './LogInPage.module.css';

// bootstrap imports
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

type FormData = {
  email: string;
  password: string;
};

const LogInPage: React.FC = () => {
  const {
    register: loginRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
  };

  return (
    <div className={classes["center-height"]}>
      <Wrapper>
        <BoxForm sm={12} md={7}>
          <h1>Login</h1>
          <h6 className="text-danger">Required *</h6>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col sm={12} md={12}>
                <Input
                  label="Email"
                  type="email"
                  required={true}
                  {...loginRegister('email', {
                    required: 'Email is required',
                    pattern: {
                      value:
                        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
                      message: 'Invalid email format',
                    },
                  })}
                  error={errors.email}
                />
              </Col>
              <Col sm={12} md={12}>
                <Input
                  label="Password"
                  type="password"
                  required={true}
                  {...loginRegister('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'At least 6 characters required',
                    },
                  })}
                  error={errors.password}
                />
              </Col>
            </Row>
            <br />
            <div className="d-grid gap-2">
              <MyButton
                text="Login"
                size={'lg'}
                variant={'primary'}
                type="submit"
              />
            </div>
          </form>
        </BoxForm>
      </Wrapper>
    </div>
  );
};

export default LogInPage;
