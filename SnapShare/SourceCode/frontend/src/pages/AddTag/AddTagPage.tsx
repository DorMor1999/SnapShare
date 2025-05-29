import React, { Fragment, useContext, useEffect, useState } from 'react';
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
import ModalUsers, {
  PopulatedUser,
} from '../../shared/components/UI/Modal/ModalUsers';

type FormData = {
  userId: string;
  position: PhotoPositionType;
};

const AddTagPage: React.FC = () => {
  const params = useParams();
  const eventId = params.eventId ?? '';
  const photoId = params.photoId ?? '';
  const { token } = useContext(UserContext);
  const navigate = useNavigate();

  const {
    register: tagRegister,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      userId: '',
    },
  });

  const { data, error, loading, sendRequest, clearError } =
    useHttpRequest<any>();

  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<PopulatedUser | null>(null);

  let mockUsers: PopulatedUser[] = [];
  mockUsers = data;

  useEffect(() => {
      const API_URL = import.meta.env.VITE_API_URL;
      sendRequest(`${API_URL}/events/${eventId}/photos/${photoId}/users-exclude-photo`, 'GET', undefined, {
        Authorization: `Bearer ${token}`,
      });
    }, [token, eventId]);

  const handleUserSelect = (userIds: string[]) => {
    const user = mockUsers.find((u) => u._id === userIds[0]);
    if (user) {
      setSelectedUser(user);
      setValue('userId', user._id, { shouldValidate: true });
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    console.log('Submitted data:', formData);
    // const API_URL = import.meta.env.VITE_API_URL;
    // const { data, error } = await sendRequest(
    //   `${API_URL}/some-endpoint`,
    //   'POST',
    //   { ...formData },
    //   { Authorization: `Bearer ${token}` }
    // );
    // if (!error) navigate(`/events/${eventId}/photos/${photoId}`);
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
                <Col sm={12}>
                  <label className="form-label">User *</label>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>
                      {selectedUser
                        ? `${selectedUser.firstName} ${selectedUser.lastName}`
                        : 'No user selected'}
                    </span>
                    <MyButton
                      text="Choose User"
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowUserModal(true)}
                      type="button"
                    />
                  </div>

                  <input
                    type="hidden"
                    {...tagRegister('userId', {
                      required: 'User is required',
                    })}
                  />
                  {errors.userId && (
                    <p className="text-danger">{errors.userId.message}</p>
                  )}
                </Col>

                <Col sm={12}>
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
                        ['Close (Main Subject)', 'Background'].includes(value) ||
                        'Invalid position selected',
                    })}
                    error={errors.position}
                  />
                </Col>
              </Row>

              <br />
              <div className="d-grid gap-2">
                <MyButton
                  text="Submit"
                  size="lg"
                  variant="primary"
                  type="submit"
                />
              </div>
            </form>
          </BoxForm>
        </Wrapper>
      </div>

      {showUserModal && (
        <ModalUsers
          users={mockUsers}
          isMultipart={false}
          show={showUserModal}
          onHide={() => setShowUserModal(false)}
          onSelect={handleUserSelect}
        />
      )}
    </Fragment>
  );
};

export default AddTagPage;
