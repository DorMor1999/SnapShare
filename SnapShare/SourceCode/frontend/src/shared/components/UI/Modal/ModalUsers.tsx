import React, { useState } from 'react';
import { Modal, Button, ListGroup, Image, Form } from 'react-bootstrap';

export interface PopulatedUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePhotosUrls: string[][];
}

interface ModalUsersProps {
  users: PopulatedUser[];
  isMultipart: boolean;
  show: boolean;
  onHide: () => void;
  onSelect: (userIds: string[]) => void;
}

const ModalUsers: React.FC<ModalUsersProps> = ({
  users,
  isMultipart,
  show,
  onHide,
  onSelect,
}) => {
  const [selected, setSelected] = useState<string[]>([]);

  const handleChange = (userId: string) => {
    if (isMultipart) {
      setSelected((prev) =>
        prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
      );
    } else {
      setSelected([userId]);
    }
  };

  const handleSubmit = () => {
    onSelect(selected);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Select {isMultipart ? 'Users' : 'User'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          {users.map((user) => (
            <ListGroup.Item key={user._id}>
              <Form.Check
                type={isMultipart ? 'checkbox' : 'radio'}
                name="user-select"
                id={`user-${user._id}`}
                label={
                  <span>
                    <Image
                      src={user.profilePhotosUrls?.[0]?.[0] || ''}
                      roundedCircle
                      width={30}
                      height={30}
                      className="me-2"
                    />
                    {user.firstName} {user.lastName}
                  </span>
                }
                checked={selected.includes(user._id)}
                onChange={() => handleChange(user._id)}
              />
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={selected.length === 0}>
          Select
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalUsers;
