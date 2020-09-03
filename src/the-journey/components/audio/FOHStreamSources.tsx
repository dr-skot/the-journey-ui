import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import StreamSource from './StreamSource';
import { uniqKey } from '../../utils/react-help';
import { isRole } from '../../utils/twilio';
import { Participant } from 'twilio-video';

export default function FOHStreamSources() {
  const [{ participants, admitted, rejected }] = useContext(AppContext);
  const notYetAdmitted = (p: Participant) => !admitted.includes(p.identity) && !rejected.includes(p.identity);
  const group = Array.from(participants.values()).filter(p =>
    isRole('foh')(p) || (isRole('audience')(p) && notYetAdmitted(p)));

  console.log("FOHStreamSources render");

  return (
    <>
      { group.flatMap(p => Array.from(p.audioTracks.values(), publication => (
        publication.track && <StreamSource key={uniqKey()} track={publication.track}/>
      ))) }
    </>
  );
}
