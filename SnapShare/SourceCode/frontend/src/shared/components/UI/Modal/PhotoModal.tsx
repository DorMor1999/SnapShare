import React from 'react';
import { Modal, Button, Image } from 'react-bootstrap';

type PhotoModalProps = {
  show: boolean;
  onHide: () => void;
  photoId: string;
  photoUrl: string;
  isOwner: boolean;
};

const PhotoModal: React.FC<PhotoModalProps> = ({ show, onHide, photoId, photoUrl, isOwner }) => {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Photo Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Image src={photoUrl} alt={`Photo ${photoId}`} fluid rounded className="mb-3" />
        
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PhotoModal;