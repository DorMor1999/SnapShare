import React, { Fragment, useContext, useEffect, useState } from 'react';
import classes from './GroupForm.module.css';
import MyButton from '../UI/Button/MyButton';
import ErrorModal from '../UI/Modal/ErrorModal';
import SpinnerOverlay from '../UI/Spinner/SpinnerOverlay';
import Wrapper from '../UI/Wrapper/Wrapper';
import BoxForm from '../UI/BoxForm/BoxForm';
import { Col, Row } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { UserContext } from '../../../context/UserContext';
import useHttpRequest from '../../../hooks/useHttpRequest';
import Input from '../UI/Input/Input';
import ModalUsers, { PopulatedUser } from '../UI/Modal/ModalUsers';

interface GroupFormProps {
  formType: 'New Group' | 'Edit Group';
  groupName?: string;
  groupId?: string;
  usersInside?: PopulatedUser[];
}

type responseFormNew = {
  _id: string;
};

type responseType = {
  owners: PopulatedUser[];
  participants: PopulatedUser[];
};

type FormData = {
  name: string;
  userIds: string[];
};

const GroupForm: React.FC<GroupFormProps> = ({
  formType,
  groupName = '',
  groupId = '',
  usersInside = [],
}) => {
  const { eventId } = useParams();
  const { token } = useContext(UserContext);
  const { data, error, loading, sendRequest, clearError } = useHttpRequest<
    responseType | responseFormNew
  >();
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<PopulatedUser[]>(
    usersInside || []
  );

  const {
    register: groupRegister,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      userIds: [],
    },
  });

  useEffect(() => {
    reset({
      name: groupName || '',
      userIds:
        usersInside && usersInside.length > 0
          ? usersInside?.map((u) => u._id)
          : [],
    });
    setSelectedUsers(usersInside);
  }, [usersInside.length, groupName, reset]);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;
    sendRequest(`${API_URL}/events/${eventId}`, 'GET', undefined, {
      Authorization: `Bearer ${token}`,
    });
  }, [token, eventId]);

  let mockUsers: PopulatedUser[] = [];

  if (
    typeof data === 'object' &&
    data !== null &&
    'owners' in data &&
    'participants' in data &&
    Array.isArray((data as responseType).owners) &&
    Array.isArray((data as responseType).participants)
  ) {
    const typedData = data as responseType;
    mockUsers = [...typedData.participants, ...typedData.owners];
  }
  const navigate = useNavigate();

  const handleUserSelect = (userIds: string[]) => {
    const users = mockUsers.filter((u) => userIds.includes(u._id));
    setSelectedUsers(users);
    setValue('userIds', userIds, { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    const API_URL = import.meta.env.VITE_API_URL;

    let requestError: undefined | string;
    if (formType === 'New Group') {
      const { data, error } = await sendRequest(
        `${API_URL}/events/${eventId}/photo-group`,
        'POST',
        formData,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      if (data && '_id' in data) {
        groupId = data._id; // now TS knows data has _id
      }
      requestError = error;
    } else {
      const { error } = await sendRequest(
        `${API_URL}/events/${eventId}/photo-group/${groupId}`,
        'PUT',
        formData,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      requestError = error;
    }

    if (!requestError) {
      navigate(`/events/${eventId}/groups/${groupId}`);
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
                <Col sm={12}>
                  <label className="form-label">User *</label>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>
                      {selectedUsers && selectedUsers.length > 0
                        ? `Users: ${selectedUsers.length}`
                        : 'No users selected'}
                    </span>
                    <MyButton
                      text="Choose User"
                      variant="secondary"
                      size={undefined}
                      onClick={() => setShowUserModal(true)}
                      type="button"
                    />
                  </div>

                  <input
                    type="hidden"
                    {...groupRegister('userIds', {
                      required: 'Users is required',
                    })}
                  />
                  {errors.userIds && (
                    <p className="text-danger">{errors.userIds.message}</p>
                  )}
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

      {showUserModal && (
        <ModalUsers
          users={mockUsers}
          isMultipart={true}
          show={showUserModal}
          onHide={() => setShowUserModal(false)}
          onSelect={handleUserSelect}
          selectedUserIds={
            selectedUsers && selectedUsers.length > 0
              ? selectedUsers.map((u) => u._id)
              : []
          }
        />
      )}
    </Fragment>
  );
};

export default GroupForm;
