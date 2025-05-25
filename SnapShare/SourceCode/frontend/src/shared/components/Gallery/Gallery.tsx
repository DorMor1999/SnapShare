// Gallery.tsx
import React, { Fragment, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { PhotoArray } from '../../types/Photos';
import styles from './Gallery.module.css';
import PhotoModal from '../UI/Modal/PhotoModal';

type GalleryProps = {
  photos: PhotoArray;
  isOwner: boolean;
};

const Gallery: React.FC<GalleryProps> = ({ photos, isOwner }) => {
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openModal = (photoId: string, photoUrl: string) => {
    setSelectedPhotoId(photoId);
    setSelectedPhotoUrl(photoUrl);
    setIsModalVisible(true);
  };

  return (
    <Fragment>
      <PhotoModal
        show={isModalVisible}
        onHide={() => setIsModalVisible(false)}
        photoId={selectedPhotoId ?? ''}
        isOwner={isOwner}
        photoUrl={selectedPhotoUrl}
      />
      <Row className="g-4">
        {photos.map((photo) => (
          <Col key={photo._id} lg={4} md={6} sm={12}>
            <Card
              className={`h-100 ${styles.cardClickable}`}
              onClick={() => openModal(photo._id, photo.url)}
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
