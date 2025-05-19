import React from 'react';

import Wrapper from '../../shared/components/UI/Wrapper/Wrapper';
import Accordion from 'react-bootstrap/Accordion';
import OwnersParticipantsTable from './components/OwnersParticipantsTable/OwnersParticipantsTable';
import InvitationsTable from './components/InvitationsTable/InvitationsTable';

interface OwnersParticipantsInvitationsPageProps {}

const OwnersParticipantsInvitationsPage: React.FC<
  OwnersParticipantsInvitationsPageProps
> = () => {
  return (
    <Wrapper>
      <h1>Owners Participants and Invitations</h1>
      <br/>
      <Accordion  alwaysOpen>
        <Accordion.Item  eventKey="owners">
          <Accordion.Header >Owners</Accordion.Header>
          <Accordion.Body>
            <OwnersParticipantsTable type="OWNER" />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="partcipants">
          <Accordion.Header>Participants</Accordion.Header>
          <Accordion.Body>
            <OwnersParticipantsTable type="PARTICIPANT" />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="invitations">
          <Accordion.Header>Invitations</Accordion.Header>
          <Accordion.Body>
            <InvitationsTable />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Wrapper>
  );
};

export default OwnersParticipantsInvitationsPage;
