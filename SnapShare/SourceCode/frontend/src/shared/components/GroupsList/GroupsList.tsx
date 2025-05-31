import React, { Fragment } from 'react';
import { PhotoGroup } from '../../types/PhotoGroup';
import { Col, Row } from 'react-bootstrap';
import GroupCard from '../GroupCard/GroupCard';

interface Props {
  photoGroups: PhotoGroup[];
}
const GroupsList: React.FC<Props> = ({ photoGroups }) => {
  let content;

  if (photoGroups && photoGroups.length > 0) {
    content = (
      <Row className="g-4">
        {photoGroups.map((photoGroup) => (
          <Col key={photoGroup._id} lg={6} md={12} className="mb-3">
            <GroupCard photoGroup={photoGroup} />
          </Col>
        ))}
      </Row>
    );
  } else {
    content = <h2>No photo groups found.</h2>;
  }
  return <Fragment>
    {content}
  </Fragment>;
};

export default GroupsList;
