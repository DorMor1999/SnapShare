import React, { Fragment, useContext, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import useHttpRequest from '../../hooks/useHttpRequest';
import ErrorModal from '../../shared/components/UI/Modal/ErrorModal';
import SpinnerOverlay from '../../shared/components/UI/Spinner/SpinnerOverlay';
import Wrapper from '../../shared/components/UI/Wrapper/Wrapper';
import BoxForm from '../../shared/components/UI/BoxForm/BoxForm';
import { Col, Row } from 'react-bootstrap';
import DropzoneInput from '../../shared/components/UI/Input/DropzoneInput';
import MyButton from '../../shared/components/UI/Button/MyButton';
import classes from './UploadPhotosPage.module.css';
import { UserContext } from '../../context/UserContext';

const imageTypes = ['image/jpeg', 'image/jpg'];
const maxFileSize = 25 * 1024 * 1024; // 25MB limit

type FormData = {
  photos: File[];
};

const UploadPhotosPage: React.FC = () => {
  const {
    register: registerUploadPhotos,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>();

  const { token } = useContext(UserContext);

  const navigate = useNavigate();

  const { eventId } = useParams();

  const { data, error, loading, sendRequest, clearError } =
    useHttpRequest<any>();

  const photos = watch('photos');

  const onDrop = (acceptedFiles: File[]) => {
    setValue('photos', acceptedFiles, {
      shouldValidate: true,
    });
  };

  useEffect(() => {
    // Validation for the dropzone input
    registerUploadPhotos('photos', {
      required: 'You must upload at least one image',
      validate: (files: File[]) => {
        if (!files || files.length < 1) return 'At least one image is required';
        if (files.length > 100) return 'You can upload a maximum of 100 images';
        for (const file of files) {
          if (!imageTypes.includes(file.type)) {
            return 'Only JPG, JPEG formats are allowed';
          }
          if (file.size > maxFileSize) {
            return 'Each file must be under 25MB';
          }
        }
        return true;
      },
    });
  }, [registerUploadPhotos]);

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    const form = new FormData();

    formData.photos.forEach((file, index) => {
      form.append('files', file);
    });

    const API_URL = import.meta.env.VITE_API_URL;

    const { error } = await sendRequest(
      `${API_URL}/events/${eventId}/photos`,
      'POST',
      form,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!error) {
      navigate('/');
    }
  };

  return (
    <Fragment>
      {error && <ErrorModal message={error} onClose={clearError} />}
      {loading && <SpinnerOverlay />}
      <div className={classes['center-height']}>
        <Wrapper>
          <BoxForm sm={12} md={10}>
            <h1>Upload Photos</h1>
            <h6 className="text-danger">Required *</h6>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col sm={12} md={12}>
                  <DropzoneInput
                    onDrop={(files) =>
                      setValue('photos', files, {
                        shouldValidate: true,
                      })
                    }
                    error={errors.photos}
                    maxFiles={100}
                  />
                </Col>
              </Row>
              <br />
              <div className="d-grid gap-2">
                <MyButton
                  text="Upload"
                  size={'lg'}
                  variant={'primary'}
                  type="submit"
                />
              </div>
            </form>
          </BoxForm>
        </Wrapper>
      </div>
    </Fragment>
  );
};

export default UploadPhotosPage;
