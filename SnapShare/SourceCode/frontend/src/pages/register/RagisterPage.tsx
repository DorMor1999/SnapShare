import React, { Fragment, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

// My imports
import Wrapper from '../../shared/components/UI/Wrapper/Wrapper';
import BoxForm from '../../shared/components/UI/BoxForm/BoxForm';
import Input from '../../shared/components/UI/Input/Input';
import DropzoneInput from '../../shared/components/UI/Input/DropzoneInput';
import MyButton from '../../shared/components/UI/Button/MyButton';
import classes from './RegisterPage.module.css';
import useHttpRequest from '../../hooks/useHttpRequest';
import ErrorModal from '../../shared/components/UI/Modal/ErrorModal';
import SpinnerOverlay from '../../shared/components/UI/Spinner/SpinnerOverlay';

// bootstrap imports
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from 'react-router';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  profilePictures: File[];
};

const imageTypes = ['image/jpeg', 'image/jpg'];
const maxFileSize = 25 * 1024 * 1024; // 25MB limit

const RegisterPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>();

  const navigate = useNavigate();

  const { data, error, loading, sendRequest, clearError } =
    useHttpRequest<any>();

  const profilePictures = watch('profilePictures');

  const onDrop = (acceptedFiles: File[]) => {
    setValue('profilePictures', acceptedFiles, {
      shouldValidate: true,
    });
  };

  useEffect(() => {
    // Validation for the dropzone input
    register('profilePictures', {
      required: 'You must upload at least one image',
      validate: (files: File[]) => {
        if (!files || files.length < 1) return 'At least one image is required';
        if (files.length > 2) return 'You can upload a maximum of 2 images';
        for (const file of files) {
          if (!imageTypes.includes(file.type)) {
            return 'Only JPG, JPEG formats are allowed';
          }
          if (file.size > maxFileSize) {
            return 'Each file must be under 25MB';
          }
        }
        return true;
      },
    });
  }, [register]);

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    const form = new FormData();
    form.append('firstName', formData.firstName);
    form.append('lastName', formData.lastName);
    form.append('email', (formData.email).toLowerCase());
    form.append('password', formData.password);
    form.append('phoneNumber', formData.phone);

    formData.profilePictures.forEach((file, index) => {
      form.append('files', file);
    });

    const API_URL = import.meta.env.VITE_API_URL;

    const { error } = await sendRequest(
      `${API_URL}/authentication/register`,
      'POST',
      form
    );
  
    if (!error) {
      navigate('/login');
    }
  };

  return (
    <Fragment>
      {error && <ErrorModal message={error} onClose={clearError} />}
      {loading && <SpinnerOverlay />}
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
                <Col sm={12}>
                  <Input
                    label="Phone"
                    type="tel"
                    {...register('phone', {
                      validate: (value) => {
                        if (value === '') return true; // Empty is fine
                        if (!/^[0-9]{9,15}$/.test(value)) {
                          return 'Enter a valid phone number';
                        }
                        return true;
                      },
                    })}
                    error={errors.phone}
                  />
                </Col>
                <Col sm={12} md={12}>
                  <DropzoneInput
                    onDrop={(files) =>
                      setValue('profilePictures', files, {
                        shouldValidate: true,
                      })
                    }
                    error={errors.profilePictures}
                    maxFiles={2}
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
    </Fragment>
  );
};

export default RegisterPage;
