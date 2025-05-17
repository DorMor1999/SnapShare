import React, { Fragment, useContext } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useForm, SubmitHandler } from 'react-hook-form';

// My imports
import Wrapper from '../../shared/components/UI/Wrapper/Wrapper';
import BoxForm from '../../shared/components/UI/BoxForm/BoxForm';
import MyButton from '../../shared/components/UI/Button/MyButton';
import classes from './SendInvitationsPage.module.css';
import useHttpRequest from '../../hooks/useHttpRequest';
import ErrorModal from '../../shared/components/UI/Modal/ErrorModal';
import SpinnerOverlay from '../../shared/components/UI/Spinner/SpinnerOverlay';
import { UserContext } from '../../context/UserContext';

// bootstrap imports
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

type FormData = {
  file: FileList;
};

const SendInvitationsPage: React.FC = () => {
  const {
    register: sendInvitationsRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const { eventId } = useParams();

  const { token } = useContext(UserContext);

  const navigate = useNavigate();

  const { data, error, loading, sendRequest, clearError } =
    useHttpRequest<any>();

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    const form = new FormData();
    form.append('eventId', `${eventId}`);
    form.append('file', formData.file[0]);

    const API_URL = import.meta.env.VITE_API_URL;
    const { error } = await sendRequest(
      `${API_URL}/invitations/createBatchInvitations`,
      'POST',
      form, 
      {
        Authorization: `Bearer ${token}`,
      },
      
    );
    if (!error) {
      navigate('/');
    }
  };

  const downloadExcelFile = () => {
    const link = document.createElement('a');
    link.href = '/assets/SendInvitationsPage/Example_Excel_File.xlsx';
    link.download = 'Example Excel File.xlsx'; // File name to download as
    link.click();
  };

  return (
    <Fragment>
      {error && <ErrorModal message={error} onClose={clearError} />}
      {loading && <SpinnerOverlay />}
      <div className={classes['center-height']}>
        <Wrapper>
          <BoxForm sm={12} md={10}>
            <h1>Send Invitations</h1>
            <h6 className="text-danger">Required *</h6>
            <MyButton
              text="Example Excel File"
              variant="success"
              type="button"
              size={'lg'}
              onClick={downloadExcelFile}
            />
            <form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col sm={12} md={12}>
                  <Form.Label>
                    Invitations Excel File{' '}
                    <span className="text-danger fw-bold">*</span>
                  </Form.Label>
                  <Form.Control
                    type="file"
                    accept=".xlsx, .xls"
                    {...sendInvitationsRegister('file', {
                      required: 'Invitations Excel file is required',
                      validate: {
                        isExcel: (files: FileList) => {
                          if (!files || files.length === 0)
                            return 'Please upload a file';
                          return (
                            /\.(xlsx|xls)$/i.test(files[0].name) ||
                            'Only Excel files (.xlsx or .xls) are allowed'
                          );
                        },
                      },
                    })}
                  />
                  {errors.file && (
                    <Form.Text className="text-danger">
                      {errors.file.message}
                    </Form.Text>
                  )}
                </Col>
              </Row>
              <br />
              <div className="d-grid gap-2">
                <MyButton
                  text="Send Invitations"
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

export default SendInvitationsPage;
