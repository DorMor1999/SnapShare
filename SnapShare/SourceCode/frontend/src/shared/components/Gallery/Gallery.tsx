// Gallery.tsx
import React, { Fragment, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { PhotoArray } from '../../types/Photos';
import styles from './Gallery.module.css';
import { useNavigate, useParams } from 'react-router';
import MyButton from '../UI/Button/MyButton';
import { downloadImagesAsZip } from './util/downloadImagesAsZip';

type GalleryProps = {
  photos: PhotoArray;
};

const Gallery: React.FC<GalleryProps> = ({ photos }) => {
  const navigate = useNavigate();
  const { eventId } = useParams();

  function moveToOtherPage(path: string): void {
    navigate(`${path}`);
  }

  return (
    <Fragment>
      
      <MyButton
        onClick={() => downloadImagesAsZip(photos.map((p) => ({url: p.url, name: p._id})), eventId)}
        variant={'primary'}
        size="lg"
        type="button"
        text="Download All Photos"
      />
      <br/>
      <br/>
      <Row className="g-4">
        {photos.map((photo) => (
          <Col key={photo._id} lg={4} md={6} sm={12}>
            <Card
              className={`h-100 ${styles.cardClickable}`}
              onClick={() =>
                moveToOtherPage(`/events/${eventId}/photos/${photo._id}`)
              }
            >
              <Card.Img
                variant="top"
                src={photo.url}
                alt={`Photo ${photo._id}`}
              />
              <Card.Body>
                <Card.Text>
                  <strong>Uploaded:</strong>{' '}
                  {new Date(photo.uploadedAt).toLocaleDateString('en-GB', {
                    timeZone: 'UTC',
                  })}{' '}
                  {new Date(photo.uploadedAt).toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                    timeZone: 'UTC',
                  })}
                  <br />
                  <strong>Users:</strong> {photo.userIds.length}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Fragment>
  );
};

export default Gallery;
