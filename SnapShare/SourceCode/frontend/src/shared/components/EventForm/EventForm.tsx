// react imports
import React, { Fragment, useContext } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router';

// My imports
import ErrorModal from '../UI/Modal/ErrorModal';
import SpinnerOverlay from '../UI/Spinner/SpinnerOverlay';
import Input from '../UI/Input/Input';
import Wrapper from '../UI/Wrapper/Wrapper';
import BoxForm from '../UI/BoxForm/BoxForm';
import MyButton from '../UI/Button/MyButton';
import useHttpRequest from '../../../hooks/useHttpRequest';
import classes from './EventForm.module.css';
import { UserContext } from '../../../context/UserContext';

// bootstrap imports
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

type EventFormProps = {
  formType: 'New Event' | 'Edit Event';
  name?: string;
  date?: string | null;
};

type FormData = {
  name: string;
  date: Date;
};

const EventForm: React.FC<EventFormProps> = ({
  formType,
  name = '',
  date = null,
}) => {
  const {
    register: eventRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const navigate = useNavigate();

   const { userId, token } = useContext(UserContext);

  const { data, error, loading, sendRequest, clearError } =
    useHttpRequest<any>();

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    
    const API_URL = import.meta.env.VITE_API_URL;

    const inputDate = formData.date; // "1999-06-12T12:00"

    // Parse the input string as a local date
    const localDate = new Date(inputDate);

    // Manually build the ISO-like string (preserving local time)
    const formattedDate = `${localDate.getFullYear()}-${String(
      localDate.getMonth() + 1
    ).padStart(2, '0')}-${String(localDate.getDate()).padStart(
      2,
      '0'
    )}T${String(localDate.getHours()).padStart(2, '0')}:${String(
      localDate.getMinutes()
    ).padStart(2, '0')}:00.000Z`;

    let requestError: undefined | string;
    if (formType === 'New Event') {
      const { error } = await sendRequest(
        `${API_URL}/events`,
        'POST',
        {
          name: formData.name,
          date: formattedDate,
          ownerId: userId
        }, 
        {
          Authorization: `Bearer ${token}`,
        }
      );
      requestError = error;
    }

    if (!requestError) {
      navigate('/events?sortBy=date&orderBy=desc');
    }
  };

  return (
    <Fragment>
      {error && <ErrorModal message={error} onClose={clearError} />}
      {loading && <SpinnerOverlay />}
      <div className={classes['center-height']}>
        <Wrapper>
          <BoxForm sm={12} md={7}>
            <h1>{formType}</h1>
            <h6 className="text-danger">Required *</h6>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col sm={12} md={12}>
                  <Input
                    label="Event Name"
                    type="text"
                    required={true}
                    {...eventRegister('name', {
                      required: 'Event Name is required',
                      minLength: {
                        value: 2,
                        message: 'At least 2 characters required',
                      },
                    })}
                    error={errors.name}
                  />
                </Col>
                <Col sm={12} md={12}>
                  <Input
                    label="Event Date & Time"
                    type="datetime-local"
                    required={true}
                    {...eventRegister('date', {
                      required: 'Date and time are required',
                      valueAsDate: true,
                      validate: (value: Date) =>
                        (value instanceof Date && !isNaN(value.getTime())) ||
                        'Invalid date and time',
                    })}
                    error={errors.date}
                  />
                </Col>
              </Row>
              <br />
              <div className="d-grid gap-2">
                <MyButton
                  text="Submit"
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

export default EventForm;
