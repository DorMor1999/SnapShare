import React, { Fragment, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import EventForm from '../../shared/components/EventForm/EventForm';
import { UserContext } from '../../context/UserContext';
import useHttpRequest from '../../hooks/useHttpRequest';
import ErrorModal from '../../shared/components/UI/Modal/ErrorModal';
import SpinnerOverlay from '../../shared/components/UI/Spinner/SpinnerOverlay';

export type EventResponse = {
  _id: string;
  name: string;
  date: string; // ISO date string
  owners: any[];
  participants: any[];
  photoGroups: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

const EditEvent: React.FC = () => {
  const { eventId } = useParams();
  const { token } = useContext(UserContext);

  const { data, error, loading, sendRequest, clearError } =
    useHttpRequest<EventResponse>();

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;
    sendRequest(`${API_URL}/events/${eventId}`, 'GET', undefined, {
      Authorization: `Bearer ${token}`,
    });
  }, [token, eventId]);

  let dateObj: Date | undefined;
  let localDateString;
  if (data?.date) {
    dateObj = new Date(data.date);
    localDateString = `${dateObj.getUTCFullYear()}-${String(
      dateObj.getUTCMonth() + 1
    ).padStart(2, '0')}-${String(dateObj.getUTCDate()).padStart(
      2,
      '0'
    )}T${String(dateObj.getUTCHours()).padStart(2, '0')}:${String(
      dateObj.getUTCMinutes()
    ).padStart(2, '0')}`;
  } else {
    localDateString = undefined;
  }

  return (
    <Fragment>
      {error && <ErrorModal message={error} onClose={clearError} />}
      {loading && <SpinnerOverlay />}
      <EventForm
        formType="Edit Event"
        name={data?.name}
        date={localDateString}
        eventId={eventId}
      />
    </Fragment>
  );
};

export default EditEvent;
