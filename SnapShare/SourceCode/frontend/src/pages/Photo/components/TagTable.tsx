import React, { Fragment, useContext, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import styles from './TagTable.module.css';
import { useParams } from 'react-router';
import { UserContext } from '../../../context/UserContext';
import useHttpRequest from '../../../hooks/useHttpRequest';
import ErrorModal from '../../../shared/components/UI/Modal/ErrorModal';
import SpinnerOverlay from '../../../shared/components/UI/Spinner/SpinnerOverlay';
import MyButton from '../../../shared/components/UI/Button/MyButton';

interface PopulatedUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePhotosUrls: string[][];
}

interface TagTableProps {
  users: PopulatedUser[];
}

interface ResponseType {
  owners: { _id: string }[];
}

const TagTable: React.FC<TagTableProps> = ({ users }) => {
  const params = useParams();
  const eventId = params.eventId ?? '';
  const photoId = params.photoId ?? '';
  const { token, userId } = useContext(UserContext);
  let isOwner: boolean = false;
  const { data, error, loading, sendRequest, clearError } =
    useHttpRequest<ResponseType>();

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;
    sendRequest(`${API_URL}/events/${eventId}`, 'GET', undefined, {
      Authorization: `Bearer ${token}`,
    });
  }, [token, eventId]);

  function deleteTag(photoId: string, userId: string) {
    console.log(photoId, userId);
    //need to finish delete
  }

  let tagContent;
  if (data && data.owners && data.owners.length > 0) {
    isOwner = data.owners.some((owner) => owner._id === userId);
    if (users && users.length > 0) {
      tagContent = (
        <Fragment>
          <h2>Tags</h2>
          <div className={styles.scrollableTable}>
            <Table striped hover size={'sm'}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Profile Photo</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  {isOwner && <th></th>}
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>
                      <a href={user.profilePhotosUrls[0][0]}>
                        <img
                          height={30}
                          width={30}
                          src={user.profilePhotosUrls[0][0]}
                          alt={`profile photo of user ${user._id}`}
                        />
                      </a>{' '}
                      {user.profilePhotosUrls[0][1] ? (
                        <a href={user.profilePhotosUrls[0][0]}>
                          <img
                            height={30}
                            width={30}
                            src={user.profilePhotosUrls[0][1]}
                            alt={`profile photo of user ${user._id}`}
                          />
                        </a>
                      ) : (
                        ''
                      )}
                    </td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    {isOwner && (
                      <td>
                        <MyButton
                          text="Delete"
                          size="sm"
                          variant="danger"
                          type="button"
                          onClick={() =>
                            deleteTag(photoId, user._id)
                          }
                        />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Fragment>
      );
    } else {
      tagContent = <h2>Tags not found!</h2>;
    }
  } else {
    tagContent = <h2>We have problem please try again later!!</h2>;
  }

  console.log(isOwner);
  return (
    <Fragment>
      {error && <ErrorModal message={error} onClose={clearError} />}
      {loading && <SpinnerOverlay />}
      {tagContent}
    </Fragment>
  );
};

export default TagTable;
