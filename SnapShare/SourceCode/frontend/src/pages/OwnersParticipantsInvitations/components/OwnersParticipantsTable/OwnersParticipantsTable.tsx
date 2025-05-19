import React, { Fragment, useContext, useEffect } from 'react';
import { InvitationType } from '../../../../shared/types/InvitationType';
import Table from 'react-bootstrap/Table';
import { useParams } from 'react-router';
import { UserContext } from '../../../../context/UserContext';
import useHttpRequest from '../../../../hooks/useHttpRequest';
import ErrorModal from '../../../../shared/components/UI/Modal/ErrorModal';
import SpinnerOverlay from '../../../../shared/components/UI/Spinner/SpinnerOverlay';
import styles from './OwnersParticipantsTable.module.css';

interface OwnersParticipantsTableProps {
  type: InvitationType;
}

type UserInfo = {
  _id: string;
  profilePhotosUrls: string[][];
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

type responseType = {
  owners: UserInfo[];
  participants: UserInfo[];
};

const OwnersParticipantsTable: React.FC<OwnersParticipantsTableProps> = ({
  type,
}) => {
  const { eventId } = useParams();

  const { token } = useContext(UserContext);

  const { data, error, loading, sendRequest, clearError } =
    useHttpRequest<responseType>();

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;
    sendRequest(`${API_URL}/events/${eventId}`, 'GET', undefined, {
      Authorization: `Bearer ${token}`,
    });
  }, [token, eventId]);

  function renderNoUsersMessage(type: InvitationType) {
    const roleLabel = type === 'OWNER' ? 'owners' : 'participants';
    return <h2>No {roleLabel} for found this event!</h2>;
  }

  let content;
  let myList: UserInfo[];
  if (data) {
    myList = type === 'OWNER' ? data.owners : data.participants;
    if (myList.length < 1) {
      content = renderNoUsersMessage(type);
    } else {
      {
        let tableContent = myList.map((user, index) => (
          <tr key={user._id}>
            <td>{index + 1}</td>
            <td>
              <a href={user.profilePhotosUrls[0][0]}><img
                height={30}
                width={30}
                src={user.profilePhotosUrls[0][0]}
                alt={`profile photo of user ${user._id}`}
              /></a> {" "}
              {user.profilePhotosUrls[0][1] ? <a href={user.profilePhotosUrls[0][0]}><img
                height={30}
                width={30}
                src={user.profilePhotosUrls[0][1]}
                alt={`profile photo of user ${user._id}`}
              /></a>: ""}
            </td>
            <td>{user.firstName}</td>
            <td>{user.lastName}</td>
            <td>{user.email}</td>
            <td>{user.phoneNumber ? user.phoneNumber : user.phoneNumber}</td>
          </tr>
        ));
        content = (
          <div className={styles.scrollableTable}>
            <Table striped hover size={'sm'}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Profile Photo</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>{tableContent}</tbody>
            </Table>
          </div>
        );
      }
    }
  } else {
    content = renderNoUsersMessage(type);
  }

  return (
    <Fragment>
      {error && <ErrorModal message={error} onClose={clearError} />}
      {loading && <SpinnerOverlay />}
      {content}
    </Fragment>
  );
};

export default OwnersParticipantsTable;
