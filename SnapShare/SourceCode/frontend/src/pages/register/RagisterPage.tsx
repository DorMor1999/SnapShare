import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

// Import the validateImage function
import { validateImage } from '../../utils/validation';

// My imports
import Wrapper from '../../shared/components/UI/Wrapper/Wrapper';
import BoxForm from '../../shared/components/UI/BoxForm/BoxForm';
import Input from '../../shared/components/UI/Input/Input';
import MyButton from '../../shared/components/UI/Button/MyButton';
import classes from './RegisterPage.module.css';


// bootstrap imports
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profilePicture1: FileList;
  profilePicture2: FileList;
};

const imageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
const maxFileSize = 25 * 1024 * 1024; // 25MB limit

const RegisterPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
  };

  return (
    <div className={classes['center-height']}>
      <Wrapper>
        <BoxForm sm={12} md={10}>
          <h1>Register</h1>
          <h6 className="text-danger">Required *</h6>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col sm={12} md={6}>
                <Input
                  label="First Name"
                  type="text"
                  required={true}
                  {...register('firstName', {
                    required: 'First Name is required',
                    minLength: {
                      value: 2,
                      message: 'At least 2 characters required',
                    },
                  })}
                  error={errors.firstName}
                />
              </Col>
              <Col sm={12} md={6}>
                <Input
                  label="Last Name"
                  type="text"
                  required={true}
                  {...register('lastName', {
                    required: 'Last Name is required',
                    minLength: {
                      value: 2,
                      message: 'At least 2 characters required',
                    },
                  })}
                  error={errors.lastName}
                />
              </Col>
              <Col sm={12} md={6}>
                <Input
                  label="Email"
                  type="email"
                  required={true}
                  {...register('email', {
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
              <Col sm={12} md={6}>
                <Input
                  label="Password"
                  type="password"
                  required={true}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'At least 6 characters required',
                    },
                  })}
                  error={errors.password}
                />
              </Col>
              <Col sm={12} md={12}>
                <Input
                  label="Profile Picture 1"
                  type="file"
                  required={true}
                  accept="image/*"
                  {...register('profilePicture1', {
                    required: 'Please upload Profile Picture 1',
                    validate: (files: FileList) =>
                      validateImage(files, maxFileSize, imageTypes),
                  })}
                  error={errors.profilePicture1}
                />
              </Col>
              <Col sm={12} md={12}>
                <Input
                  label="Profile Picture 2"
                  type="file"
                  required={true}
                  accept="image/*"
                  {...register('profilePicture2', {
                    required: 'Please upload Profile Picture 2',
                    validate: (files: FileList) =>
                      validateImage(files, maxFileSize, imageTypes),
                  })}
                  error={errors.profilePicture2}
                />
              </Col>
            </Row>
            <br />
            <div className="d-grid gap-2">
              <MyButton
                text="Register"
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

export default RegisterPage;
