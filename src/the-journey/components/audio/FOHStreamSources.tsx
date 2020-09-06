import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import StreamSource from './StreamSource';
import { uniqKey } from '../../utils/react-help';
import { isRole } from '../../utils/twilio';
import { Participant } from 'twilio-video';
import useParticipants from '../../hooks/useParticipants/useParticipants';

export default function FOHStreamSources() {
  const [{ admitted, rejected, mutedInLobby }] = useContext(AppContext);
  const participants = useParticipants();
  const notYetAdmitted = (p: Participant) => !admitted.includes(p.identity) && !rejected.includes(p.identity);
  const muted = (p: Participant) => mutedInLobby.includes(p.identity);
  const group = participants.filter(p =>
    isRole('foh')(p) || (isRole('audience')(p) && notYetAdmitted(p) && !muted(p)));

  return (
    <>
      { group.flatMap(p => Array.from(p.audioTracks.values(), publication => (
        publication.track && <StreamSource key={uniqKey()} track={publication.track}/>
      ))) }
    </>
  );
}
