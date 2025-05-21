import React, { Fragment, useContext } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useForm, SubmitHandler } from 'react-hook-form';

// My imports
import Wrapper from '../../shared/components/UI/Wrapper/Wrapper';
import BoxForm from '../../shared/components/UI/BoxForm/BoxForm';
import Input from '../../shared/components/UI/Input/Input';
import MyButton from '../../shared/components/UI/Button/MyButton';
import classes from './SendInvitationPage.module.css';
import useHttpRequest from '../../hooks/useHttpRequest';
import ErrorModal from '../../shared/components/UI/Modal/ErrorModal';
import SpinnerOverlay from '../../shared/components/UI/Spinner/SpinnerOverlay';
import { UserContext } from '../../context/UserContext';

// bootstrap imports
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { InvitationType } from '../../shared/types/InvitationType';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  type: InvitationType;
};

const SendInvitationPage: React.FC = () => {
  const {
    register: sendInvitationRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const { eventId } = useParams();

  const { token } = useContext(UserContext);

  const navigate = useNavigate();

  const { data, error, loading, sendRequest, clearError } =
    useHttpRequest<any>();

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const { error } = await sendRequest(
      `${API_URL}/invitations`,
      'POST',
      {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: (formData.email).toLowerCase(),
        type: formData.type,
        eventId: eventId, 
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    if (!error) {
      navigate(`/events/${eventId}/owners_participants_invitations`);
    }
  };

  return (
    <Fragment>
      {error && <ErrorModal message={error} onClose={clearError} />}
      {loading && <SpinnerOverlay />}
      <div className={classes['center-height']}>
        <Wrapper>
          <BoxForm sm={12} md={10}>
            <h1>Send Invitation</h1>
            <h6 className="text-danger">Required *</h6>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col sm={12} md={6}>
                  <Input
                    label="First Name"
                    type="text"
                    required={true}
                    {...sendInvitationRegister('firstName', {
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
                    {...sendInvitationRegister('lastName', {
                      required: 'Last Name is required',
                      minLength: {
                        value: 2,
                        message: 'At least 2 characters required',
                      },
                    })}
                    error={errors.lastName}
                  />
                </Col>
                <Col sm={12} md={12}>
                  <Input
                    label="Email"
                    type="email"
                    required={true}
                    {...sendInvitationRegister('email', {
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
                    label="Type"
                    type="select"
                    required={true}
                    options={[
                      { label: 'Owner', value: 'OWNER' },
                      { label: 'Participant', value: 'PARTICIPANT' },
                    ]}
                    {...sendInvitationRegister('type', {
                      required: 'Type is required',
                      validate: (value) =>
                        ['OWNER', 'PARTICIPANT'].includes(value) ||
                        'Invalid type selected',
                    })}
                    error={errors.type}
                  />
                </Col>
              </Row>
              <br />
              <div className="d-grid gap-2">
                <MyButton
                  text="Send Invitation"
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

export default SendInvitationPage;
