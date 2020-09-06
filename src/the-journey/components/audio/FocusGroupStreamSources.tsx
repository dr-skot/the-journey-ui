import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import StreamSource from './StreamSource';
import { uniqKey } from '../../utils/react-help';
import { isRole } from '../../utils/twilio';
import useParticipants from '../../hooks/useParticipants/useParticipants';

export default function FocusGroupStreamSources() {
  const [{ focusGroup, audioTracks }] = useContext(AppContext);
  const star = useParticipants().find(isRole('star'));

  return (
    <>
      { Array.from(audioTracks.entries())
      .filter(([identity]) => focusGroup.includes(identity) || identity === star?.identity)
      .flatMap(([, publications]) =>
        Array.from(publications.values())
          .map(({ track }) => track && <StreamSource key={uniqKey()} track={track}/>)
      ) }
    </>
  );
}
