import React from 'react';
import { User } from '../../../shared/types/User';
import styles from './UsersTable.module.css';
import { Table } from 'react-bootstrap';

type UsersTableProps = {
  users: User[];
};

const UsersTable: React.FC<UsersTableProps> = ({ users }) => {
  return (
    <div className={styles.scrollableTable}>
      <Table striped hover size={'sm'}>
        <thead>
          <tr>
            <th>#</th>
            <th>Profile Photo</th>
            <th>First Name</th>
            <th>Last Name</th>
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
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UsersTable;
