// react imports
import React, { Fragment, useContext } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router';

// My imports
import Wrapper from '../../shared/components/UI/Wrapper/Wrapper';
import BoxForm from '../../shared/components/UI/BoxForm/BoxForm';
import Input from '../../shared/components/UI/Input/Input';
import MyButton from '../../shared/components/UI/Button/MyButton';
import classes from './LogInPage.module.css';
import useHttpRequest from '../../hooks/useHttpRequest';
import ErrorModal from '../../shared/components/UI/Modal/ErrorModal';
import SpinnerOverlay from '../../shared/components/UI/Spinner/SpinnerOverlay';
import { UserContext } from '../../context/UserContext';

// bootstrap imports
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

type FormData = {
  email: string;
  password: string;
};

type LoginResponse = {
  message: string;
  token: string;
  id: string;
};

const LogInPage: React.FC = () => {
  const { setUser } = useContext(UserContext);

  const {
    register: loginRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const navigate = useNavigate();

  const { data, error, loading, sendRequest, clearError } =
    useHttpRequest<LoginResponse>();

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    const API_URL = import.meta.env.VITE_API_URL;

    const { data, error } = await sendRequest(
      `${API_URL}/authentication/login`,
      'POST',
      {
        email: (formData.email).toLowerCase(),
        password: formData.password,
      }
    );

    if (!error && data) {
      setUser(data.id, data.token);
      navigate('/');
    }
  };

  return (
    <Fragment>
      {error && <ErrorModal message={error} onClose={clearError} />}
      {loading && <SpinnerOverlay />}
      <div className={classes['center-height']}>
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
    </Fragment>
  );
};

export default LogInPage;
