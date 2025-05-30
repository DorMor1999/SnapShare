import React, { Fragment, useContext, useEffect } from 'react';
import classes from './GroupForm.module.css';
import MyButton from '../UI/Button/MyButton';
import ErrorModal from '../UI/Modal/ErrorModal';
import SpinnerOverlay from '../UI/Spinner/SpinnerOverlay';
import Wrapper from '../UI/Wrapper/Wrapper';
import BoxForm from '../UI/BoxForm/BoxForm';
import { Col, Row } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { data, useNavigate, useParams } from 'react-router';
import { UserContext } from '../../../context/UserContext';
import useHttpRequest from '../../../hooks/useHttpRequest';
import Input from '../UI/Input/Input';

interface GroupFormProps {
  formType: 'New Group' | 'Edit Group';
  groupName?: string;
  groupId?: string;
}

type FormData = {
  name: string;
};

const GroupForm: React.FC<GroupFormProps> = ({
  formType,
  groupName = '',
  groupId = '',
}) => {
  const { eventId } = useParams();
  const { token } = useContext(UserContext);
  const { data, error, loading, sendRequest, clearError } = useHttpRequest<any>();

  const {
    register: groupRegister,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    reset({
      name: groupName || '',
    });
  }, [groupName, reset]);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;
    sendRequest(`${API_URL}/events/${eventId}`, 'GET', undefined, {
      Authorization: `Bearer ${token}`,
    });
  }, [token, eventId]);

  const navigate = useNavigate();

  

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    const API_URL = import.meta.env.VITE_API_URL;
    console.log(formData);
    // const inputDateStr = formData.date; // e.g., "1999-06-12T12:00"

    // // Parse the input as a local Date object
    // const localDate = new Date(inputDateStr);

    // // Format it as UTC with 'Z'
    // const formattedDate = `${localDate.getFullYear()}-${String(
    //   localDate.getMonth() + 1
    // ).padStart(2, '0')}-${String(localDate.getDate()).padStart(
    //   2,
    //   '0'
    // )}T${String(localDate.getHours()).padStart(2, '0')}:${String(
    //   localDate.getMinutes()
    // ).padStart(2, '0')}:00.000Z`;

    // let requestError: undefined | string;
    // if (formType === 'New Event') {
    //   const { error } = await sendRequest(
    //     `${API_URL}/events`,
    //     'POST',
    //     {
    //       name: formData.name,
    //       date: formattedDate,
    //       ownerId: userId,
    //     },
    //     {
    //       Authorization: `Bearer ${token}`,
    //     }
    //   );
    //   requestError = error;
    // } else {
    //   const { error } = await sendRequest(
    //     `${API_URL}/events/${eventId}`,
    //     'PUT',
    //     {
    //       name: formData.name,
    //       date: formattedDate,
    //     },
    //     {
    //       Authorization: `Bearer ${token}`,
    //     }
    //   );
    //   requestError = error;
    // }

    // if (!requestError) {
    //   navigate('/events?sortBy=date&orderBy=desc');
    // }
  };

  console.log(data);

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
                    label="Group Name"
                    type="text"
                    required={true}
                    {...groupRegister('name', {
                      required: 'Group Name is required',
                      minLength: {
                        value: 2,
                        message: 'At least 2 characters required',
                      },
                    })}
                    error={errors.name}
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

export default GroupForm;
