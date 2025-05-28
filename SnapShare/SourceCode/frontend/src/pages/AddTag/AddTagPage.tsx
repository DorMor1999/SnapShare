import React, { Fragment, useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { UserContext } from '../../context/UserContext';
import { SubmitHandler, useForm } from 'react-hook-form';
import useHttpRequest from '../../hooks/useHttpRequest';
import ErrorModal from '../../shared/components/UI/Modal/ErrorModal';
import SpinnerOverlay from '../../shared/components/UI/Spinner/SpinnerOverlay';
import classes from './AddTagPage.module.css';
import Wrapper from '../../shared/components/UI/Wrapper/Wrapper';
import BoxForm from '../../shared/components/UI/BoxForm/BoxForm';
import { Col, Row } from 'react-bootstrap';
import { PhotoPositionType } from '../../shared/types/Photos';
import Input from '../../shared/components/UI/Input/Input';
import MyButton from '../../shared/components/UI/Button/MyButton';
import TagInput from '../../shared/components/UI/Input/TagInput';

interface PopulatedUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePhotosUrls: string[][];
}

type FormData = {
  userId: string;
  position: PhotoPositionType;
};

const AddTagPage: React.FC = () => {
  const params = useParams();
  const eventId = params.eventId ?? '';
  const photoId = params.photoId ?? '';
  const { token } = useContext(UserContext);
  const [selectedUser, setSelectedUser] = useState<{
    label: string;
    value: string;
  } | null>(null);

  const {
    register: tagRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const navigate = useNavigate();

  const { data, error, loading, sendRequest, clearError } =
    useHttpRequest<any>();

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const userId = selectedUser?.value || '';

    const fullData = {
      ...formData,
      userId,
    };

    console.log(fullData);
    // const { data, error } = await sendRequest(
    //   `${API_URL}/authentication/login`,
    //   'POST',
    //   {
    //     email: (formData.email).toLowerCase(),
    //     password: formData.password,
    //   }
    // );

    // if (!error) {
    //   navigate(`/events/${eventId}/photos/${photoId}`);
    // }
  };

  return (
    <Fragment>
      {error && <ErrorModal message={error} onClose={clearError} />}
      {loading && <SpinnerOverlay />}
      <div className={classes['center-height']}>
        <Wrapper>
          <BoxForm sm={12} md={7}>
            <h1>Add Tag</h1>
            <h6 className="text-danger">Required *</h6>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col sm={12} md={12}>
                  <TagInput
                    label="Tag User"
                    value={selectedUser}
                    onChange={(val) =>
                      setSelectedUser(
                        val as { label: string; value: string } | null
                      )
                    }
                    required
                    isMulti={false}
                  />
                </Col>
                <Col sm={12} md={12}>
                  <Input
                    label="Position"
                    type="select"
                    required={true}
                    options={[
                      { label: 'Close', value: 'Close (Main Subject)' },
                      { label: 'Background', value: 'Background' },
                    ]}
                    {...tagRegister('position', {
                      required: 'Position is required',
                      validate: (value) =>
                        ['Close (Main Subject)', 'Background'].includes(
                          value
                        ) || 'Invalid position selected',
                    })}
                    error={errors.position}
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

export default AddTagPage;
